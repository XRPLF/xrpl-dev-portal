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
const wallet = xrpl.Wallet.fromSeed(setupData.recipient.seed)
const checkID = setupData.checkIDs.flexible
const deliverMin = xrpl.xrpToDrops(20)

console.log(`Wallet address: ${wallet.address}`)
console.log(`Check ID to cash: ${checkID}`)
console.log(`Deliver minimum: ${deliverMin}`)

// Connect to Testnet -----------------------------------------------------

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Prepare the transaction ------------------------------------------------

const checkCash = {
  TransactionType: "CheckCash",
  Account: wallet.address,
  CheckID: checkID,
  DeliverMin: deliverMin
}

// Validate the transaction before submitting -----------------------------

xrpl.validate(checkCash)
console.log(JSON.stringify(checkCash, null, 2))

// Submit the transaction -------------------------------------------------

console.log(`\n=== Submitting CheckCash transaction ===\n`)
const tx = await client.submitAndWait(
  checkCash,
  { autofill: true,
    wallet }
)

// Confirm transaction result ---------------------------------------------

const resultCode = tx.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error('Unable to cash check:', resultCode)
  await client.disconnect()
  process.exit(1)
}

console.log('Check cashed successfully.')
console.log('Balance changes:',
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
)

// Disconnect -------------------------------------------------------------

await client.disconnect()
