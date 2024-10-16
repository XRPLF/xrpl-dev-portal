---
seo:
    description: Create offers to exchange issued currencies and XRP.
labels:
  - Accounts
  - Transaction Sending
  - XRP
  - Issued Currencies
---
# Create Offers

This example shows how to:

1. Create currency offers. 
2. Retrieve active offers.
3. Match a currency offer to exchange tokens.
4. Cancel an unsettled offer.


[![Offer Create Token Test Harness](/docs/img/module-create-offer.png)](/docs/img/module-create-offer.png)

Download and expand the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive.

**Note:** Without the Quickstart Samples, you will not be able to try the examples that follow. 

## Usage
<!-- 
<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/YnPccLPa0hc?si=U6uQNXzNRp5G_pri" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
-->
To get test accounts:

1. Open `3a.CreateOffer.html` in a browser
2. Choose **Testnet** or **Devnet**.
3. Enter an **Account Name** for the left column. For example, _Standby_.
4. Click **Get New Account** on the left.
5. Enter an **Account Name** for the right column. For example, _Operational_.
5. Click **Get New Account** on the right.
6. Copy and paste the **Seeds** field in a persistent location, such as a Notepad, so that you can reuse the accounts after reloading the form.

[![Created Standby and Operational Accounts](/docs/img/module-create-offer-get-accounts.png)](/docs/img/module-create-offer-get-accounts.png)

You can create and match offers from either account.

## Create Offer

To create an offer to exchange XRP for an issued currency on the Standby (left) side:

1. Enter _XRP_ as the Taker Pays **Currency**.
2. Enter the Taker Pays **Value** in drops. For example, _50000000_.
3. Enter the Taker Gets **Currency**. For example, _USD_.
4. Copy the left account (_Standby_) value to the Taker Gets **Issuer** field.
5. Enter the Taker Gets **Value**. For example, _50_.
6. Click **Create Offer**.

[![Created an offer for XRP and USD](/docs/img/module-create-offer-xrp-for-usd.png)](/docs/img/module-create-offer-xrp-for-usd.png)

To create a complementary offer on the Operational (right) side:

1. Enter the Taker Pays **Currency**. For example, _USD_.
2. Copy the left (Standby) side **Account** string into the **Issuer** field.
3. Enter the Taker Pays **Value**. For example, _50_.
4. Enter _XRP_ as the Taker Gets **Currency**.
5. Enter the Taker Gets **Value** in drops. For example, _50000000_.
6. Click **Create Offer**.

[![Results of matching offers for XRP and USD](/docs/img/module-create-offer-xrp-for-usd2.png)](/docs/img/module-create-offer-xrp-for-usd2.png)

## Get Offers

Click **Get Offers** to get a list of offers issued by the corresponding account.

[![Get outstanding offers for the Standby (left) account](/docs/img/module-create-offer-get-offers.png)](/docs/img/module-create-offer-get-offers.png)

## Cancel Offer

To cancel an existing offer:

1. Enter the sequence number of the offer in the **Offer Sequence** field. To find the sequence number, you can click **Get Offers**, then look for the _Seq_ value for the offer you want to cancel.

[![Where to find the "seq" value in an offer record](/docs/img/module-create-offer-cancel-offer.png)](/docs/img/module-create-offer-cancel-offer.png)

2. Click **Cancel Offer**, then click **Get Offers** to show that the offer has been removed from the list of outstanding offers.

[![Get Offers result showing no offers](/docs/img/module-create-offer-cancelled-offer.png)](/docs/img/module-create-offer-cancelled-offer.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/){.github-code-download} in the source repository for this website.

## ripplex3a-create-offers.js

### Create Offer 

Initialize variables for the _takerGets_ and _takerPays_ payload, and get the selected developer network instance.

```js
 async function createOffer() {
  let takerGets = ''
  let takerPays = ''
  let net = getNet()
```

Get a client instance and connect to the XRP Ledger.

```js
  let results = 'Connecting to ' + net + '....\n'
  const client = new xrpl.Client(net)
  await client.connect()
```

Get the wallets for both accounts.

```js
  results  += "Connected. Getting wallets.\n"
  standbyResultField.value = results
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  results += standbyNameField.value + " account address: " + standby_wallet.address + "\n"
  standbyResultField.value = results
```

