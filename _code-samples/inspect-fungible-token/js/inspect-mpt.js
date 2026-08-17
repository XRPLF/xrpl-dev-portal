// Inspect the on-chain properties of a Multi-Purpose Token (MPT).
// Reads the MPTokenIssuance ledger entry, decodes flags, formats the transfer
// fee, and decodes the XLS-89 metadata blob.
//
// Usage: node inspect-mpt.js [mpt_issuance_id]
import { Client, decodeMPTokenMetadata } from 'xrpl'

// --- 1. Set up client and inputs ---
// Devnet example MPT from XRPLF/xrpl-dev-portal#3740.
const DEFAULT_ISSUANCE_ID = '002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8'
const NETWORK = 'wss://s.devnet.rippletest.net:51233'

// --- 2. Define shared helpers ---
// MPTokenIssuance flags.
// https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-flags
const MPT_ISSUANCE_FLAGS = {
  lsfMPTLocked: 0x00000001,
  lsfMPTCanLock: 0x00000002,
  lsfMPTRequireAuth: 0x00000004,
  lsfMPTCanEscrow: 0x00000008,
  lsfMPTCanTrade: 0x00000010,
  lsfMPTCanTransfer: 0x00000020,
  lsfMPTCanClawback: 0x00000040
}

// Convert an MPT `TransferFee` from tenths of a basis point to a percentage
// string. 0 → 0%, 50_000 → 50%.
function percentFromTransferFee(fee) {
  if (!fee) return '0%'
  return `${(fee / 1000).toFixed(3)}%`
}

// Decode a bitmask into the list of flag names it contains.
function decodeFlags(value, table) {
  return Object.entries(table)
    .filter(([, bit]) => (value & bit) !== 0)
    .map(([name]) => name)
}

// --- 3. Look up the MPTokenIssuance entry ---
// Print the MPTokenIssuance fields relevant to inspecting a token.
function printIssuance(node) {
  const flags = decodeFlags(node.Flags ?? 0, MPT_ISSUANCE_FLAGS)
  console.log('\n--- MPTokenIssuance ---')
  console.log(`  Issuer            : ${node.Issuer}`)
  console.log(`  AssetScale        : ${node.AssetScale ?? 0}`)
  console.log(`  MaximumAmount     : ${node.MaximumAmount ?? '(unlimited: 2^63 - 1)'}`)
  console.log(`  OutstandingAmount : ${node.OutstandingAmount ?? '0'}`)
  console.log(`  LockedAmount      : ${node.LockedAmount ?? '0'}`)
  console.log(`  TransferFee       : ${node.TransferFee ?? 0} (${percentFromTransferFee(node.TransferFee)})`)
  console.log(`  Flags value       : ${node.Flags ?? 0}`)
  console.log(`  Flags decoded     : ${flags.length ? flags.join(', ') : '(none set)'}`)
}

// --- 4. Decode the XLS-89 metadata blob ---
// Decode the XLS-89 metadata blob (hex-encoded JSON) if present.
function printMetadata(hex) {
  console.log('\n--- MPTokenMetadata (XLS-89) ---')
  if (!hex) {
    console.log('  (none)')
    return
  }
  try {
    console.log(JSON.stringify(decodeMPTokenMetadata(hex), null, 2))
  } catch (err) {
    console.log(`  Failed to decode as XLS-89 JSON: ${err.message}`)
    console.log(`  Raw hex: ${hex}`)
  }
}

// --- 5. Main flow ---
async function main() {
  const issuanceId = process.argv[2] ?? DEFAULT_ISSUANCE_ID
  const client = new Client(NETWORK)

  try {
    await client.connect()
    console.log(`Inspecting MPT ${issuanceId} on ${NETWORK}`)

    const response = await client.request({
      command: 'ledger_entry',
      mpt_issuance: issuanceId,
      ledger_index: 'validated'
    })

    const node = response.result.node
    printIssuance(node)
    printMetadata(node.MPTokenMetadata)

    // MPT issuance fields (except lsfMPTLocked) are immutable in MPTokensV1.
    // XLS-94 (dynamic MPT) will add mutability — historical inspection will
    // become useful then.
    console.log('\nNote: MPT issuance fields are immutable in MPTokensV1;')
    console.log('      dynamic mutation is proposed in XLS-94.')
  } finally {
    await client.disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
