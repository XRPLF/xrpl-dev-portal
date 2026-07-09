// @chunk {"steps": ["import-web-tag"]}
// Import the library along with the TypeScript types you use below. The import
// map in index.html resolves 'xrpl' to a browser build at runtime.
import {
  Client,
  Wallet,
  Payment,
  AccountInfoRequest,
  AccountInfoResponse,
  xrpToDrops,
  validate
} from 'xrpl'

const output = document.getElementById('output') as HTMLElement
// @chunk-end

// @chunk {"steps": ["connect-tag"]}
// Define the network client. The Client type is inferred from the constructor.
const SERVER_URL = 'wss://s.altnet.rippletest.net:51233/'
const client = new Client(SERVER_URL)
await client.connect()
output.innerHTML = '<p>Connected to Testnet</p>'
// @chunk-end

// @chunk {"steps": ["get-account-create-wallet-tag"]}
// Create a wallet and fund it with the Testnet faucet.
output.innerHTML += '<p>Creating a new wallet and funding it with Testnet XRP...</p>'
const fundResult = await client.fundWallet()
// Annotating with the Wallet type lets TypeScript check every field you touch.
const testWallet: Wallet = fundResult.wallet
output.innerHTML += `<p>Wallet: ${testWallet.address}</p>`
output.innerHTML += `<p>Balance: ${fundResult.balance}</p>`
output.innerHTML += `<p>View account on XRPL Testnet Explorer: <a href="https://testnet.xrpl.org/accounts/${testWallet.address}" target="_blank">${testWallet.address}</a></p>`
// @chunk-end

// To generate a wallet without funding it, uncomment the code below.
// @chunk {"steps": ["get-account-create-wallet-b-tag"]}
// const testWallet: Wallet = Wallet.generate()
// @chunk-end

// To provide your own seed, replace the testWallet value with the below.
// @chunk {"steps": ["get-account-create-wallet-c-tag"]}
// const testWallet: Wallet = Wallet.fromSeed('your-seed-key')
// @chunk-end

// @chunk {"steps": ["query-xrpl-tag"]}
// Build the request as an AccountInfoRequest. TypeScript verifies the command
// name and fields, and infers the matching AccountInfoResponse for the result.
output.innerHTML += '<p>Getting account info...</p>'
const request: AccountInfoRequest = {
  command: 'account_info',
  account: testWallet.address,
  ledger_index: 'validated'
}
const response: AccountInfoResponse = await client.request(request)
output.innerHTML += `<pre>${JSON.stringify(response, null, 2)}</pre>`
// @chunk-end

// @chunk {"steps": ["build-tx-tag"]}
// Turn your own input values into a valid transaction. Typing the object as a
// Payment makes the compiler require every field and reject the wrong ones.
const xrpToSend = 22 // a value you might read from user input
const payment: Payment = {
  TransactionType: 'Payment',
  Account: testWallet.address,
  // xrpToDrops converts the XRP amount into the drops string the ledger expects.
  Amount: xrpToDrops(xrpToSend),
  Destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe' // example destination
}

// validate() runs the same structural checks the server does, at runtime. It
// takes a generic transaction object, so pass the typed value through to it.
validate(payment as unknown as Record<string, unknown>)
output.innerHTML += '<p>Built and validated a Payment transaction:</p>'
output.innerHTML += `<pre>${JSON.stringify(payment, null, 2)}</pre>`
// To send it, sign and submit in one call:
//   await client.submitAndWait(payment, { wallet: testWallet })
// @chunk-end

// @chunk {"steps": ["listen-for-events-tag"]}
// Listen to ledger close events. The ledger argument is typed for you, so
// ledger.ledger_index and ledger.txn_count are checked at compile time.
output.innerHTML += '<p>Listening for ledger close events...</p>'
client.request({
  command: 'subscribe',
  streams: ['ledger']
})
client.on('ledgerClosed', (ledger) => {
  output.innerHTML += `<p>Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions</p>`
})
// @chunk-end

// @chunk {"steps": ["disconnect-web-tag"]}
// Disconnect from the ledger when done. Delay this by 10 seconds to give the
// ledger event listener time to receive and display some ledger events.
setTimeout(async () => {
  await client.disconnect()
  output.innerHTML += '<p>Disconnected</p>'
}, 10000)
// @chunk-end
