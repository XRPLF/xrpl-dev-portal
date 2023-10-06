// *******************************************************
// ****************** Create Sell Offer ******************
// *******************************************************
      
async function createSellOffer() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Creating sell offer...'
  standbyResultField.value = results
  
  //------------------------------------- Prepare Expiration Date
  var expirationDate = null
  if (standbyExpirationField.value !="") {
    var days = standbyExpirationField.value
    let d = new Date()
    d.setDate(d.getDate() + parseInt(days))
    expirationDate = xrpl.isoTimeToRippleTime(d)
  }
  // Prepare transaction -------------------------------------------------------
  let transactionBlob = {
    "TransactionType": "NFTokenCreateOffer",
    "Account": standby_wallet.classicAddress,
    "NFTokenID": standbyTokenIdField.value,
    "Amount": standbyAmountField.value,
    "Flags": parseInt(standbyFlagsField.value),
  }
  if (expirationDate != null) {
    transactionBlob.Expiration = expirationDate
  }
  if(standbyDestinationField.value !== '') {
    transactionBlob.Destination = standbyDestinationField.value
  }

// Submit transaction --------------------------------------------------------

  const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet})

  results += '\n\n***Sell Offers***\n'

  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: standbyTokenIdField.value})
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  results += JSON.stringify(nftSellOffers,null,2)
  results += '\n\n***Buy Offers***\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: standbyTokenIdField.value })
      results += JSON.stringify(nftBuyOffers,null,2)
  } catch (err) {
    results += 'No buy offers.'
  }

// Check transaction results -------------------------------------------------
  results += '\n\nTransaction result:\n' + 
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += '\n\nBalance changes:\n' + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  standbyResultField.value = results
  client.disconnect()
}// End of createSellOffer()
      
// *******************************************************
// ***************** Create Buy Offer ********************
// *******************************************************

async function createBuyOffer() {

  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  let results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results = '\nConnected. Creating buy offer...'
  standbyResultField.value = results

  //------------------------------------- Prepare Expiration Date
  var expirationDate = null
  if (standbyExpirationField.value !="") {
    var days = standbyExpirationField.value
    let d = new Date()
    d.setDate(d.getDate() + parseInt(days))
    var expirationDate = xrpl.isoTimeToRippleTime(d)
  }

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenCreateOffer",
    "Account": standby_wallet.classicAddress,
    "Owner": standbyOwnerField.value,
    "NFTokenID": standbyTokenIdField.value,
    "Amount": standbyAmountField.value,
    "Flags": null
  }
  if (expirationDate != null) {
    transactionBlob.Expiration = expirationDate
  }

  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet})

  results += "\n\n***Sell Offers***\n"
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: standbyTokenIdField.value })
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  results += JSON.stringify(nftSellOffers,null,2)
  results += "\n\n***Buy Offers***\n"
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
    method: "nft_buy_offers",
    nft_id: standbyTokenIdField.value })
    results += JSON.stringify(nftBuyOffers,null,2)
  } catch (err) {
    results += "No buy offers."
  }

  // Check transaction results -------------------------------------------------
  results += "\n\nTransaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\n\nBalance changes:\n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results

  client.disconnect()
}// End of createBuyOffer()
      
// *******************************************************
// ******************** Cancel Offer *********************
// *******************************************************

async function cancelOffer() {    
  const wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...' + standbyResultField.value
  await client.connect()
  results +=  "\nConnected. Cancelling offer..."
  standbyResultField.value = results

  const tokenOfferIDs = [standbyTokenOfferIndexField.value]

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenCancelOffer",
    "Account": wallet.classicAddress,
    "NFTokenOffers": tokenOfferIDs
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet})

  results += "\n\n***Sell Offers***\n"
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: standbyTokenIdField.value
    })
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  results += JSON.stringify(nftSellOffers,null,2)
  results += "\n\n***Buy Offers***\n"
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: standbyTokenIdField.value
    })
    results += JSON.stringify(nftBuyOffers,null,2)
  } catch (err) {
    nftBuyOffers = "No buy offers."
  }

  // Check transaction results -------------------------------------------------

  results += "\nTransaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results

  client.disconnect() // End of cancelOffer()
}

// *******************************************************
// ******************** Get Offers ***********************
// *******************************************************

