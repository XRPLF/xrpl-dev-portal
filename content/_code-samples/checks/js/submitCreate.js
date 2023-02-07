'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const tx_blob = "12001022800000002400000002201B0077911368400000000000000"+
    "C694000000005F5E100732103B6FCD7FAC4F665FE92415DD6E8450AD90F7D6B3D45A6"+
    "CFCF2E359045FF4BB400744630440220181FE2F945EBEE632966D5FB03114611E3047"+
    "ACD155AA1BDB9DF8545C7A2431502201E873A4B0D177AB250AF790CE80621E16F1415"+
    "06CF507586038FC4A8E95887358114735FF88E5269C80CD7F7AF10530DAB840BBF6FD"+
    "F8314A8B6B9FF3246856CADC4A0106198C066EA1F9C39"

  return api.submit(tx_blob)
}).then(response => {
  console.log("Preliminary transaction result:", response.resultCode)

// Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)
