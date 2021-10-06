// Import the library
const xrpl = require("xrpl")

// Wrap code in an async function so we can use await
async function main() {

  // Define the network client
  const SERVER_URL = "https://s.altnet.rippletest.net:51234/"
  const client = new xrpl.Client(SERVER_URL)
  await client.connect()

  // Create a wallet and fund it with the Testnet faucet:
  const test_wallet = new xrpl.Wallet() // TODO: change to define based on fundWallet result
  const fund_result = await client.fundWallet(test_wallet)
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
  client.disconnect()
}

// call the async function
main()
