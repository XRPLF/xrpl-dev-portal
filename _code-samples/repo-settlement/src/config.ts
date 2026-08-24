import type { PartyKey } from './variables'

/**
 * Runtime configuration, read from environment variables so no endpoint or
 * secret is hard-coded. In the browser Vite injects `import.meta.env` from
 * .env files; the headless e2e script falls back to `process.env`.
 */
const env: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && import.meta.env != null
    ? (import.meta.env as Record<string, string | undefined>)
    : // eslint-disable-next-line no-process-env -- Node fallback for scripts
      (globalThis as { process?: { env: Record<string, string | undefined> } })
        .process?.env ?? {}

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export const CONFIG = {
  /** Needs the ConfidentialTransfer, BatchV1_1, and Sponsor amendments enabled. */
  wssUrl: optional(env.VITE_XRPL_WSS) ?? 'wss://s.devnet.rippletest.net:51233',
  explorerUrl: optional(env.VITE_EXPLORER_URL) ?? 'https://devnet.xrpl.org',
  /** Optional pre-funded account seeds; the faucet is used where unset. */
  seeds: {
    alphaFund: optional(env.VITE_ALPHAFUND_SEED),
    stableCorp: optional(env.VITE_STABLECORP_SEED),
    investCo: optional(env.VITE_INVESTCO_SEED),
    tradeDesk: optional(env.VITE_TRADEDESK_SEED),
    xSecurities: optional(env.VITE_XSECURITIES_SEED),
  } satisfies Record<PartyKey, string | undefined>,
} as const

export function explorerTxUrl(hash: string): string {
  return `${CONFIG.explorerUrl}/transactions/${hash}`
}
