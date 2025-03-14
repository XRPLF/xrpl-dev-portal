---
html: broker-an-nft-sale-using-javascript.html
parent: nfts-using-javascript.html
seo:
    description: Broker a sale between a sell offer and a buy offer.
labels:
  - Accounts
  - Quickstart
  - Broker
  - XRP
---
# Broker an NFT Sale Using JavaScript

Earlier examples showed how to make buy and sell offers directly between two accounts. Another option is to use a third account as a broker for the sale. The broker acts on behalf of the NFT owner. The seller creates an offer with the broker account as its destination. The broker gathers and evaluates buy offers and chooses which one to accept, adding an agreed-upon fee for arranging the sale. When the broker account accepts a sell offer with a buy offer, the funds and ownership of the NFT are transferred simultaneously, completing the deal. This allows an account to act as a marketplace or personal agent for NFT creators and traders.

# Usage

This example shows how to:

1. Create a brokered sell offer.
2. Get a list of offers for the brokered item.
3. Broker a sale between two different accounts.

[![Quickstart form with Broker Account](/docs/img/quickstart21.png)](/docs/img/quickstart21.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) archive to try each of the samples in your own browser.

## Get Accounts

1. Open `5.broker-nfts.html` in a browser.
2. Choose your ledger instance.
3. Get test accounts.
    1. If you have existing account seeds:
        1. Paste 3 account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have account seeds:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.
        3. Click **Get New Broker Account**

[![Quickstart form with Account Information](/docs/img/quickstart22.png)](/docs/img/quickstart22.png)

## Prepare a Brokered Transaction

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Xm-JKplBdSU?si=qOWo7vwhI4GQlErk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

1. Use the Standby account to create an NFT Sell Offer with the Broker account as the destination.
    1. Enter the **Amount** of the sell offer in drops (millionths of an XRP).
    2. Set the **Flags** field to _1_.
    3. Enter the **NFT ID** of the NFT you want to sell.
    4. Optionally, enter a number of days until **Expiration**.
    5. Enter the Broker account number as the **Destination**.
    6. Click **Create Sell Offer**.


[![Sell Offer with Destination](/docs/img/quickstart23.png)](/docs/img/quickstart23.png)

2. Use the Operational account to create an NFT Buy Offer.
    1. Enter the **Amount** of your offer.
    2. Enter the **NFT ID**.
    3. Enter the owner’s account string in the **Owner** field.
    4. Optionally enter the number of days until **Expiration**.
    5. Click **Create Buy Offer**.

[![Buy Offer](/docs/img/quickstart24.png)](/docs/img/quickstart24.png)

## Get Offers

1. Enter the **NFT ID**.
2. Click **Get Offers**.

[![Get Offers](/docs/img/quickstart25.png)](/docs/img/quickstart25.png)

## Broker the Sale

1. Copy the _nft_offer_index_ of the sell offer and paste it in the **Sell NFT Offer Index** field.
2. Copy the _nft_offer_index_ of the buy offer and paste it in the **Buy NFT Offer Index** field.
3. Enter a **Broker Fee**, in drops.
4. Click **Broker Sale**.

[![Brokered Sale](/docs/img/quickstart26.png)](/docs/img/quickstart26.png)


## Cancel Offer

After accepting a buy offer, a best practice for the broker is to cancel all other offers, if the broker has permissions to do so. Use **Get Offers** to get the full list of buy offers. To cancel an offer:

1. Enter the _nft_offer_index_ of the buy offer you want to cancel in the **Buy NFT Offer Index** field.
2. Click **Cancel Offer**.

[![Cancel Offer](/docs/img/quickstart27.png)](/docs/img/quickstart27.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) archive to examine the code samples.

## ripplex5-broker-nfts.js
<!-- SPELLING_IGNORE: ripplex5 -->

This script has new functions for brokered transactions and revised functions to support a third account on the same screen.

## Broker Get Offers

```javascript      
// *******************************************************
// *************** Broker Get Offers *********************
// *******************************************************
      
async function brGetOffers() {
```

Connect to the ledger.

