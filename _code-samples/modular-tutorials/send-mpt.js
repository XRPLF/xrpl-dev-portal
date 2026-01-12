// *******************************************************
// ********************* Send MPT ************************
// *******************************************************

async function sendMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}. Sending MPT.===\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const mpt_issuance_id = mptIdField.value
    const mpt_quantity = amountField.value
    const send_mpt_tx = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: {
        mpt_issuance_id: mpt_issuance_id,
        value: mpt_quantity,
      },
      Destination: destinationField.value,
    }
    const pay_prepared = await client.autofill(send_mpt_tx)
    const pay_signed = wallet.sign(pay_prepared)
    results = `\n===Sending ${mpt_quantity} ${mpt_issuance_id} to ${destinationField.value} ...`
    resultField.value += results
    const pay_result = await client.submitAndWait(pay_signed.tx_blob)
    results = '\n\n===Transaction succeeded.\n'
    results += JSON.stringify(pay_result.result, null, 2)
    resultField.value += results
  } catch (error) {
    results = `Error sending MPT: ${error}`
    resultField.value += results
  } finally {
    client.disconnect()
  }
} // end of sendMPT()

// *******************************************************
// ******************** Get MPTs *************************
// *******************************************************

async function getMPTs() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = ''
  resultField.value = `===Connected to ${net}. Getting MPTs.===`

  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const mpts = await client.request({
      command: 'account_objects',
      account: wallet.address,
      ledger_index: 'validated',
      type: 'mptoken',
    })
    let JSONString = JSON.stringify(mpts.result, null, 2)
    let JSONParse = JSON.parse(JSONString)
    let numberOfMPTs = JSONParse.account_objects.length
    let x = 0
    while (x < numberOfMPTs) {
      results +=
        '\n\n===MPT Issuance ID: ' + JSONParse.account_objects[x].MPTokenIssuanceID + '\n===MPT Amount: ' + JSONParse.account_objects[x].MPTAmount
      x++
    }
    results += '\n\n' + JSONString
    resultField.value += results
  } catch (error) {
    results = `===Error getting MPTs: ${error}`
    resultField.value += results
  } finally {
    client.disconnect()
  }
} // End of getMPTs()

// **********************************************************************
// ****** MPTAuthorize Transaction ***************************************
// **********************************************************************

async function authorizeMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}. Authorizing MPT.===\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const mpt_issuance_id = mptIdField.value
    const auth_mpt_tx = {
      TransactionType: 'MPTokenAuthorize',
      Account: wallet.address,
      MPTokenIssuanceID: mpt_issuance_id,
    }
    const auth_prepared = await client.autofill(auth_mpt_tx)
    const auth_signed = wallet.sign(auth_prepared)
    results += `\n\n===Sending authorization.===\n`
    resultField.value = results
    const auth_result = await client.submitAndWait(auth_signed.tx_blob)
    results = '\n===Transaction succeeded===\n\n'
    resultField.value += results
    results += `\n\n` + JSON.stringify(auth_result.result, null, 2)
  } catch (error) {
    results = `===Error authorizing MPT: ${error}`
    resultField.value = results
  } finally {
    resultField.value = results
  }
  client.disconnect()
} // end of MPTAuthorize()
