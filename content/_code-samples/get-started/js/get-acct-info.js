// Import the library
const xrpl = require("xrpl")

// Wrap code in an async function so we can use await
async function main() {

  // Define the network client
  const SERVER_URL = "wss://s.altnet.rippletest.net:51233/"
  const client = new xrpl.Client(SERVER_URL)
  await client.connect()

  // Create a wallet and fund it with the Testnet faucet:
  const fund_result = await client.fundWallet()
  const test_wallet = fund_result.wallet
  console.log(fund_result)

  // Get info from the ledger about the address we just funded
  const response = await client.request({
    "command": "account_info",
    "account": test_wallet.address,
    "ledger_index": "validated"
  })
  console.log(response)

  // Listen to ledger close events
  client.request({
    "command": "subscribe",
    "streams": ["ledger"]
  })
  client.on("ledgerClosed", async (ledger) => {
    console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
  })

  // Disconnect when done so Node.js can end the process
  await client.disconnect()
}

// call the async function
main()
