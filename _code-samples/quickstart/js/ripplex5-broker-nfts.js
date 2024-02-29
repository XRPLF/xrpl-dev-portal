// *******************************************************
// *******************************************************
// ************** Broker Transactions ********************
// *******************************************************
// *******************************************************

// *******************************************************
// *************** Broker Get Offers *********************
// *******************************************************
      
async function brGetOffers() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  brokerResultField.value = results
  await client.connect()
  results += '\nConnected. Getting offers...'
	brokerResultField.value = results

  results += '\n\n***Sell Offers***\n'  
  let nftSellOffers
  try {
    nftSellOffers = await client.request({
      method: "nft_sell_offers",
      nft_id: brokerTokenIdField.value  
    })
  } catch (err) {
    nftSellOffers = 'No sell offers.'
  }
  results += JSON.stringify(nftSellOffers,null,2)
	brokerResultField.value = results

  results += '\n\n***Buy Offers***\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: brokerTokenIdField.value 
    })
  } catch (err) {
    nftBuyOffers =  'No buy offers.'
  }
  results += JSON.stringify(nftBuyOffers,null,2)    
	brokerResultField.value = results
  client.disconnect()
}// End of brGetOffers()
      
// *******************************************************
// ******************* Broker Sale ***********************
// *******************************************************
      
async function brokerSale() {
	const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
	const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
	const broker_wallet = xrpl.Wallet.fromSeed (brokerSeedField.value)
	let net = getNet()
	const client = new xrpl.Client(net)
	results = 'Connecting to ' + getNet() + '...'
	brokerResultField.value = results
	await client.connect()
	results += '\nConnected. Brokering sale...'
	brokerResultField.value = results

 // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": broker_wallet.classicAddress,
    "NFTokenSellOffer": brokerTokenSellOfferIndexField.value,
    "NFTokenBuyOffer": brokerTokenBuyOfferIndexField.value,
    "NFTokenBrokerFee": brokerBrokerFeeField.value
  }
	// Submit transaction --------------------------------------------------------
	const tx = await client.submitAndWait(transactionBlob,{wallet: broker_wallet}) 

	// Check transaction results -------------------------------------------------
	results += "\n\nTransaction result:\n" + 
			JSON.stringify(tx.result.meta.TransactionResult, null, 2)
	results += "\nBalance changes:\n" +
			JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
	operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
	standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
	brokerBalanceField.value = (await client.getXrpBalance(broker_wallet.address))
	brokerResultField.value = results
	client.disconnect()  
}// End of brokerSale()

// *******************************************************
// ************* Broker Cancel Offer ****************
// *******************************************************

async function brCancelOffer() {
  const wallet = xrpl.Wallet.fromSeed(brokerSeedField.value)
	let net = getNet()
	const client = new xrpl.Client(net)
	results = 'Connecting to ' + getNet() + '...'
  brokerResultField.value = results
  await client.connect()
  results +=  "\nConnected. Cancelling offer..."
  brokerResultField.value = results

  const tokenOfferIDs = [brokerTokenBuyOfferIndexField.value]

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
      nft_id: brokerTokenBuyOfferIndexField.value
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
      nft_id: brokerTokenBuyOfferIndexField.value })
  } catch (err) {
    nftBuyOffers = "No buy offers."
  }
  results += JSON.stringify(nftBuyOffers,null,2)

  // Check transaction results -------------------------------------------------

  results += "\nTransaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  brokerResultField.value = results
  client.disconnect()
}// End of brCancelOffer()

// ***************************************************************************
// ************** Revised Functions ******************************************
// ***************************************************************************

// *******************************************************
// ************* Get Account *****************************
// *******************************************************


