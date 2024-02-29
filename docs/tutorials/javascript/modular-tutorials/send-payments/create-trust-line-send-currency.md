---
html: create-trustline-send-currency-using-javascript.html
parent: send-payments-using-javascript.html
seo:
    description: Create Trust Lines and send currency.
labels:
  - Cross-Currency
  - Payments
  - Quickstart
  - Tokens

---
# Create Trust Line and Send Currency Using JavaScript

This example shows how to:

1. Configure accounts to allow transfer of funds to third party accounts.
2. Set a currency type for transactions.
3. Create a trust line between the standby account and the operational account.
4. Send issued currency between accounts.
5. Display account balances for all currencies.

[![Test harness with currency transfer](/docs/img/quickstart5.png)](/docs/img/quickstart5.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try each of the samples in your own browser.

**Note:** Without the Quickstart Samples, you will not be able to try the examples that follow. 

## Usage

Open the Token Test Harness and get accounts:

1. Open `2.create-trustline-send-currency.html` in a browser.
2. Get test accounts.
    1. If you have existing account seeds
        1. Paste account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have account seeds:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.

## Create Trust Line

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/EP_LOy8kK1U?si=Ulx8vUtil_yRcesd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To create a trust line between accounts:

1. Enter a [currency code](https://www.iban.com/currency-codes) in the **Currency** field.
2. Enter the maximum transfer limit in the **Amount** field.
3. Enter the destination account value in the **Destination** field.
4. Click **Create Trustline**. <!-- SPELLING_IGNORE: trustline --><!--{# TODO: update the test harness to spell trust line as two words #}-->

[![Trust line results](/docs/img/quickstart6.png)](/docs/img/quickstart6.png)

## Send an Issued Currency Token

To transfer an issued currency token, once you have created a trust line:

1. Enter the **Amount**.
2. Enter the **Destination**.
3. Enter the **Currency** type.
4. Click **Send Currency**.

[![Currency transfer](/docs/img/quickstart7.png)](/docs/img/quickstart7.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try each of the samples in your own browser.

## ripplex2-send-currency.js
<!-- SPELLING_IGNORE: ripplex2 -->

### Configure Account

When transferring fiat currency, the actual transfer of funds is not simultaneous, as it is with XRP. If currency is transferred to a third party for a different currency, there can be a devaluation of the currency that impacts the originating account. To avoid this situation, this up and down valuation of currency, known as _rippling_, is not allowed by default. Currency transferred from one account can only be transferred back to the same account. To enable currency transfer to third parties, you need to set the `rippleDefault` value to true. The Token Test Harness provides a checkbox to enable or disable rippling.

```javascript
// *******************************************************
// **************** Configure Account ********************
// *******************************************************
      
async function configureAccount(type, defaultRippleSetting) {
```

Connect to the ledger

```javascript
  let net = getNet()
  let resultField = 'standbyResultField'
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  await client.connect()
  results += '\nConnected, finding wallet.'
```

Get the account wallets.

```
if (type=='standby') {
  my_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
} else {
  my_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  resultField = 'operationalResultField'
}
results += '\nRipple Default Setting: ' + defaultRippleSetting
resultField.value = results
```

Prepare the transaction. If the `rippleDefault` argument is true, set the `asfDefaultRipple` flag. If it is false, clear the `asfDefaultRipple` flag.

```javascript
  let settings_tx = {}
  if (defaultRippleSetting) {
    settings_tx = {
      "TransactionType": "AccountSet",
      "Account": my_wallet.address,
      "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
    } 
    results += '\n Set Default Ripple flag.' 
    } else {
      settings_tx = {
      "TransactionType": "AccountSet",
      "Account": my_wallet.address,
      "ClearFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
    }
    results += '\n Clear Default Ripple flag.' 
  }
  results += '\nSending account setting.'   
  resultField.value = results
```

Auto-fill the default values for the transaction.

```javascript
  const prepared = await client.autofill(settings_tx)
```

Sign the transaction.

```javascript
  const signed = my_wallet.sign(prepared)
```

Submit the transaction and wait for the result.

```javascript
  const result = await client.submitAndWait(signed.tx_blob)
```

Report the result.

```javascript
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nAccount setting succeeded.'
    document.getElementById(resultField).value = results
  } else {
    throw 'Error sending transaction: ${result}'
    results += '\nAccount setting failed.'
    resultField.value = results
  }     
  client.disconnect()
} // End of configureAccount()
```

### Create Trust Line

A trust line enables two accounts to trade a defined currency up to a set limit. This gives the participants assurance that any exchanges are between known entities at agreed upon maximum amounts.

```javascript
// *******************************************************
// ***************** Create TrustLine ********************
// *******************************************************
      
async function createTrustline() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results

  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
```

Get the standby and operational wallets.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
```

Capture the currency code from the standby currency field.

```javascript
  const currency_code = standbyCurrencyField.value
```

Define the transaction, capturing the currency code and (limit) amount from the form fields.

```javascript
  const trustSet_tx = {
    "TransactionType": "TrustSet",
    "Account": standbyDestinationField.value,
    "LimitAmount": {
      "currency": standbyCurrencyField.value,
      "issuer": standby_wallet.address,
      "value": standbyAmountField.value
    }
  }
```

Prepare the transaction by automatically filling the default parameters.

```javascript
  const ts_prepared = await client.autofill(trustSet_tx)
```


Sign the transaction.


```javascript
  const ts_signed = operational_wallet.sign(ts_prepared)
  results += '\nCreating trust line from operational account to standby account...'
  standbyResultField.value = results
```


Submit the transaction and wait for the results.


```javascript
  const ts_result = await client.submitAndWait(ts_signed.tx_blob)
```


Report the results.


```javascript
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nTrustline established between account \n' +
      standbyDestinationField.value + ' \n and account\n' + standby_wallet.address + '.'
    standbyResultField.value = results
  } else {
    results += '\nTrustLine failed. See JavaScript console for details.'
    document.getElementById('standbyResultField').value = results     
    throw 'Error sending transaction: ${ts_result.result.meta.TransactionResult}'
  }
} //End of createTrustline()

```

### Send Issued Currency

Once you have created a trust line from an account to your own, you can send issued currency tokens to that account, up to the established limit.

```javascript
// *******************************************************
// *************** Send Issued Currency ******************
// *******************************************************
      
async function sendCurrency() {
```

Connect to the ledger.

```javascript

  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  document.getElementById('standbyResultField').value = results

  await client.connect()

  results += '\nConnected.'
  standbyResultField.value = results
```

Get the account wallets.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const currency_code = standbyCurrencyField.value
  const issue_quantity = standbyAmountField.value
        
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": {
      "currency": standbyCurrencyField.value,
      "value": standbyAmountField.value,
      "issuer": standby_wallet.address
    },
    "Destination": standbyDestinationField.value
  }
```


Prepare the transaction by automatically filling default values.


```javascript
  const pay_prepared = await client.autofill(send_token_tx)
```


Sign the transaction.


```javascript
  const pay_signed = standby_wallet.sign(pay_prepared)
  results += 'Sending ${issue_quantity} ${currency_code} to ' +
    standbyDestinationField.value + '...'
  standbyResultField.value = results
```


Submit the transaction and wait for the results.


```javascript
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
```


Report the results.


```javascript
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}'
    standbyResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${pay_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  getBalances()
  client.disconnect()
} // end of sendCurrency()
```



### Get Balances


```javascript
// *******************************************************
// ****************** Get Balances ***********************
// *******************************************************

async function getBalances() {
```

Connect to the ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()   
  results += '\nConnected.'
  standbyResultField.value = results
```

Get the account wallets.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)   
  results = "\nGetting standby account balances...\n"
```

Define and send the request for the standby account, then wait for the results.

```javascript
  const standby_balances = await client.request({
    command: "gateway_balances",
    account: standby_wallet.address,
    ledger_index: "validated",
    hotwallet: [operational_wallet.address]
  })
```

Report the results.

```javascript
  results += JSON.stringify(standby_balances.result, null, 2)
  standbyResultField.value = results
```

Define and send the request for the operational account, then wait for the results.

```javascript
  results += "\nGetting operational account balances...\n"
  const operational_balances = await client.request({
    command: "gateway_balances",
    account: operational_wallet.address,
    ledger_index: "validated"
  })
```

Report the results.

```javascript
  results += JSON.stringify(operational_balances.result, null, 2)
  operationalResultField.value = results
```

Update the form with current XRP balances.

```javascript
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyResultField.value = results
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
```

Disconnect from the ledger.

```javascript
  client.disconnect()
} // End of getBalances()
```

### Reciprocal Transactions

For each of the transactions, there is an accompanying reciprocal transaction, with the prefix _oP,_ for the operational account. See the corresponding function for the standby account for code commentary. The `getBalances()` request does not have a reciprocal transaction, because it reports balances for both accounts.

```javascript
// *******************************************************
// ************ Create Operational TrustLine *************
// *******************************************************
      
async function oPcreateTrustline() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
        
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const trustSet_tx = {
    "TransactionType": "TrustSet",
    "Account": operationalDestinationField.value,
    "LimitAmount": {
      "currency": operationalCurrencyField.value,
      "issuer": operational_wallet.address,
      "value": operationalAmountField.value
    }
  }
  const ts_prepared = await client.autofill(trustSet_tx)
  const ts_signed = standby_wallet.sign(ts_prepared)
  results += '\nCreating trust line from operational account to ' +
   operationalDestinationField.value + ' account...'
  operationalResultField.value = results
  const ts_result = await client.submitAndWait(ts_signed.tx_blob)
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nTrustline established between account \n' + operational_wallet.address +
      ' \n and account\n' + operationalDestinationField.value + '.'
    operationalResultField.value = results
  } else {
    results += '\nTrustLine failed. See JavaScript console for details.'
    operationalResultField.value = results     
    throw 'Error sending transaction: ${ts_result.result.meta.TransactionResult}'
  }
} //End of oPcreateTrustline
      
// *******************************************************
// ************* Operational Send Issued Currency ********
// *******************************************************
      
async function oPsendCurrency() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
        
  await client.connect()        
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const currency_code = operationalCurrencyField.value
  const issue_quantity = operationalAmountField.value
        
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": operational_wallet.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": operational_wallet.address
    },
    "Destination": operationalDestinationField.value
  }
      
  const pay_prepared = await client.autofill(send_token_tx)
  const pay_signed = operational_wallet.sign(pay_prepared)
  results += 'Sending ${issue_quantity} ${currency_code} to ' +
    operationalDestinationField.value + '...'
  operationalResultField.value = results
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}'
    operationalResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${pay_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  getBalances()
  client.disconnect()
} // end of oPsendCurrency()
```

## 2.create-trustline-send-currency.html

Update the form to support the new functions.

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
      <textarea id="seeds" cols="40" rows= "2"></textarea>
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
                            <td align="right">
                              Destination
                            </td>
                            <td>
                              <input type="text" id="operationalDestinationField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            </td>
                            <td align="right">
                            <input type="checkbox" id="operationalDefault" checked="true"/>
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
