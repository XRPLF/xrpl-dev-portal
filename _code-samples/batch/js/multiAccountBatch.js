/**
 * XRP Ledger Batch Transactions Tutorial
 *
 * This tutorial demonstrates how to use the Batch transaction feature (XLS-56)
 * to perform a multi-account batch transaction.
 * Concept doc: https://xrpl.org/docs/concepts/transactions/batch-transactions
 * Reference doc: https://xrpl.org/docs/references/protocol/transactions/types/batch
*/

import xrpl from "xrpl"

const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233/")
await client.connect()

// Create and fund wallets
console.log("=== Funding new wallets from faucet... ===")
const { wallet: alice } = await client.fundWallet()
const { wallet: bob } = await client.fundWallet()
const { wallet: charlie } = await client.fundWallet()
const { wallet: thirdPartyWallet } = await client.fundWallet()

console.log(`Alice: ${alice.address}, Balance: ${await client.getXrpBalance(alice.address)} XRP`)
console.log(`Bob: ${bob.address}, Balance: ${await client.getXrpBalance(bob.address)} XRP`)
console.log(`Charlie: ${charlie.address}, Balance: ${await client.getXrpBalance(charlie.address)} XRP`)
console.log(`Third-party wallet: ${thirdPartyWallet.address}, Balance: ${await client.getXrpBalance(thirdPartyWallet.address)} XRP`)

// Create inner transactions  --------------------------------------------
// REQUIRED: Inner transactions MUST have the tfInnerBatchTxn flag (0x40000000).
// This marks them as part of a batch (allows Fee: 0 and empty SigningPubKey).

// Transaction 1: Charlie pays Alice
const charliePayment = {
  TransactionType: "Payment",
  Account: charlie.address,
  Destination: alice.address,
  Amount: xrpl.xrpToDrops(50),
  Flags: xrpl.GlobalFlags.tfInnerBatchTxn // THIS IS REQUIRED
}

// Transaction 2: Bob pays Alice
const bobPayment = {
  TransactionType: "Payment",
  Account: bob.address,
  Destination: alice.address,
  Amount: xrpl.xrpToDrops(50),
  Flags: xrpl.GlobalFlags.tfInnerBatchTxn // THIS IS REQUIRED
}

// Send Batch transaction --------------------------------------------
console.log("\n=== Creating Batch transaction... ===")
const batchTx = {
  TransactionType: "Batch",
  Account: thirdPartyWallet.address,
  Flags: xrpl.BatchFlags.tfAllOrNothing, // tfAllOrNothing: All inner transactions must succeed
  // Must include a minimum of 2 transactions and a maximum of 8 transactions.
  RawTransactions: [
    { RawTransaction: charliePayment },
    { RawTransaction: bobPayment },
  ]
}
console.log(JSON.stringify(batchTx, null, 2))

// Validate the transaction structure
xrpl.validate(batchTx)

// Set the expected number of signers for this transaction.
// "autofill" will automatically add Fee: "0" and SigningPubKey: "".
const autofilledBatchTx = await client.autofill(batchTx, 2)

// Gather batch signatures --------------------------------
// Each signer needs their own tx copy because signMultiBatch modifies the object.
// Charlie signs the Batch transaction
const charlieBatch = { ...autofilledBatchTx }
xrpl.signMultiBatch(charlie, charlieBatch)

// Bob signs the Batch transaction
const bobBatch = { ...autofilledBatchTx }
xrpl.signMultiBatch(bob, bobBatch)

// Combine inner transaction signatures.
// This returns a signed transaction blob (hex string) ready for submission.
const combinedSignedTx = xrpl.combineBatchSigners([charlieBatch, bobBatch])

// Submit the signed blob with the third-party's wallet
console.log("\n=== Submitting Batch transaction... ===")
const submitResponse = await client.submitAndWait(combinedSignedTx, 
  { wallet: thirdPartyWallet }
)

// Check Batch transaction result --------------------------------
if (submitResponse.result.meta.TransactionResult !== "tesSUCCESS") {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.warn(`\nTransaction failed with result code ${resultCode}`)
  process.exit(1)
}

console.log("\nBatch transaction submitted successfully!")
console.log("Result:\n", JSON.stringify(submitResponse.result, null, 2))
// View the transaction on the XRPL Explorer 
console.log(`\nBatch transaction URL:\nhttps://devnet.xrpl.org/transactions/${submitResponse.result.hash}`)

// Calculate and verify inner transaction hashes --------------------------------------------
console.log("\n=== Verifying inner transactions ===")
const rawTransactions = submitResponse.result.tx_json.RawTransactions
let hasFailure = false

for (let i = 0; i < rawTransactions.length; i++) {
  const innerTx = rawTransactions[i].RawTransaction
  const hash = xrpl.hashes.hashSignedTx(innerTx)
  console.log(`\nTransaction ${i + 1} hash: ${hash}`)

  try {
    const tx = await client.request({ command: 'tx', transaction: hash })
    const status = tx.result.meta?.TransactionResult
    console.log(` - Status: ${status} (Ledger ${tx.result.ledger_index})`)
    console.log(` - Transaction URL: https://devnet.xrpl.org/transactions/${hash}`)
  } catch (error) {
    hasFailure = true
    console.log(` - Transaction not found: ${error}`)
  }
}
if (hasFailure) {
  console.error("\n--- Error: One or more inner transactions failed. ---")
  process.exit(1)
}

// Verify balances after transaction
console.log("\n=== Final balances ===")
console.log(`Alice: ${alice.address}, Balance: ${await client.getXrpBalance(alice.address)} XRP`)
console.log(`Bob: ${bob.address}, Balance: ${await client.getXrpBalance(bob.address)} XRP`)
console.log(`Charlie: ${charlie.address}, Balance: ${await client.getXrpBalance(charlie.address)} XRP`)
console.log(`Third-party wallet: ${thirdPartyWallet.address}, Balance: ${await client.getXrpBalance(thirdPartyWallet.address)} XRP`)

await client.disconnect()
