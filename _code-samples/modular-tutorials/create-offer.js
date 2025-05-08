/***********************************
 *********** Create Offer **********
 **********************************/

async function createOffer() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}, getting wallet....===\n`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  try {
    if (getCurrencyField.value == 'XRP') {
      takerGets = xrpl.xrpToDrops(getAmountField.value)
    }
    else {
      takerGetsString = '{"currency": "' + getCurrencyField.value + '",\n' +
        '"issuer": "' + getIssuerField.value + '",\n' +
        '"value": "' + getAmountField.value + '"}'
      takerGets = JSON.parse(takerGetsString)
    }

    if (payCurrencyField.value == 'XRP') {
      takerPays = xrpl.xrpToDrops(payAmountField.value)
    } else {
      takerPaysString = '{"currency": "' + payCurrencyField.value + '",\n' +
        '"issuer": "' + payIssuerField.value + '",\n' +
        '"value": "' + payAmountField.value + '"}'
      takerPays = JSON.parse(takerPaysString)
    }
    const prepared = await client.autofill({
      "TransactionType": "OfferCreate",
      "Account": wallet.address,
      "TakerGets": takerGets,
      "TakerPays": takerPays
    })
    const signed = wallet.sign(prepared)
    const tx = await client.submitAndWait(signed.tx_blob)
    results = '\n\n===Offer created===\n\n' +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value += results
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
  } catch (err) {
    console.error('Error creating offer:', err);
    results = `\nError: ${err.message}\n`
    resultField.value += results
    throw err; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client          
    client.disconnect()
  }
} // End of createOffer()

/***********************************
 ************ Get Offers ***********
 **********************************/

async function getOffers() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ' + ${net}, getting offers....===\n`
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  resultField.value = results
  results += '\n\n=== Offers ===\n'
  let offers
  try {
    offers = await client.request({
      method: "account_offers",
      account: wallet.address,
      ledger_index: "validated"
    })
    results = JSON.stringify(offers, null, 2)
    resultField.value += results
  } catch (err) {
    console.error('Error getting offers:', err);
    results = `\nError: ${err.message}\n`
    resultField.value += results
    throw err; // Re-throw the error to be handled by the caller
  }
  finally {
    client.disconnect()
  }
}// End of getOffers()

/***********************************
*********** Cancel Offer **********
**********************************/
async function cancelOffer() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}, canceling offer.===\n`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  try {
    // OfferSequence is the _seq_ value from getOffers.
    const prepared = await client.autofill({
      "TransactionType": "OfferCancel",
      "Account": wallet.address,
      "OfferSequence": parseInt(offerSequenceField.value)
    })
    const signed = wallet.sign(prepared)
    const tx = await client.submitAndWait(signed.tx_blob)
    results += "\nOffer canceled. Balance changes: \n" +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
  }
  catch (err) {
    console.error('Error canceling offer:', err);
    results = `\nError: ${err.message}\n`
    resultField.value += results
    throw err; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    client.disconnect()
  }
}// End of cancelOffer()
