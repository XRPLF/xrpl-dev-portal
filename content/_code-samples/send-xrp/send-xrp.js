// Example credentials
const wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9")

// Connect ---------------------------------------------------------------------
// const  xrpl = require('xrpl') // For Node.js. In browsers, use <script>.
const api = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
api.connect()
api.on('connected', async () => {

  // Get credentials from the Testnet Faucet -----------------------------------
  const wallet = await api.generateFaucetWallet()

  console.log("Waiting until we have a validated starting sequence number...")
  // If you go too soon, the funding transaction might slip back a ledger and
  // then your starting Sequence number will be off. This is mostly relevant
  // when you want to use a Testnet account right after getting a reply from
  // the faucet.
  while (true) {
    try {
      await api.request({
        command: "account_info",
        account: wallet.classicAddress,
        ledger_index: "validated"
      })
      break
    } catch(e) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Prepare transaction -------------------------------------------------------
  const prepared = await api.autofill({
    "TransactionType": "Payment",
    "Account": wallet.classicAddress,
    "Amount": xrpl.xrpToDrops("22"),
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  })
  const max_ledger = prepared.LastLedgerSequence
  console.log("Prepared transaction instructions:", prepared)
  console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)

  // Sign prepared instructions ------------------------------------------------
  const tx_blob = wallet.signTransaction(prepared)
  const txID = xrpl.computeSignedTransactionHash(tx_blob)
  console.log("Identifying hash:", txID)
  console.log("Signed blob:", tx_blob)

  // Submit signed blob --------------------------------------------------------
  // The earliest ledger a transaction could appear in is the first ledger
  // after the one that's already validated at the time it's *first* submitted.
  const min_ledger = (await api.getLedgerIndex()) + 1
  const result = await api.request({
    "command": "submit",
    "tx_blob": tx_blob
  })
  console.log("Tentative result code:", result.result.engine_result)
  console.log("Tentative result message:", result.result.engine_result_message)

  // Wait for validation -------------------------------------------------------
  let has_final_status = false
  api.request({
    "command": "subscribe",
    "accounts": [wallet.classicAddress]
  })
  api.connection.on("transaction", (event) => {
    if (event.transaction.hash == txID) {
      console.log("Transaction has executed!", event)
      has_final_status = true
    }
  })
  api.on('ledgerClosed', ledger => {
    if (ledger.ledger_index > max_ledger && !has_final_status) {
      console.log("Ledger version", ledger.ledger_index, "was validated.")
      console.log("If the transaction hasn't succeeded by now, it's expired")
      has_final_status = true
    }
  })

  // There are other ways to do this, but they're more complicated.
  // See https://xrpl.org/reliable-transaction-submission.html for details.
  while (!has_final_status) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Check transaction results -------------------------------------------------
  try {
    const tx = await api.request({
      command: "tx",
      transaction: txID,
      min_ledger: min_ledger,
      max_ledger: max_ledger
    })
    if (tx.result.validated) {
      console.log("This result is validated by consensus and final.")
    } else {
      console.log("This result is pending.")
    }
    console.log("Transaction result:", tx.result.meta.TransactionResult)

    if (typeof tx.result.meta.delivered_amount === "string" &&
        typeof tx.result.meta.delivered_amount !== "unavailable")
    console.log("Delivered:", xrpl.dropsToXrp(tx.result.meta.delivered_amount), "XRP")
  } catch(error) {
    console.log("Couldn't get transaction outcome:", error)
  }

}) // End of api.on.('connected')
