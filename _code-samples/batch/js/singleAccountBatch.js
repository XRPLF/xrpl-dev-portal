/**
 * Single Account Batch Transaction Example
 *
 * This example demonstrates how to use the Batch transactions feature (XLS-56)
 * to create a single-account batch transaction that sends payments
 * to multiple destinations in one atomic operation.
*/

import xrpl from "xrpl"
import { BatchFlags } from 'xrpl/dist/npm/models/transactions/batch.js'
import { GlobalFlags } from 'xrpl/dist/npm/models/transactions/common.js'

const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233/")
await client.connect()

// Create and fund wallets
console.log("=== Funding new wallets from faucet... ===")
const { wallet: sender } = await client.fundWallet()
const { wallet: wallet1 } = await client.fundWallet()
const { wallet: wallet2 } = await client.fundWallet()

console.log(`Sender: ${sender.address}, Balance: ${await client.getXrpBalance(sender.address)} XRP`)
console.log(`Wallet1: ${wallet1.address}, Balance: ${await client.getXrpBalance(wallet1.address)} XRP`)
console.log(`Wallet2: ${wallet2.address}, Balance: ${await client.getXrpBalance(wallet2.address)} XRP`)

// Create inner transactions  --------------------------------------------
// REQUIRED: Inner transactions MUST have the tfInnerBatchTxn flag (0x40000000).
// This marks them as part of a batch (allows Fee: 0 and empty SigningPubKey).

// Transaction 1
const payment1 = {
  TransactionType: "Payment",
  Account: sender.address,
  Destination: wallet1.address,
  Amount: xrpl.xrpToDrops(2),
  Flags: GlobalFlags.tfInnerBatchTxn // THIS IS REQUIRED
}

// Transaction 2
const payment2 = {
  TransactionType: "Payment",
  Account: sender.address,
  Destination: wallet2.address,
  Amount: xrpl.xrpToDrops(5),
  Flags: GlobalFlags.tfInnerBatchTxn // THIS IS REQUIRED
}

// Send Batch transaction --------------------------------------------
console.log("\n=== Creating batch transaction ===")
const batchTx = {
  TransactionType: "Batch",
  Account: sender.address,
  Flags: BatchFlags.tfAllOrNothing, // tfAllOrNothing: All inner transactions must succeed
  // Must include a minimum of 2 transactions and a maximum of 8 transactions.
  RawTransactions: [
    { RawTransaction: payment1 }, 
    { RawTransaction: payment2 }
  ]
}
console.log(JSON.stringify(batchTx, null, 2))

// Validate the transaction structure before submitting
xrpl.validate(batchTx)

// Submit and wait for validation
console.log("\n=== Submitting batch transaction ===")
const submitResponse = await client.submitAndWait(batchTx, {
  wallet: sender,
  // "autofill" will automatically add Fee: "0" and SigningPubKey: "".
  autofill: true
})

// Check Batch transaction result --------------------------------
if (submitResponse.result.meta.TransactionResult !== "tesSUCCESS") {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.warn(`\nTransaction failed with result code ${resultCode}`)
  process.exit(1)
}
console.log("\nBatch transaction submitted successfully!")
console.log("Result:\n", JSON.stringify(submitResponse.result, null, 2))

// Calculate and verify inner transaction hashes --------------------------------------------
console.log("\n=== Verifying Inner Transactions ===")

// Get the actual inner transactions from the batch response
const rawTransactions = submitResponse.result.tx_json.RawTransactions

for (let i = 0; i < rawTransactions.length; i++) {
  const innerTx = rawTransactions[i].RawTransaction
  const hash = xrpl.hashes.hashSignedTx(xrpl.encode(innerTx))
  
  console.log(`\nTransaction ${i + 1} Hash: ${hash}`)
  
  try {
    const tx = await client.request({ command: 'tx', transaction: hash })
    console.log(` - Status: ${tx.result.meta?.TransactionResult} (Ledger ${tx.result.ledger_index})`)
    console.log(` - Transaction URL: https://devnet.xrpl.org/transactions/${hash}`)
  } catch (error) {
    console.log(`✗ Not found: ${error.message}`)
  }
}

// Verify balances after transaction
console.log("\n=== Final Balances ===")
console.log(`Sender: ${sender.address}, Balance: ${await client.getXrpBalance(sender.address)} XRP`)
console.log(`Wallet1: ${wallet1.address}, Balance: ${await client.getXrpBalance(wallet1.address)} XRP`)
console.log(`Wallet2: ${wallet2.address}, Balance: ${await client.getXrpBalance(wallet2.address)} XRP`)

// View the batch transaction on the XRPL Explorer 
console.log(`\nBatch Transaction URL:\nhttps://devnet.xrpl.org/transactions/${submitResponse.result.hash}`)

await client.disconnect()