```javascript      
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '...'
  brokerResultField.value = results
  await client.connect()
  results += '\nConnected. Getting offers...'
    brokerResultField.value = results
```

Request the list of sell offers for the token.

```javascript      
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
```

Request the list of buy offers for the token.

```javascript      
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
```

Disconnect from the ledger.

```javascript      
  client.disconnect()  
}// End of brGetOffers()
```

## Broker Sale

```javascript      
async function brokerSale() {
```

Connect to the ledger and get the accounts.

```javascript      
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
```

Prepare the transaction. The difference between a brokered sale and a direct sale is that you provide both a sell offer and a buy offer, with an agreed-upon broker's fee. 

```javascript      
  const transactionBlob = {
    "TransactionType": "NFTokenAcceptOffer",
    "Account": broker_wallet.classicAddress,
    "NFTokenSellOffer": brokerTokenSellOfferIndexField.value,
    "NFTokenBuyOffer": brokerTokenBuyOfferIndexField.value,
    "NFTokenBrokerFee": brokerBrokerFeeField.value
  }
```
  
  Submit the transaction and wait for the results.
  
```javascript      
  const tx = await client.submitAndWait(transactionBlob,{wallet: broker_wallet}) 
```

Report the results.

```javascript      
    results += "\n\nTransaction result:\n" + 
            JSON.stringify(tx.result.meta.TransactionResult, null, 2)
    results += "\nBalance changes:\n" +
            JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
    standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
    brokerBalanceField.value = (await client.getXrpBalance(broker_wallet.address))
    brokerResultField.value = results
```

Disconnect from the ledger.

```javascript      
  client.disconnect()
}// End of brokerSale()
```

## Broker Cancel Offer

```javascript
// *******************************************************
// ************* Broker Cancel Offer ****************
// *******************************************************


async function brCancelOffer() {
```

Get the broker account and connect to the ledger. 

```javascript      
  const wallet = xrpl.Wallet.fromSeed(brokerSeedField.value)
    let net = getNet()
    const client = new xrpl.Client(net)
    results = 'Connecting to ' + getNet() + '...'
  brokerResultField.value = results
  await client.connect()
  results +=  "\nConnected. Cancelling offer..."
  brokerResultField.value = results
```

The Token ID must be converted to an array.

```javascript      
  const tokenOfferIDs = [brokerTokenBuyOfferIndexField.value]
```

Prepare the transaction.

```javascript      
  const transactionBlob = {
    "TransactionType": "NFTokenCancelOffer",
    "Account": wallet.classicAddress,
    "NFTokenOffers": tokenOfferIDs
  }
```

Submit the transaction and wait for the results.

```javascript      
  const tx = await client.submitAndWait(transactionBlob,{wallet})
```

Get the sell offers and report the results.

```javascript      
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
```

Get the buy offers and report the results.

```javascript      
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
```

Report the transaction results.

```javascript      
  results += "\nTransaction result:\n" +
    JSON.stringify(tx.result.meta.TransactionResult, null, 2)
  results += "\nBalance changes:\n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  document.getElementById('brokerResultField').value = results
```

Disconnect from the ledger.

```javascript      
  client.disconnect()
}// End of brCancelOffer()
```
## Get Account

To accommodate the broker account, override the `getAccount(type)` function to watch for the _broker_ type. 

```javascript      
// ***************************************************************************
// ************** Revised Functions ******************************************
// ***************************************************************************

// *******************************************************
// ************* Get Account *****************************
// *******************************************************


async function getAccount(type) {
```

Connect to the ledger.

```javascript      
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '....'
```

Get the correct network host.

```javascript      
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '....'
  
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
```

Connect to the ledger.

```javascript      
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
```

Create and fund a test account and report progress.

```javascript      
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
```

Get the XRP balance for the new account.

```javascript      
  const my_balance = (await client.getXrpBalance(my_wallet.address))  
```

Populate the form fields for the appropriate account with the new account information.

