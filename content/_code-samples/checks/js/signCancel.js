'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// Can sign offline if the txJSON has all required fields
const api = new RippleAPI()

const txJSON = '{"Account":"rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za","TransactionType":"CheckCancel","CheckID":"49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0","Flags":2147483648,"LastLedgerSequence":8004884,"Fee":"12","Sequence":7}'

// Be careful where you store your real secret.
const secret = 's████████████████████████████'

const signed = api.sign(txJSON, secret)

console.log("tx_blob is:", signed.signedTransaction)
console.log("tx hash is:", signed.id)
