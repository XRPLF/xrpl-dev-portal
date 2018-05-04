'use strict'
const RippleAPI = require('ripple-lib').RippleAPI
const cc = require('five-bells-condition')
const crypto = require('crypto')

const myAddr = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
const mySecret = 's████████████████████████████'

// Construct condition and fulfillment
const preimageData = crypto.randomBytes(32)
const myFulfillment = new cc.PreimageSha256()
myFulfillment.setPreimage(preimageData)
const conditionHex = myFulfillment.getConditionBinary().toString('hex').toUpperCase()

console.log('Condition:', conditionHex)
console.log('Fulfillment:', myFulfillment.serializeBinary().toString('hex').toUpperCase())

// Construct transaction
const currentTime = new Date()
const myEscrow = {
  "destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", // Destination can be same as source
  "destinationTag": 2017,
  "amount": "0.1113", //decimal XRP
  "condition": conditionHex,
  "allowExecuteAfter": currentTime.toISOString() // can be executed right away if the condition is met
}
const myInstructions = {
  maxLedgerVersionOffset: 5
}

// Connect and submit
const api = new RippleAPI({server: 'wss://s2.ripple.com'})

function submitTransaction(lastClosedLedgerVersion, prepared, secret) {
  const signedData = api.sign(prepared.txJSON, secret)
  console.log('Transaction ID: ', signedData.id)
  return api.submit(signedData.signedTransaction).then(data => {
    console.log('Tentative Result: ', data.resultCode)
    console.log('Tentative Message: ', data.resultMessage)
  })
}

api.connect().then(() => {
  console.log('Connected')
  return api.prepareEscrowCreation(myAddr, myEscrow, myInstructions)
}).then(prepared => {
  console.log('EscrowCreation Prepared')
  return api.getLedger().then(ledger => {
    console.log('Current Ledger', ledger.ledgerVersion)
    return submitTransaction(ledger.ledgerVersion, prepared, mySecret)
  })
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected')
    process.exit()
  })
}).catch(console.error)
