'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// Load address & secret from environment variables:
const from_address = process.env['MY_ADDRESS']
const secret = process.env['MY_SECRET']

// Can sign offline if the txJSON has all required fields
const api = new RippleAPI()

const txJSON = JSON.stringify({
  "Account": from_address,
  "TransactionType":"Payment",
  "Destination":"rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount":"13000000",
  "Flags":2147483648,
  "LastLedgerSequence":7835923,
  "Fee":"13",
  "Sequence":2
})

const signed = api.sign(txJSON, secret)

console.log("tx_blob is:", signed.signedTransaction)
console.log("tx hash is:", signed.id)
