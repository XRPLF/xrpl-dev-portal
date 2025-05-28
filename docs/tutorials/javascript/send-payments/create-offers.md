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


[![Offer Create Token Test Harness](/docs/img/mt-create-offers-1-empty-form-info.png)](/docs/img/mt-create-offers-1-empty-form-info.png)

Download and expand the [Modular Tutorials](../../../../_code-samples/modular-tutorials/payment-modular-tutorials.zip)<!-- {.github-code-download} --> archive.

**Note:** Without the Modular Tutorial Samples, you will not be able to try the examples that follow. 

## Usage

To get test accounts:

1. Open `create-offers.html` in a browser.
2. Get test accounts.
    1. If you copied the gathered information from another tutorial:
        1. Paste the gathered information to the **Result** field.
        2. Click **Distribute Account Info**.
    2. If you have an existing account seed:
        1. Paste the account seed to the **Account 1 Seed** or **Account 2 Seed** field.
        2. Click **Get Account 1 from Seed** or **Get Account 2 from Seed**.
    2. If you do not have existing accounts:
        1. Click **Get New Account 1**.
        2. Click **Get New Account 2**.

[![Created Accounts](/docs/img/mt-create-offers-2-form-with-account-info.png)](/docs/img/mt-create-offers-2-form-with-account-info.png)

You can create and match offers from either account.

## Create Offer

To create an offer to exchange XRP for an issued currency:

1. Click **Account 1** or **Account 2**.
2. Enter _XRP_ as the Taker Pays **Currency Code**.
2. Enter the Taker Pays **Amount** in drops. For example, _50000000_.
3. Enter the Taker Gets **Currency**. For example, _USD_.
4. Copy the current **Account Address** and paste it in the Taker Gets **Issuer** field.
5. Enter the Taker Gets **Amount**. For example, _50_.
6. Click **Create Offer**.

[![Created an offer for XRP and USD](/docs/img/mt-create-offers-3-xrp-for-usd-offer.png)](/docs/img/mt-create-offers-3-xrp-for-usd-offer.png)

## Get Offers

Click **Get Offers** to get a list of offers issued by the corresponding account.

[![Created an offer for XRP and USD](/docs/img/mt-create-offers-3-xrp-for-usd-offer.png)](/docs/img/mt-create-offers-3-xrp-for-usd-offer.png)

## Create a Matching Offer

1. Choose an account other than the Issuer. For example, **Account 2**.
2. Enter _XRP_ as the Taker Gets **Currency Code**.
3. Enter the Taker Gets **Amount**. For example, _50000000_.
3. Enter the Taker Pays **Currency Code**, for example _USD_.
4. Enter the Taker Pays **Issuer**. For example, the **Account 1 Address**.
5. Enter the Taker Pays **Amount** For example, _50_.
6. Click **Create Offer**.


[![Results of matching offers for XRP and USD](/docs/img/mt-create-offers-4-matching-offer.png)](/docs/img/mt-create-offers-4-matching-offer.png)

## Cancel Offer

To cancel an existing offer:

1. Enter the sequence number of the offer in the **Offer Sequence** field. To find the sequence number, you can click **Get Offers**, then look for the _Seq_ value for the offer you want to cancel.

[![Where to find the "seq" value in an offer record](/docs/img/mt-create-offers-5-sequence-number.png)](/docs/img/mt-create-offers-5-sequence-number.png)

2. Click **Cancel Offer**, then click **Get Offers** to show that the offer has been removed from the list of outstanding offers.

[![Get Offers result showing no offers](/docs/img/mt-create-offers-6-no-offers.png)](/docs/img/mt-create-offers-6-no-offers.png)

# Code Walkthrough

You can download the [Payment Modular Tutorials](/_code-samples/modular-tutorials/payment-modular-tutorials.zip) from the source repository for this website.

## create-offer.js

The functions in create-offer.html leverage functions from the base module. The functions that follow are solely focused on creating and handling offers.

### Create Offer 

Connect to the XRP Ledger and get the account wallet.

```javascript
 async function createOffer() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}, getting wallet....===\n`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
