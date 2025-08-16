// Import the library
// @chunk {"steps": ["import-node-tag"]}
const xrpl = require("xrpl")
// @chunk-end

// Wrap code in an async function so we can use await
async function main() {

  // @chunk {"steps": ["connect-tag"]}
  // Define the network client
  const SERVER_URL = "wss://s.altnet.rippletest.net:51233/"
  const client = new xrpl.Client(SERVER_URL)
  await client.connect()
  // @chunk-end

  // @chunk {"steps": ["get-account-create-wallet-tag"]}
  // Create a wallet and fund it with the Testnet faucet:
  const fund_result = await client.fundWallet()
  const test_wallet = fund_result.wallet
  console.log(fund_result)
  // @chunk-end

  // To generate keys only, uncomment the code below
  // @chunk {"steps": ["get-account-create-wallet-b-tag"]}
  // const test_wallet = xrpl.Wallet.generate()
  // @chunk-end

  // To provide your own seed, replace the test_wallet value with the below
  // @chunk {"steps": ["get-account-create-wallet-c-tag"], "inputs": ["wallet-input"]}
  // const test_wallet = xrpl.Wallet.fromSeed({{wallet-input}})
  // @chunk-end

  // @chunk {"steps": ["query-xrpl-tag"]}
  // Get info from the ledger about the address we just funded
  const response = await client.request({
    "command": "account_info",
    "account": test_wallet.address,
    "ledger_index": "validated"
  })
  console.log(response)
  // @chunk-end

  // @chunk {"steps": ["listen-for-events-tag"]}
  // Listen to ledger close events
  client.request({
    "command": "subscribe",
    "streams": ["ledger"]
  })
  client.on("ledgerClosed", async (ledger) => {
    console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
  })
  // @chunk-end

  // @chunk {"steps": ["disconnect-tag"]}
  // Disconnect when done so Node.js can end the process
  await client.disconnect()
  // @chunk-end
}

// call the async function
main()
