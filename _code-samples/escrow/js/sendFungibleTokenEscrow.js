// This example demonstrates how to create escrows that hold fungible tokens.
// It covers MPTs and Trust Line Tokens, and uses conditional and timed escrows.

import xrpl from 'xrpl'
import { PreimageSha256 } from 'five-bells-condition'
import { randomBytes } from 'crypto'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Fund an issuer account and an escrow creator account ----------------------
console.log(`\n=== Funding Accounts ===\n`)
const [
  { wallet: issuer },
  { wallet: creator }
] = await Promise.all([
  client.fundWallet(),
  client.fundWallet()
])
console.log(`Issuer: ${issuer.address}`)
console.log(`Escrow Creator: ${creator.address}`)

// ====== Conditional MPT Escrow ======

// Issuer creates an MPT ----------------------
console.log('\n=== Creating MPT ===\n')
const mptCreateTx = {
  TransactionType: 'MPTokenIssuanceCreate',
  Account: issuer.address,
  MaximumAmount: '1000000',
  Flags: xrpl.MPTokenIssuanceCreateFlags.tfMPTCanEscrow
}

// Validate the transaction structure before submitting
xrpl.validate(mptCreateTx)
console.log(JSON.stringify(mptCreateTx, null, 2))

// Submit, sign, and wait for validation
console.log(`\nSubmitting MPTokenIssuanceCreate transaction...`)
const mptCreateResponse = await client.submitAndWait(mptCreateTx, {
  wallet: issuer,
  autofill: true
})
if (mptCreateResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`MPTokenIssuanceCreate failed: ${mptCreateResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}

// Extract the MPT issuance ID from the transaction result
const mptIssuanceId = mptCreateResponse.result.meta.mpt_issuance_id
console.log(`MPT created: ${mptIssuanceId}`)

// Escrow Creator authorizes the MPT ----------------------
console.log('\n=== Escrow Creator Authorizing MPT ===\n')
const mptAuthTx = {
  TransactionType: 'MPTokenAuthorize',
  Account: creator.address,
  MPTokenIssuanceID: mptIssuanceId
}

xrpl.validate(mptAuthTx)
console.log(JSON.stringify(mptAuthTx, null, 2))

console.log(`\nSubmitting MPTokenAuthorize transaction...`)
const mptAuthResponse = await client.submitAndWait(mptAuthTx, {
  wallet: creator,
  autofill: true
})
if (mptAuthResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`MPTokenAuthorize failed: ${mptAuthResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log('Escrow Creator authorized for MPT.')

// Issuer sends MPTs to escrow creator ----------------------
console.log('\n=== Issuer Sending MPTs to Escrow Creator ===\n')
const mptPaymentTx = {
  TransactionType: 'Payment',
  Account: issuer.address,
  Destination: creator.address,
  Amount: {
    mpt_issuance_id: mptIssuanceId,
    value: '5000'
  }
}

xrpl.validate(mptPaymentTx)
console.log(JSON.stringify(mptPaymentTx, null, 2))

console.log(`\nSubmitting MPT Payment transaction...`)
const mptPaymentResponse = await client.submitAndWait(mptPaymentTx, {
  wallet: issuer,
  autofill: true
})
if (mptPaymentResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`MPT Payment failed: ${mptPaymentResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log('Successfully sent 5000 MPTs to Escrow Creator.')

// Escrow Creator creates a conditional MPT escrow ----------------------
console.log('\n=== Creating Conditional MPT Escrow ===\n')

// Generate crypto-condition
const preimage = randomBytes(32)
const fulfillment = new PreimageSha256()
fulfillment.setPreimage(preimage)
const fulfillmentHex = fulfillment.serializeBinary().toString('hex').toUpperCase()
const conditionHex = fulfillment.getConditionBinary().toString('hex').toUpperCase()
console.log(`Condition: ${conditionHex}`)
console.log(`Fulfillment: ${fulfillmentHex}\n`)

// Set expiration (300 seconds from now)
const cancelAfter = new Date()
cancelAfter.setSeconds(cancelAfter.getSeconds() + 300)
const cancelAfterRippleTime = xrpl.isoTimeToRippleTime(cancelAfter.toISOString())

const mptEscrowCreateTx = {
  TransactionType: 'EscrowCreate',
  Account: creator.address,
  Destination: issuer.address,
  Amount: {
    mpt_issuance_id: mptIssuanceId,
    value: '1000'
  },
  Condition: conditionHex,
  CancelAfter: cancelAfterRippleTime // Fungible token escrows require a CancelAfter time
}

xrpl.validate(mptEscrowCreateTx)
console.log(JSON.stringify(mptEscrowCreateTx, null, 2))

console.log(`\nSubmitting MPT EscrowCreate transaction...`)
const mptEscrowResponse = await client.submitAndWait(mptEscrowCreateTx, {
  wallet: creator,
  autofill: true
})
if (mptEscrowResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`MPT EscrowCreate failed: ${mptEscrowResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}

// Save the sequence number to identify the escrow later
const mptEscrowSeq = mptEscrowResponse.result.tx_json.Sequence
console.log(`Conditional MPT escrow created. Sequence: ${mptEscrowSeq}`)

// Finish the conditional MPT escrow with the fulfillment ----------------------
console.log('\n=== Finishing Conditional MPT Escrow ===\n')
const mptEscrowFinishTx = {
  TransactionType: 'EscrowFinish',
  Account: creator.address,
  Owner: creator.address,
  OfferSequence: mptEscrowSeq,
  Condition: conditionHex,
  Fulfillment: fulfillmentHex
}

xrpl.validate(mptEscrowFinishTx)
console.log(JSON.stringify(mptEscrowFinishTx, null, 2))

console.log(`\nSubmitting EscrowFinish transaction...`)
const mptFinishResponse = await client.submitAndWait(mptEscrowFinishTx, {
  wallet: creator,
  autofill: true
})
if (mptFinishResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`MPT EscrowFinish failed: ${mptFinishResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log(`Conditional MPT escrow finished successfully: https://testnet.xrpl.org/transactions/${mptFinishResponse.result.hash}`)

// ====== Timed Trust Line Token Escrow ======

// Enable trust line token escrows on the issuer ----------------------
console.log('\n=== Enabling Trust Line Token Escrows on Issuer ===\n')
const accountSetTx = {
  TransactionType: 'AccountSet',
  Account: issuer.address,
  SetFlag: xrpl.AccountSetAsfFlags.asfAllowTrustLineLocking
}

xrpl.validate(accountSetTx)
console.log(JSON.stringify(accountSetTx, null, 2))

console.log(`\nSubmitting AccountSet transaction...`)
const accountSetResponse = await client.submitAndWait(accountSetTx, {
  wallet: issuer,
  autofill: true
})
if (accountSetResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`AccountSet failed: ${accountSetResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log('Trust line token escrows enabled by issuer.')

// Escrow Creator sets up a trust line to the issuer ----------------------
console.log('\n=== Setting Up Trust Line ===\n')
const currencyCode = 'IOU'

const trustSetTx = {
  TransactionType: 'TrustSet',
  Account: creator.address,
  LimitAmount: {
    currency: currencyCode,
    issuer: issuer.address,
    value: '10000000'
  }
}

xrpl.validate(trustSetTx)
console.log(JSON.stringify(trustSetTx, null, 2))

console.log(`\nSubmitting TrustSet transaction...`)
const trustResponse = await client.submitAndWait(trustSetTx, {
  wallet: creator,
  autofill: true
})
if (trustResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`TrustSet failed: ${trustResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log(`Trust line successfully created for "${currencyCode}" tokens.`)

// Issuer sends IOU tokens to creator ----------------------
console.log('\n=== Issuer Sending IOU Tokens to Escrow Creator ===\n')
const iouPaymentTx = {
  TransactionType: 'Payment',
  Account: issuer.address,
  Destination: creator.address,
  Amount: {
    currency: currencyCode,
    value: '5000',
    issuer: issuer.address
  }
}

xrpl.validate(iouPaymentTx)
console.log(JSON.stringify(iouPaymentTx, null, 2))

console.log(`\nSubmitting Trust Line Token payment transaction...`)
const iouPayResponse = await client.submitAndWait(iouPaymentTx, {
  wallet: issuer,
  autofill: true
})
if (iouPayResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`Trust Line Token payment failed: ${iouPayResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log(`Successfully sent 5000 ${currencyCode} tokens.`)

// Escrow Creator creates a timed trust line token escrow ----------------------
console.log('\n=== Creating Timed Trust Line Token Escrow ===\n')
const delay = 10 // seconds
const now = new Date()
const finishAfter = new Date(now.getTime() + delay * 1000)
const finishAfterRippleTime = xrpl.isoTimeToRippleTime(finishAfter.toISOString())
console.log(`Escrow will mature after: ${finishAfter.toLocaleString()}\n`)

const iouCancelAfter = new Date(now.getTime() + 300 * 1000)
const iouCancelAfterRippleTime = xrpl.isoTimeToRippleTime(iouCancelAfter.toISOString())

const iouEscrowCreateTx = {
  TransactionType: 'EscrowCreate',
  Account: creator.address,
  Destination: issuer.address,
  Amount: {
    currency: currencyCode,
    value: '1000',
    issuer: issuer.address
  },
  FinishAfter: finishAfterRippleTime,
  CancelAfter: iouCancelAfterRippleTime
}

xrpl.validate(iouEscrowCreateTx)
console.log(JSON.stringify(iouEscrowCreateTx, null, 2))

console.log(`\nSubmitting Trust Line Token EscrowCreate transaction...`)
const iouEscrowResponse = await client.submitAndWait(iouEscrowCreateTx, {
  wallet: creator,
  autofill: true
})
if (iouEscrowResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`Trust Line Token EscrowCreate failed: ${iouEscrowResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}

// Save the sequence number to identify the escrow later
const iouEscrowSeq = iouEscrowResponse.result.tx_json.Sequence
console.log(`Trust Line Token escrow created. Sequence: ${iouEscrowSeq}`)

// Wait for the escrow to mature, then finish it --------------------
console.log(`\n=== Waiting For Timed Trust Line Token Escrow to Mature ===\n`)

// Sleep function to countdown delay until escrow matures
function sleep (delayInSeconds) {
  return new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000))
}
for (let i = delay; i >= 0; i--) {
  process.stdout.write(`\rWaiting for escrow to mature... ${i}s remaining...`)
  await sleep(1)
}
console.log('\rWaiting for escrow to mature... done.           ')

// Confirm latest validated ledger close time is after the FinishAfter time
let escrowReady = false
while (!escrowReady) {
  const validatedLedger = await client.request({
    command: 'ledger',
    ledger_index: 'validated'
  })
  const ledgerCloseTime = validatedLedger.result.ledger.close_time
  console.log(`Latest validated ledger closed at: ${new Date(xrpl.rippleTimeToISOTime(ledgerCloseTime)).toLocaleString()}`)
  if (ledgerCloseTime > finishAfterRippleTime) {
    escrowReady = true
    console.log('Escrow confirmed ready to finish.')
  } else {
    let timeDifference = finishAfterRippleTime - ledgerCloseTime
    if (timeDifference === 0) { timeDifference = 1 }
    console.log(`Escrow needs to wait another ${timeDifference}s.`)
    await sleep(timeDifference)
  }
}

// Finish the timed trust line token escrow --------------------
console.log('\n=== Finishing Timed Trust Line Token Escrow ===\n')
const iouEscrowFinishTx = {
  TransactionType: 'EscrowFinish',
  Account: creator.address,
  Owner: creator.address,
  OfferSequence: iouEscrowSeq
}

xrpl.validate(iouEscrowFinishTx)
console.log(JSON.stringify(iouEscrowFinishTx, null, 2))

console.log(`\nSubmitting EscrowFinish transaction...`)
const iouFinishResponse = await client.submitAndWait(iouEscrowFinishTx, {
  wallet: creator,
  autofill: true
})
if (iouFinishResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  console.error(`Trust Line Token EscrowFinish failed: ${iouFinishResponse.result.meta.TransactionResult}`)
  await client.disconnect()
  process.exit(1)
}
console.log(`Timed Trust Line Token escrow finished successfully: https://testnet.xrpl.org/transactions/${iouFinishResponse.result.hash}`)

await client.disconnect()
