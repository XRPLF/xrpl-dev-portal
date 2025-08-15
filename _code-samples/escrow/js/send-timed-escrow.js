import xrpl from 'xrpl'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
// const destination_address = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe' // Testnet faucet
// Alternative: Get another account to send the escrow to. Use this if you get
// a tecDIR_FULL error trying to create escrows to the Testnet faucet.
const destination_address = (await client.fundWallet()).wallet.address

// Set the escrow finish time -----------------------------------------------
const delay = 30 // Seconds in the future when the escrow should mature
const finishAfter = new Date() // Current time
finishAfter.setSeconds(finishAfter.getSeconds() + delay)
console.log('This escrow will finish after:', finishAfter)
// Convert finishAfter to seconds since the Ripple Epoch:
const finishAfterRippleTime = xrpl.isoTimeToRippleTime(finishAfter.toISOString())

// Send EscrowCreate transaction --------------------------------------------
const escrowCreate = {
  TransactionType: 'EscrowCreate',
  Account: wallet.address,
  Destination: destination_address,
  Amount: '123456', // drops of XRP
  FinishAfter: finishAfterRippleTime
}
xrpl.validate(escrowCreate)

console.log('Signing and submitting the transaction:',
  JSON.stringify(escrowCreate, null, 2))
const response = await client.submitAndWait(escrowCreate, {
  wallet,
  autofill: true
})
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

// Wait for the escrow to be finishable -------------------------------------
console.log(`Waiting ${delay} seconds for the escrow to mature...`)
await sleep(delay)

/* Sleep function that can be used with await */
function sleep (delayInSeconds) {
  const delayInMs = delayInSeconds * 1000
  return new Promise((resolve) => setTimeout(resolve, delayInMs))
}

// Check if escrow can be finished -------------------------------------------
let escrowReady = false
while (!escrowReady) {
  // Check the close time of the latest validated ledger.
  // Close times are rounded by about 10 seconds, so the exact time the escrow
  // is ready to finish may vary by +/- 10 seconds.
  const validatedLedger = await client.request({
    command: 'ledger',
    ledger_index: 'validated'
  })
  const ledgerCloseTime = validatedLedger.result.ledger.close_time
  console.log('Latest validated ledger closed at',
    xrpl.rippleTimeToISOTime(ledgerCloseTime))
  if (ledgerCloseTime > finishAfterRippleTime) {
    escrowReady = true
    console.log('Escrow is mature.')
  } else {
    let timeDifference = finishAfterRippleTime - ledgerCloseTime
    if (timeDifference === 0) { timeDifference = 1 }
    console.log(`Waiting another ${timeDifference} second(s).`)
    await sleep(timeDifference)
  }
}

// Send EscrowFinish transaction --------------------------------------------
const escrowFinish = {
  TransactionType: 'EscrowFinish',
  Account: wallet.address,
  Owner: wallet.address,
  OfferSequence: escrowSeq
}
xrpl.validate(escrowFinish)

console.log('Signing and submitting the transaction:',
  JSON.stringify(escrowFinish, null, 2))
const response2 = await client.submitAndWait(escrowFinish, {
  wallet,
  autofill: true
})
console.log(JSON.stringify(response2.result, null, 2))
if (response2.result.meta.TransactionResult === 'tesSUCCESS') {
  console.log('Escrow finished successfully. Balance changes:')
  console.log(
    JSON.stringify(xrpl.getBalanceChanges(response2.result.meta), null, 2)
  )
}

client.disconnect()
