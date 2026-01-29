// IMPORTANT: This example deposits and withdraws first-loss capital from a
// preconfigured LoanBroker entry.

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
const loanBrokerID = setupData.loanBrokerID
const mptID = setupData.mptID

console.log(`\nLoan broker address: ${loanBroker.address}`)
console.log(`LoanBrokerID: ${loanBrokerID}`)
console.log(`MPT ID: ${mptID}`)

// Prepare LoanBrokerCoverDeposit transaction ----------------------
console.log(`\n=== Preparing LoanBrokerCoverDeposit transaction ===\n`)
const coverDepositTx = {
  TransactionType: 'LoanBrokerCoverDeposit',
  Account: loanBroker.address,
  LoanBrokerID: loanBrokerID,
  Amount: {
    mpt_issuance_id: mptID,
    value: '2000'
  }
}

// Validate the transaction structure before submitting
xrpl.validate(coverDepositTx)
console.log(JSON.stringify(coverDepositTx, null, 2))

// Sign, submit, and wait for deposit validation ----------------------
console.log(`\n=== Submitting LoanBrokerCoverDeposit transaction ===\n`)
const depositResponse = await client.submitAndWait(coverDepositTx, {
  wallet: loanBroker,
  autofill: true
})
if (depositResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = depositResponse.result.meta.TransactionResult
  console.error('Error: Unable to deposit cover:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Cover deposit successful!')

// Extract cover balance from the transaction result
console.log(`\n=== Cover Balance ===\n`)
let loanBrokerNode = depositResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'LoanBroker'
)
// First-loss capital is stored in the LoanBroker's pseudo-account.
console.log(`LoanBroker Pseudo-Account: ${loanBrokerNode.ModifiedNode.FinalFields.Account}`)
console.log(`Cover balance after deposit: ${loanBrokerNode.ModifiedNode.FinalFields.CoverAvailable} TSTUSD`)

// Prepare LoanBrokerCoverWithdraw transaction ----------------------
console.log(`\n=== Preparing LoanBrokerCoverWithdraw transaction ===\n`)
const coverWithdrawTx = {
  TransactionType: 'LoanBrokerCoverWithdraw',
  Account: loanBroker.address,
  LoanBrokerID: loanBrokerID,
  Amount: {
    mpt_issuance_id: mptID,
    value: '1000'
  }
}

// Validate the transaction structure before submitting
xrpl.validate(coverWithdrawTx)
console.log(JSON.stringify(coverWithdrawTx, null, 2))

// Sign, submit, and wait for withdraw validation ----------------------
console.log(`\n=== Submitting LoanBrokerCoverWithdraw transaction ===\n`)
const withdrawResponse = await client.submitAndWait(coverWithdrawTx, {
  wallet: loanBroker,
  autofill: true
})
if (withdrawResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = withdrawResponse.result.meta.TransactionResult
  console.error('Error: Unable to withdraw cover:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Cover withdraw successful!')

// Extract updated cover balance from the transaction result
console.log(`\n=== Updated Cover Balance ===\n`)
loanBrokerNode = withdrawResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'LoanBroker'
)
console.log(`LoanBroker Pseudo-Account: ${loanBrokerNode.ModifiedNode.FinalFields.Account}`)
console.log(`Cover balance after withdraw: ${loanBrokerNode.ModifiedNode.FinalFields.CoverAvailable} TSTUSD`)

await client.disconnect()
