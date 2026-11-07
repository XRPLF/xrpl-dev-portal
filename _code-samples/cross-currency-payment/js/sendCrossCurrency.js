// IMPORTANT: This script sends a cross-currency payment. The sender spends XRP
// and the receiver is credited in USD, converted through the DEX order book.
// It requires the accounts and liquidity created by crossCurrencySetup.js; if
// the setup data is missing, this script runs the setup script first.
import xrpl from 'xrpl'
import fs from 'fs'
import { execSync } from 'child_process'

// Connect to the network ----------------------
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Ensure the tutorial's accounts and liquidity exist ----------------------
if (!fs.existsSync('crossCurrencySetup.json')) {
  console.log(`\n=== Setup data doesn't exist. Running setup script... ===\n`)
  execSync('node crossCurrencySetup.js', { stdio: 'inherit' })
}

const setupData = JSON.parse(fs.readFileSync('crossCurrencySetup.json', 'utf8'))
const sender = xrpl.Wallet.fromSeed(setupData.sender.seed)
const receiverAddress = setupData.receiver.address
const issuerAddress = setupData.issuerAddress
const currency = setupData.currency

console.log(`\nSender address:   ${sender.address}`)
console.log(`Receiver address: ${receiverAddress}`)

// Prepare cross-currency Payment ----------------------
// Deliver 100 USD to the receiver while spending no more than 30 XRP from the
// source. The ledger routes XRP -> USD through the DEX automatically, so there
// is no router to integrate. SendMax caps what the source spends. DeliverMin,
// together with the tfPartialPayment flag, floors what the destination receives.
console.log(`\n=== Preparing cross-currency Payment ===\n`)
const paymentTx = {
  TransactionType: 'Payment',
  Account: sender.address,
  Destination: receiverAddress,
  Amount: { currency, issuer: issuerAddress, value: '100' },
  SendMax: xrpl.xrpToDrops('30'),
  DeliverMin: { currency, issuer: issuerAddress, value: '95' },
  Flags: 131072 // tfPartialPayment
}

xrpl.validate(paymentTx)
console.log(JSON.stringify(paymentTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log(`\n=== Submitting cross-currency Payment ===\n`)
const response = await client.submitAndWait(paymentTx, { wallet: sender, autofill: true })

const resultCode = response.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error('Error: payment failed with', resultCode)
  await client.disconnect()
  process.exit(1)
}

// Credit the amount that ACTUALLY arrived, from metadata, never the Amount field
console.log(`\n=== Payment delivered ===\n`)
console.log('delivered_amount:', response.result.meta.delivered_amount)
// End cross-currency payment

await client.disconnect()
