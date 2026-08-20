import {
  Client,
  SponsorFlags,
  SponsorshipSetFlags,
  validate
} from 'xrpl'

// Connect to the network ----------------------
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// Create the sponsor and sponsee wallets ----------------------
console.log(`\n=== Creating the sponsor and sponsee wallets... ===`)
const { wallet: sponsor } = await client.fundWallet()
const { wallet: sponsee } = await client.fundWallet()

console.log(`Sponsor address: ${sponsor.address}`)
console.log(`Sponsee address: ${sponsee.address}`)

// Prepare SponsorshipSet transaction ----------------------
// FeeAmountDelta adds 1 XRP to the fee pool, MaxFee caps the pool's contribution
// to any single transaction, and RemainingOwnerCountDelta allows five sponsored ledger entries.
console.log(`\n=== Preparing SponsorshipSet transaction... ===`)
const createPoolTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  FeeAmountDelta: '1000000',
  MaxFee: '1000',
  RemainingOwnerCountDelta: 5
}

validate(createPoolTx)
console.log(JSON.stringify(createPoolTx, null, 2))

// Submit the SponsorshipSet transaction ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction... ===`)
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
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${createResponse.result.hash}`)

// Spend part of the pool ----------------------
// The sponsee creates a DepositPreauth entry, drawing the fee and one owner reserve
// from the pool.
console.log(`\n=== Submitting sponsored DepositPreauth transaction... ===`)
const depositPreauthTx = {
  TransactionType: 'DepositPreauth',
  Account: sponsee.address,
  Authorize: sponsor.address,
  Sponsor: sponsor.address,
  SponsorFlags: SponsorFlags.spfSponsorFee | SponsorFlags.spfSponsorReserve
}
validate(depositPreauthTx)

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

let fields = depositPreauthResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'Sponsorship'
).ModifiedNode.FinalFields
console.log('Sponsorship pool:')
console.log(`  Fee amount:            ${fields.FeeAmount} drops`)
console.log(`  Owner reserves count:  ${fields.RemainingOwnerCount}`)
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${depositPreauthResponse.result.hash}`)

// Prepare SponsorshipSet transaction to top up the pool ----------------------
// A second SponsorshipSet on the same sponsee applies deltas to the current allowances.
// Here the sponsor adds another 1 XRP of fee budget and five more reserve units.
console.log(`\n=== Preparing SponsorshipSet transaction to top up sponsorship pool... ===`)
const updatePoolTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  FeeAmountDelta: '1000000',
  MaxFee: '1000',
  RemainingOwnerCountDelta: 5
}

validate(updatePoolTx)
console.log(JSON.stringify(updatePoolTx, null, 2))

// Submit the SponsorshipSet transaction to top up the pool ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction... ===`)
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
console.log('Sponsorship pool topped up successfully:')
console.log(`  Fee amount:            ${fields.FeeAmount} drops`)
console.log(`  Owner reserves count:  ${fields.RemainingOwnerCount}`)
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${updateResponse.result.hash}`)

// Prepare SponsorshipSet transaction to delete the sponsorship ----------------------
// tfDeleteObject returns the unspent FeeAmount to the sponsor. Ledger entries the
// pool already paid reserves for stay sponsored until they're transferred or deleted.
console.log(`\n=== Preparing SponsorshipSet transaction to delete the sponsorship... ===`)
const balanceBeforeResponse = await client.request({
  command: 'account_info',
  account: sponsor.address,
  ledger_index: 'validated'
})
const sponsorBalanceBefore = BigInt(
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

// Submit the SponsorshipSet transaction to delete the sponsorship ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction... ===`)
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
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${deleteResponse.result.hash}`)

// Show the reclaimed XRP ----------------------
console.log(`\n=== Reclaimed Funds ===`)
const balanceAfterResponse = await client.request({
  command: 'account_info',
  account: sponsor.address,
  ledger_index: 'validated'
})
const sponsorBalanceAfter = BigInt(
  balanceAfterResponse.result.account_data.Balance
)
const deleteFee = BigInt(deleteResponse.result.tx_json.Fee)

console.log(`Unspent fee amount returned from pool: ${deletedNode.DeletedNode.FinalFields.FeeAmount} drops`)
console.log(`Sponsor balance "before" deletion:     ${sponsorBalanceBefore} drops`)
console.log(`Sponsor balance "after" deletion:      ${sponsorBalanceAfter} drops`)
console.log(`Delete transaction (fee paid):         ${deleteFee} drops`)

await client.disconnect()
