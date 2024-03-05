---
html: send-and-cash-checks.html
parent: send-payments-using-javascript.html
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - Checks
  - XRP
---
# Send and Cash Checks

This example shows how to:

1. Send a check to transfer XRP or issued currency to another account. 
2. Get a list of checks you have sent or received.
3. Cash a check received from another account.
4. Cancel a check you have sent.

Checks offer another option for transferring funds between accounts. Checks have two particular advantages.

1. You can use a check to send funds to another account without first creating a trust line - the trust line is created automatically when the receiver chooses to accept the funds.
2. The receiver can choose to accept less than the full amount of the check. This allows you to authorize a maximum amount when the actual cost is not finalized. 


[![Empty Check Form](/docs/img/quickstart-checks1.png)](/docs/img/quickstart-checks1.png)

## Prerequisites

Clone or download the [Modular Tutorial Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/){.github-code-download}.

**Note:** Without the Quickstart Samples, you will not be able to try the examples that follow. 

## Usage

To get test accounts:

1. Open and launch `10check.html`.
2. Click **Get Standby Account**.
3. Click **Get Operational Account**.

[![Form with New Accounts](/docs/img/quickstart-checks2.png)](/docs/img/quickstart-checks2.png)

You can transfer XRP between your new accounts. Each account has its own fields and buttons.

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/5zRBC7dGSaM?si=Glf3_uh7w0UUNHU8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Send a Check for XRP

To send a check for XRP from the Standby account to the Operational account:

1. On the Standby (left) side of the form, enter the **Amount** of XRP to send, in drops.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Set the **Currency** to _XRP_.
4. Click **Send Check**.

[![Send Check Settings](/docs/img/quickstart-checks3.png)](/docs/img/quickstart-checks3.png)

### Send a Check for an Issued Currency

To send a check for an issued currency token from the Standby account to the Operational account:

1. On the Standby side of the form, enter the **Amount** of currency to send.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Copy the **Standby Account** field and paste the value in the **Issuer** field.
4. Enter the **Currency** code for your token.
5. Click **Send Check**.

[![Send Token Check Settings](/docs/img/quickstart-checks4.png)](/docs/img/quickstart-checks4.png)


### Get Checks

Click **Get Checks** to get a list of the current checks you have sent or received. To uniquely identify a check (for existence, when cashing a check), capture the _index_ value for the check.

[![Get Checks with index highlighted](/docs/img/quickstart-checks5.png)](/docs/img/quickstart-checks5.png)

### Cash Check

To cash a check you have received:

1. Enter the **Check ID** (**index** value).
2. Enter the **Amount** you want to collect, up to the full amount of the check.
3. Enter the currency code.
   a. If you cashing a check for XRP, enter _XRP_ in the **Currency** field.
	 b. If you are cashing a check for an issued currency token:
	    1. Enter the **Issuer** of the token.
	    2. Enter the **Currency** code for the token.
4. Click **Cash Check**.

[![Cashed check results](/docs/img/quickstart-checks6.png)](/docs/img/quickstart-checks6.png)


### Get Balances

Click **Get Balances** to get a list of obligations and assets for each account.

[![Account Balances](/docs/img/quickstart-checks7.png)](/docs/img/quickstart-checks7.png)

### Cancel Check

To cancel a check you have previously sent to another account.

1. Enter the **Check ID** (**index** value).
2. Click **Cancel Check**.

[![Canceled check results](/docs/img/quickstart-checks8.png)](/docs/img/quickstart-checks8.png)


# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/){.github-code-download} in the source repository for this website.

## ripplex10-check.js

### sendCheck()

Connect to the XRP ledger.

```javascript
async function sendCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
```

Instantiate the account wallets. 

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
```

Create the `check_amount` variable, based on the standby amount field.

```javascript
  var check_amount = standbyAmountField.value
```

If the currency is anything but _XRP_, it's an issued currency. Update the `check_amount` variable to include the `currency` and `issuer` fields.

```javascript
  if (standbyCurrencyField.value !=  "XRP") {
  	check_amount = {
      "currency": standbyCurrencyField.value,
      "value": standbyAmountField.value,
      "issuer": standby_wallet.address  	
  	}
  }
