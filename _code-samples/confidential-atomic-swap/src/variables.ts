/**
 * Fictional example variables for the confidential atomic swap demo.
 *
 * Everything scenario-specific lives here (parties, tokens, and deal terms)
 * so the flow logic and UI stay generic. To retell the story with different
 * names, amounts, or term, edit this file only.
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
    roleLabel: 'Asset holder',
    blurb:
      'Buys TKN from AlphaFund, swaps it with TradeDesk for USD in the opening leg, and swaps it back in the closing leg.',
    /* Pink, not teal: teal is the app's own accent, so a teal party badge sat
       the same color as the ✓, the done badge, and the chrome. */
    color: 'pink',
    seedEnv: 'VITE_INVESTCO_SEED'
  },
  tradeDesk: {
    name: 'TradeDesk',
    role: 'counterparty',
    roleLabel: 'Counterparty',
    blurb:
      'Pays USD for TKN in the opening leg and returns the TKN in the closing leg.',
    color: 'orange',
    seedEnv: 'VITE_TRADEDESK_SEED'
  },
  alphaFund: {
    name: 'AlphaFund',
    role: 'issuer',
    roleLabel: 'Asset issuer',
    blurb:
      'Issues TKN and controls who may hold it. Not a party to the swap.',
    color: 'violet',
    seedEnv: 'VITE_ALPHAFUND_SEED'
  },
  stableCorp: {
    name: 'StableCorp',
    role: 'issuer',
    roleLabel: 'Cash issuer',
    blurb:
      'Stablecoin issuer. Issues USD and distributes it to TradeDesk. Not active after setup.',
    color: 'blue',
    seedEnv: 'VITE_STABLECORP_SEED'
  },
  xSecurities: {
    name: 'xSecurities',
    role: 'orchestrator',
    roleLabel: 'Orchestrator',
    blurb:
      'Constructs the atomic swap batches, collects signatures, submits, and sponsors fees. Holds no assets.',
    color: 'gray',
    seedEnv: 'VITE_XSECURITIES_SEED'
  }
} satisfies Record<string, PartyInfo>

export type PartyKey = keyof typeof PARTIES

/** Every party, in the order the UI lists them. */
export const PARTY_KEYS = Object.keys(PARTIES) as PartyKey[]

/** The parties playing one role, as a type: `PartyPlaying<'counterparty'>`. */
export type PartyPlaying<R extends PartyRole> = {
  [K in PartyKey]: (typeof PARTIES)[K]['role'] extends R ? K : never
}[PartyKey]

function partiesPlaying<R extends PartyRole> (role: R): Array<PartyPlaying<R>> {
  return PARTY_KEYS.filter(
    (key) => PARTIES[key].role === role
  ) as Array<PartyPlaying<R>>
}

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
  asset: {
    /* Uppercase letters and digits only, per XLS-89: the ledger warns on any
       other ticker, and non-compliant tokens may not be indexed. */
    ticker: 'TKN',
    name: 'AlphaFund Tokenized Asset',
    issuer: 'alphaFund',
    assetScale: 0,
    maximumAmount: '1000000',
    requireAuth: true,
    metadata: {
      desc: 'A tokenized asset issued by AlphaFund.',
      icon: 'https://example.org/tkn-icon.png',
      asset_class: 'rwa',
      asset_subclass: 'other',
      issuer_name: 'AlphaFund Asset Management'
    }
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
      issuer_name: 'StableCorp Inc.'
    }
  }
} satisfies Record<string, TokenInfo>

export type IssuanceKey = keyof typeof TOKENS

/** Every token, in the order the UI lists them. */
export const TOKEN_KEYS = Object.keys(TOKENS) as IssuanceKey[]

export function issuedToken (party: PartyKey): IssuanceKey | undefined {
  return TOKEN_KEYS.find((key) => TOKENS[key].issuer === party)
}

/** Deal terms of the swap, in each token's base units. */
export interface DealTerms {
  /** Opening leg: InvestCo swaps this much asset… */
  assetUnits: bigint
  /** …to TradeDesk for this much cash. */
  cashUnits: bigint
  /** Days until the closing leg reverses the swap. */
  termDays: bigint
  /** Annualized agreed return in basis points, tracked off-chain. */
  returnRateBps: bigint
}

export const DAYS_PER_YEAR = 365n

/** The scenario's default terms: 100 TKN vs 1,000.00 USD, 10 days at 5%. */
export const DEFAULT_DEAL: DealTerms = {
  assetUnits: 100n,
  cashUnits: 100_000n,
  termDays: 10n,
  returnRateBps: 500n
}

/**
 * The agreed return on the cash, rounded half-up to the smallest cash unit.
 * With the defaults: 1,000.00 × 5% × 10/365 = 1.37 USD. Computed off-chain
 * by the orchestrator; the ledger itself never calculates it.
 */
export function agreedReturnUnits (deal: DealTerms): bigint {
  const numerator = deal.cashUnits * deal.returnRateBps * deal.termDays
  const denominator = 10_000n * DAYS_PER_YEAR
  return (numerator + denominator / 2n) / denominator
}

/** Closing leg: InvestCo returns the cash plus the agreed return. */
export function closingLegCashUnits (deal: DealTerms): bigint {
  return deal.cashUnits + agreedReturnUnits(deal)
}

/**
 * The cash operating balance InvestCo carries: the closing leg returns the
 * cash *plus the agreed return*, so the asset holder must fund that return
 * from somewhere, a detail term sheets gloss over but settlement cannot.
 * Twice the return, with a 10.00 floor.
 */
export function operatingCashUnits (deal: DealTerms): bigint {
  const doubled = 2n * agreedReturnUnits(deal)
  return doubled > 1_000n ? doubled : 1_000n
}

/** Format integer base units as a decimal amount, e.g. 100137n @ scale 2 → "1,001.37". */
export function formatUnits (units: bigint, assetScale: number): string {
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
export function formatAmount (units: bigint, token: TokenInfo): string {
  return `${formatUnits(units, token.assetScale)} ${token.ticker}`
}
