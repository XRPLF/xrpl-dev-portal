import fs from 'fs'
import {
  Client,
  SponsorFlags,
  SponsorshipTransferFlags,
  signAsSponsor,
  validate
} from 'xrpl'
import { setup } from './sponsoredFeesAndReservesSetup.js'

// Connect to the network ----------------------
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// This step checks for the necessary setup data to run the sponsorship tutorials.
// If missing, sponsoredFeesAndReservesSetup.js will generate the data.
if (!fs.existsSync('sponsoredFeesAndReservesSetup.json')) {
  console.log(`\n=== Sponsorship tutorial data doesn't exist. Running setup script... ===\n`)
  await setup()
}

// Load the preconfigured issuer and MPT issuance ID.
const setupData = JSON.parse(
  fs.readFileSync('sponsoredFeesAndReservesSetup.json', 'utf8')
)

// You can replace these values with your own
const issuerAddress = setupData.issuer.address
const mptID = setupData.mptID

console.log(`\nIssuer address:  ${issuerAddress}`)
console.log(`MPT Issuance ID: ${mptID}`)

// Create the wallets ----------------------
console.log(`\n=== Creating the sponsor and sponsee wallets ===\n`)
const { wallet: sponsorA } = await client.fundWallet()
const { wallet: sponsorB } = await client.fundWallet()
const { wallet: sponsee } = await client.fundWallet()

console.log(`Sponsor A address: ${sponsorA.address}`)
console.log(`Sponsor B address: ${sponsorB.address}`)
console.log(`Sponsee address:   ${sponsee.address}`)

// Create an unsponsored object ----------------------
// The sponsee authorizes the MPT with no sponsorship fields, so it pays the fee and
// the owner reserve for the resulting MPToken entry itself.
console.log(`\n=== Submitting unsponsored MPTokenAuthorize transaction ===\n`)
const authorizeTx = {
  TransactionType: 'MPTokenAuthorize',
  Account: sponsee.address,
  MPTokenIssuanceID: mptID
}
const authorizeResponse = await client.submitAndWait(authorizeTx, {
  wallet: sponsee,
  autofill: true
})

if (authorizeResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = authorizeResponse.result.meta.TransactionResult
  console.error('Error: Unable to authorize the MPT:', resultCode)
  await client.disconnect()
  process.exit(1)
}

const mptokenNode = authorizeResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'MPToken'
)
const mptokenID = mptokenNode.CreatedNode.LedgerIndex

console.log('MPToken created successfully, with its reserve paid by the sponsee.')
console.log(`MPToken ID: ${mptokenID}`)

// Prepare SponsorshipTransfer transaction to start the sponsorship ----------------------
// The sponsee owns the object, so the sponsee sends the transaction and names
// Sponsor A in the Sponsor field. The sponsor's signature is optional for an object,
// but required when the target is an account.
console.log(`\n=== Preparing SponsorshipTransfer transaction to start the sponsorship ===\n`)
const createTx = {
  TransactionType: 'SponsorshipTransfer',
  Account: sponsee.address,
  ObjectID: mptokenID,
  Flags: SponsorshipTransferFlags.tfSponsorshipCreate,
  Sponsor: sponsorA.address,
  SponsorFlags: SponsorFlags.tfSponsorReserve
}

validate(createTx)
const preparedCreateTx = await client.autofill(createTx)

console.log(JSON.stringify(preparedCreateTx, null, 2))

// Sign as the sponsee, then co-sign as Sponsor A ----------------------
console.log(`\n=== Submitting SponsorshipTransfer transaction ===\n`)
const createSignedTx = signAsSponsor(sponsorA, sponsee.sign(preparedCreateTx).tx_blob)
const createResponse = await client.submitAndWait(createSignedTx.tx_blob)

if (createResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = createResponse.result.meta.TransactionResult
  console.error('Error: Unable to start the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

let fields = createResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'MPToken'
).ModifiedNode.FinalFields
console.log('Sponsorship started successfully!')
console.log(`MPToken reserve now sponsored by: ${fields.Sponsor}`)

// Prepare SponsorshipTransfer transaction to reassign the sponsorship ----------------
// tfSponsorshipReassign moves the reserve to Sponsor B in one transaction. Only the
// incoming sponsor has to consent; Sponsor A's obligation is released automatically.
console.log(`\n=== Preparing SponsorshipTransfer transaction to reassign the sponsorship ===\n`)
const reassignTx = {
  TransactionType: 'SponsorshipTransfer',
  Account: sponsee.address,
  ObjectID: mptokenID,
  Flags: SponsorshipTransferFlags.tfSponsorshipReassign,
  Sponsor: sponsorB.address,
  SponsorFlags: SponsorFlags.tfSponsorReserve
}

validate(reassignTx)
const preparedReassignTx = await client.autofill(reassignTx)

console.log(JSON.stringify(preparedReassignTx, null, 2))

// Sign as the sponsee, then co-sign as Sponsor B ----------------------
console.log(`\n=== Submitting SponsorshipTransfer transaction ===\n`)
const reassignSignedTx = signAsSponsor(sponsorB, sponsee.sign(preparedReassignTx).tx_blob)
const reassignResponse = await client.submitAndWait(reassignSignedTx.tx_blob)

if (reassignResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = reassignResponse.result.meta.TransactionResult
  console.error('Error: Unable to reassign the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

fields = reassignResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'MPToken'
).ModifiedNode.FinalFields
console.log('Sponsorship reassigned successfully!')
console.log(`MPToken reserve now sponsored by: ${fields.Sponsor}`)

// Prepare SponsorshipTransfer transaction to end the sponsorship ----------------------
// tfSponsorshipEnd takes no Sponsor field and needs no co-signature. The sponsee must
// hold enough XRP to cover the owner reserve it's taking back.
console.log(`\n=== Preparing SponsorshipTransfer transaction to end the sponsorship ===\n`)
const endTx = {
  TransactionType: 'SponsorshipTransfer',
  Account: sponsee.address,
  ObjectID: mptokenID,
  Flags: SponsorshipTransferFlags.tfSponsorshipEnd
}

validate(endTx)
console.log(JSON.stringify(endTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting SponsorshipTransfer transaction ===\n`)
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
  node => node.ModifiedNode?.LedgerEntryType === 'MPToken'
).ModifiedNode.FinalFields
if (fields.Sponsor !== undefined) {
  console.error('Error: The MPToken still has a Sponsor field')
  await client.disconnect()
  process.exit(1)
}

console.log('Sponsorship ended successfully!')
console.log(`The sponsee now pays the MPToken's owner reserve again.`)

await client.disconnect()
