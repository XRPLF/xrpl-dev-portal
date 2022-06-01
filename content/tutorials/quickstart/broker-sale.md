---
html: broker-sale.html
parent: xrpl-quickstart.html
blurb: Broker a sale between a sell offer and a buy offer.
labels:
  - Accounts
  - Quickstart
  - Broker
  - XRP
---
# Broker a NFToken Sale

Earlier examples showed how to make buy and sell offers directly between two accounts. Another option is to use a third account as a broker for the sale. The broker acts on behalf of the NFToken owner. The seller creates an offer with the broker account as its destination. The broker gathers and evaluates buy offers and chooses which one to accept, adding an agreed-upon fee for arranging the sale. When the broker account matches the sell offer with a buy offer, the funds and ownership of the NFToken are transferred simultaneously, completing the deal. This allows an account to act as a marketplace or personal agent for NFToken creators and traders.

# Usage

This example shows how to:
1. Create a brokered sell offer.
2. Get a list of offers for the brokered item.
3. Broker a sale between two different accounts.

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip) archive to try each of the samples in your own browser.

## Get Accounts

1. Open `5.broker-nfts.html` in a browser.
2. Choose **XLS20-NFT** as your ledger instance.
3. Get test accounts.
    1. If you have existing NFT-Devnet account seeds:
        1. Paste 3 account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have NFT-Devnet account seeds:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.
        3. Click **Get New Broker Account**


## Prepare a Brokered Transaction

1. Use the Standby account to create a NFToken Sell Offer with the Broker account as the destination.
	1. Enter the **Amount** of the sell offer in drops (millionths of an XRP).
	2. Set the **Flags** field to _1_.
	3. Enter the **Token ID** of the NFToken you want to sell.
	4. Optionally, enter a number of days until **Expiration**.
	5. Enter the Broker account number as the **Destination**.
	6. Click **Create Sell Offer**.

2. Use the Operational account to create a NFToken Buy Offer.
	1. Enter the **Amount** of your offer.
	2. Enter the **Token ID**.
	3. Enter the owner’s account string in the **Owner** field.
	4. Optionally enter the number of days until **Expiration**.
	5. Click **Create Buy Offer**.

## Get Offers

1. Enter the **NFToken ID**.
2. Click **Get Offers**.

## Broker the Sale

1. Copy the _nft_offer_index_ of the sell offer and paste it in the **Sell NFToken Offer Index** field.
2. Copy the _nft_offer_index_ of the buy offer and paste it in the **Buy NFToken Offer Index** field.
3. Enter a **Broker Fee**, in drops.
4. Click **Broker Sale**.

## Cancel Offer

After accepting a buy offer, a best practice for the broker is to cancel all other offers, if possible. Use **Get Offers** to get the full list of buy offers. To cancel an offer:

1. Enter the _nft_offer_index_ of the buy offer you want to cancel in the **Buy NFToken Offer Index** field.
2. Click **Cancel Offer**.


# Code Walkthrough

