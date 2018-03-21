'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const tx_blob = "12001022800000002400000001201B0075139F68400000000000000C69"+
    "4000000005F5E100732103B6FCD7FAC4F665FE92415DD6E8450AD90F7D6B3D45A6CFCF2E"+
    "359045FF4BB4007446304402204B5DA588DC2B9B9E52248129F07083AE71039CBDD8A87F"+
    "58583853A4A9A8461B02205973D04A9F97EE0684DB98D4EC813CF748806019751062FB60"+
    "0406D8BE95D18D8114735FF88E5269C80CD7F7AF10530DAB840BBF6FDF8314A8B6B9FF32"+
    "46856CADC4A0106198C066EA1F9C39"

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
