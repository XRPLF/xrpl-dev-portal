/**
 * Fictional example variables for the repo settlement tutorial.
 *
 * Everything scenario-specific lives here (parties, tokens, and deal terms)
 * so the flow logic and UI stay generic. To retell the story with different
 * names, amounts, or tenor, edit this file only.
 */

/**
 * The role a party plays, which is what the flow branches on: counterparties
 * trade with each other and sign the batches, the orchestrator builds and
 * sponsors them, and issuers only mint. `roleLabel` below is how the reader
 * sees it; this is the structure behind it.
 */
export type PartyRole = 'counterparty' | 'orchestrator' | 'issuer'

export interface PartyInfo {
  name: string
  role: PartyRole
  /** How the role is described in the UI. */
  roleLabel: string
  blurb: string
  /** Mantine palette color, used wherever the party is themed. */
  color: string
  /** Environment variable holding this party's optional pre-funded seed. */
  seedEnv: string
}

/**
 * Everyone in the story, in the order the UI lists them: the two who trade
 * first, then those who support the deal. Adding a party here gives it a
 * balance row, a color, and a seed override without touching the flow or UI.
 */
export const PARTIES = {
  investCo: {
    name: 'InvestCo',
    role: 'counterparty',
    roleLabel: 'Repo seller',
    blurb:
      'Primary investor. Buys TMMF from AlphaFund, sells it to TradeDesk in the near leg, and buys it back in the far leg.',
    /* Pink, not teal: teal is the app's own accent, so a teal party badge sat
       the same color as the ✓, the done badge, and the chrome. */
    color: 'pink',
    seedEnv: 'VITE_INVESTCO_SEED',
  },
  tradeDesk: {
    name: 'TradeDesk',
    role: 'counterparty',
    roleLabel: 'Repo buyer',
    blurb:
      'Repo counterparty. Pays USD for TMMF in the near leg and returns the collateral in the far leg.',
    color: 'orange',
    seedEnv: 'VITE_TRADEDESK_SEED',
  },
  alphaFund: {
    name: 'AlphaFund',
    role: 'issuer',
    roleLabel: 'Collateral issuer',
    blurb:
      'Asset manager. Issues TMMF, a tokenized money market fund, and gates who may hold it. Not a repo participant.',
    color: 'violet',
    seedEnv: 'VITE_ALPHAFUND_SEED',
  },
  stableCorp: {
    name: 'StableCorp',
    role: 'issuer',
    roleLabel: 'Cash issuer',
    blurb:
      'Stablecoin issuer. Issues USD and distributes it to TradeDesk. Not active after setup.',
    color: 'blue',
    seedEnv: 'VITE_STABLECORP_SEED',
  },
  xSecurities: {
    name: 'xSecurities',
    role: 'orchestrator',
    roleLabel: 'Orchestrator',
    blurb:
      'Constructs the atomic swap batches, collects signatures, submits, and sponsors fees. Holds no assets.',
    color: 'gray',
    seedEnv: 'VITE_XSECURITIES_SEED',
  },
} satisfies Record<string, PartyInfo>

export type PartyKey = keyof typeof PARTIES

/** Every party, in the order the UI lists them. */
export const PARTY_KEYS = Object.keys(PARTIES) as PartyKey[]

/** The parties playing one role, as a type: `PartyPlaying<'counterparty'>`. */
export type PartyPlaying<R extends PartyRole> = {
  [K in PartyKey]: (typeof PARTIES)[K]['role'] extends R ? K : never
}[PartyKey]

function partiesPlaying<R extends PartyRole>(role: R): PartyPlaying<R>[] {
  return PARTY_KEYS.filter(
    (key) => PARTIES[key].role === role,
  ) as PartyPlaying<R>[]
}

/** A party to the repo itself, as opposed to an issuer or the orchestrator. */
export type Counterparty = PartyPlaying<'counterparty'>

/** The two who trade: they sign every batch and hold every confidential pot. */
export const COUNTERPARTIES = partiesPlaying('counterparty')

/**
 * The party that builds the batches and sponsors everything inside the deal.
 * Only issuers, which sit outside it, pay their own way.
 */
export const ORCHESTRATOR = partiesPlaying('orchestrator')[0]

export interface TokenInfo {
  ticker: string
  name: string
  issuer: PartyKey
  /** Decimal places: on-ledger amounts are integers of 10^-assetScale units. */
  assetScale: number
  maximumAmount: string
  /** Whether the issuer must approve each holder before it can hold any. */
  requireAuth: boolean
  metadata: {
    desc: string
    icon: string
    asset_class: string
    asset_subclass: string
    issuer_name: string
  }
}

/**
 * The deal's tokens, keyed by the role each plays in it. Adding a token here
 * gives it an issuance, a balance row, and an issuer view without touching the
 * protocol or UI layers; only the storyboard names a token by its role.
 */
export const TOKENS = {
  collateral: {
    /* Uppercase letters and digits only, per XLS-89: the ledger warns on any
       other ticker, and non-compliant tokens may not be indexed. */
    ticker: 'TMMF',
    name: 'AlphaFund Tokenized Money Market Fund',
    issuer: 'alphaFund',
    assetScale: 0,
    maximumAmount: '1000000',
    requireAuth: true,
    metadata: {
      desc: 'A tokenized share class of the AlphaFund money market fund.',
      icon: 'https://example.org/tmmf-icon.png',
      asset_class: 'rwa',
      asset_subclass: 'treasury',
      issuer_name: 'AlphaFund Asset Management',
    },
  },
  cash: {
    ticker: 'USD',
    name: 'StableCorp USD',
    issuer: 'stableCorp',
    assetScale: 2,
    maximumAmount: '100000000',
    requireAuth: false,
    metadata: {
      desc: 'A USD-backed stablecoin issued by StableCorp.',
      icon: 'https://example.org/usd-icon.png',
      asset_class: 'rwa',
      asset_subclass: 'stablecoin',
      issuer_name: 'StableCorp Inc.',
    },
  },
} satisfies Record<string, TokenInfo>

/** Which of the deal's tokens an operation, balance, or row refers to. */
export type IssuanceKey = keyof typeof TOKENS

/** Every token, in the order the UI lists them. */
export const TOKEN_KEYS = Object.keys(TOKENS) as IssuanceKey[]

/** The token this party issues, if it issues one. */
export function issuedToken(party: PartyKey): IssuanceKey | undefined {
  return TOKEN_KEYS.find((key) => TOKENS[key].issuer === party)
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

/** The scenario's default terms: 100 TMMF vs 1,000.00 USD, 10 days at 5%. */
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

/** An amount with its ticker, e.g. "1,001.37 USD". */
export function formatAmount(units: bigint, token: TokenInfo): string {
  return `${formatUnits(units, token.assetScale)} ${token.ticker}`
}
