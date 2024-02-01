'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const tx_blob = "12001222800000002400000007201B007A251450182E0AD0740B79BE0AAE5EDD1D5FC79E3C5C221D23C6A7F771D85569B5B91195C268400000000000000C732103B6FCD7FAC4F665FE92415DD6E8450AD90F7D6B3D45A6CFCF2E359045FF4BB4007446304402205D77451B0D7BCDA1FE5B98763C5B3B2837453371FE93C2B86157C44B1867AE36022003800273848BC2F8E1C6EC7EE4B0CB2425A888AE80E586886C306C796B25678B8114735FF88E5269C80CD7F7AF10530DAB840BBF6FDF"

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
