import { PARTIES, PARTY_KEYS, type PartyKey } from './variables'

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

function optional (value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed || undefined
}

export const CONFIG = {
  wssUrl: optional(env.VITE_XRPL_WSS) ?? 'wss://s.devnet.rippletest.net:51233',
  explorerUrl: optional(env.VITE_EXPLORER_URL) ?? 'https://devnet.xrpl.org',
  /**
   * Optional pre-funded account seeds; the faucet is used where unset. Each
   * party names its own variable, so adding a party needs no change here.
   */
  seeds: Object.fromEntries(
    PARTY_KEYS.map((key) => [key, optional(env[PARTIES[key].seedEnv])])
  ) as Record<PartyKey, string | undefined>
} as const

export function explorerTxUrl (hash: string): string {
  return `${CONFIG.explorerUrl}/transactions/${hash}`
}
