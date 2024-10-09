/***********************************
 *********** Create Offer **********
 **********************************/

 async function createOffer() {
  let takerGets = ''
  let takerPays = ''
  let net = getNet()
  let results = 'Connecting to ' + net + '....\n'
  const client = new xrpl.Client(net)
  await client.connect()
      
  results  += "Connected. Getting wallets.\n"
  standbyResultField.value = results
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  results += standbyNameField.value + " account address: " + standby_wallet.address + "\n"
  standbyResultField.value = results


  if (standbyTakerGetsCurrencyField.value == 'XRP') {
    takerGets = standbyTakerGetsValueField.value
  } else {
    takerGetsString = '{"currency": "' + standbyTakerGetsCurrencyField.value +'",\n' +
        '"issuer": "' + standbyTakerGetsIssuerField.value + '",\n' +
        '"value": "' + standbyTakerGetsValueField.value + '"}'
    takerGets = JSON.parse(takerGetsString)
  }

  if (standbyTakerPaysCurrencyField.value == 'XRP') {
    takerPays = standbyTakerPaysValueField.value
  } else {
    takerPaysString = '{"currency": "' + standbyTakerPaysCurrencyField.value + '",\n' +
      '"issuer": "' + standbyTakerPaysIssuerField.value + '",\n' +
      '"value": "' + standbyTakerPaysValueField.value + '"}'
    takerPays = JSON.parse(takerPaysString)
  }
 
   // -------------------------------------------------------- Prepare transaction
  const prepared = await client.autofill({
    "TransactionType": "OfferCreate",
    "Account": standby_wallet.address,
    "TakerGets": takerGets,
      "TakerPays": takerPays
  })   
  // ------------------------------------------------- Sign prepared instructions
  const signed = standby_wallet.sign(prepared)
 results += "\nSubmitting transaction...."
  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  
  results += tx.results + "\n"
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results

  standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
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
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  results += standbyNameField.value + " acccount: " + standby_wallet.address
// -------------------------------------------------------- Prepare request

  results += '\n\n*** Offers ***\n'
  let offers
  try {
    const offers = await client.request({
      method: "account_offers",
      account: standby_wallet.address,
      ledger_index: "validated"
    })
    results += JSON.stringify(offers,null,2)
  } catch (err) {
      results += err
  }
  results += JSON.stringify(offers,null,2)
  standbyResultField.value = results
  client.disconnect()
}// End of getOffers()

/***********************************
*********** Cancel Offer **********
**********************************/

  async function cancelOffer() {
    let results  = "Connecting to the selected ledger.\n"
    standbyResultField.value = results
    let net = getNet()
    results += 'Connecting to ' + net + '....\n'
    const client = new xrpl.Client(net)
    await client.connect()
        
    results  += "Connected.\n"
    standbyResultField.value = results
    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
    const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
    results += "standby_wallet.address: = " + standby_wallet.address
    standbyResultField.value = results

  // -------------------------------------------------------- Prepare transaction
    /* OfferSequence is the Seq value when you getOffers. */

  const prepared = await client.autofill({
  "TransactionType": "OfferCancel",
  "Account": standby_wallet.address,
  "OfferSequence": parseInt(standbyOfferSequenceField.value)
  })

  // ------------------------------------------------- Sign prepared instructions
  const signed = standby_wallet.sign(prepared)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
      
  results  += "\nBalance changes: \n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results

  standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
  client.disconnect()    
  } // End of cancelOffer()

  /*********************************************
  ************* Reciprocal Functions **********
  ********************************************/

  /***********************************
   ********* OP Create Offer *********
    **********************************/

    async function oPcreateOffer() {
    let takerGets = ''
    let takerPays = ''

      operationalResultField.value = ''
      let net = getNet()
      let results = 'Connecting to ' + net + '....\n'
      const client = new xrpl.Client(net)
      await client.connect()
          
      results  += "Connected. Getting wallets.\n"
      operationalResultField.value = results
      const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
      const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
      results += operationalNameField.value + " account address: " + operational_wallet.address + "\n"
      operationalResultField.value = results


    if (operationalTakerGetsCurrencyField.value == 'XRP') {
      takerGets = operationalTakerGetsValueField.value
    } else {
      takerGetsString = '{"currency": "' + operationalTakerGetsCurrencyField.value +'",\n' +
          '"issuer": "' + operationalTakerGetsIssuerField.value + '",\n' +
          '"value": "' + operationalTakerGetsValueField.value + '"}'
      takerGets = JSON.parse(takerGetsString)
    }

    if (operationalTakerPaysCurrencyField.value == 'XRP') {
      takerPays = operationalTakerPaysValueField.value
    } else {
      takerPaysString = '{"currency": "' + operationalTakerPaysCurrencyField.value + '",\n' +
        '"issuer": "' + operationalTakerPaysIssuerField.value + '",\n' +
        '"value": "' + operationalTakerPaysValueField.value + '"}'
      takerPays = JSON.parse(takerPaysString)
    }
    
      // -------------------------------------------------------- Prepare transaction
    const prepared = await client.autofill({
      "TransactionType": "OfferCreate",
      "Account": operational_wallet.address,
      "TakerGets": takerGets,
      "TakerPays": takerPays
    })   
    // ------------------------------------------------- Sign prepared instructions
    const signed = operational_wallet.sign(prepared)
    results += "\nSubmitting transaction...."
    // -------------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(signed.tx_blob)
    
    results += tx.results + "\n"
    results  += "\nBalance changes: " + 
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
      operationalResultField.value = results

    standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
    operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
    getOffers()                 
    client.disconnect()    
  } // End of oPcreateOffer()

  /***********************************
  ********** OP Get Offers ***********
  ***********************************/

async function oPgetOffers() {
  let results  = "Connecting to the selected ledger.\n"
  operationalResultField.value = results
  let net = getNet()
  results = 'Connecting to ' + net + '....\n'
  const client = new xrpl.Client(net)
  await client.connect()
      
  results  += "Connected.\n"
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  results += operationalNameField.value + " account: " + operational_wallet.address
  operationalResultField.value = results   

  // -------------------------------------------------------- Prepare request

  results += '\n\n*** Offers ***\n'
  let offers
  try {
    const offers = await client.request({
      method: "account_offers",
      account: operational_wallet.address,
      ledger_index: "validated"
    })
    results += JSON.stringify(offers,null,2)
  } catch (err) {
      results += err
  }
  results += JSON.stringify(offers,null,2)
  operationalResultField.value = results
  client.disconnect()
}// End of oPgetOffers()

/************************************
 ********** Op Cancel Offer *********
 ***********************************/

async function oPcancelOffer() {
    let net = getNet()
    let results = 'Connecting to ' + net + '....\n'
    const client = new xrpl.Client(net)
    await client.connect()
        
    results  += "Connected.\n"
    const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
    results += "wallet.address: = " + operational_wallet.address
    operationalResultField.value = results
  
  // -------------------------------------------------------- Prepare transaction
  
  /* OfferSequence is the Seq value when you getOffers. */
  const prepared = await client.autofill({
  "TransactionType": "OfferCancel",
  "Account": operational_wallet.address,
  "OfferSequence": parseInt(operationalOfferSequenceField.value)
})
  
// ------------------------------------------------- Sign prepared instructions
  const signed = operational_wallet.sign(prepared)
  
// -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
      
  results  += "\nBalance changes: \n" + tx.result + "\n" +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results

  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))                 
  client.disconnect()    
} // End of oPcancelOffer()