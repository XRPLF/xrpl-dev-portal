// Send Multi-Recipient XRP Payments
// https://xrpl.org/resources/code-samples
// License: MIT. https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE
//
// Demonstrates sending XRP payments to multiple recipients from a single
// sender account using sequential Payment transactions with xrpl.js.
//
// This approach works today on Mainnet and Testnet. When the BatchV1_1
// amendment activates, you can upgrade to atomic Batch transactions for
// groups of up to 8 payments.
//
// Usage:
//   npm install xrpl
//   node send-multi-recipient-payments.js

const xrpl = require("xrpl")

async function main() {
  // ----------------------------------------------------------------
  // 1. Connect to the XRP Ledger Testnet
  // ----------------------------------------------------------------
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  console.log("Connecting to Testnet...")
  await client.connect()

  // ----------------------------------------------------------------
  // 2. Create and fund a sender account using the Testnet faucet
  // ----------------------------------------------------------------
  console.log("Funding sender account...")
  const senderWallet = (await client.fundWallet()).wallet
  console.log(`  Sender address: ${senderWallet.address}`)

  // ----------------------------------------------------------------
  // 3. Create and fund recipient accounts
  //    In production, these would be existing accounts you want to pay.
  // ----------------------------------------------------------------
  const NUM_RECIPIENTS = 3
  const recipients = []

  for (let i = 0; i < NUM_RECIPIENTS; i++) {
    console.log(`Funding recipient ${i + 1}...`)
    const recipientWallet = (await client.fundWallet()).wallet
    recipients.push({
      address: recipientWallet.address,
      // Amount in XRP (string). Each recipient can receive a different amount.
      amountXRP: String(10 + i * 5), // 10, 15, 20 XRP
      // Optional: destination tag (commonly required by exchanges)
      destinationTag: i === 0 ? 12345 : undefined,
      // Optional: a human-readable memo
      memo: i === 2 ? "Final payment" : undefined,
    })
    console.log(`  Recipient ${i + 1}: ${recipientWallet.address} → ${recipients[i].amountXRP} XRP`)
  }

  // ----------------------------------------------------------------
  // 4. Look up sender's current sequence number and ledger state
  // ----------------------------------------------------------------
  const accountInfo = await client.request({
    command: "account_info",
    account: senderWallet.address,
    ledger_index: "validated",
  })
  let currentSequence = accountInfo.result.account_data.Sequence
  console.log(`\nSender sequence: ${currentSequence}`)

  const ledgerResponse = await client.request({
    command: "ledger",
    ledger_index: "validated",
  })
  const validatedLedger = ledgerResponse.result.ledger_index
  // Allow roughly 80 seconds (~20 ledgers at ~4s each) for signing and
  // submission. If a transaction isn't validated by this ledger, it expires.
  const lastLedgerSequence = validatedLedger + 20
  console.log(`Validated ledger: ${validatedLedger}, LastLedgerSequence: ${lastLedgerSequence}`)

  // ----------------------------------------------------------------
  // 5. Build, sign, and submit one Payment transaction per recipient
  //    Each transaction uses the next Sequence number.
  // ----------------------------------------------------------------
  console.log(`\n--- Sending ${recipients.length} payments ---\n`)

  const results = []

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]

    // Build the Payment transaction
    const payment = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Destination: recipient.address,
      Amount: xrpl.xrpToDrops(recipient.amountXRP),
      Sequence: currentSequence,
      LastLedgerSequence: lastLedgerSequence,
    }

    // Add optional DestinationTag
    if (recipient.destinationTag !== undefined) {
      payment.DestinationTag = recipient.destinationTag
    }

    // Add optional Memo
    // Memos are hex-encoded on the XRP Ledger.
    if (recipient.memo) {
      payment.Memos = [
        {
          Memo: {
            MemoType: Buffer.from("text/plain", "utf8").toString("hex").toUpperCase(),
            MemoData: Buffer.from(recipient.memo, "utf8").toString("hex").toUpperCase(),
          },
        },
      ]
    }

    // Autofill remaining fields (Fee, etc.) and sign
    const prepared = await client.autofill(payment)
    const signed = senderWallet.sign(prepared)

    console.log(`Payment ${i + 1}/${recipients.length}:`)
    console.log(`  To: ${recipient.address}`)
    console.log(`  Amount: ${recipient.amountXRP} XRP`)
    console.log(`  Sequence: ${currentSequence}`)
    console.log(`  Hash: ${signed.hash}`)

    // Submit the signed transaction
    const submitResponse = await client.submitAndWait(signed.tx_blob)
    const resultCode = submitResponse.result.meta.TransactionResult

    console.log(`  Result: ${resultCode}`)
    results.push({
      index: i,
      hash: signed.hash,
      destination: recipient.address,
      amount: recipient.amountXRP,
      result: resultCode,
    })

    if (resultCode !== "tesSUCCESS") {
      console.log(`  ⚠ Payment ${i + 1} did not succeed. Continuing...`)
    }

    // Increment the sequence number for the next transaction
    currentSequence++
  }

  // ----------------------------------------------------------------
  // 6. Summary
  // ----------------------------------------------------------------
  console.log("\n--- Results ---\n")
  const successful = results.filter((r) => r.result === "tesSUCCESS")
  console.log(`${successful.length}/${results.length} payments succeeded.`)
  console.log()

  for (const r of results) {
    const status = r.result === "tesSUCCESS" ? "✓" : "✗"
    console.log(
      `  ${status} Payment ${r.index + 1}: ${r.amount} XRP → ${r.destination} [${r.result}]`
    )
    console.log(`    Explorer: https://testnet.xrpl.org/transactions/${r.hash}`)
  }

  // ----------------------------------------------------------------
  // 7. Verify final sender balance
  // ----------------------------------------------------------------
  const finalInfo = await client.request({
    command: "account_info",
    account: senderWallet.address,
    ledger_index: "validated",
  })
  console.log(
    `\nSender final balance: ${xrpl.dropsToXrp(finalInfo.result.account_data.Balance)} XRP`
  )

  await client.disconnect()
  console.log("\nDisconnected.")
}

main().catch(console.error)