```

Gather the information for what the taker pays, and what the taker gets in return. If the **Currency Code** is _XRP_, the amount is equal to the value in the **Amount** field. Otherwise, the `takerGets` parameter is constructed as an array containing the currency code, issuer address, and the value in the amount field.

```javascript
  try {
    if (getCurrencyField.value == 'XRP') {
        takerGets = getAmountField.value
    } else {
        takerGetsString = '{"currency": "' + getCurrencyField.value +'",\n' +
            '"issuer": "' + getIssuerField.value + '",\n' +
            '"value": "' + getAmountField.value + '"}'
        takerGets = JSON.parse(takerGetsString)
    }
```

The same logic is used to create the value for the `takerPays` parameter.

```javascript
    if (payCurrencyField.value == 'XRP') {
      takerPays = xrpl.xrpToDrops(payAmountField.value)
    } else {
      takerPaysString = '{"currency": "' + payCurrencyField.value + '",\n' +
        '"issuer": "' + payIssuerField.value + '",\n' +
        '"value": "' + payAmountField.value + '"}'
      takerPays = JSON.parse(takerPaysString)
    }
 ```

Define the `OfferCreate` transaction, using the `takerPays` and `takerGets` parameters defined above.

 ```javascript
  const prepared = await client.autofill({
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerGets": takerGets,
    "TakerPays": takerPays
  })
```

Sign and send the prepared transaction, and wait for the results.

```javascript
    const signed = wallet.sign(prepared)
    const tx = await client.submitAndWait(signed.tx_blob)
```

Request the token balance changes after the transaction.

```javascript
    results = '\n\n===Offer created===\n\n' +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value += results
```

Get the new XRP balance, reflecting the payments and transaction fees.

```javascript
  xrpBalanceField.value =  (await client.getXrpBalance(wallet.address))
```


```javascript
  getOffers()
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript
  } catch (err) {
    console.error('Error creating offer:', err);
    results = `\nError: ${err.message}\n`
    resultField.value += results
    throw err; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client          
    client.disconnect()
  })
```

### getOffers

This function requests a list of all offers posted by an account.

Connect to the XRP Ledger and get the Account wallet.

```javascript
async function getOffers() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ' + ${net}, getting offers....===\n`
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  resultField.value = results
```

Send a request for all `account_offers` for the specified account address and report the results.

```javascript
  results += '\n\n*** Offers ***\n'
  let offers
    try {
    offers = await client.request({
      method: "account_offers",
      account: wallet.address,
      ledger_index: "validated"
    })
    results = JSON.stringify(offers, null, 2)
    resultField.value += results
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript
  } catch (err) {
    console.error('Error getting offers:', err);
    results = `\nError: ${err.message}\n`
    resultField.value += results
    throw err; // Re-throw the error to be handled by the caller
  }
  finally {
    client.disconnect()
  }

```

### cancelOffer()

You can cancel an offer before it is matched with another offer.

Connect to the XRP Ledger and get the account wallet.

```javascript
async function cancelOffer() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}, canceling offer.===\n`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
```

Prepare the `OfferCancel` transaction, passing the account address of the account that created the offer and the `Sequence` of the offer.

```javascript
  try {
    const prepared = await client.autofill({
      "TransactionType": "OfferCancel",
      "Account": wallet.address,
      "OfferSequence": parseInt(offerSequenceField.value)
    })
```

Sign and submit the transaction, then wait for the result.

```javascript
  const signed = wallet.sign(prepared)
  const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
    results += "\nOffer canceled. Balance changes: \n" +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript
  }
  catch (err) {
    console.error('Error canceling offer:', err);
    results = `\nError: ${err.message}\n`
    resultField.value += results
    throw err; // Re-throw the error to be handled by the caller
  }
  finally {
    client.disconnect()
  }
}// End of cancelOffer()
```

## create-offer.html

