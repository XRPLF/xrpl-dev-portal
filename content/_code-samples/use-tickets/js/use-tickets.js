// Dependencies for Node.js.
// In browsers, use a <script> tag instead.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Example credentials
const wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9")

// Connect to Devnet (since that's where tickets are available)
async function main() {
  const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Getting a wallet from the faucet...")
  const {wallet, balance} = await client.fundWallet()

  // Check Sequence Number -----------------------------------------------------
  const account_info = await client.request({
    "command": "account_info",
    "account": wallet.address
  })
  let current_sequence = account_info.result.account_data.Sequence

  // Prepare and Sign TicketCreate ---------------------------------------------
  const prepared = await client.autofill({
    "TransactionType": "TicketCreate",
    "Account": wallet.address,
    "TicketCount": 10,
    "Sequence": current_sequence
  })
  const signed = wallet.sign(prepared)
  console.log(`Prepared TicketCreate transaction ${signed.hash}`)

  // Submit TicketCreate -------------------------------------------------------
  const tx = await client.submitAndWait(signed.tx_blob)
  console.log(tx)

  // Wait for Validation -------------------------------------------------------
  // submitAndWait() handles this automatically, but it can take 4-7s.

  // Check Available Tickets ---------------------------------------------------
  let response = await client.request({
    "command": "account_objects",
    "account": wallet.address,
    "type": "ticket"
  })
  console.log("Available Tickets:", response.result.account_objects)

  // Choose an arbitrary Ticket to use
  use_ticket = response.result.account_objects[0].TicketSequence

  // Prepare and Sign Ticketed Transaction -------------------------------------
  const prepared_t = await client.autofill({
    "TransactionType": "AccountSet",
    "Account": wallet.address,
    "TicketSequence": use_ticket,
    "LastLedgerSequence": null, // Never expire this transaction.
    "Sequence": 0
  })
  const signed_t = wallet.sign(prepared_t)
  console.log(`Prepared ticketed transaction ${signed_t.hash}`)

  // Submit Ticketed Transaction -----------------------------------------------
  const tx_t = await client.submitAndWait(signed_t.tx_blob)
  console.log(tx_t)

  // Wait for Validation (again) -----------------------------------------------

  // Disconnect when done (If you omit this, Node.js won't end the process)
  await client.disconnect()
}

main()
