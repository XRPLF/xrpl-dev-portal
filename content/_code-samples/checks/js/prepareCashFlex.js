'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const sender = 'rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis'
  const options = {
    // Allow up to 60 ledger versions (~5 min) instead of the default 3 versions
    // before this transaction fails permanently.
    "maxLedgerVersionOffset": 60
  }
  return api.prepareCheckCash(sender, {
    "checkID": "C0B27D20669BAB837B3CDF4B8148B988F17CE1EF8EDF48C806AE9BF69E16F441",
    "deliverMin": {
      "currency": "XRP",
      "value": "95" // Cash for at least 95 XRP
    }
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
// txJSON: {"Account":"rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
//   "TransactionType":"CheckCash",
//   "CheckID":"C0B27D20669BAB837B3CDF4B8148B988F17CE1EF8EDF48C806AE9BF69E16F441",
//   "DeliverMin":"95000000",
//   "Flags":2147483648,
//   "LastLedgerSequence":8006858,
//   "Fee":"12",
//   "Sequence":5}
// Disconnected
