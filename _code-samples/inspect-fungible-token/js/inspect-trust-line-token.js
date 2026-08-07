// Inspect the on-chain properties of a Trust Line token.
// Reads the issuer's AccountRoot (transfer rate, flags, domain, tick size),
// walks its trust lines for the given currency, and reconstructs the history
// of TransferRate changes from AccountSet transactions.
//
// Usage: node inspect-trust-line-token.js [issuer] [currency]
import { Client, convertHexToString } from 'xrpl'

// --- 1. Set up client and inputs ---
// Devnet example token from XRPLF/xrpl-dev-portal#3740.
const DEFAULT_ISSUER = 'ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf'
const DEFAULT_CURRENCY = 'USD'
const NETWORK = 'wss://s.devnet.rippletest.net:51233'

// --- 2. Define shared helpers ---
// AccountRoot flags that affect trust line token behavior.
// https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot#accountroot-flags
const ACCOUNT_ROOT_FLAGS = {
  lsfDefaultRipple: 0x00800000,
  lsfDepositAuth: 0x01000000,
  lsfDisallowIncomingTrustline: 0x20000000,
  lsfGlobalFreeze: 0x00400000,
  lsfNoFreeze: 0x00200000,
  lsfRequireAuth: 0x00040000,
  lsfRequireDestTag: 0x00020000,
  lsfAllowTrustLineClawback: 0x80000000
}

// Convert a `TransferRate` from billionths to a percentage string.
// 0 or 1_000_000_000 → 0%. 2_000_000_000 → 100%.
function percentFromTransferRate(rate) {
  if (!rate || rate === 1_000_000_000) return '0%'
  return `${((rate - 1_000_000_000) / 10_000_000).toFixed(4)}%`
}

// Decode a bitmask into the list of flag names it contains.
function decodeFlags(value, table) {
  return Object.entries(table)
    .filter(([, bit]) => (value & bit) !== 0)
    .map(([name]) => name)
}

// --- 3. Look up the issuer's AccountRoot ---
// Print the AccountRoot-level properties that apply to every trust line token
// this account issues (transfer rate, flags, identity fields).
function printIssuerSettings(accountRoot) {
  const flags = decodeFlags(accountRoot.Flags ?? 0, ACCOUNT_ROOT_FLAGS)
  console.log('\n--- Issuer AccountRoot settings ---')
  console.log(`  Address       : ${accountRoot.Account}`)
  console.log(`  TransferRate  : ${accountRoot.TransferRate ?? 0} (${percentFromTransferRate(accountRoot.TransferRate)})`)
  console.log(`  TickSize      : ${accountRoot.TickSize ?? '(default)'}`)
  console.log(`  Domain        : ${accountRoot.Domain ? convertHexToString(accountRoot.Domain) : '(none)'}`)
  console.log(`  Flags value   : ${accountRoot.Flags ?? 0}`)
  console.log(`  Flags decoded : ${flags.length ? flags.join(', ') : '(none set)'}`)
}

// --- 4. Look up individual trust lines ---
// Print the per-trust-line properties for each holder of this currency.
function printTrustLines(lines, currency) {
  console.log(`\n--- Trust lines for currency ${currency} (${lines.length} shown) ---`)
  for (const line of lines) {
    console.log(`  Counterparty : ${line.account}`)
    console.log(`    balance      : ${line.balance}`)
    console.log(`    limit        : ${line.limit}`)
    console.log(`    no_ripple    : ${!!line.no_ripple}`)
    console.log(`    freeze       : ${!!line.freeze}`)
    console.log(`    authorized   : ${!!line.authorized}`)
  }
}

// --- 5. Reconstruct the TransferRate history ---
// Fetch the full history of TransferRate changes from AccountSet transactions.
// Walks account_tx forward, comparing each observed rate to the previous one.
async function fetchTransferRateHistory(client, issuer) {
  const history = []
  let previous = null
  let marker

  do {
    const response = await client.request({
      command: 'account_tx',
      account: issuer,
      ledger_index_min: -1,
      ledger_index_max: -1,
      forward: true,
      limit: 200,
      marker
    })

    for (const entry of response.result.transactions) {
      const tx = entry.tx_json ?? entry.tx
      if (!tx || tx.TransactionType !== 'AccountSet') continue
      if (!('TransferRate' in tx)) continue

      const rate = tx.TransferRate ?? 0
      if (rate === previous) continue

      history.push({
        ledger_index: tx.ledger_index ?? entry.ledger_index,
        tx_hash: entry.hash ?? tx.hash,
        transfer_rate: rate,
        percent: percentFromTransferRate(rate)
      })
      previous = rate
    }

    marker = response.result.marker
  } while (marker)

  return history
}

// Print the chronological TransferRate history reconstructed from account_tx.
function printFeeHistory(history) {
  console.log(`\n--- TransferRate history (${history.length} change${history.length === 1 ? '' : 's'}) ---`)
  if (history.length === 0) {
    console.log('  No AccountSet transactions modified TransferRate.')
    return
  }
  for (const entry of history) {
    console.log(`  Ledger ${entry.ledger_index}  →  ${entry.percent}  (tx ${entry.tx_hash})`)
  }
}

// --- 6. Main flow ---
async function main() {
  const issuer = process.argv[2] ?? DEFAULT_ISSUER
  const currency = process.argv[3] ?? DEFAULT_CURRENCY
  const client = new Client(NETWORK)

  try {
    await client.connect()
    console.log(`Inspecting ${currency}.${issuer} on ${NETWORK}`)

    const accountInfo = await client.request({
      command: 'account_info',
      account: issuer,
      ledger_index: 'validated'
    })
    printIssuerSettings(accountInfo.result.account_data)

    const accountLines = await client.request({
      command: 'account_lines',
      account: issuer,
      ledger_index: 'validated'
    })
    const filtered = accountLines.result.lines.filter((l) => l.currency === currency)
    printTrustLines(filtered, currency)

    const history = await fetchTransferRateHistory(client, issuer)
    printFeeHistory(history)
  } finally {
    await client.disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
