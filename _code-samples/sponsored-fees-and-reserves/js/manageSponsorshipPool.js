// IMPORTANT:
// This script walks through the life cycle of a Sponsorship ledger entry: creating a
// pool of fees and owner reserves, spending part of it, topping it up, and deleting it
// to reclaim the unspent XRP. Both accounts already exist on the ledger here, so the
// sponsor only covers costs the sponsee opts into.

import fs from 'fs'
import {
  Client,
  SponsorFlags,
  SponsorshipSetFlags,
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
const { wallet: sponsee } = await client.fundWallet()

console.log(`Sponsor address: ${sponsor.address}`)
console.log(`Sponsee address: ${sponsee.address}`)

// Prepare SponsorshipSet transaction ----------------------
// FeeAmount funds the pool with 1 XRP for fees, MaxFee caps the pool's contribution to
// any single transaction, and RemainingOwnerCount allows five sponsored objects.
console.log(`\n=== Preparing SponsorshipSet transaction ===\n`)
const createPoolTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  FeeAmount: '1000000',
  MaxFee: '1000',
  RemainingOwnerCount: 5
}

validate(createPoolTx)
console.log(JSON.stringify(createPoolTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction ===\n`)
const createResponse = await client.submitAndWait(createPoolTx, {
  wallet: sponsor,
  autofill: true
})

if (createResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = createResponse.result.meta.TransactionResult
  console.error('Error: Unable to create the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

const sponsorshipNode = createResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'Sponsorship'
)
console.log('Sponsorship created successfully!')
console.log(`Sponsorship ID: ${sponsorshipNode.CreatedNode.LedgerIndex}`)

// Spend part of the pool ----------------------
// The sponsee authorizes the MPT, drawing the fee and one owner reserve from the pool.
console.log(`\n=== Submitting sponsored MPTokenAuthorize transaction ===\n`)
const authorizeTx = {
  TransactionType: 'MPTokenAuthorize',
  Account: sponsee.address,
  MPTokenIssuanceID: mptID,
  Sponsor: sponsor.address,
  SponsorFlags: SponsorFlags.tfSponsorFee | SponsorFlags.tfSponsorReserve
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

let fields = authorizeResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'Sponsorship'
).ModifiedNode.FinalFields
console.log('Sponsorship partially spent:')
console.log(`  Fee remaining:            ${fields.FeeAmount} drops`)
console.log(`  Owner reserves remaining: ${fields.RemainingOwnerCount}`)

// Prepare SponsorshipSet transaction to top up the pool ----------------------
// A second SponsorshipSet on the same sponsee replaces the current allowances rather
// than adding to them, so these values are the pool's new totals.
console.log(`\n=== Preparing SponsorshipSet transaction to update the sponsorship ===\n`)
const updatePoolTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  FeeAmount: '2000000',
  MaxFee: '1000',
  RemainingOwnerCount: 10
}

validate(updatePoolTx)
console.log(JSON.stringify(updatePoolTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction ===\n`)
const updateResponse = await client.submitAndWait(updatePoolTx, {
  wallet: sponsor,
  autofill: true
})

if (updateResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = updateResponse.result.meta.TransactionResult
  console.error('Error: Unable to update the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

fields = updateResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'Sponsorship'
).ModifiedNode.FinalFields
console.log('Sponsorship updated successfully:')
console.log(`  Fee allocated:            ${fields.FeeAmount} drops`)
console.log(`  Owner reserves allocated: ${fields.RemainingOwnerCount}`)

// Prepare SponsorshipSet transaction to delete the sponsorship ----------------------
// tfDeleteObject returns the unspent FeeAmount to the sponsor. Objects the pool
// already paid reserves for stay sponsored until they're transferred or deleted.
console.log(`\n=== Preparing SponsorshipSet transaction to delete the sponsorship ===\n`)
const balanceBeforeResponse = await client.request({
  command: 'account_info',
  account: sponsor.address
})
const sponsorBalanceBefore = Number(
  balanceBeforeResponse.result.account_data.Balance
)

const deletePoolTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  Flags: SponsorshipSetFlags.tfDeleteObject
}

validate(deletePoolTx)
console.log(JSON.stringify(deletePoolTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction ===\n`)
const deleteResponse = await client.submitAndWait(deletePoolTx, {
  wallet: sponsor,
  autofill: true
})

if (deleteResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = deleteResponse.result.meta.TransactionResult
  console.error('Error: Unable to delete the sponsorship:', resultCode)
  await client.disconnect()
  process.exit(1)
}

const deletedNode = deleteResponse.result.meta.AffectedNodes.find(
  node => node.DeletedNode?.LedgerEntryType === 'Sponsorship'
)
console.log('Sponsorship deleted successfully!')

// Show the reclaimed XRP ----------------------
console.log(`\n=== Reclaimed Funds ===\n`)
const balanceAfterResponse = await client.request({
  command: 'account_info',
  account: sponsor.address
})
const sponsorBalanceAfter = Number(
  balanceAfterResponse.result.account_data.Balance
)
const deleteFee = Number(deleteResponse.result.tx_json.Fee)

console.log(`Unspent fee returned from the pool: ${deletedNode.DeletedNode.FinalFields.FeeAmount} drops`)
console.log(`Sponsor balance before deletion:    ${sponsorBalanceBefore} drops`)
console.log(`Sponsor balance after deletion:     ${sponsorBalanceAfter} drops`)
console.log(`Fee paid for the deletion:          ${deleteFee} drops`)

await client.disconnect()
