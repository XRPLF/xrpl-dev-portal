import { Client, dropsToXrp, rippleTimeToISOTime } from 'xrpl'

// Set up client and address
const address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
console.log('Connecting to Mainnet...')
const client = new Client('wss://xrplcluster.com/')
await client.connect()

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
const close_time = ledger.result.ledger.close_time
const ledger_hash = ledger.result.ledger.ledger_hash

// Look up objects filtered to escrows, handling pagination --------------------
let marker
const escrows = []
while (true) {
  console.log(`Requesting page of account_objects with marker ${marker}`)
  const resp = await client.request({
    command: 'account_objects',
    account: address,
    ledger_hash, // Caution: if you use a shortcut
    // such as "validated", the ledger may
    // change during iteration, leading to
    // inconsistent results.
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
    escrows.push(escrow)
  }

  // If there's a marker, loop and fetch the next page of results
  if (resp.result.marker) {
    marker = resp.result.marker
  } else {
    break
  }
}

// Define helper function for displaying amounts -------------------------------
function display_amount (amount) {
  if (typeof amount === 'string') {
    // amount is drops of XRP.
    const decimal_xrp = dropsToXrp(amount)
    return `${decimal_xrp} XRP`
  } else if (amount.hasOwnProperty('mpt_issuance_id')) {
    // amount is an MPT.
    // More info may be available, but that would require looking it up.
    return `${amount.value} units of MPT ${amount.mpt_issuance_id}`
  } else if (amount.hasOwnProperty('issuer')) {
    // amount is a trust line token.
    // Currency may be 3 chars or hex. For guidelines parsing hex codes,
    // see "Normalize Currency Codes" code sample.
    return `${amount.value} ${amount.currency} issued by ${amount.issuer}`
  }
  console.error(`Unexpected type of amount: ${amount}`)
  client.disconnect()
  process.exit(1)
}

// Summarize results -----------------------------------------------------------
console.log(`Found ${escrows.length} escrow(s).`)

for (const escrow of escrows) {
  if (escrow.Account === address) {
    console.log(`Outgoing escrow to ${escrow.Destination}`)
  } else if (escrow.Destination === address) {
    console.log(`Incoming escrow from ${escrow.Account}`)
  } else {
    console.log('Neither incoming nor outgoing? This is unexexpected.')
  }

  console.log(`  Amount: ${display_amount(escrow.Amount)}`)

  if (escrow.hasOwnProperty('Condition')) {
    console.log(`  Condition: ${escrow.Condition}`)
  }

  if (escrow.FinishAfter) {
    const mature_time_display = rippleTimeToISOTime(escrow.FinishAfter)
    if (escrow.FinishAfter < close_time) {
      console.log(`  Matured at ${mature_time_display}`)
    } else {
      console.log(`  Will mature at ${mature_time_display}`)
    }
  }

  if (escrow.hasOwnProperty('CancelAfter')) {
    const cancel_time_display = rippleTimeToISOTime(escrow.CancelAfter)
    if (escrow.CancelAfter < close_time) {
      console.log(`  EXPIRED at ${cancel_time_display}`)
    } else {
      console.log(`  Expires at ${cancel_time_display}`)
    }
  }
}

client.disconnect()
