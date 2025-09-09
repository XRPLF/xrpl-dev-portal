// Import the library
// @chunk {"steps": ["connect-tag"]}
import xrpl from "xrpl"

// Define the network client
const SERVER_URL = "wss://s.altnet.rippletest.net:51233/"
const client = new xrpl.Client(SERVER_URL)
await client.connect()
console.log("Connected to Testnet")
// @chunk-end

// @chunk {"steps": ["get-account-create-wallet-tag"]}
// Create a wallet and fund it with the Testnet faucet:
console.log("\nCreating a new wallet and funding it with Testnet XRP...")
const fund_result = await client.fundWallet()
const test_wallet = fund_result.wallet
console.log(`Wallet: ${test_wallet.address}`)
console.log(`Balance: ${fund_result.balance}`)
console.log('Account Testnet Explorer URL:')
console.log(`  https://testnet.xrpl.org/accounts/${test_wallet.address}`)
// @chunk-end

// To generate a wallet without funding it, uncomment the code below
// @chunk {"steps": ["get-account-create-wallet-b-tag"]}
// const test_wallet = xrpl.Wallet.generate()
// @chunk-end

// To provide your own seed, replace the test_wallet value with the below
// @chunk {"steps": ["get-account-create-wallet-c-tag"]}
// const test_wallet = xrpl.Wallet.fromSeed("your-seed-key")
// @chunk-end

// @chunk {"steps": ["query-xrpl-tag"]}
// Get info from the ledger about the address we just funded
console.log("\nGetting account info...")
const response = await client.request({
  "command": "account_info",
  "account": test_wallet.address,
  "ledger_index": "validated"
})
console.log(JSON.stringify(response, null, 2))
// @chunk-end

// @chunk {"steps": ["listen-for-events-tag"]}
// Listen to ledger close events
console.log("\nListening for ledger close events...")
client.request({
  "command": "subscribe",
  "streams": ["ledger"]
})
client.on("ledgerClosed", async (ledger) => {
  console.log(`Ledger #${ledger.ledger_index} validated ` +
              `with ${ledger.txn_count} transactions!`)
})
// @chunk-end

// @chunk {"steps": ["disconnect-node-tag"]}
// Disconnect when done so Node.js can end the process.
// Delay this by 10 seconds to give the ledger event listener time to receive
// and display some ledger events.
setTimeout(async () => {
  await client.disconnect();
  console.log('\nDisconnected');
}, 10000);
// @chunk-end
