import xrpl from 'xrpl'
import { execSync } from 'child_process'
import fs from 'fs'

// Looks for setup data required to run the checks tutorials.
// If missing, checks-setup.js will generate the data.

if (!fs.existsSync('checks-setup.json')) {
  console.log(`\n=== Checks tutorial data doesn't exist. Running setup script... ===\n`)
  execSync('node checks-setup.js', { stdio: 'inherit' })
}

// Load setup data --------------------------------------------------------

const setupData = JSON.parse(fs.readFileSync('checks-setup.json', 'utf8'))
const wallet = xrpl.Wallet.fromSeed(setupData.sender.seed)
const checkID = setupData.checkIDs.cancel

console.log(`Wallet address: ${wallet.address}`)
console.log(`Check ID to cancel: ${checkID}`)

// Connect to Testnet -----------------------------------------------------

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Prepare the transaction ------------------------------------------------

console.log(`\n=== Preparing CheckCancel transaction ===\n`)
const checkCancel = {
  TransactionType: 'CheckCancel',
  Account: wallet.address,
  CheckID: checkID
}

// Validate the transaction before submitting -----------------------------

xrpl.validate(checkCancel)
console.log(JSON.stringify(checkCancel, null, 2))

// Submit the transaction -------------------------------------------------

console.log(`\n=== Submitting CheckCancel transaction ===\n`)
const tx = await client.submitAndWait(
  checkCancel,
  { autofill: true,
    wallet }
)

// Confirm transaction result ---------------------------------------------

const resultCode = tx.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error('Unable to cancel check:', resultCode)
  await client.disconnect()
  process.exit(1)
}

const deletedCheck = tx.result.meta.AffectedNodes.find(node =>
  node.DeletedNode?.LedgerEntryType === 'Check')
console.log(`Check canceled successfully.`)
console.log(`Deleted check:\n`, JSON.stringify(deletedCheck.DeletedNode.FinalFields, null, 2))

// Disconnect -------------------------------------------------------------

await client.disconnect()
