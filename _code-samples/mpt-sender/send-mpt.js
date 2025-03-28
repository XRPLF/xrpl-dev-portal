// *******************************************************
// ********************* Send MPT ************************
// *******************************************************
      
async function sendMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('leftResultField').value = results

  await client.connect()

  results += '\nConnected.'
  leftResultField.value = results
          
  const left_wallet = xrpl.Wallet.fromSeed(leftSeedField.value)
  const mpt_issuance_id = leftIssuanceIdField.value
  const mpt_quantity = leftQuantityField.value
        
  const send_mpt_tx = {
    "TransactionType": "Payment",
    "Account": left_wallet.address,
    "Amount": {
      "mpt_issuance_id": mpt_issuance_id,
      "value": mpt_quantity,
    },
    "Destination": leftDestinationField.value,
  }
      
  const pay_prepared = await client.autofill(send_mpt_tx)
  const pay_signed = left_wallet.sign(pay_prepared)
  results += `\n\nSending ${mpt_quantity} ${mpt_issuance_id} to ${leftDestinationField.value} ...`
  leftResultField.value = results
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    
        results += 'Transaction succeeded.\n\n'
        results += JSON.stringify(pay_result.result, null, 2)
    leftResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    results += JSON.stringify(pay_result.result, null, 2)
    leftResultField.value = results
  }
  client.disconnect()
} // end of sendMPT()
      
// *******************************************************
// ******************** Get MPTs *************************
// *******************************************************

async function getMPTs() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  leftResultField.value = results

  await client.connect()
  const left_wallet = xrpl.Wallet.fromSeed(leftSeedField.value)
  results += '\nConnected.'
  leftResultField.value = results
  const left_mpts = await client.request({
      command: "account_objects",
      account: left_wallet.address,
      ledger_index: "validated",
      type: "mptoken"
    })
  let JSONString = JSON.stringify(left_mpts.result, null, 2)
  let JSONParse = JSON.parse(JSONString)
  let numberOfMPTs = JSONParse.account_objects.length
  console.log("length: " + numberOfMPTs)
  let x = 0
  while (x < numberOfMPTs){
  results += "\n\nMPT Issuance ID: " + JSONParse.account_objects[x].MPTokenIssuanceID
             + "\nMPT Amount: " + JSONParse.account_objects[x].MPTAmount
    x++
  }
  results += "\n\n" + JSONString
  leftResultField.value = results
  client.disconnect()
} // End of getMPTs()

// **********************************************************************
// ****** MPTAuthorize Transaction ***************************************
// **********************************************************************

async function MPTAuthorize() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('leftResultField').value = results
  await client.connect()

  const left_wallet = xrpl.Wallet.fromSeed(leftSeedField.value)
  const mpt_issuance_id = leftIssuanceIdField.value

  const auth_mpt_tx = {
    "TransactionType": "MPTokenAuthorize",
    "Account": left_wallet.address,
    "MPTokenIssuanceID": mpt_issuance_id,
  }
  const auth_prepared = await client.autofill(auth_mpt_tx)
  const auth_signed = left_wallet.sign(auth_prepared)
  results += `\n\nSending authorization...`
  leftResultField.value = results
  const auth_result = await client.submitAndWait(auth_signed.tx_blob)

  if (auth_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += `Transaction succeeded`
    leftResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    leftResultField.value = results
  }
  client.disconnect()
} // end of MPTAuthorize()

// **********************************************************************
// ****** Reciprocal Transactions ***************************************
// **********************************************************************
       
// *******************************************************
// ************* Right Send MPT ********
// *******************************************************
      
async function rightSendMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  rightResultField.value = results

  await client.connect()

  results += '\nConnected.'
  rightResultField.value = results
          
  const right_wallet = xrpl.Wallet.fromSeed(rightSeedField.value)
  const mpt_issuance_id = rightIssuanceIdField.value
  const mpt_quantity = rightQuantityField.value
        
  const send_mpt_tx = {
    "TransactionType": "Payment",
    "Account": right_wallet.address,
    "Amount": {
      "mpt_issuance_id": mpt_issuance_id,
      "value": mpt_quantity,
    },
    "Destination": rightDestinationField.value,
  }
      
  const pay_prepared = await client.autofill(send_mpt_tx)
  const pay_signed = right_wallet.sign(pay_prepared)
  results += `\n\nSending ${mpt_quantity} ${mpt_issuance_id} to ${rightDestinationField.value} ...`
  rightResultField.value = results
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded.\n\n'
    results += JSON.stringify(pay_result.result, null, 2)
    rightResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    results += JSON.stringify(pay_result.result, null, 2)
    rightResultField.value = results
  }
  client.disconnect()
} // end of rightSendMPT()

// **********************************************************************
// ****** MPTAuthorize Transaction ***************************************
// **********************************************************************

async function rightMPTAuthorize() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('rightResultField').value = results
  await client.connect()

  const right_wallet = xrpl.Wallet.fromSeed(rightSeedField.value)
  const mpt_issuance_id = rightIssuanceIdField.value
  const auth_mpt_tx = {
    "TransactionType": "MPTokenAuthorize",
    "Account": right_wallet.address,
    "MPTokenIssuanceID": mpt_issuance_id,
  }
  const auth_prepared = await client.autofill(auth_mpt_tx)
  const auth_signed = right_wallet.sign(auth_prepared)
  results += `\n\nSending authorization...`
  rightResultField.value = results
  const auth_result = await client.submitAndWait(auth_signed.tx_blob)
  console.log(JSON.stringify(auth_result.result, null, 2))

  if (auth_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += `Transaction succeeded`
    rightResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    rightResultField.value = results
  }
  client.disconnect()
} // end of rightMPTAuthorize()

// **********************************************************************
// ****** Right Get MPTs          ***************************************
// **********************************************************************

async function rightGetMPTs() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  rightResultField.value = results

  await client.connect()
  const right_wallet = xrpl.Wallet.fromSeed(rightSeedField.value)
  results += '\nConnected.'
  rightResultField.value = results
  const right_mpts = await client.request({
      command: "account_objects",
      account: right_wallet.address,
      ledger_index: "validated",
      type: "mptoken"
    })
  let JSONString = JSON.stringify(right_mpts.result, null, 2)
  let JSONParse = JSON.parse(JSONString)
  let numberOfMPTs = JSONParse.account_objects.length
  let x = 0
  while (x < numberOfMPTs){
  results += "\n\nMPT Issuance ID: " + JSONParse.account_objects[x].MPTokenIssuanceID
             + "\nMPT Amount: " + JSONParse.account_objects[x].MPTAmount
    x++
  }
  results += "\n\n" + JSONString
  rightResultField.value = results
  client.disconnect()
} // End of rightGetMPTs()