If the currency for the "Taker Gets" side of the deal is XRP, you only need the value (amount) of XRP to request. If you are trading an issued currency, you need to capture the currency code, issuer account, and value.

```js
  if (standbyTakerGetsCurrencyField.value == 'XRP') {
    takerGets = standbyTakerGetsValueField.value
  } else {
    takerGetsString = '{"currency": "' + standbyTakerGetsCurrencyField.value +'",\n' +
        '"issuer": "' + standbyTakerGetsIssuerField.value + '",\n' +
        '"value": "' + standbyTakerGetsValueField.value + '"}'
    takerGets = JSON.parse(takerGetsString)
  }
```

Similarly on the "Take Pays" side, you only need the value when trading XRP.

```js
  if (standbyTakerPaysCurrencyField.value == 'XRP') {
    takerPays = standbyTakerPaysValueField.value
  } else {
    takerPaysString = '{"currency": "' + standbyTakerPaysCurrencyField.value + '",\n' +
      '"issuer": "' + standbyTakerPaysIssuerField.value + '",\n' +
      '"value": "' + standbyTakerPaysValueField.value + '"}'
    takerPays = JSON.parse(takerPaysString)
  }
```

Prepare the transaction.

```js
  const prepared = await client.autofill({
    "TransactionType": "OfferCreate",
    "Account": standby_wallet.address,
    "TakerGets": takerGets,
    "TakerPays": takerPays
  })   
 ```

 Sign the prepared instructions.

 ```js
  const signed = standby_wallet.sign(prepared)
 results += "\nSubmitting transaction...."
```

Submit the signed transaction blob.

```js
const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results and update XRP balances.

```js
  results += tx.results + "\n"
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results
  standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
```

Call the `getOffers` function to show the new offer.

```js
  getOffers() 
```

Disconnect from the XRP Ledger.

```js
  client.disconnect()    
}
```

### Get Offers 

Connect to the XRP Ledger and get the wallet for the Standby (left) side of the Token Test Harness.

```js
async function getOffers() {
  let net = getNet()
  let results = 'Connecting to ' + net + '....\n'
  const client = new xrpl.Client(net)
  await client.connect()
  results  += "Connected.\n"
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  results += standbyNameField.value + " acccount: " + standby_wallet.address
```

Label the offers section of the results

```js
  results += '\n\n*** Offers ***\n'
```

Send the _account_offers_ request to the XRP Ledger. Capture the results.

```js
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
```

Report the results and disconnect from the XRP Ledger.

```js
  standbyResultField.value = results
  client.disconnect()
}
```

### Cancel Offer 

Connect to the XRP Ledger and get the account wallets.

```js

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
```

Prepare the transaction. `The OfferSequence` is the `Seq` value in the response to the `account_offers` request.

```js
  const prepared = await client.autofill({
  "TransactionType": "OfferCancel",
  "Account": standby_wallet.address,
  "OfferSequence": parseInt(standbyOfferSequenceField.value)
  })
```

Sign the prepared transaction.
```js
  const signed = standby_wallet.sign(prepared)
```

Submit the transaction and wait for the results.

```js
  const tx = await client.submitAndWait(signed.tx_blob)
```

Capture the balance changes and report the results.

```js
  results  += "\nBalance changes: \n" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results
```

Update the XRP balance.

```js
  standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
```

Disconnect from the XRP Ledger.

```js
  client.disconnect()    
  }
```

### Reciprocal functions for the Operational (right) account.
```js
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
```

## ripplex3b-name-field-support.js

When creating more complex transactions, it can be difficult to remember which account number was performing which part of the deal. To ease the mental burden, there is a new _Name_ field to facilitate working with use cases that typically involve more than two accounts. The account name is appended to the seed values, which makes them reusable and portable to other forms with name field support. To migrate an account, paste the seed value into the seeds field, add a period, then type the account name as a string with no spaces.

With the exception of the changes that enable use of the Name field, the functions in this JavaScript file are identical to the functions found in `ripplex1-send-xrp.js`.
<!-- SPELLING_IGNORE: getNet -->

```javascript
### getNet()

    function getNet() {
```

This function uses brute force `if` statements to discover the selected network instance and return the URI.

```javascript
  let net
  if (document.getElementById("tn").checked) net = "wss://s.altnet.rippletest.net:51233"
  if (document.getElementById("dn").checked) net = "wss://s.devnet.rippletest.net:51233"
  return net
} // End of getNet()
```

### getAccount(type)              
<!-- SPELLING_IGNORE: getaccount -->

```javascript
// *******************************************************
// ************* Get Account *****************************
// *******************************************************

