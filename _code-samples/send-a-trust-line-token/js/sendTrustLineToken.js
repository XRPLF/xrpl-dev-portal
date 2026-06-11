import xrpl from 'xrpl'
import fs from 'fs'
import { setup } from './sendTrustLineTokenSetup.js'

// Set up client ----------------------
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// This step checks for the necessary setup data to run the tutorial.
// If missing, sendTrustLineTokenSetup.js will generate it.
if (!fs.existsSync('sendTrustLineTokenSetup.json')) {
  console.log(`\n=== Tutorial setup data doesn't exist. Running setup script... ===\n`)
  await setup()
}

// Load preconfigured issuer, sender, and receiver accounts.
const setupData = JSON.parse(fs.readFileSync('sendTrustLineTokenSetup.json', 'utf8'))
const issuer = xrpl.Wallet.fromSeed(setupData.issuer.seed)
const sender = xrpl.Wallet.fromSeed(setupData.sender.seed)
const receiver = xrpl.Wallet.fromSeed(setupData.receiver.seed)
const currencyCode = 'FOO'

console.log(`Issuer address:   ${issuer.address}`)
console.log(`Sender address:   ${sender.address}`)
console.log(`Receiver address: ${receiver.address}`)

// Create trust line ----------------------
// The receiver opts in to the token by creating a trust line to the issuer.
// The LimitAmount sets the maximum amount of the token the receiver will hold.
console.log(`\n=== Creating trust line from receiver to issuer... ===\n`)
const trustSetTx = {
  TransactionType: 'TrustSet',
  Account: receiver.address,
  LimitAmount: {
    currency: currencyCode,
    issuer: issuer.address,
    value: '1000000000'
  }
}
xrpl.validate(trustSetTx)
console.log(JSON.stringify(trustSetTx, null, 2))

const trustSetResponse = await client.submitAndWait(trustSetTx, {
  wallet: receiver,
  autofill: true
})
if (trustSetResponse.result.meta?.TransactionResult !== 'tesSUCCESS') {
  const resultCode = trustSetResponse.result.meta?.TransactionResult
  console.error('Error: Unable to create trust line:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Trust line created from receiver to issuer!')
console.log(`Explorer link: https://testnet.xrpl.org/transactions/${trustSetResponse.result.hash}`)

// Check initial balances ----------------------
// getTrustLineBalance returns the trust line balance between `account` and
// `peer` for the given currency.
async function getTrustLineBalance(account, currency, peer) {
  const response = await client.request({
    command: 'account_lines',
    account,
    peer,
    ledger_index: 'validated'
  })
  const line = response.result.lines.find(l => l.currency === currency)
  return line?.balance ?? '0'
}

console.log(`\n=== Checking initial ${currencyCode} balances... ===\n`)
console.log("Holders' perspective:")
console.log(`  Sender's balance:   ${await getTrustLineBalance(sender.address, currencyCode, issuer.address)}`)
console.log(`  Receiver's balance: ${await getTrustLineBalance(receiver.address, currencyCode, issuer.address)}`)
console.log("Issuer's perspective:")
console.log(`  Owed to sender:   ${await getTrustLineBalance(issuer.address, currencyCode, sender.address)}`)
console.log(`  Owed to receiver: ${await getTrustLineBalance(issuer.address, currencyCode, receiver.address)}`)

// Send issued token ----------------------
// The sender pays the receiver with the issued currency.
const sendQuantity = '100'
console.log(`\n=== Sending ${currencyCode} payment... ===\n`)
const paymentTx = {
  TransactionType: 'Payment',
  Account: sender.address,
  Destination: receiver.address,
  Amount: {
    currency: currencyCode,
    issuer: issuer.address,
    value: sendQuantity
  }
}
xrpl.validate(paymentTx)
console.log(JSON.stringify(paymentTx, null, 2))

const paymentResponse = await client.submitAndWait(paymentTx, {
  wallet: sender,
  autofill: true
})
if (paymentResponse.result.meta?.TransactionResult !== 'tesSUCCESS') {
  const resultCode = paymentResponse.result.meta?.TransactionResult
  console.error('Error: Unable to send token:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Payment successful!')
console.log(`Explorer link: https://testnet.xrpl.org/transactions/${paymentResponse.result.hash}`)

// Verify balances ----------------------
// Check account balances after the payment.
console.log(`\n=== Checking final ${currencyCode} balances... ===\n`)
console.log("Holders' perspective:")
console.log(`  Sender's balance:   ${await getTrustLineBalance(sender.address, currencyCode, issuer.address)}`)
console.log(`  Receiver's balance: ${await getTrustLineBalance(receiver.address, currencyCode, issuer.address)}`)
console.log("Issuer's perspective:")
console.log(`  Owed to sender:   ${await getTrustLineBalance(issuer.address, currencyCode, sender.address)}`)
console.log(`  Owed to receiver: ${await getTrustLineBalance(issuer.address, currencyCode, receiver.address)}`)

await client.disconnect()
