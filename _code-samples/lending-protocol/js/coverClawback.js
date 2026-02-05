// IMPORTANT: This example deposits and claws back first-loss capital from a
// preconfigured LoanBroker entry. The first-loss capital is an MPT
// with clawback enabled.

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
const mptIssuer = xrpl.Wallet.fromSeed(setupData.depositor.seed)
const loanBrokerID = setupData.loanBrokerID
const mptID = setupData.mptID

console.log(`\nLoan broker address: ${loanBroker.address}`)
console.log(`MPT issuer address: ${mptIssuer.address}`)
console.log(`LoanBrokerID: ${loanBrokerID}`)
console.log(`MPT ID: ${mptID}`)

// Check cover available ----------------------
console.log(`\n=== Cover Available ===\n`)
const coverInfo = await client.request({
  command: 'ledger_entry',
  index: loanBrokerID,
  ledger_index: 'validated'
})

let currentCoverAvailable = coverInfo.result.node.CoverAvailable || '0'
console.log(`${currentCoverAvailable} TSTUSD`)

// Prepare LoanBrokerCoverDeposit transaction ----------------------
console.log(`\n=== Preparing LoanBrokerCoverDeposit transaction ===\n`)
const coverDepositTx = {
  TransactionType: 'LoanBrokerCoverDeposit',
  Account: loanBroker.address,
  LoanBrokerID: loanBrokerID,
  Amount: {
    mpt_issuance_id: mptID,
    value: '1000'
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

// Extract updated cover available after deposit ----------------------
console.log(`\n=== Cover Available After Deposit ===\n`)
let loanBrokerNode = depositResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'LoanBroker'
)

currentCoverAvailable = loanBrokerNode.ModifiedNode.FinalFields.CoverAvailable
console.log(`${currentCoverAvailable} TSTUSD`)

// Verify issuer of cover asset matches ----------------------
// Only the issuer of the asset can submit clawback transactions.
// The asset must also have clawback enabled.
console.log(`\n=== Verifying Asset Issuer ===\n`)
const assetIssuerInfo = await client.request({
  command: 'ledger_entry',
  mpt_issuance: mptID,
  ledger_index: 'validated'
})

if (assetIssuerInfo.result.node.Issuer !== mptIssuer.address) {
  console.error(`Error: ${assetIssuerInfo.result.node.Issuer} does not match account (${mptIssuer.address}) attempting clawback!`)
  await client.disconnect()
  process.exit(1)
}

console.log(`MPT issuer account verified: ${mptIssuer.address}. Proceeding to clawback.`)

// Prepare LoanBrokerCoverClawback transaction ----------------------
console.log(`\n=== Preparing LoanBrokerCoverClawback transaction ===\n`)
const coverClawbackTx = {
  TransactionType: 'LoanBrokerCoverClawback',
  Account: mptIssuer.address,
  LoanBrokerID: loanBrokerID,
  Amount: {
    mpt_issuance_id: mptID,
    value: currentCoverAvailable
  }
}

// Validate the transaction structure before submitting
xrpl.validate(coverClawbackTx)
console.log(JSON.stringify(coverClawbackTx, null, 2))

// Sign, submit, and wait for clawback validation ----------------------
console.log(`\n=== Submitting LoanBrokerCoverClawback transaction ===\n`)
const clawbackResponse = await client.submitAndWait(coverClawbackTx, {
  wallet: mptIssuer,
  autofill: true
})

if (clawbackResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = clawbackResponse.result.meta.TransactionResult
  console.error('Error: Unable to clawback cover:', resultCode)
  await client.disconnect()
  process.exit(1)
}

console.log(`Successfully clawed back ${currentCoverAvailable} TSTUSD!`)

// Extract final cover available ----------------------
console.log(`\n=== Final Cover Available After Clawback ===\n`)
loanBrokerNode = clawbackResponse.result.meta.AffectedNodes.find(node =>
  node.ModifiedNode?.LedgerEntryType === 'LoanBroker'
)

console.log(`${loanBrokerNode.ModifiedNode.FinalFields.CoverAvailable || '0'} TSTUSD`)

await client.disconnect()
