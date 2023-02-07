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
    "checkID": "84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9",
    "amount": {
      "currency": "XRP",
      "value": "95" // Cash for exactly 95 XRP
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
//   "CheckID":"84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9",
//   "Amount":"95000000",
//   "Flags":2147483648,
//   "LastLedgerSequence":8006841,
//   "Fee":"12",
//   "Sequence":5}
// Disconnected
