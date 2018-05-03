'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const tx_hash = "54A7A917BE9AC13962251BCF1D09803C7BBE75882B8BFC987B5933A566A48215"

  return api.getTransaction(tx_hash)
}).then(response => {
  console.log("Final transaction result:", response)

// Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)
