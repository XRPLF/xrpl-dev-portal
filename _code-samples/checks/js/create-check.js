import xrpl from 'xrpl'

// Connect to the Testnet -------------------------------------------------

console.log('Connecting to Testnet...')
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()
console.log('Connected.')

// Get a new wallet -------------------------------------------------------

console.log('Generating new wallet...')
const wallet = (await client.fundWallet()).wallet
console.log('  Address:', wallet.address)
console.log('  Seed:', wallet.seed)

// Prepare the transaction ------------------------------------------------

const checkCreate = {
  TransactionType: 'CheckCreate',
  Account: wallet.address,
  Destination: 'rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis',
  SendMax: xrpl.xrpToDrops(120), // Can be more than you have
  InvoiceID: '46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291'
}

// Validate the transaction before submitting -----------------------------

xrpl.validate(checkCreate)
console.log(JSON.stringify(checkCreate, null, 2))

// Submit the transaction -------------------------------------------------

console.log('Submitting transaction...')
const tx = await client.submitAndWait(
  checkCreate,
  { autofill: true,
    wallet }
)

// Confirm transaction result and get check ID ------------------------------------

const resultCode = tx.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error('Unable to create check:', resultCode)
  await client.disconnect()
  process.exit(1)
}

const node = tx.result.meta.AffectedNodes.find(node =>
   node.CreatedNode?.LedgerEntryType === 'Check'
  ).CreatedNode

console.log('Check created successfully.')
console.log(`Check details:\n`, JSON.stringify(node.NewFields, null, 2))
console.log(`Check ID: ${node.LedgerIndex}`)

// Disconnect -------------------------------------------------------------

await client.disconnect()
