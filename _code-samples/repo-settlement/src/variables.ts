/**
 * Fictional example variables for the repo settlement tutorial.
 *
 * Everything scenario-specific lives here (parties, tokens, and deal terms)
 * so the flow logic and UI stay generic. To retell the story with different
 * names, amounts, or tenor, edit this file only.
 */

export type PartyKey =
  | 'alphaFund'
  | 'stableCorp'
  | 'investCo'
  | 'tradeDesk'
  | 'xSecurities'

export interface PartyInfo {
  key: PartyKey
  name: string
  role: string
  blurb: string
}

export const PARTIES: Record<PartyKey, PartyInfo> = {
  alphaFund: {
    key: 'alphaFund',
    name: 'AlphaFund',
    role: 'Collateral issuer',
    blurb:
      'Asset manager. Issues tMMF, a tokenized money market fund, and gates who may hold it. Not a repo participant.',
  },
  stableCorp: {
    key: 'stableCorp',
    name: 'StableCorp',
    role: 'Cash issuer',
    blurb:
      'Stablecoin issuer. Issues USD and distributes it to TradeDesk. Not active after setup.',
  },
  investCo: {
    key: 'investCo',
    name: 'InvestCo',
    role: 'Repo seller',
    blurb:
      'Primary investor. Buys tMMF from AlphaFund, sells it to TradeDesk in the near leg, and buys it back in the far leg.',
  },
  tradeDesk: {
    key: 'tradeDesk',
    name: 'TradeDesk',
    role: 'Repo buyer',
    blurb:
      'Repo counterparty. Pays USD for tMMF in the near leg and returns the collateral in the far leg.',
  },
  xSecurities: {
    key: 'xSecurities',
    name: 'xSecurities',
    role: 'Orchestrator',
    blurb:
      'Constructs the atomic swap batches, collects signatures, submits, and sponsors fees. Holds no assets.',
  },
} as const

export interface TokenInfo {
  ticker: string
  name: string
  issuer: PartyKey
  /** Decimal places: on-ledger amounts are integers of 10^-assetScale units. */
  assetScale: number
  maximumAmount: string
  metadata: {
    desc: string
    icon: string
    asset_class: string
    asset_subclass: string
    issuer_name: string
  }
}

export const COLLATERAL: TokenInfo = {
  ticker: 'tMMF',
  name: 'AlphaFund Tokenized Money Market Fund',
  issuer: 'alphaFund',
  assetScale: 0,
  maximumAmount: '1000000',
  metadata: {
    desc: 'A tokenized share class of the AlphaFund money market fund.',
    icon: 'https://example.org/tmmf-icon.png',
    asset_class: 'rwa',
    asset_subclass: 'treasury',
    issuer_name: 'AlphaFund Asset Management',
  },
}

export const CASH: TokenInfo = {
  ticker: 'USD',
  name: 'StableCorp USD',
  issuer: 'stableCorp',
  assetScale: 2,
  maximumAmount: '100000000',
  metadata: {
    desc: 'A USD-backed stablecoin issued by StableCorp.',
    icon: 'https://example.org/usd-icon.png',
    asset_class: 'rwa',
    asset_subclass: 'stablecoin',
    issuer_name: 'StableCorp Inc.',
  },
}

/** Deal terms of the repo trade, in each token's base units. */
export interface DealTerms {
  /** Near leg: InvestCo sells this much collateral… */
  collateralUnits: bigint
  /** …to TradeDesk for this much cash. */
  cashUnits: bigint
  /** Days until the far leg unwinds the trade. */
  tenorDays: bigint
  /** Annualized interest ("repo rate") in basis points, tracked off-chain. */
  interestRateBps: bigint
}

export const DAYS_PER_YEAR = 365n

/** The scenario's default terms: 100 tMMF vs 1,000.00 USD, 10 days at 5%. */
export const DEFAULT_DEAL: DealTerms = {
  collateralUnits: 100n,
  cashUnits: 100_000n,
  tenorDays: 10n,
  interestRateBps: 500n,
}

/**
 * Interest on the cash leg, rounded half-up to the smallest cash unit.
 * With the defaults: 1,000.00 × 5% × 10/365 = 1.37 USD. Computed off-chain
 * by the orchestrator; the ledger itself never calculates interest.
 */
export function interestUnits(deal: DealTerms): bigint {
  const numerator = deal.cashUnits * deal.interestRateBps * deal.tenorDays
  const denominator = 10_000n * DAYS_PER_YEAR
  return (numerator + denominator / 2n) / denominator
}

/** Far leg: InvestCo returns principal plus interest. */
export function farLegCashUnits(deal: DealTerms): bigint {
  return deal.cashUnits + interestUnits(deal)
}

/**
 * The cash operating balance InvestCo carries: the far leg returns principal
 * *plus interest*, so the repo seller must fund the interest from somewhere,
 * a detail term sheets gloss over but settlement cannot. Twice the interest,
 * with a 10.00 floor.
 */
export function operatingCashUnits(deal: DealTerms): bigint {
  const doubled = 2n * interestUnits(deal)
  return doubled > 1_000n ? doubled : 1_000n
}

/** Format integer base units as a decimal amount, e.g. 100137n @ scale 2 → "1,001.37". */
export function formatUnits(units: bigint, assetScale: number): string {
  const negative = units < 0n
  const abs = negative ? -units : units
  const divisor = 10n ** BigInt(assetScale)
  const whole = (abs / divisor).toLocaleString('en-US')
  const fraction =
    assetScale > 0
      ? `.${(abs % divisor).toString().padStart(assetScale, '0')}`
      : ''
  return `${negative ? '-' : ''}${whole}${fraction}`
}