async function getAccount(type) {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '....'

  // This uses the default faucet for Testnet/Devnet
  let faucetHost = null

  if (type == 'standby') {
    standbyResultField.value = results
  } 
  if (type == 'operational') {
    operationalResultField.value = results
  }
  if (type == 'broker') {
    brokerResultField.value = results
  }
  await client.connect()

  results += '\nConnected, funding wallet.'
  if (type == 'standby') {
    standbyResultField.value = results
  } 
  if (type == 'operational') {
    operationalResultField.value = results
  }
  if (type == 'broker') {
    brokerResultField.value = results
  }

// -----------------------------------Create and fund a test account wallet
  const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet

  results += '\nGot a wallet.'
  if (type == 'standby') {
    standbyResultField.value = results
  } 
  if (type == 'operational') {
    operationalResultField.value = results
  }
  if (type == 'broker') {
    brokerResultField.value = results
  }

// -----------------------------------Get the current balance.
  const my_balance = (await client.getXrpBalance(my_wallet.address))  
        
  if (type == 'standby') {
    standbyAccountField.value = my_wallet.address
    standbyBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    standbySeedField.value = my_wallet.seed
    results += '\nStandby account created.'
    standbyResultField.value = results
  }
  if (type == 'operational') {
    operationalAccountField.value = my_wallet.address
    operationalSeedField.value = my_wallet.seed
    operationalBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    results += '\nOperational account created.'
    operationalResultField.value = results
  }
  if (type == 'broker') {
    brokerAccountField.value = my_wallet.address
    brokerSeedField.value = my_wallet.seed
    brokerBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    results += '\nBroker account created.'
    brokerResultField.value = results
  }
  // --------------- Capture the seeds for accounts for ease of reload.
  seeds.value = standbySeedField.value + '\n' + operationalSeedField.value + "\n" +
    brokerSeedField.value
  client.disconnect()
} // End of getAccount()

// *******************************************************
// ********** Get Accounts from Seeds ******************** 
// *******************************************************

async function getAccountsFromSeeds() {
	let net = getNet()
	const client = new xrpl.Client(net)
	results = 'Connecting to ' + getNet() + '....'
	standbyResultField.value = results
	await client.connect()
	results += '\nConnected, finding wallets.\n'
	standbyResultField.value = results

	// -----------------------------------Find the test account wallets    
	var lines = seeds.value.split('\n');
	const standby_wallet = xrpl.Wallet.fromSeed(lines[0])
	const operational_wallet = xrpl.Wallet.fromSeed(lines[1])
	const broker_wallet = xrpl.Wallet.fromSeed(lines[2])

	// -----------------------------------Get the current balance.
	const standby_balance = (await client.getXrpBalance(standby_wallet.address))  
	const operational_balance = (await client.getXrpBalance(operational_wallet.address))  
	const broker_balance = (await client.getXrpBalance(broker_wallet.address))  
 
	standbyAccountField.value = standby_wallet.address
	standbyPubKeyField.value = standby_wallet.publicKey
	standbyPrivKeyField.value = standby_wallet.privateKey
	standbySeedField.value = standby_wallet.seed
	standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))

	operationalAccountField.value = operational_wallet.address
	operationalPubKeyField.value = operational_wallet.publicKey
	operationalPrivKeyField.value = operational_wallet.privateKey
	operationalSeedField.value = operational_wallet.seed
	operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

	brokerAccountField.value = broker_wallet.address
	brokerPubKeyField.value = broker_wallet.publicKey
	brokerPrivKeyField.value = broker_wallet.privateKey
	brokerSeedField.value = broker_wallet.seed
	brokerBalanceField.value = (await client.getXrpBalance(broker_wallet.address))

  client.disconnect() 
  getBalances()
} // End of getAccountsFromSeeds()

// *******************************************************
// ****************** Get Balances ***********************
// *******************************************************

async function getBalances() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results

  await client.connect()

  results += '\nConnected.'
  standbyResultField.value = results

  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const broker_wallet = xrpl.Wallet.fromSeed(brokerSeedField.value)

  results = "\nGetting standby account balances...\n"
  const standby_balances = await client.request({
    command: "gateway_balances",
    account: standby_wallet.address,
    ledger_index: "validated",
    hotwallet: [operational_wallet.address]
  })
  results += JSON.stringify(standby_balances.result, null, 2)
  standbyResultField.value = results

  results= "\nGetting operational account balances...\n"
  const operational_balances = await client.request({
    command: "account_lines",
    account: operational_wallet.address,
    ledger_index: "validated"
  })
  results += JSON.stringify(operational_balances.result, null, 2)
  operationalResultField.value = results

  results= "\nGetting broker account balances...\n"
  const broker_balances = await client.request({
    command: "account_lines",
    account: broker_wallet.address,
    ledger_index: "validated"
  })
  results += JSON.stringify(broker_balances.result, null, 2)
  brokerResultField.value = results

  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  brokerBalanceField.value = (await client.getXrpBalance(broker_wallet.address))

  client.disconnect()
} // End of getBalances()