async function getOffers() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Getting offers...'
  standbyResultField.value = results

  results += '\n\n***Sell Offers***\n'
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: standbyTokenIdField.value
    })
  } catch (err) {
      nftSellOffers = 'No sell offers.'
  }
  results += JSON.stringify(nftSellOffers,null,2)
  standbyResultField.value = results

  results += '\n\n***Buy Offers***\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: standbyTokenIdField.value 
    })
  } catch (err) {
    nftBuyOffers =  'No buy offers.'
  }
  results += JSON.stringify(nftBuyOffers,null,2)
  standbyResultField.value = results

  client.disconnect()
}// End of getOffers()
      
// *******************************************************
// ****************** Accept Sell Offer ******************
// *******************************************************

async function acceptSellOffer() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Accepting sell offer...\n\n'
  standbyResultField.value = results

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": standby_wallet.classicAddress,
    "NFTokenSellOffer": standbyTokenOfferIndexField.value,
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet}) 
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress
  })

  // Check transaction results -------------------------------------------------

  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

  results += 'Transaction result:\n'
  results +=  JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += '\nBalance changes:'
  results +=  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  results += JSON.stringify(nfts,null,2)
  standbyResultField.value = results

  client.disconnect()
}// End of acceptSellOffer()

// *******************************************************
// ******************* Accept Buy Offer ******************
// *******************************************************

async function acceptBuyOffer() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected. Accepting buy offer...'
  standbyResultField.value = results

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": standby_wallet.classicAddress,
    "NFTokenBuyOffer": standbyTokenOfferIndexField.value
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: standby_wallet}) 
  const nfts = await client.request({
    method: "account_nfts",
    account: standby_wallet.classicAddress  
  })
  results += JSON.stringify(nfts,null,2)
  standbyResultField.value = results

  // Check transaction results -------------------------------------------------
  results += "\n\nTransaction result:\n" + 
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalBalanceField.value = 
    (await client.getXrpBalance(operational_wallet.address))
  standbyBalanceField.value = 
    (await client.getXrpBalance(standby_wallet.address))
  standbyResultField.value = results
  client.disconnect()
}// End of acceptBuyOffer()

// **********************************************************************
// ****** Reciprocal Transactions ***************************************
// **********************************************************************
      
// *******************************************************
// *********** Operational Create Sell Offer *************
// *******************************************************

async function oPcreateSellOffer() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  operationalResultField.value = results
    await client.connect()
  results += '\nConnected. Creating sell offer...'
  operationalResultField.value = results

  //------------------------------------- Prepare Expiration Date
  var expirationDate = null
  if (operationalExpirationField.value !="") {
    var days = operationalExpirationField.value
    let d = new Date()
    d.setDate(d.getDate() + parseInt(days))
    var expirationDate = xrpl.isoTimeToRippleTime(d)
  }
  // Prepare transaction -------------------------------------------------------
  let transactionBlob = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": operational_wallet.classicAddress,
      "NFTokenID": operationalTokenIdField.value,
      "Amount": operationalAmountField.value,
      "Flags": parseInt(operationalFlagsField.value)
  }
  if (expirationDate != null) {
    transactionBlob.Expiration = expirationDate
  }
  if(standbyDestinationField.value !== '') {
    transactionBlob.Destination = operationalDestinationField.value
  }

  // Submit transaction --------------------------------------------------------

  const tx = await client.submitAndWait(transactionBlob,{wallet: operational_wallet})

  results += '\n\n***Sell Offers***\n'

  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: operationalTokenIdField.value  
    })
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  results += JSON.stringify(nftSellOffers,null,2)
  results += '\n\n***Buy Offers***\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: operationalTokenIdField.value
    })
    results += JSON.stringify(nftBuyOffers,null,2)
  } catch (err) {
    results += 'No buy offers.'
  }

  // Check transaction results -------------------------------------------------
  results += '\n\nTransaction result:\n' + 
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += '\n\nBalance changes:\n' + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalBalanceField.value = 
    (await client.getXrpBalance(operational_wallet.address))
  standbyBalanceField.value = 
    (await client.getXrpBalance(standby_wallet.address))
  operationalResultField.value = results

  client.disconnect()
}  // End of oPcreateSellOffer()

// *******************************************************
// ************** Operational Create Buy Offer ***********
// *******************************************************

