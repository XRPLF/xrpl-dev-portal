import { Client, isoTimeToRippleTime, rippleTimeToISOTime, validate, getBalanceChanges } from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

console.log('Funding new wallet from faucet...')
const { wallet } = await client.fundWallet()
// const destinationAddress = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe' // Testnet faucet
// Alternative: Get another account to send the escrow to. Use this if you get
// a tecDIR_FULL error trying to create escrows to the Testnet faucet.
const destinationAddress = (await client.fundWallet()).wallet.address

// Create an escrow that won't be finished -------------------------------------
const cancelDelay = 30
const cancelAfter = new Date()
cancelAfter.setSeconds(cancelAfter.getSeconds() + cancelDelay)
console.log('This escrow will expire after:', cancelAfter)
// Convert cancelAfter to seconds since the Ripple Epoch:
const cancelAfterRippleTime = isoTimeToRippleTime(cancelAfter.toISOString())
const conditionHex = 'A02580200000000000000000000000000000000000000000000000000000000000000000810120'

const escrowCreate = {
  TransactionType: 'EscrowCreate',
  Account: wallet.address,
  Destination: destinationAddress,
  Amount: '123456',
  Condition: conditionHex,
  CancelAfter: cancelAfterRippleTime
}
validate(escrowCreate)

console.log('Signing and submitting the EscrowCreate transaction.')
const response = await client.submitAndWait(escrowCreate, {
  wallet,
  autofill: true // Note: fee is higher based on condition size in bytes
})
console.log(JSON.stringify(response.result, null, 2))
const escrowCreateResultCode = response.result.meta.TransactionResult
if (escrowCreateResultCode !== 'tesSUCCESS') {
  console.error(`EscrowCreate failed with code ${escrowCreateResultCode}.`)
  client.disconnect()
  process.exit(1)
}

// Wait for the escrow to expire -----------------------------------------------
// Since ledger close times can be rounded by up to 10 seconds, wait an extra
// 10 seconds to make sure the escrow has officially expired.
console.log(`Waiting ${cancelDelay + 10} seconds for the escrow to expire...`)
await sleep(cancelDelay + 10)

/* Sleep function that can be used with await */
function sleep (delayInSeconds) {
  const delayInMs = delayInSeconds * 1000
  return new Promise((resolve) => setTimeout(resolve, delayInMs))
}

// Look up the official close time of the validated ledger ---------------------
const ledger = await client.request({
  command: 'ledger',
  ledger_index: 'validated'
})
if (ledger.error) {
  console.error(`Error looking up validated ledger: ${ledger.error}`)
  client.disconnect()
  process.exit(1)
}
const closeTime = ledger.result.ledger.close_time
console.log('Latest validated ledger closed at',
  rippleTimeToISOTime(closeTime)
)
const ledgerHash = ledger.result.ledger.ledger_hash

// Look up escrows connected to the account, handling pagination ---------------
let marker
let expiredEscrow
while (true) {
  console.log(`Requesting page of account_objects with marker ${marker}`)
  const resp = await client.request({
    command: 'account_objects',
    account: wallet.address,
    ledger_hash: ledgerHash,
    type: 'escrow',
    marker
  })
  if (resp.error) {
    console.error('account_objects failed with error', resp)
    client.disconnect()
    process.exit(1)
  }

  // Add new escrows to the full list
  for (const escrow of resp.result.account_objects) {
    if (!escrow.hasOwnProperty('CancelAfter')) {
      console.log('This escrow does not have an expiration.')
    } else if (escrow.CancelAfter < closeTime) {
      console.log('This escrow has expired.')
      expiredEscrow = escrow
      break
    } else {
      const expirationTime = rippleTimeToISOTime(escrow.CancelAfter)
      console.log('This escrow expires at', expirationTime)
    }
  }

  if (expiredEscrow) {
    // Found an expired escrow, stop paginating
    break
  }

  // If there's a marker, loop and fetch the next page of results
  if (resp.result.marker) {
    marker = resp.result.marker
  } else {
    break
  }
}

if (!expiredEscrow) {
  console.error('Did not find any expired escrows.')
  process.exit(1)
}

// Find the sequence number of the expired escrow ------------------------------
let escrow_seq
const txResp = await client.request({
  command: 'tx',
  transaction: expiredEscrow.PreviousTxnID
})
if (txResp.error) {
  console.error("Couldn't get transaction. Maybe this server doesn't have",
    'enough transaction history available?')
  client.disconnect()
  process.exit(1)
}

if (txResp.result.tx_json.TransactionType === 'EscrowCreate') {
  // Save this sequence number for canceling the escrow
  escrow_seq = txResp.result.tx_json.Sequence
  if (escrow_seq === 0) {
    // This transaction used a Ticket, so use TicketSequence instead.
    escrow_seq = response.result.tx_json.TicketSequence
  }
} else {
  console.error("This escrow's previous transaction wasn't EscrowCreate!")
  client.disconnect()
  process.exit(1)
}

// Send EscrowCancel transaction -----------------------------------------------
const escrowCancel = {
  TransactionType: 'EscrowCancel',
  Account: wallet.address,
  Owner: expiredEscrow.Account,
  OfferSequence: escrow_seq
}
validate(escrowCancel)

console.log('Signing and submitting the EscrowCancel transaction.')
const cancelResponse = await client.submitAndWait(escrowCancel, {
  wallet,
  autofill: true
})
console.log(JSON.stringify(cancelResponse.result, null, 2))
const cancelResultCode = cancelResponse.result.meta.TransactionResult
if (cancelResultCode !== 'tesSUCCESS') {
  console.error(`EscrowCancel failed with result code ${cancelResultCode}`)
  client.disconnect()
  process.exit(1)
}

console.log('Escrow canceled. Balance changes:')
console.log(JSON.stringify(getBalanceChanges(cancelResponse.result.meta), null, 2))

client.disconnect()
