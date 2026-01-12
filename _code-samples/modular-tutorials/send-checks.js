// *******************************************************
// ***************** Send Check **************************
// *******************************************************
async function sendCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  results = `\n===Connected to ${net}.===\n===Sending check.===\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    let check_amount = amountField.value
    if (currencyField.value != 'XRP') {
      check_amount = {
        currency: currencyField.value,
        value: amountField.value,
        issuer: wallet.address,
      }
    }
    const send_check_tx = {
      TransactionType: 'CheckCreate',
      Account: wallet.address,
      SendMax: check_amount,
      Destination: destinationField.value,
    }
    const check_prepared = await client.autofill(send_check_tx)
    const check_signed = wallet.sign(check_prepared)
    results = '\n===Sending ' + amountField.value + ' ' + currencyField.value + ' to ' + destinationField.value + '.===\n'
    resultField.value += results
    const check_result = await client.submitAndWait(check_signed.tx_blob)
    if (check_result.result.meta.TransactionResult == 'tesSUCCESS') {
      results += '===Transaction succeeded===\n\n'
      resultField.value += JSON.stringify(check_result.result, null, 2)
      xrpBalanceField.value = await client.getXrpBalance(wallet.address)
    }
  } catch (error) {
    results = `Error sending transaction: ${error}`
    resultField.value += results
  } finally {
    client.disconnect()
  }
} // end of sendCheck()

// *******************************************************
// ********************* Get Checks **********************
// *******************************************************

async function getChecks() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}.===\n===Getting account checks.===\n\n`
  resultField.value = results
  try {
    const check_objects = await client.request({
      id: 5,
      command: 'account_objects',
      account: accountAddressField.value,
      ledger_index: 'validated',
      type: 'check',
    })
    resultField.value += JSON.stringify(check_objects.result, null, 2)
  } catch (error) {
    results = `Error getting checks: ${error}`
    resultField.value += results
  } finally {
    client.disconnect()
  }
} // End of getChecks()

// *******************************************************
// ********************  Cash Check **********************
// *******************************************************

async function cashCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  results = `\n===Connected to ${net}.===\n===Cashing check.===\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    let check_amount = amountField.value
    if (currencyField.value != 'XRP') {
      check_amount = {
        value: amountField.value,
        currency: currencyField.value,
        issuer: issuerField.value,
      }
    }
    const cash_check_tx = {
      TransactionType: 'CheckCash',
      Account: wallet.address,
      Amount: check_amount,
      CheckID: checkIdField.value,
    }
    const cash_prepared = await client.autofill(cash_check_tx)
    const cash_signed = wallet.sign(cash_prepared)
    results = ' Receiving ' + amountField.value + ' ' + currencyField.value + '.\n'
    resultField.value += results
    const check_result = await client.submitAndWait(cash_signed.tx_blob)
    if (check_result.result.meta.TransactionResult == 'tesSUCCESS') {
      results = '===Transaction succeeded===\n' + JSON.stringify(check_result.result, null, 2)
      resultField.value += results
    }
    xrpBalanceField.value = await client.getXrpBalance(wallet.address)
  } catch (error) {
    results = `Error sending transaction: ${error}`
    resultField.value += results
  } finally {
    client.disconnect()
  }
} // end of cashCheck()

// *******************************************************
// **************** Cancel Check *************************
// *******************************************************

async function cancelCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  results = `\n===Connected to ${net}.===\n===Cancelling check.===\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const cancel_check_tx = {
      TransactionType: 'CheckCancel',
      Account: wallet.address,
      CheckID: checkIdField.value,
    }
    const cancel_prepared = await client.autofill(cancel_check_tx)
    const cancel_signed = wallet.sign(cancel_prepared)
    const check_result = await client.submitAndWait(cancel_signed.tx_blob)
    if (check_result.result.meta.TransactionResult == 'tesSUCCESS') {
      results += `===Transaction succeeded===\n${check_result.result.meta.TransactionResult}`
      resultField.value = results
    }
    xrpBalanceField.value = await client.getXrpBalance(wallet.address)
  } catch (error) {
    results = `Error sending transaction: ${error}`
    resultField.value += results
  } finally {
    client.disconnect()
  }
} // end of cancelCheck()
