// IMPORTANT: This example creates a loan using a preconfigured
// loan broker, borrower, and private vault.

import fs from 'fs'
import { execSync } from 'child_process'
import xrpl from 'xrpl'

// Connect to the network ----------------------
const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// This step checks for the necessary setup data to run the lending protocol tutorials.
// If missing, lendingSetup.js will generate the data.
if (!fs.existsSync('lendingSetup.json')) {
  console.log(`\n=== Lending tutorial data doesn't exist. Running setup script... ===\n`)
  execSync('node lendingSetup.js', { stdio: 'inherit' })
}

// Load preconfigured accounts and LoanBrokerID.
const setupData = JSON.parse(fs.readFileSync('lendingSetup.json', 'utf8'))

// You can replace these values with your own
const loanBroker = xrpl.Wallet.fromSeed(setupData.loanBroker.seed)
const borrower = xrpl.Wallet.fromSeed(setupData.borrower.seed)
const loanBrokerID = setupData.loanBrokerID

console.log(`\nLoan broker address: ${loanBroker.address}`)
console.log(`Borrower address: ${borrower.address}`)
console.log(`LoanBrokerID: ${loanBrokerID}`)

// Prepare LoanSet transaction ----------------------
// Account and Counterparty accounts can be swapped, but determines signing order.
// Account signs first, Counterparty signs second.
console.log(`\n=== Preparing LoanSet transaction ===\n`)

// Suppress unnecessary console warning from autofilling LoanSet.
console.warn = () => {}

const loanSetTx = await client.autofill({
  TransactionType: 'LoanSet',
  Account: loanBroker.address,
  Counterparty: borrower.address,
  LoanBrokerID: loanBrokerID,
  PrincipalRequested: '1000',
  InterestRate: 500,
  PaymentTotal: 12,
  PaymentInterval: 2592000,
  GracePeriod: 604800,
  LoanOriginationFee: '100',
  LoanServiceFee: '10'
})

console.log(JSON.stringify(loanSetTx, null, 2))

// Loan broker signs first
console.log(`\n=== Adding loan broker signature ===\n`)
const loanBrokerSigned = loanBroker.sign(loanSetTx)
const loanBrokerSignedTx = xrpl.decode(loanBrokerSigned.tx_blob)

console.log(`TxnSignature: ${loanBrokerSignedTx.TxnSignature}`)
console.log(`SigningPubKey: ${loanBrokerSignedTx.SigningPubKey}\n`)
console.log(`Signed loanSetTx for borrower to sign over:\n${JSON.stringify(loanBrokerSignedTx, null, 2)}`)

// Borrower signs second
console.log(`\n=== Adding borrower signature ===\n`)
const fullySigned = xrpl.signLoanSetByCounterparty(borrower, loanBrokerSignedTx)

console.log(`Borrower TxnSignature: ${fullySigned.tx.CounterpartySignature.TxnSignature}`)
console.log(`Borrower SigningPubKey: ${fullySigned.tx.CounterpartySignature.SigningPubKey}`)

// Validate the transaction structure before submitting.
xrpl.validate(fullySigned.tx)
console.log(`\nFully signed LoanSet transaction:\n${JSON.stringify(fullySigned.tx, null, 2)}`)

// Submit and wait for validation ----------------------
console.log(`\n=== Submitting signed LoanSet transaction ===\n`)

const submitResponse = await client.submitAndWait(fullySigned.tx)

if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.error('Error: Unable to create loan:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan created successfully!')

// Extract loan information from the transaction result.
console.log(`\n=== Loan Information ===\n`)
const loanNode = submitResponse.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Loan'
)
console.log(JSON.stringify(loanNode.CreatedNode.NewFields, null, 2))

await client.disconnect()
