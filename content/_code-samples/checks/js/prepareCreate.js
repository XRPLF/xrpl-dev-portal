'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const sender = 'rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za'
  const receiver = 'rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis'
  const options = {
    // Allow up to 60 ledger versions (~5 min) instead of the default 3 versions
    // before this transaction fails permanently.
    "maxLedgerVersionOffset": 60
  }
  return api.prepareCheckCreate(sender, {
    "destination": receiver,
    "sendMax": {
      "currency": "XRP",
      "value": "100" // RippleAPI uses decimal XRP, not integer drops
    },
    "invoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291"
  }, options)

}).then(prepared => {
  console.log("txJSON:", prepared.txJSON);

// Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)


// Example output:
//
// Connected
// txJSON: {"Account":"rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za",
//  "TransactionType":"CheckCreate",
//  "Destination":"rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
//  "SendMax":"100000000",
//  "Flags":2147483648,
//  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
//  "LastLedgerSequence":7835917,"Fee":"12","Sequence":2}
// Disconnected
