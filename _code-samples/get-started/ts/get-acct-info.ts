// @chunk {"steps": ["import-node-tag"]}
// Import the library along with the TypeScript types you use below.
import {
  Client,
  Wallet,
  Payment,
  AccountInfoRequest,
  AccountInfoResponse,
  xrpToDrops,
  validate
} from 'xrpl'
// @chunk-end

// @chunk {"steps": ["connect-tag"]}
// Define the network client. The Client type is inferred from the constructor.
const SERVER_URL = 'wss://s.altnet.rippletest.net:51233/'
const client = new Client(SERVER_URL)
await client.connect()
console.log('Connected to Testnet')
// @chunk-end

// @chunk {"steps": ["get-account-create-wallet-tag"]}
// Create a wallet and fund it with the Testnet faucet.
console.log('\nCreating a new wallet and funding it with Testnet XRP...')
const fundResult = await client.fundWallet()
// Annotating with the Wallet type lets TypeScript check every field you touch.
const testWallet: Wallet = fundResult.wallet
console.log(`Wallet: ${testWallet.address}`)
console.log(`Balance: ${fundResult.balance}`)
console.log('Account Testnet Explorer URL:')
console.log(`  https://testnet.xrpl.org/accounts/${testWallet.address}`)
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
console.log('\nGetting account info...')
const request: AccountInfoRequest = {
  command: 'account_info',
  account: testWallet.address,
  ledger_index: 'validated'
}
const response: AccountInfoResponse = await client.request(request)
console.log(JSON.stringify(response, null, 2))
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
console.log('\nBuilt and validated a Payment transaction:')
console.log(JSON.stringify(payment, null, 2))
// To send it, sign and submit in one call:
//   await client.submitAndWait(payment, { wallet: testWallet })
// @chunk-end

// @chunk {"steps": ["listen-for-events-tag"]}
// Listen to ledger close events. The ledger argument is typed for you, so
// ledger.ledger_index and ledger.txn_count are checked at compile time.
console.log('\nListening for ledger close events...')
client.request({
  command: 'subscribe',
  streams: ['ledger']
})
client.on('ledgerClosed', (ledger) => {
  console.log(`Ledger #${ledger.ledger_index} validated ` +
              `with ${ledger.txn_count} transactions!`)
})
// @chunk-end

// @chunk {"steps": ["disconnect-node-tag"]}
// Disconnect when done so Node.js can end the process.
// Delay this by 10 seconds to give the ledger event listener time to receive
// and display some ledger events.
setTimeout(async () => {
  await client.disconnect()
  console.log('\nDisconnected')
}, 10000)
// @chunk-end
