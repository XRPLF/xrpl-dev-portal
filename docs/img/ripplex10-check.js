// *******************************************************
// ************* Standby Send Check **********************
// *******************************************************
async function sendCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  var check_amount = standbyAmountField.value
  
  if (standbyCurrencyField.value !=  "XRP") {
  	check_amount = {
      "currency": standbyCurrencyField.value,
      "value": standbyAmountField.value,
      "issuer": standby_wallet.address  	
  	}
  }
  
  const send_check_tx = {
    "TransactionType": "CheckCreate",
    "Account": standby_wallet.address,
    "SendMax": check_amount,
    "Destination": standbyDestinationField.value
  }
  const check_prepared = await client.autofill(send_check_tx)
  const check_signed = standby_wallet.sign(check_prepared)
  results += 'Sending ' + check_amount + ' ' + standbyCurrencyField + ' to ' +
    standbyDestinationField.value + '...'
  standbyResultField.value = results
  const check_result = await client.submitAndWait(check_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${check_signed.hash}'
    standbyResultField.value = JSON.stringify(check_result.result, null, 2)
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

  client.disconnect()
} // end of sendCheck()

// *******************************************************
// *************** Standby Get Checks ********************
// *******************************************************

async function getChecks() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()   
  results += '\nConnected.'
  standbyResultField.value = results

  results= "\nGetting standby account checks...\n"
  const check_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": standbyAccountField.value,
    "ledger_index": "validated",
    "type": "check"
  })
  standbyResultField.value = JSON.stringify(check_objects.result, null, 2)
  client.disconnect()
} // End of getChecks()

// *******************************************************
// ************* Standby Cash Check **********************
// *******************************************************
      
async function cashCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)

  var check_amount = standbyAmountField.value
  
  if (standbyCurrencyField.value !=  "XRP") {
  	check_amount = {
      "value": standbyAmountField.value,
      "currency": standbyCurrencyField.value,
      "issuer": standbyIssuerField.value  	
  	}
  }
  const cash_check_tx = {
    "TransactionType": "CheckCash",
    "Account": standby_wallet.address,
    "Amount": check_amount,
    "CheckID": standbyCheckID.value
  }
  const cash_prepared = await client.autofill(cash_check_tx)
  const cash_signed = standby_wallet.sign(cash_prepared)
  results += ' Receiving ' + standbyAmountField.value + ' ' + standbyCurrencyField.value + '.\n'
  standbyResultField.value = results
  const check_result = await client.submitAndWait(cash_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    standbyResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

  client.disconnect()
} // end of cashCheck()

// *******************************************************
// *************** Standby Cancel Check ******************
// *******************************************************

async function cancelCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        
  const cancel_check_tx = {
    "TransactionType": "CheckCancel",
    "Account": standby_wallet.address,
    "CheckID": standbyCheckID.value
  }
  const cancel_prepared = await client.autofill(cancel_check_tx)
  const cancel_signed = standby_wallet.sign(cancel_prepared)
  results += ' Cancelling check.\n'
  standbyResultField.value = results
  const check_result = await client.submitAndWait(cancel_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    standbyResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
} // end of cancelCheck()

// *******************************************************
// ************ Operational Send Check *******************
// *******************************************************
async function opSendCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)

  const issue_quantity = operationalAmountField.value
  var check_amount = operationalAmountField.value
  
  if (operationalCurrencyField.value !=  "XRP") {
  	check_amount = {
      "currency": operationalCurrencyField.value,
      "value": operationalAmountField.value,
      "issuer": operational_wallet.address  	
  	}
  }  
  const send_check_tx = {
    "TransactionType": "CheckCreate",
    "Account": operational_wallet.address,
    "SendMax": check_amount,
    "Destination": operationalDestinationField.value
  }
  const check_prepared = await client.autofill(send_check_tx)
  const check_signed = operational_wallet.sign(check_prepared)
  results += '\nSending check to ' +
    operationalDestinationField.value + '...'
  operationalResultField.value = results
  const check_result = await client.submitAndWait(check_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${check_signed.hash}'
    operationalResultField.value = JSON.stringify(check_result.result, null, 2)
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
} // end of opSendCheck()

// *******************************************************
// ************ Operational Get Checks *******************
// *******************************************************

async function opGetChecks() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()   
  results += '\nConnected.'
  operationalResultField.value = results

  results= "\nGetting standby account checks...\n"
  const check_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": operationalAccountField.value,
    "ledger_index": "validated",
    "type": "check"
  })
  operationalResultField.value = JSON.stringify(check_objects.result, null, 2)
  client.disconnect()
} // End of opGetChecks()


// *******************************************************
// ************* Operational Cash Check ******************
// *******************************************************
      
async function opCashCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)

  var check_amount = operationalAmountField.value
  
  if (operationalCurrencyField.value !=  "XRP") {
  	check_amount = {
      "value": operationalAmountField.value,
      "currency": operationalCurrencyField.value,
      "issuer": operationalIssuerField.value  	
  	}
  }
  const cash_check_tx = {
    "TransactionType": "CheckCash",
    "Account": operational_wallet.address,
    "Amount": check_amount,
    "CheckID": operationalCheckIDField.value
  }
  const cash_prepared = await client.autofill(cash_check_tx)
  const cash_signed = operational_wallet.sign(cash_prepared)
  results += ' Receiving ' + operationalAmountField.value + ' ' + operationalCurrencyField.value + '.\n'
  operationalResultField.value = results
  const check_result = await client.submitAndWait(cash_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    operationalResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
}
// end of opCashCheck()

// *******************************************************
// ************* Operational Cancel Check ****************
// *******************************************************

async function opCancelCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        
  const cancel_check_tx = {
    "TransactionType": "CheckCancel",
    "Account": operational_wallet.address,
    "CheckID": operationalCheckIDField.value
  }

  const cancel_prepared = await client.autofill(cancel_check_tx)
  const cancel_signed = operational_wallet.sign(cancel_prepared)
  results += ' Cancelling check.\n'
  operationalResultField.value = results
  const check_result = await client.submitAndWait(cancel_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    operationalResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
} // end of cancelCheck()