```

Define the `CheckCreate` transaction.

```javascript
  const send_check_tx = {
    "TransactionType": "CheckCreate",
    "Account": standby_wallet.address,
    "SendMax": check_amount,
    "Destination": standbyDestinationField.value
  }
```

Prepare and sign the transaction.

```javascript
  const check_prepared = await client.autofill(send_check_tx)
  const check_signed = standby_wallet.sign(check_prepared)
  results += 'Sending ' + check_amount + ' ' + standbyCurrencyField + ' to ' +
    standbyDestinationField.value + '...'
  standbyResultField.value = results
```

Submit the transaction to the XRP Ledger and wait for the response.

```
  const check_result = await client.submitAndWait(check_signed.tx_blob)
```

Report the results

```javascript
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${check_signed.hash}'
    standbyResultField.value = JSON.stringify(check_result.result, null, 2)
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
```

Update the XRP balance fields.

```javascript
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // end of sendCheck()
```

### getChecks()

```javascript
async function getChecks() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()   
  results += '\nConnected.'
  standbyResultField.value = results
  results= "\nGetting standby account checks...\n"
```

Define and send the `account_objects` request, specifying `check` objects.

```javascript
  const check_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": standbyAccountField.value,
    "ledger_index": "validated",
    "type": "check"
  })
```

Report the results.

```javascript
  standbyResultField.value = JSON.stringify(check_objects.result, null, 2)
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // End of getChecks()
```
### cashCheck()

Connect to the XRP Ledger and instantiate the account wallets.

```javascript
async function cashCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
```

Set the `check_amount` variable to the value in the **Amount** field.

```javascript
  var check_amount = standbyAmountField.value
```

If the **Currency** is anything other than `XRP`, the check is for an issued currency. Redefine the variable to include the `currency` and `issuer` for the token.

```
  if (standbyCurrencyField.value !=  "XRP") {
  	check_amount = {
      "value": standbyAmountField.value,
      "currency": standbyCurrencyField.value,
      "issuer": standbyIssuerField.value  	
  	}
  }
```

Define the `CheckCash` transaction.

```javascript
  const cash_check_tx = {
    "TransactionType": "CheckCash",
    "Account": standby_wallet.address,
    "Amount": check_amount,
    "CheckID": standbyCheckID.value
  }
```

Prepare and sign the transaction.

```javascript
  const cash_prepared = await client.autofill(cash_check_tx)
  const cash_signed = standby_wallet.sign(cash_prepared)
  results += ' Receiving ' + standbyAmountField.value + ' ' + standbyCurrencyField.value + '.\n'
  standbyResultField.value = results
```

Submit the transaction and wait for the results.

```javascript
  const check_result = await client.submitAndWait(cash_signed.tx_blob)
```

Report the results.

```javascript
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    standbyResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
```

Update the XRP balance fields.

```javascript
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // end of cashCheck()
```

### cancelCheck

Connect to the XRP Ledger and instantiate the account wallets.

```javascript
async function cancelCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  await client.connect()
  results += '\nConnected.'
  standbyResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
```

Define the `CheckCancel` transaction.

```javascript
  const cancel_check_tx = {
    "TransactionType": "CheckCancel",
    "Account": standby_wallet.address,
    "CheckID": standbyCheckID.value
  }
```

Prepare and sign the transaction object.

```javascript
  const cancel_prepared = await client.autofill(cancel_check_tx)
  const cancel_signed = standby_wallet.sign(cancel_prepared)
  results += ' Cancelling check.\n'
  standbyResultField.value = results
```

Submit the transaction and wait for the results.

```javascript
  const check_result = await client.submitAndWait(cancel_signed.tx_blob)