```
// *******************************************************
// *******************************************************
// ************** Broker Transactions ********************
// *******************************************************
// *******************************************************

// *******************************************************
// *************** Broker Get Offers *********************
// *******************************************************
      
async function brGetOffers() {
  const standby_wallet = xrpl.Wallet.fromSeed(brokerSeedField.value)
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  document.getElementById('brokerResultField').value = results
  await client.connect()
  results += '\nConnected. Getting offers...'
  document.getElementById('brokerResultField').value = results

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
  document.getElementById('brokerResultField').value = results

  results += '\n\n***Buy Offers***\n'
  let nftBuyOffers
  try {
    nftBuyOffers = await client.request({
      method: "nft_buy_offers",
      nft_id: brokerTokenIdField.value })
    } catch (err) {
    nftBuyOffers =  'No buy offers.'
  }
  results += JSON.stringify(nftBuyOffers,null,2)    

  document.getElementById('brokerResultField').value = results

  client.disconnect()
  // End of brGetOffers()
}

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
  document.getElementById('brokerResultField').value = results
  await client.connect()
  results += '\nConnected. Brokering sale...'
  document.getElementById('brokerResultField').value = results

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": broker_wallet.classicAddress,
    "NFTokenSellOffer": brokerTokenSellOfferIndexField.value,
    "NFTokenBuyOffer": brokerTokenBuyOfferIndexField.value,
    "Fee": brokerBrokerFeeField.value
  }
  // Submit transaction --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob,{wallet: broker_wallet}) 

  // Check transaction results -------------------------------------------------
  results += "\n\nTransaction result:\n" + 
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  document.getElementById('operationalBalanceField').value = 
    (await client.getXrpBalance(operational_wallet.address))
  document.getElementById('standbyBalanceField').value = 
    (await client.getXrpBalance(standby_wallet.address))
  document.getElementById('brokerBalanceField').value = 
    (await client.getXrpBalance(broker_wallet.address))
  document.getElementById('brokerResultField').value = results
  client.disconnect()

}// End of brokerSale()

// *******************************************************
// ************* Broker Cancel Offer ****************
// *******************************************************

async function brCancelOffer() {

  const wallet = xrpl.Wallet.fromSeed(brokerSeedField.value)
  const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
  results = 'Connecting to ' + getNet() + '...'
  document.getElementById('brokerResultField').value = results
  await client.connect()
  results +=  "\nConnected. Cancelling offer..."
  document.getElementById('brokerResultField').value = results

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
  document.getElementById('brokerResultField').value = results

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
  if(document.getElementById("xls").checked) {
    faucetHost = "faucet-nft.ripple.com"
  } 

  if (type == 'standby') {
    document.getElementById('standbyResultField').value = results
  } 
  if (type == 'operational') {
    document.getElementById('operationalResultField').value = results
  }
  if (type == 'broker') {
    document.getElementById('brokerResultField').value = results
  }
  await client.connect()

  results += '\nConnected, funding wallet.'
  if (type == 'standby') {
    document.getElementById('standbyResultField').value = results
  } 
  if (type == 'operational') {
    document.getElementById('operationalResultField').value = results
  }
  if (type == 'broker') {
    document.getElementById('brokerResultField').value = results
  }

  // -----------------------------------Create and fund a test account wallet
  const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet

  results += '\nGot a wallet.'
  if (type == 'standby') {
    document.getElementById('standbyResultField').value = results
  } 
  if (type == 'operational') {
    document.getElementById('operationalResultField').value = results
  }
  if (type == 'broker') {
    document.getElementById('brokerResultField').value = results
  }

  // -----------------------------------Get the current balance.
  const my_balance = (await client.getXrpBalance(my_wallet.address))  

  if (type == 'standby') {
    document.getElementById('standbyAccountField').value = my_wallet.address
    document.getElementById('standbyPubKeyField').value = my_wallet.publicKey
    document.getElementById('standbyPrivKeyField').value = my_wallet.privateKey
    document.getElementById('standbyBalanceField').value = 
      (await client.getXrpBalance(my_wallet.address))
    document.getElementById('standbySeedField').value = my_wallet.seed
    results += '\nStandby account created.'
    document.getElementById('standbyResultField').value = results
  }
  if (type == 'operational') {
    document.getElementById('operationalAccountField').value = my_wallet.address
    document.getElementById('operationalPubKeyField').value = my_wallet.publicKey
    document.getElementById('operationalPrivKeyField').value = my_wallet.privateKey
    document.getElementById('operationalSeedField').value = my_wallet.seed
    document.getElementById('operationalBalanceField').value = 
      (await client.getXrpBalance(my_wallet.address))
    results += '\nOperational account created.'
    document.getElementById('operationalResultField').value = results
  }
  if (type == 'broker') {
    document.getElementById('brokerAccountField').value = my_wallet.address
    document.getElementById('brokerPubKeyField').value = my_wallet.publicKey
    document.getElementById('brokerPrivKeyField').value = my_wallet.privateKey
    document.getElementById('brokerSeedField').value = my_wallet.seed
    document.getElementById('brokerBalanceField').value = 
      (await client.getXrpBalance(my_wallet.address))
    results += '\nBroker account created.'
    document.getElementById('brokerResultField').value = results
  }
  // --------------- Capture the seeds for accounts for ease of reload.
  document.getElementById('seeds').value = standbySeedField.value + '\n' + operationalSeedField.value + "\n" + brokerSeedField.value
  client.disconnect()
} // End of getAccount()

// *******************************************************
// ********** Get Accounts from Seeds ******************** 
// *******************************************************

async function getAccountsFromSeeds() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('standbyResultField').value = results
  await client.connect()
  results += '\nConnected, finding wallets.\n'
  document.getElementById('standbyResultField').value = results

  // -----------------------------------Find the test account wallets    
  var lines = seeds.value.split('\n');
  const standby_wallet = xrpl.Wallet.fromSeed(lines[0])
  const operational_wallet = xrpl.Wallet.fromSeed(lines[1])
  const broker_wallet = xrpl.Wallet.fromSeed(lines[2])

  // -----------------------------------Get the current balance.
  const standby_balance = (await client.getXrpBalance(standby_wallet.address))  
  const operational_balance = (await client.getXrpBalance(operational_wallet.address))  
  const broker_balance = (await client.getXrpBalance(broker_wallet.address))  
 
  document.getElementById('standbyAccountField').value = standby_wallet.address
  document.getElementById('standbyPubKeyField').value = standby_wallet.publicKey
  document.getElementById('standbyPrivKeyField').value = standby_wallet.privateKey
  document.getElementById('standbySeedField').value = standby_wallet.seed
  document.getElementById('standbyBalanceField').value = 
    (await client.getXrpBalance(standby_wallet.address))

  document.getElementById('operationalAccountField').value = operational_wallet.address
  document.getElementById('operationalPubKeyField').value = operational_wallet.publicKey
  document.getElementById('operationalPrivKeyField').value = operational_wallet.privateKey
  document.getElementById('operationalSeedField').value = operational_wallet.seed
  document.getElementById('operationalBalanceField').value = 
    (await client.getXrpBalance(operational_wallet.address))

  document.getElementById('brokerAccountField').value = broker_wallet.address
  document.getElementById('brokerPubKeyField').value = broker_wallet.publicKey
  document.getElementById('brokerPrivKeyField').value = broker_wallet.privateKey
  document.getElementById('brokerSeedField').value = broker_wallet.seed
  document.getElementById('brokerBalanceField').value = 
    (await client.getXrpBalance(broker_wallet.address))

  client.disconnect()
  getBalances()
	
} // End of getAccountsFromSeeds()

```

---

| Previous      | Next                                                             |
| :---          |                                                             ---: |
| [← 4. Transfer NFTokens → >](transfer-nftokens.html)  |  |
