'use strict'
// Dependencies for Node.js.
const api = require('ripple-binary-codec')
const path = require('path')
const { binary } = require(path.resolve('node_modules','ripple-binary-codec', 'dist', 'coretypes'))

// Construct a valid xrpl transaction object --------------------
// In this instance, we will demonstrate a simple USD payment
const tx = {   
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}

// Serialize JSON to Array Buffer -------------------------------
const tx_serialize = binary.serializeObject(tx)

// Log Array Buffer representing the serialized object
console.log('Serialize Transaction Array Buffer: ', tx_serialize)

// Serialize to Hex  --------------------------------------------
const tx_hex = api.encode(tx)
console.log('Serialize Transaction Hexidecimal: ', tx_hex)

// Verify Correctness of Array Buffer  --------------------------
const parser = binary.makeParser(tx_serialize)
const json = binary.readJSON(parser)
console.log('Original Transaction Object JSON: ', json)