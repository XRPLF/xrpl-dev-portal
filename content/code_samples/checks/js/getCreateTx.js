'use strict'
const RippleAPI = require('ripple-lib').RippleAPI
const decodeAddress = require('ripple-address-codec').decodeAddress;
const createHash = require('crypto').createHash;

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const tx_hash = "C0B27D20669BAB837B3CDF4B8148B988F17CE1EF8EDF48C806AE9BF69E16F441"

  return api.getTransaction(tx_hash)
}).then(response => {
  console.log("Final transaction result:", response)

  // Re-calculate checkID to work around issue ripple-lib#876
  const checkIDhasher = createHash('sha512')
  checkIDhasher.update(Buffer.from('0043', 'hex'))
  checkIDhasher.update(new Buffer(decodeAddress(response.address)))
  const seqBuf = Buffer.alloc(4)
  seqBuf.writeUInt32BE(response.sequence, 0)
  checkIDhasher.update(seqBuf)
  const checkID = checkIDhasher.digest('hex').slice(0,64).toUpperCase()
  console.log("Calculated checkID:", checkID)

// Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)