```javascript      
  if (type == 'standby') {
    standbyAccountField.value = my_wallet.address
    standbyPubKeyField.value = my_wallet.publicKey
    standbyPrivKeyField.value = my_wallet.privateKey
    standbyBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    standbySeedField.value = my_wallet.seed
    results += '\nStandby account created.'
    standbyResultField.value = results
  }
  if (type == 'operational') {
    operationalAccountField.value = my_wallet.address
    operationalPubKeyField.value = my_wallet.publicKey
    operationalPrivKeyField.value = my_wallet.privateKey
    operationalSeedField.value = my_wallet.seed
    operationalBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    results += '\nOperational account created.'
    operationalResultField.value = results
  }
  if (type == 'broker') {
    brokerAccountField.value = my_wallet.address
    brokerPubKeyField.value = my_wallet.publicKey
    brokerPrivKeyField.value = my_wallet.privateKey
    brokerSeedField.value = my_wallet.seed
    brokerBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    results += '\nBroker account created.'
    brokerResultField.value = results
  }
```

Add the new account seed to corresponding line in the **Account Seeds** field.

```javascript      
  seeds.value = standbySeedField.value + '\n' + operationalSeedField.value + "\n" +
    brokerSeedField.value
```

Disconnect from the ledger.

```javascript      
  client.disconnect()
} // End of getAccount()
```

## Get Accounts from Seeds

Override the `getAccountsFromSeeds()` function to include the broker account fields.

```javascript      
async function getAccountsFromSeeds() {
```

Connect to the ledger.

```javascript      
    let net = getNet()
    const client = new xrpl.Client(net)
    results = 'Connecting to ' + getNet() + '....'
    standbyResultField.value = results
    await client.connect()
    results += '\nConnected, finding wallets.\n'
    standbyResultField.value = results
```

Use the `split` function to parse the values from the **Seeds** field.

```javascript      
  var lines = seeds.value.split('\n');
```

Derive the accounts from the seed values.

```javascript      
  const standby_wallet = xrpl.Wallet.fromSeed(lines[0])
  const operational_wallet = xrpl.Wallet.fromSeed(lines[1])
  const broker_wallet = xrpl.Wallet.fromSeed(lines[2])
```

Get the XRP balances for the accounts.

```javascript      
  const standby_balance = (await client.getXrpBalance(standby_wallet.address))  
  const operational_balance = (await client.getXrpBalance(operational_wallet.address))  
  const broker_balance = (await client.getXrpBalance(broker_wallet.address))  
```

Populate the form fields based on the account values. 

```javascript      
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
```

Disconnect from the ledger.

```javascript      
  client.disconnect()
```

Use the `getBalances()` function to get the current balances of fiat currency.

```javascript      
  getBalances()
    
} // End of getAccountsFromSeeds()
```

## Get Balances

Override the `getBalances()` function to include the broker balance.

```javascript      
// *******************************************************
// ****************** Get Balances ***********************
// *******************************************************

async function getBalances() {
```

Connect with the ledger. 

```javascript      
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('standbyResultField').value = results

  await client.connect()

  results += '\nConnected.'
  document.getElementById('standbyResultField').value = results
```

Derive each of the three accounts.

```javascript      
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const broker_wallet = xrpl.Wallet.fromSeed(brokerSeedField.value)
```

Get and report the Standby account balances.

```javascript      
  results = "\nGetting standby account balances...\n"
  const standby_balances = await client.request({
    command: "gateway_balances",
    account: standby_wallet.address,
    ledger_index: "validated",
    hotwallet: [operational_wallet.address]
  })
  results += JSON.stringify(standby_balances.result, null, 2)
  standbyResultField.value = results
```

Get and report the Operational account balances.

```javascript      
  results= "\nGetting operational account balances...\n"
  const operational_balances = await client.request({
    command: "account_lines",
    account: operational_wallet.address,
    ledger_index: "validated"
  })
  results += JSON.stringify(operational_balances.result, null, 2)
  operationalResultField.value = results
```

Get and report the Broker account balances.

```javascript      
  results= "\nGetting broker account balances...\n"
  const broker_balances = await client.request({
    command: "account_lines",
    account: broker_wallet.address,
    ledger_index: "validated"
  })
  results += JSON.stringify(broker_balances.result, null, 2)
  brokerResultField.value = results
```

