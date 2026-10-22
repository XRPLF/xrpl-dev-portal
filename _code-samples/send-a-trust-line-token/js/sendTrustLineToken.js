import xrpl from 'xrpl'
import BigNumber from 'bignumber.js'
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

// Load the preconfigured sender account.
const setupData = JSON.parse(fs.readFileSync('sendTrustLineTokenSetup.json', 'utf8'))
const sender = xrpl.Wallet.fromSeed(setupData.sender.seed)

// The token to send and who to send it to. TST is a test token on Testnet,
// and the receiver is a well-known account that already holds a TST trust
// line. You can replace these values with your own.
const issuerAddress = 'rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd'
const currencyCode = 'TST'
const receiverAddress = 'rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE'
const sendQuantity = '2'

// The highest transfer fee this script is willing to pay, as a percentage of
// the amount sent. Protects against approving a large fee by accident.
const maxTransferFeePercent = 10

console.log(`Issuer address:   ${issuerAddress}`)
console.log(`Sender address:   ${sender.address}`)
console.log(`Receiver address: ${receiverAddress}`)

// getTrustLine returns the trust line between `account` and `peer` for the
// given currency, or undefined if no such trust line exists.
async function getTrustLine(account, currency, peer) {
  const pages = await client.requestAll({
    command: 'account_lines',
    account,
    peer,
    ledger_index: 'validated'
  })
  return pages.flatMap(page => page.result.lines).find(line => line.currency === currency)
}

// Check sender balance ----------------------
// Confirm the sender holds enough of the token to make the payment, including
// the issuer's transfer fee, which the sender pays on top of the amount sent.
console.log(`\n=== Checking sender's ${currencyCode} balance... ===\n`)
const issuerInfo = await client.request({
  command: 'account_info',
  account: issuerAddress,
  ledger_index: 'validated'
})
// parseAccountRootFlags turns the Flags bitmask into an object of booleans.
const issuerFlags = xrpl.parseAccountRootFlags(issuerInfo.result.account_data.Flags)

// If the issuer charges a transfer fee, the sender pays more than the
// receiver gets. Work out the SendMax needed and refuse unreasonable fees.
// TransferRate is a multiplier in billionths, e.g. 1005000000 = 1.005 = 0.5% fee.
const transferRate = issuerInfo.result.account_data.TransferRate ?? 1000000000
const transferFee = new BigNumber(xrpl.transferRateToDecimal(transferRate))
const transferFeePercent = transferFee.times(100)
if (transferFeePercent.gt(maxTransferFeePercent)) {
  console.error(`Error: Transfer fee of ${transferFeePercent}% exceeds the ${maxTransferFeePercent}% limit.`)
  await client.disconnect()
  process.exit(1)
}
let sendMax
if (transferFeePercent.gt(0)) {
  // Token amounts have at most 16 significant digits. Round up so SendMax
  // never falls short of the exact cost.
  sendMax = new BigNumber(sendQuantity).times(transferFee.plus(1)).precision(16, BigNumber.ROUND_UP).toString()
  console.log(`✓ Transfer fee is ${transferFeePercent}%; sender will pay up to ${sendMax} ${currencyCode}`)
} else {
  console.log('✓ No transfer fee')
}

const senderLine = await getTrustLine(sender.address, currencyCode, issuerAddress)
if (!senderLine) {
  console.error(`Error: Sender has no ${currencyCode} trust line with the issuer.`)
  await client.disconnect()
  process.exit(1)
}
console.log(`Sender's balance: ${senderLine.balance}`)
if (new BigNumber(senderLine.balance).lt(sendMax ?? sendQuantity)) {
  console.error(`Error: Sender's balance is less than the ${sendMax ?? sendQuantity} ${currencyCode} to send.`)
  await client.disconnect()
  process.exit(1)
}

// Check receiver ----------------------
// Confirm the receiver can accept the payment before sending it.
console.log(`\n=== Checking receiver can receive ${currencyCode}... ===\n`)
const receiverLine = await getTrustLine(receiverAddress, currencyCode, issuerAddress)

// 1. The receiver must have a trust line to the issuer for this currency.
if (!receiverLine) {
  console.error(`Error: Receiver has no ${currencyCode} trust line with the issuer.`)
  await client.disconnect()
  process.exit(1)
}
console.log('✓ Receiver has a trust line to the issuer')

// 2. The issuer must allow rippling on at least one of the two trust lines, since
//    a payment between holders moves through the issuer. Default Ripple on the
//    issuer is the usual way to allow this, but check the lines themselves.
if (senderLine.no_ripple_peer && receiverLine.no_ripple_peer) {
  console.error('Error: The issuer has disabled rippling on both the sender and receiver trust lines.')
  await client.disconnect()
  process.exit(1)
}
const defaultRipple = issuerFlags.lsfDefaultRipple === true
console.log(`✓ Rippling is allowed (issuer Default Ripple: ${defaultRipple})`)

// 3. The receiver's limit must cover their current balance plus the payment.
if (new BigNumber(receiverLine.balance).plus(sendQuantity).gt(receiverLine.limit)) {
  console.error(`Error: Payment would exceed the receiver's limit of ${receiverLine.limit} ${currencyCode}.`)
  await client.disconnect()
  process.exit(1)
}
console.log(`✓ Receiver's limit covers the payment`)

// 4. If the issuer requires authorization, the receiver's line must be authorized.
const requireAuth = issuerFlags.lsfRequireAuth === true
if (requireAuth && !receiverLine.peer_authorized) {
  console.error('Error: The issuer requires authorization and has not authorized the receiver.')
  await client.disconnect()
  process.exit(1)
}
console.log(`✓ Authorization OK (issuer Require Auth: ${requireAuth})`)

console.log(`\nBalances before payment:`)
console.log(`  Sender:   ${senderLine.balance} ${currencyCode}`)
console.log(`  Receiver: ${receiverLine.balance} ${currencyCode}`)

// Send payment ----------------------
// The sender pays the receiver with the token. Amount is what the receiver
// gets; SendMax (if set) is the most the sender is willing to spend.
console.log(`\n=== Sending ${sendQuantity} ${currencyCode} to receiver... ===\n`)
const paymentTx = {
  TransactionType: 'Payment',
  Account: sender.address,
  Destination: receiverAddress,
  Amount: {
    currency: currencyCode,
    issuer: issuerAddress,
    value: sendQuantity
  }
}
if (sendMax) {
  paymentTx.SendMax = {
    currency: currencyCode,
    issuer: issuerAddress,
    value: sendMax
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
// Check both balances again to confirm the transfer.
console.log(`\n=== Checking final ${currencyCode} balances... ===\n`)

// The metadata's delivered_amount is the amount the receiver actually got.
// Always read this field rather than the transaction's Amount, because a
// partial payment can succeed while delivering less than Amount.
const deliveredAmount = paymentResponse.result.meta.delivered_amount
console.log(`  Delivered amount: ${deliveredAmount.value} ${deliveredAmount.currency}`)

const senderLineAfter = await getTrustLine(sender.address, currencyCode, issuerAddress)
const receiverLineAfter = await getTrustLine(receiverAddress, currencyCode, issuerAddress)
console.log(`  Sender:   ${senderLineAfter.balance} ${currencyCode}`)
console.log(`  Receiver: ${receiverLineAfter.balance} ${currencyCode}`)

await client.disconnect()
