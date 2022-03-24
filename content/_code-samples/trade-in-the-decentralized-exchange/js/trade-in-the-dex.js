// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Connect ---------------------------------------------------------------------
async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  console.log("Connecting to Testnet...")
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting address from the Testnet faucet...")
  const wallet = (await client.fundWallet()).wallet
  console.log(`Got address ${wallet.address}.`)

  // Look up Offers
  const orderbook = await client.getOrderbook(
      {currency: "TST", issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"}, // TakerPays
      {currency: "XRP"}, // TakerGets
      {ledger_index: "current", taker: wallet.address} // options
  )
  console.log(JSON.stringify(orderbook, null, 2))

  // Depending on your use case, you may want to present options to the user
  // here with estimates of the cost to buy (or proceeds from selling) the
  // assets involved. For this tutorial, we already know that TST is pegged to
  // XRP at a rate of approximately 10:1 plus spread, so we can use a
  // hard-coded TakerGets amount.

  // Send OfferCreate transaction ----------------------------------------------
  const offer_1 = {
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerPays": {
      "currency": "TST",
      "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
      "value": "25"
    },
    "TakerGets": xrpl.xrpToDrops(300)
  }

  const prepared = await client.autofill(offer_1)
  const signed = wallet.sign(prepared)
  console.log("Sending OfferCreate transaction...")
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`)
  } else {
    throw `Error sending transaction: ${result}`
  }

  // Check balances ------------------------------------------------------------
  console.log("Getting address balances...")
  const balances = await client.request({
    command: "account_lines",
    account: wallet.address,
    ledger_index: "validated"
  })
  console.log(balances.result)

  client.disconnect()
} // End of main()

main()