Update the XRP balances for the three accounts.

```javascript      
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  brokerBalanceField.value = (await client.getXrpBalance(broker_wallet.address))
```

Disconnect from the ledger.

```javascript      
  client.disconnect()
} // end of getBalances()
```

## 5.broker-nfts.html

Revise the HTML form to add a new Broker section at the top.

```html
<html>
  <head>
    <title>Token Test Harness</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <style>
       body{font-family: "Work Sans", sans-serif;padding: 20px;background: #fafafa;}
       h1{font-weight: bold;}
       input, button {padding: 6px;margin-bottom: 8px;}
       button{font-weight: bold;font-family: "Work Sans", sans-serif;}
       td{vertical-align: middle;}
    </style>
    <script src='https://unpkg.com/xrpl@2.7.0/build/xrpl-latest-min.js'></script>
    <script src='ripplex1-send-xrp.js'></script>
    <script src='ripplex2-send-currency.js'></script>
    <script src='ripplex3-mint-nfts.js'></script>
    <script src='ripplex4-transfer-nfts.js'></script>
    <script src='ripplex5-broker-nfts.js'></script>
    <script>
      if (typeof module !== "undefined") {
        const xrpl = require('xrpl')
      }
    </script>

<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->

  <body>
    <h1>Token Test Harness</h1>
    <form id="theForm">
      Choose your ledger instance:
      &nbsp;&nbsp;
      <input type="radio" id="tn" name="server"
        value="wss://s.altnet.rippletest.net:51233" checked>
      <label for="testnet">Testnet</label>
      &nbsp;&nbsp;
      <input type="radio" id="dn" name="server"
        value="wss://s.devnet.rippletest.net:51233">
      <label for="devnet">Devnet</label>
      <br/><br/>
      <button type="button" onClick="getAccountsFromSeeds()">Get Accounts From Seeds</button>
      <br/>
      <textarea id="seeds" cols="40" rows= "3"></textarea>
      <br/><br/>
        <table align="center">
          <tr valign="top">
            <td>
              <button type="button" onClick="getAccount('broker')">Get New Broker Account</button>
            </td>
          </tr>
          <tr valign="top">
            <td align="right">
              Broker Account
            </td>
            <td>
              <input type="text" id="brokerAccountField" size="40"></input>
              <button type="button" id="another" onclick="brokerSale()">Broker Sale</button>
            </td>
            <td rowspan="7">
            <textarea id="brokerResultField" cols="40" rows="12"></textarea>
            </td>
          </tr>
          <tr>
            <td align="right">
              Public Key
            </td>
            <td>
              <input type="text" id="brokerPubKeyField" size="40"></input>
              <button type="button" onClick="brGetOffers()">Get Offers</button>
              <br>
            </td>
          </tr>
          <tr>
            <td align="right">
              Private Key
            </td>
            <td>
              <input type="text" id="brokerPrivKeyField" size="40"></input>
              <button type="button" onClick="brCancelOffer()">Cancel Offer</button>
              <br>
            </td>
          </tr>
          <tr>
            <td align="right">
              Seed
              <br>
            </td>
            <td>
              <input type="text" id="brokerSeedField" size="40"></input>
            </td>
          </tr>
          <tr>
            <td align="right">
              XRP Balance
            </td>
            <td>
              <input type="text" id="brokerBalanceField" size="40"></input>
              <br>
            </td>
          </tr>
          <tr>
            <td align="right">
              Amount
            </td>
            <td>
              <input type="text" id="brokerAmountField" size="40"></input>
              <br>
            </td>
          </tr>
          <tr>
            <td align="right">NFT ID</td>
            <td><input type="text" id="brokerTokenIdField" value="" size="80"/></td>
          </tr>
          <tr>
            <td align="right">Sell NFT Offer Index</td>
            <td><input type="text" id="brokerTokenSellOfferIndexField" value="" size="80"/></td>
          </tr>
          <tr>
            <td align="right">Buy NFT Offer Index</td>
            <td><input type="text" id="brokerTokenBuyOfferIndexField" value="" size="80"/></td>
          </tr>
          <tr>
            <td align="right">Owner</td>
            <td><input type="text" id="brokerOwnerField" value="" size="80"/></td>
          </tr>
          <tr>
            <td align="right">Broker Fee</td>
            <td><input type="text" id="brokerBrokerFeeField" value="" size="80"/></td>
          </tr>
        </table>
        <br/><br/>
      <table>
        <tr valign="top">
          <td>
            <table>
              <tr valign="top">
                <td>
                <td>
                  <button type="button" onClick="getAccount('standby')">Get New Standby Account</button>
                  <table>
                    <tr valign="top">
                      <td align="right">
                        Standby Account
                      </td>
                      <td>
                        <input type="text" id="standbyAccountField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Public Key
                      </td>
                      <td>
                        <input type="text" id="standbyPubKeyField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Private Key
                      </td>
                      <td>
                        <input type="text" id="standbyPrivKeyField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Seed
                      </td>
                      <td>
                        <input type="text" id="standbySeedField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        XRP Balance
                      </td>
                      <td>
                        <input type="text" id="standbyBalanceField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Amount
                      </td>
                      <td>
                        <input type="text" id="standbyAmountField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr valign="top">
                      <td><button type="button" onClick="configureAccount('standby',document.querySelector('#standbyDefault').checked)">Configure Account</button></td>
                      <td>
                        <input type="checkbox" id="standbyDefault" checked="true"/>
                        <label for="standbyDefault">Allow Rippling</label>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Currency
                      </td>
                      <td>
                        <input type="text" id="standbyCurrencyField" size="40" value="USD"></input>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">NFT URL</td>
                      <td><input type="text" id="standbyTokenUrlField"
                        value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">Flags</td>
                      <td><input type="text" id="standbyFlagsField" value="1" size="10"/></td>
                    </tr>
                    <tr>
                      <td align="right">NFT ID</td>
                      <td><input type="text" id="standbyTokenIdField" value="" size="80"/></td>
                    </tr>
                    <tr>
                      <td align="right">NFT Offer Index</td>
                      <td><input type="text" id="standbyTokenOfferIndexField" value="" size="80"/></td>
                    </tr>
                    <tr>
                      <td align="right">Owner</td>
                      <td><input type="text" id="standbyOwnerField" value="" size="80"/></td>
                    </tr>
                    <tr>
                      <td align="right">Destination</td>
                      <td><input type="text" id="standbyDestinationField" value="" size="80"/></td>
                    </tr>
                    <tr>
                      <td align="right">Expiration</td>
                      <td><input type="text" id="standbyExpirationField" value="" size="80"/></td>
                    </tr>
                    <tr>
                      <td align="right">Transfer Fee</td>
                      <td><input type="text" id="standbyTransferFeeField" value="" size="80"/></td>
                    </tr>
                  </table>
                  <p align="left">
                    <textarea id="standbyResultField" cols="80" rows="20" ></textarea>
                  </p>
                </td>
                </td>
                <td>
                  <table>
                    <tr valign="top">
                      <td align="center" valign="top">
                        <button type="button" onClick="sendXRP()">Send XRP&#62;</button>
                        <br/><br/>
                        <button type="button" onClick="createTrustline()">Create TrustLine</button>
                        <br/>
                        <button type="button" onClick="sendCurrency()">Send Currency</button>
                        <br/>
                        <button type="button" onClick="getBalances()">Get Balances</button>
                        <br/><br/>
                        <button type="button" onClick="mintToken()">Mint NFT</button>
                        <br/>
                        <button type="button" onClick="getTokens()">Get NFTs</button>
                        <br/>
                        <button type="button" onClick="burnToken()">Burn NFT</button>
                        <br/><br/>
                        <button type="button" onClick="createSellOffer()">Create Sell Offer</button>
                        <br/>
                        <button type="button" onClick="acceptSellOffer()">Accept Sell Offer</button>
                        <br/>
                        <button type="button" onClick="createBuyOffer()">Create Buy Offer</button>
                        <br/>
                        <button type="button" onClick="acceptBuyOffer()">Accept Buy Offer</button>
                        <br/>
                        <button type="button" onClick="getOffers()">Get Offers</button>
                        <br/>
                        <button type="button" onClick="cancelOffer()">Cancel Offer</button>
                      </td>
                    </tr>
                    </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          <td>
            <table>
              <tr>
                <td>
                <td>
                  <table>
                    <tr>
                      <td align="center" valign="top">
                        <button type="button" onClick="oPsendXRP()">&#60; Send XRP</button>
                        <br/><br/>
                        <button type="button" onClick="oPcreateTrustline()">Create TrustLine</button>
                        <br/>
                        <button type="button" onClick="oPsendCurrency()">Send Currency</button>
                        <br/>
                        <button type="button" onClick="getBalances()">Get Balances</button>
                        <br/><br/>
                        <button type="button" onClick="oPmintToken()">Mint NFT</button>
                        <br/>
                        <button type="button" onClick="oPgetTokens()">Get NFTs</button>
                        <br/>
                        <button type="button" onClick="oPburnToken()">Burn NFT</button>
                        <br/><br/>
                        <button type="button" onClick="oPcreateSellOffer()">Create Sell Offer</button>
                        <br/>
                        <button type="button" onClick="oPacceptSellOffer()">Accept Sell Offer</button>
                        <br/>
                        <button type="button" onClick="oPcreateBuyOffer()">Create Buy Offer</button>
                        <br/>
                        <button type="button" onClick="oPacceptBuyOffer()">Accept Buy Offer</button>
                        <br/>
                        <button type="button" onClick="oPgetOffers()">Get Offers</button>
                        <br/>
                        <button type="button" onClick="oPcancelOffer()">Cancel Offer</button>
                      </td>
                      <td valign="top" align="right">
                        <button type="button" onClick="getAccount('operational')">Get New Operational Account</button>
                        <table>
                          <tr valign="top">
                            <td align="right">
                              Operational Account
                            </td>
                            <td>
                              <input type="text" id="operationalAccountField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Public Key
                            </td>
                            <td>
                              <input type="text" id="operationalPubKeyField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Private Key
                            </td>
                            <td>
                              <input type="text" id="operationalPrivKeyField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Seed
                            </td>
                            <td>
                              <input type="text" id="operationalSeedField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              XRP Balance
                            </td>
                            <td>
                              <input type="text" id="operationalBalanceField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Amount
                            </td>
                            <td>
                              <input type="text" id="operationalAmountField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            </td>
                            <td align="right">                        <input type="checkbox" id="operationalDefault" checked="true"/>
                              <label for="operationalDefault">Allow Rippling</label>
                              <button type="button" onClick="configureAccount('operational',document.querySelector('#operationalDefault').checked)">Configure Account</button>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Currency
                            </td>
                            <td>
                              <input type="text" id="operationalCurrencyField" size="40" value="USD"></input>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">NFT URL</td>
                            <td><input type="text" id="operationalTokenUrlField"
                              value = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi" size="80"/>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">Flags</td>
                            <td><input type="text" id="operationalFlagsField" value="1" size="10"/></td>
                          </tr>
                          <tr>
                            <td align="right">NFT ID</td>
                            <td><input type="text" id="operationalTokenIdField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">NFT Offer Index</td>
                            <td><input type="text" id="operationalTokenOfferIndexField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">Owner</td>
                            <td><input type="text" id="operationalOwnerField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">Destination</td>
                            <td><input type="text" id="operationalDestinationField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">Expiration</td>
                            <td><input type="text" id="operationalExpirationField" value="" size="80"/></td>
                          </tr>
                          <tr>
                            <td align="right">Transfer Fee</td>
                            <td><input type="text" id="operationalTransferFeeField" value="" size="80"/></td>
                          </tr>
                        </table>
                        <p align="right">
                          <textarea id="operationalResultField" cols="80" rows="20" ></textarea>
                        </p>
                      </td>
                      </td>
                    </tr>
                    </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
```