async function getAccount(type) {
```

Get the selected ledger.

```javascript
  let net = getNet()
```

Instantiate a client.

```javascript
  const client = new xrpl.Client(net)
```

Use the _results_ variable to capture progress information.

```javascript
  results = 'Connecting to ' + net + '....'
```
Use the default faucet using a _null_ value.

```javascript
  let faucetHost = null
```

Report progress in the appropriate results field.

```javascript
  if (type == 'standby') {
    standbyResultField.value = results
  } else {
    operationalResultField.value = results
  }
```

Connect to the server.

```javascript
  await client.connect()
        
  results += '\nConnected, funding wallet.'
  if (type == 'standby') {
    standbyResultField.value = results
  } else {
    operationalResultField.value = results
  }

```

Create and fund a test account.

```javascript
  const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet
        
  results += '\nGot a wallet.'
  if (type == 'standby') {
    standbyResultField.value = results
  } else {
    operationalResultField.value = results
  }       
```

Get the current XRP balance for the account.

```javascript
  const my_balance = (await client.getXrpBalance(my_wallet.address))  
```

If this is a standby account, populate the standby account fields.

```javascript
  if (type == 'standby') {
    standbyAccountField.value = my_wallet.address
    standbyBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    standbySeedField.value = my_wallet.seed
    results += '\nAccount created named ' + standbyNameField.value + '.'
    standbyResultField.value = results
```

Otherwise, populate the operational account fields.

```javascript
  } else {
    operationalAccountField.value = my_wallet.address
    operationalSeedField.value = my_wallet.seed
    operationalBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    results += '\nAccount created named ' +  operationalNameField.value + '.'
    operationalResultField.value = results
  }
```

Insert the seed values and names for both accounts as they are created to the **Seeds** field as a convenience. You can copy the values and store them offline. When you reload this form or another in this tutorial, copy and paste them into the **Seeds** field to retrieve the accounts with the `getAccountsFromSeeds()` function.

```javascript
  seeds.value = standbySeedField.value + "." + standbyNameField.value + '\n' + 
                operationalSeedField.value + "." + operationalNameField.value
```

Disconnect from the XRP ledger. 

```javascript
  client.disconnect()
} // End of getAccount()
```

### Get Accounts from Seeds

```javascript
// *******************************************************
// ********** Get Accounts from Seeds ******************** 
// *******************************************************

async function getAccountsFromSeeds() {
```

Connect to the selected network.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected, finding wallets.\n'
  standbyResultField.value = results
```

Parse the **Seeds** field.

```javascript
  var lines = seeds.value.split('\n')
  var first_line_value = lines[0]
  var first_line = first_line_value.split('.')
  var first_seed = first_line[0]
  var first_name = first_line[1]

  var second_line = lines[1].split('.')
  var second_seed = second_line[0]
  var second_name = second_line[1]
```

Get the `standby_wallet` based on the seed in the first line. Get the `operational_wallet` based on the seed in the second line.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(lines[0])
  const operational_wallet = xrpl.Wallet.fromSeed(lines[1])
```

Populate the fields for the standby and operational accounts.

```javascript
  standbyAccountField.value = standby_wallet.address
  standbyNameField.value = first_name
  standbySeedField.value = first_seed
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
      
  operationalAccountField.value = operational_wallet.address
  operationalNameField.value = second_name
  operationalSeedField.value = second_seed
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))  
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // End of getAccountsFromSeeds()
```

### Send XRP

```javascript
// *******************************************************
// ******************** Send XRP *************************
// *******************************************************