```

Report the results.

```javascript
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    standbyResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    standbyResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
```

Update the XRP balance fields.

```javascript
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // end of cancelCheck()
```

### Reciprocal functions for the Operational account.

```javascript
// *******************************************************
// ************ Operational Send Check *******************
// *******************************************************
async function opSendCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)

  const issue_quantity = operationalAmountField.value
  var check_amount = operationalAmountField.value
  
  if (operationalCurrencyField.value !=  "XRP") {
  	check_amount = {
      "currency": operationalCurrencyField.value,
      "value": operationalAmountField.value,
      "issuer": operational_wallet.address  	
  	}
  }  
  const send_check_tx = {
    "TransactionType": "CheckCreate",
    "Account": operational_wallet.address,
    "SendMax": check_amount,
    "Destination": operationalDestinationField.value
  }
  const check_prepared = await client.autofill(send_check_tx)
  const check_signed = operational_wallet.sign(check_prepared)
  results += '\nSending check to ' +
    operationalDestinationField.value + '...'
  operationalResultField.value = results
  const check_result = await client.submitAndWait(check_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${check_signed.hash}'
    operationalResultField.value = JSON.stringify(check_result.result, null, 2)
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
} // end of opSendCheck()

// *******************************************************
// ************ Operational Get Checks *******************
// *******************************************************

async function opGetChecks() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()   
  results += '\nConnected.'
  operationalResultField.value = results

  results= "\nGetting standby account checks...\n"
  const check_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": operationalAccountField.value,
    "ledger_index": "validated",
    "type": "check"
  })
  operationalResultField.value = JSON.stringify(check_objects.result, null, 2)
  client.disconnect()
} // End of opGetChecks()


// *******************************************************
// ************* Operational Cash Check ******************
// *******************************************************
      
async function opCashCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)

  var check_amount = operationalAmountField.value
  
  if (operationalCurrencyField.value !=  "XRP") {
  	check_amount = {
      "value": operationalAmountField.value,
      "currency": operationalCurrencyField.value,
      "issuer": operationalIssuerField.value  	
  	}
  }
  const cash_check_tx = {
    "TransactionType": "CheckCash",
    "Account": operational_wallet.address,
    "Amount": check_amount,
    "CheckID": operationalCheckIDField.value
  }
  const cash_prepared = await client.autofill(cash_check_tx)
  const cash_signed = operational_wallet.sign(cash_prepared)
  results += ' Receiving ' + operationalAmountField.value + ' ' + operationalCurrencyField.value + '.\n'
  operationalResultField.value = results
  const check_result = await client.submitAndWait(cash_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    operationalResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
}
// end of opCashCheck()

// *******************************************************
// ************* Operational Cancel Check ****************
// *******************************************************

async function opCancelCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  await client.connect()
  results += '\nConnected.'
  operationalResultField.value = results
          
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        
  const cancel_check_tx = {
    "TransactionType": "CheckCancel",
    "Account": operational_wallet.address,
    "CheckID": operationalCheckIDField.value
  }

  const cancel_prepared = await client.autofill(cancel_check_tx)
  const cancel_signed = operational_wallet.sign(cancel_prepared)
  results += ' Cancelling check.\n'
  operationalResultField.value = results
  const check_result = await client.submitAndWait(cancel_signed.tx_blob)
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${cash_signed.hash}'
    operationalResultField.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    operationalResultField.value = results
    throw 'Error sending transaction: ${check_result.result.meta.TransactionResult}'
  }
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  client.disconnect()
} // end of cancelCheck()
```

## 10.check.html

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
    <script src='ripplex10-check.js'></script>

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
                    <tr>
                      <td align="right">
                        Issuer
                      </td>
                      <td>
                        <input type="text" id="standbyIssuerField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Check ID
                      </td>
                      <td>
                        <input type="text" id="standbyCheckID" size="40"></input>
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
                        <button type="button" onClick="sendCheck()">Send Check</button>
                        <br/>
                        <button type="button" onClick="getChecks()">Get Checks</button>
                        <br/>
                        <button type="button" onClick="cashCheck()">Cash Check</button>
                        <br/>
                        <button type="button" onClick="cancelCheck()">Cancel Check</button>
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
                        <button type="button" onClick="opSendCheck()">Send Check</button>
                        <br/>
                        <button type="button" onClick="opGetChecks()">Get Checks</button>
                        <br/>
                        <button type="button" onClick="opCashCheck()">Cash Check</button>
                        <br/>
                        <button type="button" onClick="opCancelCheck()">Cancel Check</button>
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
                            <td align="right">
                              Issuer
                            </td>
                            <td>
                              <input type="text" id="operationalIssuerField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>
                            <td align="right">
                              Check ID
                            </td>
                            <td>
                              <input type="text" id="operationalCheckIDField" size="40"></input>
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