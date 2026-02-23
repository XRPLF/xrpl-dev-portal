// IMPORTANT: This example pays off an existing loan and then deletes it.

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

// Load preconfigured accounts and LoanID.
const setupData = JSON.parse(fs.readFileSync('lendingSetup.json', 'utf8'))

// You can replace these values with your own
const borrower = xrpl.Wallet.fromSeed(setupData.borrower.seed)
const loanID = setupData.loanID2
const mptID = setupData.mptID

console.log(`\nBorrower address: ${borrower.address}`)
console.log(`LoanID: ${loanID}`)
console.log(`MPT ID: ${mptID}`)

// Check initial loan status ----------------------
console.log(`\n=== Loan Status ===\n`)
const loanStatus = await client.request({
  command: 'ledger_entry',
  index: loanID,
  ledger_index: 'validated'
})

const totalValueOutstanding = loanStatus.result.node.TotalValueOutstanding
const loanServiceFee = loanStatus.result.node.LoanServiceFee
const totalPayment = (BigInt(totalValueOutstanding) + BigInt(loanServiceFee)).toString()

console.log(`Amount Owed: ${totalValueOutstanding} TSTUSD`)
console.log(`Loan Service Fee: ${loanServiceFee} TSTUSD`)
console.log(`Total Payment Due (including fees): ${totalPayment} TSTUSD`)

// Prepare LoanPay transaction ----------------------
console.log(`\n=== Preparing LoanPay transaction ===\n`)

const loanPayTx = {
  TransactionType: 'LoanPay',
  Account: borrower.address,
  LoanID: loanID,
  Amount: {
    mpt_issuance_id: mptID,
    value: totalPayment
  }
}

// Validate the transaction structure before submitting
xrpl.validate(loanPayTx)
console.log(JSON.stringify(loanPayTx, null, 2))

// Sign, submit, and wait for payment validation ----------------------
console.log(`\n=== Submitting LoanPay transaction ===\n`)
const payResponse = await client.submitAndWait(loanPayTx, {
  wallet: borrower,
  autofill: true
})

if (payResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = payResponse.result.meta.TransactionResult
  console.error('Error: Unable to pay loan:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan paid successfully!')

// Extract updated loan info from transaction results ----------------------
console.log(`\n=== Loan Status After Payment ===\n`)
const loanNode = payResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'Loan'
)

const finalBalance = loanNode.ModifiedNode.FinalFields.TotalValueOutstanding
  ? `${loanNode.ModifiedNode.FinalFields.TotalValueOutstanding} TSTUSD`
  : 'Loan fully paid off!'
console.log(`Outstanding Loan Balance: ${finalBalance}`)

// Prepare LoanDelete transaction ----------------------
// Either the loan broker or borrower can submit this transaction.
console.log(`\n=== Preparing LoanDelete transaction ===\n`)
const loanDeleteTx = {
  TransactionType: 'LoanDelete',
  Account: borrower.address,
  LoanID: loanID
}

// Validate the transaction structure before submitting
xrpl.validate(loanDeleteTx)
console.log(JSON.stringify(loanDeleteTx, null, 2))

// Sign, submit, and wait for deletion validation ----------------------
console.log(`\n=== Submitting LoanDelete transaction ===\n`)
const deleteResponse = await client.submitAndWait(loanDeleteTx, {
  wallet: borrower,
  autofill: true
})

if (deleteResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = deleteResponse.result.meta.TransactionResult
  console.error('Error: Unable to delete loan:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan deleted successfully!')

// Verify loan deletion ----------------------
console.log(`\n=== Verifying Loan Deletion ===\n`)
try {
  await client.request({
    command: 'ledger_entry',
    index: loanID,
    ledger_index: 'validated'
  })
  console.log('Warning: Loan still exists in the ledger.')
} catch (error) {
  if (error.data.error === 'entryNotFound') {
    console.log('Loan has been successfully removed from the XRP Ledger!')
  } else {
    console.error('Error checking loan status:', error)
  }
}

await client.disconnect()