async function oPcreateBuyOffer() {

  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  let results = 'Connecting to ' + net + '...'
  operationalResultField.value = results
  await client.connect()
  results = '\nConnected. Creating buy offer...'
  operationalResultField.value = results

  //------------------------------------- Prepare Expiration Date
  var expirationDate = null
  if (operationalExpirationField.value !="") {
    var days = operationalExpirationField.value
    let d = new Date()
    d.setDate(d.getDate() + parseInt(days))
    var expirationDate = xrpl.isoTimeToRippleTime(d)
  }

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenCreateOffer",
    "Account": operational_wallet.classicAddress,
    "Owner": operationalOwnerField.value,
    "NFTokenID": operationalTokenIdField.value,
    "Amount": operationalAmountField.value,
    "Flags": null,
  }
  if (expirationDate != null) {
    transactionBlob.Expiration = expirationDate
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: operational_wallet})

  results += "\n\n***Sell Offers***\n"
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: operationalTokenIdField.value  
    })
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  results += JSON.stringify(nftSellOffers,null,2)
  results += "\n\n***Buy Offers***\n"
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: operationalTokenIdField.value
    })
  } catch (err) {
    results += "No buy offers."
  }
  results += JSON.stringify(nftBuyOffers,null,2)

  // Check transaction results -------------------------------------------------
  results += "\n\nTransaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\n\nBalance changes:\n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results

  client.disconnect()
}// End of oPcreateBuyOffer()

// *******************************************************
// ************* Operational Cancel Offer ****************
// *******************************************************

async function oPcancelOffer() {

  const wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  operationalResultField.value = results
  await client.connect()
  results +=  "\nConnected. Cancelling offer..."
  operationalResultField.value = results

  const tokenOfferIDs = [operationalTokenOfferIndexField.value]

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenCancelOffer",
    "Account": wallet.classicAddress,
    "NFTokenOffers": tokenOfferIDs
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet})

  results += "\n\n***Sell Offers***\n"
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: operationalTokenIdField.value
    })
  } catch (err) {
    nftSellOffers = "No sell offers."
  }
  results += JSON.stringify(nftSellOffers,null,2)
  results += "\n\n***Buy Offers***\n"
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: operationalTokenIdField.value
    })
  } catch (err) {
    nftBuyOffers = "No buy offers."
  }
  results += JSON.stringify(nftBuyOffers,null,2)

  // Check transaction results -------------------------------------------------

  results += "\nTransaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results

  client.disconnect()
}// End of oPcancelOffer()

// *******************************************************
// **************** Operational Get Offers ***************
// *******************************************************

async function oPgetOffers() {
//  const standby_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Getting offers...'

  results += '\n\n***Sell Offers***\n'

  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: operationalTokenIdField.value
    })
  } catch (err) {
    nftSellOffers = 'No sell offers.'
  }
  results += JSON.stringify(nftSellOffers,null,2)

  results += '\n\n***Buy Offers***\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: operationalTokenIdField.value
    })
  } catch (err) {
    nftBuyOffers =  'No buy offers.'
  }
  results += JSON.stringify(nftBuyOffers,null,2)  
  operationalResultField.value = results

  client.disconnect()
}// End of oPgetOffers()

// *******************************************************
// *************** Operational Accept Sell Offer *********
// *******************************************************

async function oPacceptSellOffer() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Accepting sell offer...\n\n'
  operationalResultField.value = results

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": operational_wallet.classicAddress,
    "NFTokenSellOffer": operationalTokenOfferIndexField.value,
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: operational_wallet}) 
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })

  // Check transaction results -------------------------------------------------

  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

  results += 'Transaction result:\n'
  results +=  JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += '\nBalance changes:'
  results +=  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  results += JSON.stringify(nfts,null,2)   
  operationalResultField.value = results    
  client.disconnect()
}// End of acceptSellOffer()

// *******************************************************
// ********* Operational Accept Buy Offer ****************
// *******************************************************

async function oPacceptBuyOffer() {
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '...'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected. Accepting buy offer...'
  operationalResultField.value = results

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": operational_wallet.classicAddress,
    "NFTokenBuyOffer": operationalTokenOfferIndexField.value
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: operational_wallet}) 
  const nfts = await client.request({
    method: "account_nfts",
    account: operational_wallet.classicAddress
  })
  results += JSON.stringify(nfts,null,2)
  operationalResultField.value = results

  // Check transaction results -------------------------------------------------
  results += "\n\nTransaction result:\n" + 
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalBalanceField.value = 
    (await client.getXrpBalance(operational_wallet.address))
  operationalBalanceField.value = 
    (await client.getXrpBalance(standby_wallet.address))
  operationalResultField.value = results
  client.disconnect()
}// End of acceptBuyOffer()