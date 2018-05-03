'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// Can sign offline if the txJSON has all required fields
const api = new RippleAPI()

const txJSON = '{"Account":"rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za","TransactionType":"CheckCancel","CheckID":"2E0AD0740B79BE0AAE5EDD1D5FC79E3C5C221D23C6A7F771D85569B5B91195C2","Flags":2147483648,"LastLedgerSequence":8004884,"Fee":"12","Sequence":7}'

// Be careful where you store your real secret.
const secret = 's████████████████████████████'

const signed = api.sign(txJSON, secret)

console.log("tx_blob is:", signed.signedTransaction)
console.log("tx hash is:", signed.id)
