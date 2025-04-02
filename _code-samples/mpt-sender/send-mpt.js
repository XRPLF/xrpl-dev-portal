// *******************************************************
// ********************* Send MPT ************************
// *******************************************************
      
async function sendMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `Connected to ${net}....`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const mpt_issuance_id = mptIdField.value
  const mpt_quantity = amountField.value
  const send_mpt_tx = {
    "TransactionType": "Payment",
    "Account": wallet.address,
    "Amount": {
      "mpt_issuance_id": mpt_issuance_id,
      "value": mpt_quantity,
    },
    "Destination": destinationField.value,
  }
  const pay_prepared = await client.autofill(send_mpt_tx)
  const pay_signed = wallet.sign(pay_prepared)
  results += `\n\nSending ${mpt_quantity} ${mpt_issuance_id} to ${destinationField.value} ...`
  resultField.value = results
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        results += 'Transaction succeeded.\n\n'
        results += JSON.stringify(pay_result.result, null, 2)
    resultField.value = results
  } else {
    results += `\nTransaction failed: ${pay_result.result.meta.TransactionResult}\n\n`
    results += JSON.stringify(pay_result.result, null, 2)
    resultField.value = results
  }
  client.disconnect()
} // end of sendMPT()
      
// *******************************************************
// ******************** Get MPTs *************************
// *******************************************************

async function getMPTs() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  let results = `Connected to ${net}....`
  resultField.value = results
  const mpts = await client.request({
      command: "account_objects",
      account: wallet.address,
      ledger_index: "validated",
      type: "mptoken"
    })
  let JSONString = JSON.stringify(mpts.result, null, 2)
  let JSONParse = JSON.parse(JSONString)
  let numberOfMPTs = JSONParse.account_objects.length
  let x = 0
  while (x < numberOfMPTs){
    results += "\n\nMPT Issuance ID: " + JSONParse.account_objects[x].MPTokenIssuanceID
             + "\nMPT Amount: " + JSONParse.account_objects[x].MPTAmount
    x++
  }
  results += "\n\n" + JSONString
  resultField.value = results
  client.disconnect()
} // End of getMPTs()

// **********************************************************************
// ****** MPTAuthorize Transaction ***************************************
// **********************************************************************

async function authorizeMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `Connected to ${net}....`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const mpt_issuance_id = mptIdField.value
  const auth_mpt_tx = {
    "TransactionType": "MPTokenAuthorize",
    "Account": wallet.address,
    "MPTokenIssuanceID": mpt_issuance_id,
  }
  const auth_prepared = await client.autofill(auth_mpt_tx)
  const auth_signed = wallet.sign(auth_prepared)
  results += `\n\nSending authorization...`
  resultField.value = results
  const auth_result = await client.submitAndWait(auth_signed.tx_blob)
  if (auth_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += `\nTransaction succeeded`
    resultField.value = results
  } else {
    results += `\nTransaction failed: ${auth_result.result.meta.TransactionResult}`
    resultField.value = results
  }
  client.disconnect()
} // end of MPTAuthorize()