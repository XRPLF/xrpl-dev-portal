import fs from 'fs'
import {
  Client,
  PaymentFlags,
  SponsorFlags,
  Wallet,
  addPreFundedSponsor,
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

// Create the sponsor and sponsee wallets ----------------------
console.log(`\n=== Creating the sponsor and sponsee wallets ===\n`)
const { wallet: sponsor } = await client.fundWallet()
const sponsee = Wallet.generate()

console.log(`Sponsor address: ${sponsor.address}`)
console.log(`Sponsee address: ${sponsee.address}`)

// Prepare Payment transaction to create the sponsee's account ----------------------
console.log(`\n=== Preparing Payment transaction to create the sponsee's account ===\n`)
const createAccountTx = {
  TransactionType: 'Payment',
  Account: sponsor.address,
  Destination: sponsee.address,
  Amount: '1',
  Flags: PaymentFlags.tfSponsorCreatedAccount
}

validate(createAccountTx)
console.log(JSON.stringify(createAccountTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting Payment transaction ===\n`)
const createAccountResponse = await client.submitAndWait(createAccountTx, {
  wallet: sponsor,
  autofill: true
})

if (createAccountResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = createAccountResponse.result.meta.TransactionResult
  console.error(`Error: Unable to create the sponsee's account:`, resultCode)
  await client.disconnect()
  process.exit(1)
}

console.log('Sponsee account created successfully!')

// Prepare SponsorshipSet transaction ----------------------
// FeeAmount is a pool of drops the sponsee can spend on fees. MaxFee caps what the
// pool pays for any single transaction. RemainingOwnerCount is how many object
// reserves the sponsor will cover.
console.log(`\n=== Preparing SponsorshipSet transaction ===\n`)
const sponsorshipSetTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  FeeAmount: '1000000',
  MaxFee: '1000',
  RemainingOwnerCount: 5
}

validate(sponsorshipSetTx)
console.log(JSON.stringify(sponsorshipSetTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction ===\n`)
const sponsorshipResponse = await client.submitAndWait(sponsorshipSetTx, {
  wallet: sponsor,
  autofill: true
})

if (sponsorshipResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = sponsorshipResponse.result.meta.TransactionResult
  console.error('Error: Unable to create the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

// Extract the Sponsorship entry from the transaction result ----------------------
const sponsorshipNode = sponsorshipResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'Sponsorship'
)
console.log('Sponsorship created successfully!')
console.log(`Sponsorship ID: ${sponsorshipNode.CreatedNode.LedgerIndex}`)

// Prepare the sponsored MPTokenAuthorize transaction ----------------------
// The addPreFundedSponsor helper adds the Sponsor and SponsorFlags fields. Because
// the Sponsorship entry already exists, the sponsee signs and submits alone.
console.log(`\n=== Preparing sponsored MPTokenAuthorize transaction ===\n`)
const mptAuthorizeTx = addPreFundedSponsor(
  {
    TransactionType: 'MPTokenAuthorize',
    Account: sponsee.address,
    MPTokenIssuanceID: mptID
  },
  sponsor.address,
  SponsorFlags.tfSponsorFee | SponsorFlags.tfSponsorReserve
)

validate(mptAuthorizeTx)
console.log(JSON.stringify(mptAuthorizeTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting sponsored MPTokenAuthorize transaction ===\n`)
const submitResponse = await client.submitAndWait(mptAuthorizeTx, {
  wallet: sponsee,
  autofill: true
})

if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.error('Error: Unable to authorize the MPT:', resultCode)
  await client.disconnect()
  process.exit(1)
}

// The transaction carries no SponsorSignature, which is what distinguishes the
// pre-funded flow from the co-signed flow.
if (submitResponse.result.tx_json.SponsorSignature !== undefined) {
  console.error('Error: A pre-funded sponsorship should not need a SponsorSignature')
  await client.disconnect()
  process.exit(1)
}

console.log('Transaction sponsored successfully, with no sponsor signature!')

// Extract sponsorship information from the transaction result ----------------------
console.log(`\n=== Sponsorship Information ===\n`)
const mptokenNode = submitResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'MPToken'
)
console.log(`MPToken ID: ${mptokenNode.CreatedNode.LedgerIndex}`)
console.log(`MPToken reserve sponsored by: ${mptokenNode.CreatedNode.NewFields.Sponsor}`)

// The Sponsorship entry shows the fee drops and owner reserves the pool spent.
const sponsorshipUsed = submitResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'Sponsorship'
)
const fields = sponsorshipUsed.ModifiedNode.FinalFields
const previous = sponsorshipUsed.ModifiedNode.PreviousFields

console.log(`\nFee paid from the pool: ${Number(previous.FeeAmount) - Number(fields.FeeAmount)} drops`)
console.log(`Fee remaining in the pool: ${fields.FeeAmount} drops`)
console.log(`Owner reserves remaining: ${fields.RemainingOwnerCount}`)

await client.disconnect()
