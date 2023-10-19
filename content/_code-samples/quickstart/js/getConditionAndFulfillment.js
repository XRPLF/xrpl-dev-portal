function getConditionAndFulfillment() {

  const cc = require('five-bells-condition')
  const crypto = require('crypto')

  const preimageData = crypto.randomBytes(32)
  const fulfillment = new cc.PreimageSha256()
  fulfillment.setPreimage(preimageData)

  const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase()
  console.log('Condition:', condition)
 
  // Keep secret until you want to finish the escrow
  const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase()
  console.log('Fulfillment:', fulfillment_hex)
}
getConditionAndFulfillment()