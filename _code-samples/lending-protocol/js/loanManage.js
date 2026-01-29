// IMPORTANT: This example impairs an existing loan, which has a 60 second grace period.
// After the 60 seconds pass, this example defaults the loan.

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
const loanBroker = xrpl.Wallet.fromSeed(setupData.loanBroker.seed)
const loanID = setupData.loanID1

console.log(`\nLoan broker address: ${loanBroker.address}`)
console.log(`LoanID: ${loanID}`)

// Check loan status before impairment ----------------------
console.log(`\n=== Loan Status ===\n`)
const loanStatus = await client.request({
  command: 'ledger_entry',
  index: loanID,
  ledger_index: 'validated'
})

console.log(`Total Amount Owed: ${loanStatus.result.node.TotalValueOutstanding} TSTUSD.`)
// Convert Ripple Epoch timestamp to local date and time
let nextPaymentDueDate = loanStatus.result.node.NextPaymentDueDate
let paymentDue = new Date((nextPaymentDueDate + 946684800) * 1000)
console.log(`Payment Due Date: ${paymentDue.toLocaleString()}`)

// Prepare LoanManage transaction to impair the loan ----------------------
console.log(`\n=== Preparing LoanManage transaction to impair loan ===\n`)
const loanManageImpair = {
  TransactionType: 'LoanManage',
  Account: loanBroker.address,
  LoanID: loanID,
  Flags: xrpl.LoanManageFlags.tfLoanImpair
}

// Validate the impairment transaction before submitting
xrpl.validate(loanManageImpair)
console.log(JSON.stringify(loanManageImpair, null, 2))

// Sign, submit, and wait for impairment validation ----------------------
console.log(`\n=== Submitting LoanManage impairment transaction ===\n`)
const impairResponse = await client.submitAndWait(loanManageImpair, {
  wallet: loanBroker,
  autofill: true
})

if (impairResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = impairResponse.result.meta.TransactionResult
  console.error('Error: Unable to impair loan:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan impaired successfully!')

// Extract loan impairment info from transaction results ----------------------
let loanNode = impairResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'Loan'
)

// Check grace period and next payment due date
const gracePeriod = loanNode.ModifiedNode.FinalFields.GracePeriod
nextPaymentDueDate = loanNode.ModifiedNode.FinalFields.NextPaymentDueDate
const defaultTime = nextPaymentDueDate + gracePeriod
paymentDue = new Date((nextPaymentDueDate + 946684800) * 1000)

console.log(`New Payment Due Date: ${paymentDue.toLocaleString()}`)
console.log(`Grace Period: ${gracePeriod} seconds`)

// Convert current time to Ripple Epoch timestamp
const currentTime = Math.floor(Date.now() / 1000) - 946684800
let secondsUntilDefault = defaultTime - currentTime

// Countdown until loan can be defaulted ----------------------
console.log(`\n=== Countdown until loan can be defaulted ===\n`)

await new Promise((resolve) => {
  const countdown = setInterval(() => {
    if (secondsUntilDefault <= 0) {
      clearInterval(countdown)
      process.stdout.write('\rGrace period expired. Loan can now be defaulted.\n')
      resolve()
    } else {
      process.stdout.write(`\r${secondsUntilDefault} seconds...`)
      secondsUntilDefault--
    }
  }, 1000)
})

// Prepare LoanManage transaction to default the loan ----------------------
console.log(`\n=== Preparing LoanManage transaction to default loan ===\n`)
const loanManageDefault = {
  TransactionType: 'LoanManage',
  Account: loanBroker.address,
  LoanID: loanID,
  Flags: xrpl.LoanManageFlags.tfLoanDefault
}

// Validate the default transaction before submitting
xrpl.validate(loanManageDefault)
console.log(JSON.stringify(loanManageDefault, null, 2))

// Sign, submit, and wait for default validation ----------------------
console.log(`\n=== Submitting LoanManage default transaction ===\n`)
const defaultResponse = await client.submitAndWait(loanManageDefault, {
  wallet: loanBroker,
  autofill: true
})

if (defaultResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = defaultResponse.result.meta.TransactionResult
  console.error('Error: Unable to default loan:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan defaulted successfully!')

// Verify loan default status from transaction results ----------------------
console.log(`\n=== Checking final loan status ===\n`)
loanNode = defaultResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'Loan'
)
const loanFlags = loanNode.ModifiedNode.FinalFields.Flags
console.log(`Final loan flags (parsed): ${JSON.stringify(xrpl.parseTransactionFlags({
  TransactionType: 'LoanManage',
  Flags: loanFlags
}))}`)

await client.disconnect()
