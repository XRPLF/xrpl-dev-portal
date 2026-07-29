import fs from 'fs'
import {
  Client,
  PaymentFlags,
  SponsorFlags,
  Wallet,
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

// Create the sponsor and sponsee wallets ----------------------
// Only the sponsor is funded. The sponsee has no account on the ledger yet, and no
// XRP to pay for one.
console.log(`\n=== Creating the sponsor and sponsee wallets ===\n`)
const { wallet: sponsor } = await client.fundWallet()
const sponsee = Wallet.generate()

console.log(`Sponsor address: ${sponsor.address}`)
console.log(`Sponsee address: ${sponsee.address}`)

// Prepare Payment transaction to create the sponsee's account ----------------------
// The tfSponsorCreatedAccount flag makes the sponsor pay the new account's reserve,
// so the payment itself only needs to deliver 1 drop.
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

// Confirm the new AccountRoot entry records the sponsor
const accountNode = createAccountResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'AccountRoot'
)
console.log('Sponsee account created successfully!')
console.log(`Account reserve sponsored by: ${accountNode.CreatedNode.NewFields.Sponsor}`)

// Prepare the sponsored MPTokenAuthorize transaction ----------------------
// The sponsee is the sending account. The Sponsor and SponsorFlags fields ask the
// sponsor to cover both the fee and the reserve for the new MPToken entry.
console.log(`\n=== Preparing sponsored MPTokenAuthorize transaction ===\n`)
const mptAuthorizeTx = {
  TransactionType: 'MPTokenAuthorize',
  Account: sponsee.address,
  MPTokenIssuanceID: mptID,
  Sponsor: sponsor.address,
  SponsorFlags: SponsorFlags.tfSponsorFee | SponsorFlags.tfSponsorReserve
}

validate(mptAuthorizeTx)
// The fee must be autofilled before either party signs, because the sponsor's
// signature approves the exact fee amount.
const preparedTx = await client.autofill(mptAuthorizeTx)
console.log(JSON.stringify(preparedTx, null, 2))

// Sign as the sponsee ----------------------
const sponseeSignedTx = sponsee.sign(preparedTx)

// Co-sign as the sponsor ----------------------
const coSignedTx = signAsSponsor(sponsor, sponseeSignedTx.tx_blob)

// Submit the fully signed transaction and wait for validation ----------------------
console.log(`\n=== Submitting sponsored MPTokenAuthorize transaction ===\n`)
console.log(JSON.stringify(coSignedTx.tx, null, 2))
const submitResponse = await client.submitAndWait(coSignedTx.tx_blob)

if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.error('Error: Unable to authorize the MPT:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Transaction sponsored successfully!')

// Extract sponsorship information from the transaction result ----------------------
console.log(`\n=== Sponsorship Information ===\n`)
const mptokenNode = submitResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'MPToken'
)
console.log(`MPToken ID: ${mptokenNode.CreatedNode.LedgerIndex}`)
console.log(`MPToken reserve sponsored by: ${mptokenNode.CreatedNode.NewFields.Sponsor}`)

// The sponsor's AccountRoot shows the fee it paid and the reserves it now covers.
// The sponsee's balance is untouched.
for (const node of submitResponse.result.meta.AffectedNodes) {
  const modified = node.ModifiedNode
  if (modified?.LedgerEntryType !== 'AccountRoot') {
    continue
  }

  const fields = modified.FinalFields
  const previousBalance = modified.PreviousFields?.Balance ?? fields.Balance
  const feePaid = Number(previousBalance) - Number(fields.Balance)

  if (fields.Account === sponsor.address) {
    console.log(`\nSponsor fee paid: ${feePaid} drops`)
    console.log(`Sponsor balance:  ${fields.Balance} drops`)
    console.log(`Reserves sponsored (SponsoringOwnerCount): ${fields.SponsoringOwnerCount ?? 0}`)
  } else if (fields.Account === sponsee.address) {
    console.log(`\nSponsee fee paid: ${feePaid} drops`)
    console.log(`Sponsee balance:  ${fields.Balance} drops`)
    console.log(`Sponsee owner count: ${fields.OwnerCount ?? 0}`)
  }
}

await client.disconnect()
