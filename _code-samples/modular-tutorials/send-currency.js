// *******************************************************
// ***************** Create TrustLine ********************
// *******************************************************
      
async function createTrustLine() {
  const net = getNet() 
  const client = new xrpl.Client(net)
  await client.connect()
  let results = "\nConnected. Creating trust line.\n"
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const trustSet_tx = {
      "TransactionType": "TrustSet",
      "Account": accountAddressField.value,
      "LimitAmount": {
        "currency": currencyField.value,
        "issuer": issuerField.value,
        "value": amountField.value
      }
    }
    const ts_prepared = await client.autofill(trustSet_tx)
    const ts_signed = wallet.sign(ts_prepared)
    resultField.value = results
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
      results += '\n===Trustline established between account\n' +
        accountAddressField.value + "\nand account\n" + issuerField.value + '.'
      resultField.value = results
    } else {
      results += `\n===Transaction failed: ${ts_result.result.meta.TransactionResult}`
      resultField.value = results     
    }
  }
  catch (error) {
    console.error('Error creating trust line:', error);
    results += `\n===Error: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} //End of createTrustline()
      
// *******************************************************
// *************** Send Issued Currency ******************
// *******************************************************
      
async function sendCurrency() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  resultField.value = results
  await client.connect()
  results += '\nConnected.'
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const send_currency_tx = {
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Amount": {
        "currency": currencyField.value,
        "value": amountField.value,
        "issuer": issuerField.value
      },
      "Destination": destinationField.value
    }
    const pay_prepared = await client.autofill(send_currency_tx)
    const pay_signed = wallet.sign(pay_prepared)
    results += `\n\n===Sending ${amountField.value} ${currencyField.value} to ${destinationField.value} ...`
    resultField.value = results
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\n===Transaction succeeded.'
    resultField.value = results
    getTokenBalance()
  } else {
    results += `\n===Transaction failed: ${pay_result.result.meta.TransactionResult}\n`
    resultField.value = results
  }
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
}
  catch (error) {
    console.error('Error sending transaction:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} // end of sendCurrency()