async function sendXRP() {
```

Connect to your selected ledger.

```javascript
  results  = "Connecting to the selected ledger.\n"
  standbyResultField.value = results
  let net = getNet()
  results = 'Connecting to ' + getNet() + '....'
  const client = new xrpl.Client(net)
  await client.connect()
      
  results  += "\nConnected. Sending XRP.\n"
  standbyResultField.value = results
      
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const sendAmount = standbyAmountField.value
        
  results += "\nstandby_wallet.address: = " + standby_wallet.address
  standbyResultField.value = results
```

Prepare the transaction. This is a Payment transaction from the standby address to the operational address.

The _Payment_ transaction expects the XRP to be expressed in drops, or 1/millionth of an XRP.  You can use the `xrpToDrops()` method to convert the send amount for you (which beats having to type an extra 6 zeroes to send 1 XRP).

```javascript
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value
  })
```

Sign the prepared transaction.

```javascript
const signed = standby_wallet.sign(prepared)
```

Submit the transaction and wait for the results.

```javascript
const tx = await client.submitAndWait(signed.tx_blob)
```

Request the balance changes caused by the transaction and report the results.

```javascript
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results

  standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))                 
  client.disconnect()    
} // End of sendXRP()
```

### Reciprocal Transactions

For each of the transactions, there is an accompanying reciprocal transaction, with the prefix _oP,_ for the operational account. See the corresponding function for the standby account for code commentary.

```javascript

// *******************************************************
// ********* Send XRP from Operational account ***********
// *******************************************************
      
async function oPsendXRP() {

  results  = "Connecting to the selected ledger.\n"
  operationalResultField.value = results
  let net = getNet()
  results = 'Connecting to ' + getNet() + '....'
  const client = new xrpl.Client(net)
  await client.connect()
      
  results  += "\nConnected. Sending XRP.\n"
  operationalResultField.value = results
      
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const sendAmount = operationalAmountField.value
        
  results += "\noperational_wallet.address: = " + operational_wallet.address
  operationalResultField.value = results
      
// ---------------------------------------------------------- Prepare transaction
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": operational_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": operationalDestinationField.value
  })

// ---------------------------------------------------- Sign prepared instructions
  const signed = operational_wallet.sign(prepared)

