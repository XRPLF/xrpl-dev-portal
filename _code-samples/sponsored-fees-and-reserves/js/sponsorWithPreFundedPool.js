import {
  Client,
  PaymentFlags,
  SponsorFlags,
  Wallet,
  addPreFundedSponsor,
  validate
} from 'xrpl'

// Connect to the network ----------------------
const client = new Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// Create the sponsor and sponsee wallets ----------------------
console.log(`\n=== Creating the sponsor and sponsee wallets... ===`)
const { wallet: sponsor } = await client.fundWallet()
const sponsee = Wallet.generate()

console.log(`Sponsor address: ${sponsor.address}`)
console.log(`Sponsee address: ${sponsee.address}`)

// Prepare Payment transaction to create the sponsee's account ----------------------
console.log(`\n=== Preparing Payment transaction to create the sponsee's account... ===`)
const createAccountTx = {
  TransactionType: 'Payment',
  Account: sponsor.address,
  Destination: sponsee.address,
  Amount: '1',
  Flags: PaymentFlags.tfSponsorCreatedAccount
}
validate(createAccountTx)
console.log(JSON.stringify(createAccountTx, null, 2))

// Submit the Payment transaction ----------------------
console.log(`\n=== Submitting Payment transaction... ===`)
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
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${createAccountResponse.result.hash}`)

// Prepare SponsorshipSet transaction ----------------------
console.log(`\n=== Preparing SponsorshipSet transaction... ===`)
const sponsorshipSetTx = {
  TransactionType: 'SponsorshipSet',
  Account: sponsor.address,
  Sponsee: sponsee.address,
  FeeAmountDelta: '1000000',
  MaxFee: '1000',
  RemainingOwnerCountDelta: 5
}
validate(sponsorshipSetTx)
console.log(JSON.stringify(sponsorshipSetTx, null, 2))

// Submit the SponsorshipSet transaction ----------------------
console.log(`\n=== Submitting SponsorshipSet transaction... ===`)
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
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${sponsorshipResponse.result.hash}`)

// Prepare the sponsored DepositPreauth transaction ----------------------
console.log(`\n=== Preparing sponsored DepositPreauth transaction... ===`)
const depositPreauthTx = addPreFundedSponsor(
  {
    TransactionType: 'DepositPreauth',
    Account: sponsee.address,
    Authorize: sponsor.address
  },
  sponsor.address,
  SponsorFlags.tfSponsorFee | SponsorFlags.tfSponsorReserve
)
validate(depositPreauthTx)
console.log(JSON.stringify(depositPreauthTx, null, 2))

// Submit the sponsored DepositPreauth transaction ----------------------
console.log(`\n=== Submitting sponsored DepositPreauth transaction... ===`)
const submitResponse = await client.submitAndWait(depositPreauthTx, {
  wallet: sponsee,
  autofill: true
})

if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.error('Error: Unable to create the preauthorization:', resultCode)
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

console.log('Transaction sponsored successfully!')
console.log(`Transaction URL: https://devnet.xrpl.org/transactions/${submitResponse.result.hash}`)

// Extract sponsorship information from the transaction result ----------------------
console.log(`\n=== Sponsorship Pool information ===`)
const preauthNode = submitResponse.result.meta.AffectedNodes.find(
  node => node.CreatedNode?.LedgerEntryType === 'DepositPreauth'
)
console.log(`DepositPreauth ID: ${preauthNode.CreatedNode.LedgerIndex}`)
console.log(`DepositPreauth reserve sponsored by: ${preauthNode.CreatedNode.NewFields.Sponsor}`)

// The Sponsorship entry shows the fee drops and owner reserves the pool spent.
const sponsorshipPool = submitResponse.result.meta.AffectedNodes.find(
  node => node.ModifiedNode?.LedgerEntryType === 'Sponsorship'
)
const fields = sponsorshipPool.ModifiedNode.FinalFields
const previous = sponsorshipPool.ModifiedNode.PreviousFields
const feePaid = BigInt(previous.FeeAmount) - BigInt(fields.FeeAmount)

console.log(`\nFee spent from the pool: ${feePaid} drops`)
console.log(`Fee remaining in the pool: ${fields.FeeAmount} drops`)
console.log(`Owner reserves spent: ${previous.RemainingOwnerCount - fields.RemainingOwnerCount}`)
console.log(`Owner reserves remaining: ${fields.RemainingOwnerCount}`)

await client.disconnect()
