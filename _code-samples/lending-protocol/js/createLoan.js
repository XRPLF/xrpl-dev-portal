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
  PrincipalRequested: 1000,
  InterestRate: 500,
  PaymentTotal: 12,
  PaymentInterval: 2592000,
  GracePeriod: 604800,
  LoanOriginationFee: 100,
  LoanServiceFee: 10
})

console.log(JSON.stringify(loanSetTx, null, 2))

// Loan broker signs first
console.log(`\n=== Adding loan broker signature ===\n`)
const loanBrokerSignature = await client.request({
  command: 'sign',
  tx_json: loanSetTx,
  secret: loanBroker.seed
})

const loanBrokerSignatureResult = loanBrokerSignature.result.tx_json

console.log(`TxnSignature: ${loanBrokerSignatureResult.TxnSignature}`)
console.log(`SigningPubKey: ${loanBrokerSignatureResult.SigningPubKey}\n`)
console.log(`Signed loanSetTx for borrower to sign over:\n${JSON.stringify(loanBrokerSignatureResult, null, 2)}`)

// Borrower signs second
console.log(`\n=== Adding borrower signature ===\n`)

const borrowerSignature = await client.request({
  command: 'sign',
  tx_json: loanBrokerSignatureResult,
  secret: borrower.seed,
  signature_target: 'CounterpartySignature'
})

const borrowerSignatureResult = borrowerSignature.result.tx_json

console.log(`Borrower TxnSignature: ${borrowerSignatureResult.CounterpartySignature.TxnSignature}`)
console.log(`Borrower SigningPubKey: ${borrowerSignatureResult.CounterpartySignature.SigningPubKey}`)

// Validate the transaction structure before submitting.
xrpl.validate(borrowerSignatureResult)
console.log(`\nFully signed LoanSet transaction:\n${JSON.stringify(borrowerSignatureResult, null, 2)}`)

// Submit and wait for validation ----------------------
console.log(`\n=== Submitting signed LoanSet transaction ===\n`)

// Submit the transaction
const submitResult = await client.submit(borrowerSignatureResult)
const txHash = submitResult.result.tx_json.hash

// Helper function to check tx hash is validated
async function validateTx (hash, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      const tx = await client.request({ command: 'tx', transaction: hash })
      if (tx.result.validated) {
        return tx
      }
    } catch (error) {
      // Transaction not validated yet, check again
    }
  }
  console.error(`Error: Transaction ${hash} not validated after ${maxRetries} attempts.`)
  await client.disconnect()
  process.exit(1)
}

// Validate the transaction
const submitResponse = await validateTx(txHash)
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