// ------------------------------------------------------------ Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
      
  results  += "\nBalance changes: " +
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))                 
      
  client.disconnect()
      
} // End of oPsendXRP()
```

## 3a.CreateOffer.html

This form includes the added account name fields, to allow you to swap in different accounts for a variety of use cases with a recognizable label for the seed and account values.

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
    <script src='ripplex2-send-currency.js'></script>
    <script src='ripplex3a-create-offers.js'></script>
    <script src='ripplex3b-NameFieldSupport.js'></script>
    <script>
      if (typeof module !== "undefined") {
        const xrpl = require('xrpl')
      }
    </script>
  </head>
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
      <textarea id="seeds" cols="55" rows= "4"></textarea>
      <table>
        <tr valign="top">
          <td>
            <table>
              <tr valign="top">
                <td>
                  <button type="button" onClick="getAccount('standby')">Get New Account</button>
                  <table>
                    <tr valign="top">
                      <td align="right">
                        Account Name
                      </td>
                      <td>
                        <input type="text" id="standbyNameField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr valign="top">
                      <td align="right">
                        Account
                      </td>
                      <td>
                        <input type="text" id="standbyAccountField" size="40"></input>
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
                    <tr>
                      <td align="right">
                        Destination
                      </td>
                      <td>
                        <input type="text" id="standbyDestinationField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr valign="top">
                      <td><button type="button" onClick="configureAccount('standby',document.querySelector('#standbyDefault').checked)">Configure Account</button></td>
                      <td>
                        <input type="checkbox" id="standbyDefault" checked="false"/>
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
                      <td align="right">
                        Offer Sequence
                      </td>
                      <td>
                        <input type="text" id="standbyOfferSequenceField" size="10"></input>                        
                      </td>
                    </tr>
                    </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table>
                    <tr>
                      <td>
                        Taker Pays:<br/>
                        Currency: <input type="text" id="standbyTakerPaysCurrencyField" size="10"></input><br/>
                        Issuer: <input type="text" id="standbyTakerPaysIssuerField" size="35"></input><br/>
                        Value: <input type="text" id="standbyTakerPaysValueField" size="10"></input>
                      </td>
                      <td>
                        Taker Gets:<br/>
                        Currency: <input type="text" id="standbyTakerGetsCurrencyField" size="10"></input><br/>
                        Issuer: <input type="text" id="standbyTakerGetsIssuerField" size="35"></input><br/>
                        Value: <input type="text" id="standbyTakerGetsValueField" size="10"></input><br/>
                      </td>
                    </tr>
                  </table>
                  <p align="left">
                    <textarea id="standbyResultField" cols="80" rows="20" ></textarea>
                  </p>
                </td>
              </tr>
            </table>
          </td>
<!-- Standby Buttons, Column 2 -->
          <td>
            <table>
              <tr valign="top">
                <td align="center" valign="top">
                  <button type="button" onClick="sendXRP()">Send XRP&#62;</button>
                  <br/>
                  <button type="button" onClick="createTrustline()">Create Trust Line</button>
                  <br/>
                  <button type="button" onClick="getTrustLines()">Get Trust Lines</button>
                  <br/>
                  <button type="button" onClick="sendCurrency()">Send Currency</button>
                  <br/>
                  <button type="button" onClick="getBalances()">Get Balances</button>
                  <br/><br/>
                  <button type="button" onClick="createOffer()">Create Offer</button>
                  <br/>
                  <button type="button" onClick="getOffers()">Get Offers</button>
                  <br/>
                  <button type="button" onClick="cancelOffer()">Cancel Offer</button>
                </td>
              </tr>
            </table>
          </td>
<!-- Operational Buttons, Column 3 -->
          <td>
            <table>
              <tr valign="bottom">
                <td align="center" valign="middle">
                  <button type="button" onClick="oPsendXRP()">&#60; Send XRP</button>
                  <br/>
                  <button type="button" onClick="oPcreateTrustline()">Create Trust Line</button>
                  <br/>
                  <button type="button" onClick="oPgetTrustLines()">Get Trust Lines</button>
                  <br/>
                  <button type="button" onClick="oPsendCurrency()">Send Currency</button>
                  <br/>
                  <button type="button" onClick="getBalances()">Get Balances</button>
                  <br/><br/>
                  <button type="button" onClick="oPcreateOffer()">Create Offer</button>
                  <br/>
                  <button type="button" onClick="oPgetOffers()">Get Offers</button>
                  <br/>
                  <button type="button" onClick="oPcancelOffer()">Cancel Offer</button>
                </td>
              </tr>
            </table>
          </td>
          
<!-- Operational fields, Column 4 -->

          <td valign="top" align="right">
            <button type="button" onClick="getAccount('operational')">Get New Account</button>
            <table>
              <tr valign="top">
                <td align="left">
                  Account Name
                </td>
                <td align="left">
                  <input type="text" id="operationalNameField" size="40"></input>
                  <br>
                </td>
              </tr>
              <tr valign="top">
                <td align="right">
                  Account
                </td>
                <td>
                  <input type="text" id="operationalAccountField" size="40"></input>
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
                <td align="right">
                  Destination
                </td>
                <td>
                  <input type="text" id="operationalDestinationField" size="40"></input>
                  <br>
                </td>
              </tr>
              <tr>
                <td></td>
                <td align="right">
                  <input type="checkbox" id="operationalDefault" checked="false"/>
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
                <td align="right">
                  Offer Sequence
                </td>
                <td>
                  <input type="text" id="operationalOfferSequenceField" size="10"></input>                        
                </td>
              </tr>
            </table>
            <table>
              <tr>
                <td>
                  Taker Pays:<br/>
                  Currency: <input type="text" id="operationalTakerPaysCurrencyField" size="10"></input><br/>
                  Issuer: <input type="text" id="operationalTakerPaysIssuerField" size="35"></input><br/>
                  Value: <input type="text" id="operationalTakerPaysValueField" size="10"></input>
                </td>
                <td>
                  Taker Gets:<br/>
                  Currency: <input type="text" id="operationalTakerGetsCurrencyField" size="10"></input><br/>
                  Issuer: <input type="text" id="operationalTakerGetsIssuerField" size="35"></input><br/>
                  Value: <input type="text" id="operationalTakerGetsValueField" size="10"></input><br/>
                </td>
              </tr>
            </table>
            <p align="right">
              <textarea id="operationalResultField" cols="80" rows="20" ></textarea>
            </p>
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
```


