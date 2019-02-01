'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// Can sign offline if the txJSON has all required fields
const api = new RippleAPI()

const txJSON = '{"Account":"rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za", \
  "TransactionType":"Payment", \
  "Destination":"rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", \
  "Amount":"13000000", \
  "Flags":2147483648, \
  "LastLedgerSequence":7835923, \
  "Fee":"13", \
  "Sequence":2}'

// Be careful where you store your real secret.
const secret = 's████████████████████████████'

const signed = api.sign(txJSON, secret)

console.log("tx_blob is:", signed.signedTransaction)
console.log("tx hash is:", signed.id)
