/***********************************
 *********** Create Offer **********
 **********************************/

 async function createOffer() {
  let net = getNet()
  let results = 'Connecting to ' + net + '....\n'
  const client = new xrpl.Client(net)
  await client.connect()
      
  results  += "Connected. Getting wallets.\n"
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  results += accountNameField.value + " account address: " + wallet.address + "\n"
  resultField.value = results


  if (getCurrencyField.value == 'XRP') {
    takerGets = getAmountField.value
  } else {
    takerGetsString = '{"currency": "' + getCurrencyField.value +'",\n' +
        '"issuer": "' + getIssuerField.value + '",\n' +
        '"value": "' + getAmountField.value + '"}'
    takerGets = JSON.parse(takerGetsString)
  }

  if (payCurrencyField.value == 'XRP') {
    takerPays = payAmountField.value
  } else {
    takerPaysString = '{"currency": "' + payCurrencyField.value + '",\n' +
      '"issuer": "' + payIssuerField.value + '",\n' +
      '"value": "' + payAmountField.value + '"}'
    takerPays = JSON.parse(takerPaysString)
  }
 
   // -------------------------------------------------------- Prepare transaction
  const prepared = await client.autofill({
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerGets": takerGets,
    "TakerPays": takerPays
  })   
  // ------------------------------------------------- Sign prepared instructions
  const signed = wallet.sign(prepared)
 results += "\nSubmitting transaction...."
  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  results  += "\nBalance changes: " + 
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  resultField.value = results

  xrpBalanceField.value =  (await client.getXrpBalance(wallet.address))
  getOffers()                 
  client.disconnect()    
} // End of createOffer()

/***********************************
 ************ Get Offers ***********
 **********************************/

async function getOffers() {
  let net = getNet()
  let results = 'Connecting to ' + net + '....\n'
  const client = new xrpl.Client(net)
  await client.connect()
  results  += "Connected.\n"
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  results += accountNameField.value + " account: " + wallet.address
// -------------------------------------------------------- Prepare request

  results += '\n\n*** Offers ***\n'
  let offers
  try {
    const offers = await client.request({
      method: "account_offers",
      account: wallet.address,
      ledger_index: "validated"
    })
    results += JSON.stringify(offers,null,2)
  } catch (err) {
      results += err
  }
  resultField.value = results
  client.disconnect()
}// End of getOffers()

/***********************************
*********** Cancel Offer **********
**********************************/

  async function cancelOffer() {
    let results  = "Connecting to the selected ledger.\n"
    resultField.value = results
    let net = getNet()
    results += 'Connecting to ' + net + '....\n'
    const client = new xrpl.Client(net)
    await client.connect()
        
    results  += "Connected.\n"
    resultField.value = results
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    results += "wallet.address: = " + wallet.address
    resultField.value = results

  // -------------------------------------------------------- Prepare transaction
    /* OfferSequence is the Seq value when you getOffers. */

  const prepared = await client.autofill({
  "TransactionType": "OfferCancel",
  "Account": wallet.address,
  "OfferSequence": parseInt(offerSequenceField.value)
  })

  // ------------------------------------------------- Sign prepared instructions
  const signed = wallet.sign(prepared)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
      
  results  += "\nBalance changes: \n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  resultField.value = results
  xrpBalanceField.value =  (await client.getXrpBalance(wallet.address))
  client.disconnect()    
  } // End of cancelOffer()
