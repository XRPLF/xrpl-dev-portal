const cc = require('five-bells-condition')
const crypto = require('crypto')

const preimageData = crypto.randomBytes(32)
const myFulfillment = new cc.PreimageSha256()
myFulfillment.setPreimage(preimageData)

console.log('Condition:', myFulfillment.getConditionBinary().toString('hex').toUpperCase())
console.log('Fulfillment:', myFulfillment.serializeBinary().toString('hex').toUpperCase())
