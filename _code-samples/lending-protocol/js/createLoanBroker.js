// IMPORTANT: This example creates a loan broker using an existing account
// that has already created a PRIVATE vault.
// If you want to create a loan broker for a PUBLIC vault, you can replace the vaultID
// and loanBroker values with your own.

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

// Load preconfigured accounts and VaultID.
const setupData = JSON.parse(fs.readFileSync('lendingSetup.json', 'utf8'))

// You can replace these values with your own
const loanBroker = xrpl.Wallet.fromSeed(setupData.loanBroker.seed)
const vaultID = setupData.vaultID

console.log(`\nLoan broker/vault owner address: ${loanBroker.address}`)
console.log(`Vault ID: ${vaultID}`)

// Prepare LoanBrokerSet transaction ----------------------
console.log(`\n=== Preparing LoanBrokerSet transaction ===\n`)
const loanBrokerSetTx = {
  TransactionType: 'LoanBrokerSet',
  Account: loanBroker.address,
  VaultID: vaultID,
  ManagementFeeRate: 1000
}

// Validate the transaction structure before submitting
xrpl.validate(loanBrokerSetTx)
console.log(JSON.stringify(loanBrokerSetTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting LoanBrokerSet transaction ===\n`)
const submitResponse = await client.submitAndWait(loanBrokerSetTx, {
  wallet: loanBroker,
  autofill: true
})
if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.error('Error: Unable to create loan broker:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan broker created successfully!')

// Extract loan broker information from the transaction result
console.log(`\n=== Loan Broker Information ===\n`)
const loanBrokerNode = submitResponse.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'LoanBroker'
)
console.log(`LoanBroker ID: ${loanBrokerNode.CreatedNode.LedgerIndex}`)
console.log(`LoanBroker Psuedo-Account Address: ${loanBrokerNode.CreatedNode.NewFields.Account}`)

await client.disconnect()
