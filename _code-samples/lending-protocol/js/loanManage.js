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
const nextPaymentDueDate = loanStatus.result.node.NextPaymentDueDate
const paymentDue = new Date(xrpl.rippleTimeToUnixTime(nextPaymentDueDate))
const gracePeriod = loanStatus.result.node.GracePeriod
console.log(`Payment Due Date: ${paymentDue.toLocaleString()}`)
console.log(`Grace Period: ${gracePeriod} seconds`)

// Countdown until the loan can be impaired ----------------------
// A loan can only be impaired once its payment is late.
// Lateness is measured against the ledger's close time.
console.log(`\n=== Countdown until loan can be impaired ===\n`)

let latestLedger = await client.request({
  command: 'ledger',
  ledger_index: 'validated'
})

for (let secondsLeft = nextPaymentDueDate - latestLedger.result.ledger.close_time + 1; secondsLeft > 0; secondsLeft--) {
  process.stdout.write(`\x1b[K\r${secondsLeft} seconds...`)
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// The countdown runs on the local clock, so confirm the ledger has caught up.
while (true) {
  latestLedger = await client.request({ command: 'ledger', ledger_index: 'validated' })
  if (latestLedger.result.ledger.close_time > nextPaymentDueDate) break
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
process.stdout.write('\x1b[K\rPayment is late. Loan can now be impaired.\n')

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

// Countdown until the loan can be defaulted ----------------------
// A loan can only be defaulted once the grace period has elapsed
// past the payment due date. Measured against the ledger's close time.
console.log(`\n=== Countdown until loan can be defaulted ===\n`)

latestLedger = await client.request({
  command: 'ledger',
  ledger_index: 'validated'
})

const defaultTime = nextPaymentDueDate + gracePeriod
for (let secondsLeft = defaultTime - latestLedger.result.ledger.close_time + 1; secondsLeft > 0; secondsLeft--) {
  process.stdout.write(`\x1b[K\r${secondsLeft} seconds...`)
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// The countdown runs on the local clock, so confirm the ledger has caught up.
while (true) {
  latestLedger = await client.request({ command: 'ledger', ledger_index: 'validated' })
  if (latestLedger.result.ledger.close_time > defaultTime) break
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
process.stdout.write('\x1b[K\rGrace period expired. Loan can now be defaulted.\n')

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
const loanNode = defaultResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'Loan'
)
const loanFlags = loanNode.ModifiedNode.FinalFields.Flags
console.log(`Final loan flags (parsed): ${JSON.stringify(xrpl.parseTransactionFlags({
  TransactionType: 'LoanManage',
  Flags: loanFlags
}))}`)

await client.disconnect()