```html
<html>
<head>
    <title>Create Offers</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <link href="modular-tutorials.css" rel="stylesheet">
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script>
    <script src="account-support.js"></script>
    <script src='send-xrp.js'></script>
    <script src='create-offer.js'></script>
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
    <h1>Create Offers</h1>
    <form id="theForm">
        <span class="tooltip" tooltip-data="Choose the XRPL host server for your account.">
            Choose your ledger instance:
        </span>
        &nbsp;&nbsp;
        <input type="radio" id="dn" name="server" value="wss://s.devnet.rippletest.net:51233" checked>
        <label for="dn">Devnet</label>
        &nbsp;&nbsp;
        <input type="radio" id="tn" name="server" value="wss://s.altnet.rippletest.net:51233">
        <label for="tn">Testnet</label>
        <br /><br />
        <table>
            <tr>
                <td>
                    <button type="button" onClick="getNewAccount1()">Get New Account 1</button>
                </td>
                <td>
                    <button type="button" onClick="getAccountFromSeed1()">Get Account 1 From Seed</button>
                </td>
                <td>
                    <button type="button" onClick="getNewAccount2()">Get New Account 2</button>
                </td>
                <td>
                    <button type="button" onClick="getAccountFromSeed2()">Get Account 2 From Seed</button>
                </td>
            </tr>
            <tr>
                <td>
                        <span class="tooltip" tooltip-data="Arbitrary human-readable name for the account."><label for="account1name">Account 1 Name</label>
                        </span>
                </td>
                <td>
                    <input type="text" id="account1name" size="40"></input>
                </td>
                <td>
                    <span class="tooltip" tooltip-data="Arbitrary human-readable name for the account.">
                        <label for="account2name">Account 2 Name</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="account2name" size="40"></input>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="tooltip" tooltip-data="Identifying address for the account.">
                        <label for="account1address">Account 1 Address</label>
                    </span>
                </td>
                <td> 
                    <input type="text" id="account1address" size="40"></input>
                </td>
                <td>
                    <span class="tooltip" tooltip-data="Identifying address for the account.">
                        <label for="account2address">Account 2 Address</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="account2address" size="40"></input>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="tooltip" tooltip-data="Seed for deriving public and private keys for the account.">
                        <label for="account1seed">Account 1 Seed</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="account1seed" size="40"></input>
                </td>
                <td>
                    <span class="tooltip" tooltip-data="Seed for deriving public and private keys for the account.">
                        <label for="account2seed">Account 2 Seed</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="account2seed" size="40"></input>
                </td>
            </tr>
        </table>
        <hr />
        <table>
            <tr valign="top">
                <td align="right">
                    <span class="tooltip" tooltip-data="Name of the currently selected account.">
                        <label for="accountNameField">Account Name</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="accountNameField" size="40" readonly></input>
                    <input type="radio" id="account1" name="accounts" value="account1">
                    <label for="account1">Account 1</label>
                </td>
            </tr>
            <tr valign="top">
                <td align="right">
                    <span class="tooltip" tooltip-data="Address of the currently selected account.">
                        <label for="accountAddressField">Account Address</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="accountAddressField" size="40" readonly></input>
                    <input type="radio" id="account2" name="accounts" value="account2">
                    <label for="account2">Account 2</label>
                </td>
            </tr>
            <tr valign="top">
                <td align="right">
                    <span class="tooltip" tooltip-data="Seed of the currently selected account.">
                        <label for="accountSeedField">Account Seed</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="accountSeedField" size="40" readonly></input>
                    <br>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="XRP balance for the currently selected account.">
                        <label for="xrpBalanceField">XRP Balance</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="xrpBalanceField" size="40" readonly></input>
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td></td>
                <td>
                    <h4 align="center">Taker Pays</h4>
                </td>
                <td>
                    <h4 align="center">Taker Gets</h4>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Currency codes for the Pay and Get offers.">
                    <lable for="payCurrencyField">Currency Code</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="payCurrencyField" size="40"></input>
                </td>
                <td>
                    <input type="text" id="getCurrencyField" size="40"></input>
                </td> 
                <td>          
                    <button type="button" onClick="createOffer()">Create Offer</button>
                </td>   
            </tr> 
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Issuers of the offered currencies.">
                        <lable for="payIssuerField">Issuer</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="payIssuerField" size="40"></input>&nbsp;&nbsp;
                </td>  
                <td>
                    <input type="text" id="getIssuerField" size="40"></input>&nbsp;&nbsp;
                </td>
                <td>
                    <button type="button" onClick="getOffers()">Get Offers</button>
                </td>
            </tr>    
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Amounts of offered currencies.">
                        <lable for="amountField">Amount</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="payAmountField" size="40"></input>
                </td> 
                <td>
                    <input type="text" id="getAmountField" size="40"></input>
                </td>
                <td>
                    <button type="button" onClick="cancelOffer()">Cancel Offer</button>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Sequence number of the offer.">
                        <lable for="offerSequenceField">Offer Sequence</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="offerSequenceField" size="40"></input>
                </td> 
                <td></td>
                <td>
                    <button type="button" onClick="getTokenBalance()">Get Token Balance</button>
                </td>
            </tr>  
            <tr>
                <td colspan="3">
                    <p align="right">
                        <textarea id="resultField" cols="80" rows="20"></textarea>
                    </p>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="gatherAccountInfo()">Gather Account Info</button><br/>
                    <button type="button" onClick="distributeAccountInfo()">Distribute Account Info</button>
                </td>
            </tr>
        </table>
    </form>
</body>
<script>
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'account1') {
                populate1()
            } else if (this.value === 'account2') {
                populate2()
            }
        });
    });
</script>
</html>
```


