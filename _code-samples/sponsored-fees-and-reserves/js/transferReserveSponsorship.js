import {
  Client,
  SponsorFlags,
  SponsorshipTransferFlags,
  signAsSponsor,
  validate
} from 'xrpl'

// Connect to the network ----------------------
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// Create the wallets ----------------------
console.log(`\n=== Creating the sponsor and sponsee wallets... ===`)
const { wallet: sponsorA } = await client.fundWallet()
const { wallet: sponsorB } = await client.fundWallet()
const { wallet: sponsee } = await client.fundWallet()

console.log(`Sponsor A address: ${sponsorA.address}`)
console.log(`Sponsor B address: ${sponsorB.address}`)
console.log(`Sponsee address:   ${sponsee.address}`)

// Create an unsponsored ledger entry ----------------------
// The sponsee creates a DepositPreauth entry with no sponsorship fields, so it pays
// the fee and the owner reserve for the resulting entry itself.
console.log(`\n=== Submitting unsponsored DepositPreauth transaction... ===`)
const depositPreauthTx = {
  TransactionType: 'DepositPreauth',
  Account: sponsee.address,
  Authorize: sponsorA.address
}
const depositPreauthResponse = await client.submitAndWait(depositPreauthTx, {
  wallet: sponsee,
  autofill: true
})

if (depositPreauthResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = depositPreauthResponse.result.meta.TransactionResult
  console.error('Error: Unable to create the preauthorization:', resultCode)
  await client.disconnect()
  process.exit(1)
}

const preauthNode = depositPreauthResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'DepositPreauth'
)
const preauthID = preauthNode.CreatedNode.LedgerIndex

console.log('DepositPreauth created successfully, with its reserve paid by the sponsee.')
console.log(`DepositPreauth ID: ${preauthID}`)
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${depositPreauthResponse.result.hash}`)

// Prepare SponsorshipTransfer transaction to start the sponsorship ----------------------
console.log(`\n=== Preparing SponsorshipTransfer transaction to start the sponsorship... ===`)
const createTx = {
  TransactionType: 'SponsorshipTransfer',
  Account: sponsee.address,
  ObjectID: preauthID,
  Flags: SponsorshipTransferFlags.tfSponsorshipCreate,
  Sponsor: sponsorA.address,
  SponsorFlags: SponsorFlags.tfSponsorReserve
}

validate(createTx)
const preparedCreateTx = await client.autofill(createTx)

console.log(JSON.stringify(preparedCreateTx, null, 2))

// Sign as the sponsee, then co-sign as Sponsor A ----------------------
console.log(`\n=== Submitting SponsorshipTransfer transaction... ===`)
const createSignedTx = signAsSponsor(sponsorA, sponsee.sign(preparedCreateTx).tx_blob)
const createResponse = await client.submitAndWait(createSignedTx.tx_blob)

if (createResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = createResponse.result.meta.TransactionResult
  console.error('Error: Unable to start the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

let fields = createResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'DepositPreauth'
).ModifiedNode.FinalFields
console.log('Sponsorship started successfully!')
console.log(`DepositPreauth reserve now sponsored by: ${fields.Sponsor}`)
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${createResponse.result.hash}`)

// Prepare SponsorshipTransfer transaction to reassign the sponsorship ----------------
// tfSponsorshipReassign moves the reserve to Sponsor B in one transaction. Only the
// incoming sponsor has to consent; Sponsor A's obligation is released automatically.
console.log(`\n=== Preparing SponsorshipTransfer transaction to reassign the sponsorship... ===`)
const reassignTx = {
  TransactionType: 'SponsorshipTransfer',
  Account: sponsee.address,
  ObjectID: preauthID,
  Flags: SponsorshipTransferFlags.tfSponsorshipReassign,
  Sponsor: sponsorB.address,
  SponsorFlags: SponsorFlags.tfSponsorReserve
}

validate(reassignTx)
const preparedReassignTx = await client.autofill(reassignTx)

console.log(JSON.stringify(preparedReassignTx, null, 2))

// Sign as the sponsee, then co-sign as Sponsor B ----------------------
console.log(`\n=== Submitting SponsorshipTransfer transaction... ===`)
const reassignSignedTx = signAsSponsor(sponsorB, sponsee.sign(preparedReassignTx).tx_blob)
const reassignResponse = await client.submitAndWait(reassignSignedTx.tx_blob)

if (reassignResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = reassignResponse.result.meta.TransactionResult
  console.error('Error: Unable to reassign the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

fields = reassignResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'DepositPreauth'
).ModifiedNode.FinalFields
console.log('Sponsorship reassigned successfully!')
console.log(`DepositPreauth reserve now sponsored by: ${fields.Sponsor}`)
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${reassignResponse.result.hash}`)

// Prepare SponsorshipTransfer transaction to end the sponsorship ----------------------
// tfSponsorshipEnd takes no Sponsor field and needs no co-signature. If it
// succeeds, the Sponsor field is removed and the sponsee becomes responsible for
// the entry's reserve again.
console.log(`\n=== Preparing SponsorshipTransfer transaction to end the sponsorship... ===`)
const endTx = {
  TransactionType: 'SponsorshipTransfer',
  Account: sponsee.address,
  ObjectID: preauthID,
  Flags: SponsorshipTransferFlags.tfSponsorshipEnd
}

validate(endTx)
console.log(JSON.stringify(endTx, null, 2))

// Submit the SponsorshipTransfer transaction to end the sponsorship ----------------------
console.log(`\n=== Submitting SponsorshipTransfer transaction... ===`)
const endResponse = await client.submitAndWait(endTx, {
  wallet: sponsee,
  autofill: true
})

if (endResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = endResponse.result.meta.TransactionResult
  console.error('Error: Unable to end the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

fields = endResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'DepositPreauth'
).ModifiedNode.FinalFields
if (fields.Sponsor !== undefined) {
  console.error('Error: The DepositPreauth entry still has a Sponsor field')
  await client.disconnect()
  process.exit(1)
}

console.log('Sponsorship ended successfully!')
console.log(`The sponsee now pays the DepositPreauth entry's owner reserve again.`)
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${endResponse.result.hash}`)

await client.disconnect()
