import xrpl from 'xrpl'
import { PreimageSha256 } from 'five-bells-condition'
import { randomBytes } from 'crypto'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
const destination_address = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe' // Testnet faucet
// Alternative: Get another account to send the escrow to. Use this if you get
// a tecDIR_FULL error trying to create escrows to the Testnet faucet.
// const destination_address = (await client.fundWallet()).wallet.address

// Create the crypto-condition for release ----------------------------------
const preimage = randomBytes(32)
const fulfillment = new PreimageSha256()
fulfillment.setPreimage(preimage)
const fulfillmentHex = fulfillment.serializeBinary().toString('hex').toUpperCase()
const conditionHex = fulfillment.getConditionBinary().toString('hex').toUpperCase()
console.log('Condition:', conditionHex)
console.log('Fulfillment:', fulfillmentHex)

// Set the escrow expiration ------------------------------------------------
const cancelDelay = 300 // Seconds in the future when the escrow should expire
const cancelAfter = new Date() // Current time
cancelAfter.setSeconds(cancelAfter.getSeconds() + cancelDelay)
console.log('This escrow will expire after:', cancelAfter)
// Convert cancelAfter to seconds since the Ripple Epoch:
const cancelAfterRippleTime = xrpl.isoTimeToRippleTime(cancelAfter.toISOString())

// Send EscrowCreate transaction --------------------------------------------
const escrowCreate = {
  TransactionType: 'EscrowCreate',
  Account: wallet.address,
  Destination: destination_address,
  Amount: '123456', // drops of XRP
  Condition: conditionHex,
  CancelAfter: cancelAfterRippleTime
}
xrpl.validate(escrowCreate)

console.log('Signing and submitting the transaction:',
  JSON.stringify(escrowCreate, null, 2))
const response = await client.submitAndWait(escrowCreate, {
  wallet,
  autofill: true // Note: fee is higher based on condition size in bytes
})

// Check result of submitting -----------------------------------------------
console.log(JSON.stringify(response.result, null, 2))
const escrowCreateResultCode = response.result.meta.TransactionResult
if (escrowCreateResultCode === 'tesSUCCESS') {
  console.log('Escrow created successfully.')
} else {
  console.error(`EscrowCreate failed with code ${escrowCreateResultCode}.`)
  process.exit(1)
}

// Save the sequence number so you can identify the escrow later.
const escrowSeq = response.result.tx_json.Sequence
console.log(`Escrow sequence is ${escrowSeq}.`)


// Send EscrowFinish transaction --------------------------------------------
const escrowFinish = {
  TransactionType: 'EscrowFinish',
  Account: wallet.address,
  Owner: wallet.address,
  OfferSequence: escrowSeq,
  Condition: conditionHex,
  Fulfillment: fulfillmentHex
}
xrpl.validate(escrowFinish)

console.log('Signing and submitting the transaction:',
  JSON.stringify(escrowFinish, null, 2))
const response2 = await client.submitAndWait(escrowFinish, {
  wallet,
  autofill: true // Note: fee is higher based on fulfillment size in bytes
})
console.log(JSON.stringify(response2.result, null, 2))
if (response2.result.meta.TransactionResult === 'tesSUCCESS') {
  console.log('Escrow finished successfully.')
} else {
    console.log(`Failed with result code ${response2.result.meta.TransactionResult}`)
}

client.disconnect()
