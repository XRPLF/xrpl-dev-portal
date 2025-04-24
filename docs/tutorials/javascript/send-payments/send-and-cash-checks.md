---
html: send-and-cash-checks.html
parent: send-payments-using-javascript.html
labels:
  - Accounts
  - Modular Tutorials
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

1. You can use a check to send [tokens](../../../concepts/tokens/index.md) to someone who has not already created a trust line. The trust line is created automatically when the receiver chooses to accept the funds.
2. The receiver can choose to accept less than the full amount of the check. This allows you to authorize a maximum amount when the actual cost is not finalized. 


[![Empty Check Form](/docs/img/mt-send-checks-1-empty-form.png)](/docs/img/mt-send-checks-1-empty-form.png)

## Prerequisites

Download and expand the [Modular Tutorials](../../../../_code-samples/modular-tutorials/payment-modular-tutorials.zip)<!-- {.github-code-download} --> archive.

{% admonition type="info" name="Note" %}
Without the Modular Tutorial Samples, you will not be able to try the examples that follow.
{% /admonition %}

## Usage

To get test accounts:

1. Open `send-checks.html` in a browser.
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

[![Form with Accounts](/docs/img/mt-send-checks-2-form-with-accounts.png)](/docs/img/mt-send-checks-2-form-with-accounts.png)

### Send a Check for XRP

To send a check for XRP:

1. Select **Account 1** or **Account 2**.
2. Enter the **Amount** of XRP to send, in drops.
2. Enter the receiving account address in the **Destination** field.
3. Set the **Currency Code** to _XRP_.
4. Click **Send Check**.

[![Send Check Settings](/docs/img/mt-send-checks-3-send-xrp.png)](/docs/img/mt-send-checks-3-send-xrp.png)

### Send a Check for an Issued Currency

To send a check for an issued currency token:

1. Choose **Account 1** or **Account 2**.
2. Enter the **Amount** of currency to send.
3. Enter the receiving account address in the **Destination** field.
4. Enter the issuing account in the **Issuer** field (for example, the account sending the check).
5. Enter the **Currency** code for your issued currency token.
6. Click **Send Check**.

[![Send Token Check Settings](/docs/img/mt-send-checks-4-send-currency.png)](/docs/img/mt-send-checks-4-send-currency.png)


### Get Checks

Click **Get Checks** to get a list of the current checks you have sent or received. To uniquely identify a check (for example, when cashing a check), use the check's ledger entry ID, in the `index` field.

[![Get Checks with index highlighted](/docs/img/mt-send-checks-5-get-checks.png)](/docs/img/mt-send-checks-5-get-checks.png)

### Cash Check

To cash a check you have received:

1. Enter the **Check ID** (**index** value).
2. Enter the **Amount** you want to collect, up to the full amount of the check.
3. Enter the currency code.
   a. If you cashing a check for XRP, enter _XRP_ in the **Currency Code** field.
	 b. If you are cashing a check for an issued currency token:
	    1. Enter the **Issuer** of the token.
	    2. Enter the **Currency Code** code for the token.
4. Click **Cash Check**.

[![Cashed check results](/docs/img/mt-send-checks-6-cash-check.png)](/docs/img/mt-send-checks-6-cash-check.png)

### Get Token Balance

Click **Get Token Balance** to get a list of obligations and assets for the account.

[![Account Balance](/docs/img/mt-send-checks-7-get-balance.png)](/docs/img/mt-send-checks-7-get-balance.png)

### Cancel Check

To cancel a check you have previously sent to another account.

1. Enter the **Check ID** (`index` value).
2. Click **Cancel Check**.

[![Canceled check results](/docs/img/mt-send-checks-8-cancel-check.png)](/docs/img/mt-send-checks-8-cancel-check.png)

# Code Walkthrough

Download and expand the [Modular Tutorials](../../../../_code-samples/modular-tutorials/payment-modular-tutorials.zip)<!-- {.github-code-download} --> archive.

## send-checks.js

### sendCheck()

Connect to the XRP ledger and get the account wallet.

```javascript
async function sendCheck() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  results = `\nConnected to ${net}.`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
```

Prepare the transaction. Set the *check_amount* variable to the value in the **Amount** field.

```javascript
  let check_amount = amountField.value
```

 If the currency field is not _XRP_, create an `amount` object with the _currency_, _value_, and _issuer_. Otherwise, use the *check_amount* value as is.

 ```javascript
  if (currencyField.value !=  "XRP") {
  	check_amount = {
      "currency": currencyField.value,
      "value": amountField.value,
      "issuer": wallet.address  	
  	}
  }
  ```

  Create the transaction object.

  ```javascript
  const send_check_tx = {
    "TransactionType": "CheckCreate",
    "Account": wallet.address,
    "SendMax": check_amount,
    "Destination": destinationField.value
  }
```

Autofill the remaining values and sign the prepared transaction.

```javascript
  const check_prepared = await client.autofill(send_check_tx)
  const check_signed = wallet.sign(check_prepared)
```

Send the transaction and wait for the results.

```javascript
  results += '\nSending ' + amountField.value + ' ' + currencyField.value + ' to ' +
    destinationField.value + '...\n'
  resultField.value = results
  const check_result = await client.submitAndWait(check_signed.tx_blob)
```

Report the results.

```javascript
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded:\n'
    resultField.value += JSON.stringify(check_result.result, null, 2)
  } else {
    results += `Error sending transaction: ${check_result.result.meta.TransactionResult}`
    resultField.value = results
  }
```

Update the **XRP Balance** field.

```javascript
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
```

Disconnect from the XRP ledger.

```javascript
  client.disconnect()
} // end of sendCheck()
```

## getChecks()

Connect to the XRP Ledger.

```javascript
async function getChecks() {
  let net = getNet();
  const client = new xrpl.Client(net);
  await client.connect();
```
Initialize the results string and display the connection status.

```javascript
  let results = `\nConnected to ${net}.`;
  resultField.value = results;
```

Define an `account_objects` query, filtering for the _check_ object type.

```javascript
  const check_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": accountAddressField.value,
    "ledger_index": "validated",
    "type": "check"
  });
```
Display the retrieved `Check` objects in the result field.

```javascript
  resultField.value = JSON.stringify(check_objects.result, null, 2);
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect();
} // End of getChecks()
```

## cashCheck()

Connect to the XRP Ledger and get the account wallet

```javascript
async function cashCheck() {
  let net = getNet();
  const client = new xrpl.Client(net);
  await client.connect();
  results = `\nConnected to ${net}.`;
  resultField.value = results;
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
```

Set the check amount.

```javascript
  let check_amount = amountField.value;
```

If the currency is not _XRP_, create an `amount` object with _value_, _currency_, and _issuer_.

```javascript
  if (currencyField.value != "XRP") {
    check_amount = {
      "value": amountField.value,
      "currency": currencyField.value,
      "issuer": issuerField.value
    };
  }
```

Create the `CheckCash` transaction object.

```javascript
  const cash_check_tx = {
    "TransactionType": "CheckCash",
    "Account": wallet.address,
    "Amount": check_amount,
    "CheckID": checkIdField.value
  };
```

Autofill the transaction details.

```javascript
  const cash_prepared = await client.autofill(cash_check_tx);
```

Sign the prepared transaction.

```javascript
  const cash_signed = wallet.sign(cash_prepared);
  results += ' Receiving ' + amountField.value + ' ' + currencyField.value + '.\n';
  resultField.value = results;
```

Submit the transaction and wait for the result.

```javascript
  const check_result = await client.submitAndWait(cash_signed.tx_blob);
```

Report the transaction results.

```javascript
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += 'Transaction succeeded:\n' + JSON.stringify(check_result.result, null, 2);
    resultField.value = results;
  } else {
    results += `Error sending transaction: ${check_result.result.meta.TransactionResult}`;
    resultField.value = results;
  }
```

 Update the XRP Balance field.

```javascript
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address));
```

Disconnect from the XRP ledger.

```javascript
  client.disconnect();
} // end of cashCheck()
```

## cancelCheck()

Connect to the XRP Ledger and get the account wallet.

```javascript
async function cancelCheck() {
  // Connect to the XRP Ledger.
  let net = getNet();
  const client = new xrpl.Client(net);
  await client.connect();
  results = `\nConnected to ${net}.`;
  resultField.value = results;
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value);
```

Create the CheckCancel transaction object, passing the wallet address and the Check ID value (the _Index_).

```javascript
  const cancel_check_tx = {
    "TransactionType": "CheckCancel",
    "Account": wallet.address,
    "CheckID": checkIdField.value
  };
```

Autofill the transaction details.

```javascript
  const cancel_prepared = await client.autofill(cancel_check_tx);
```

Sign the prepared transaction.

```javascript
  const cancel_signed = wallet.sign(cancel_prepared);
  results += ' Cancelling check.\n';
  resultField.value = results;
```

Submit the transaction and wait for the results.

```javascript
  const check_result = await client.submitAndWait(cancel_signed.tx_blob);
```

Report the transaction results.

```javascript
  if (check_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += `Transaction succeeded: ${check_result.result.meta.TransactionResult}`;
    resultField.value = results;
  } else {
    results += `Error sending transaction: ${check_result.result.meta.TransactionResult}`;
    resultField.value = results;
  }
```

Update the XRP Balance field.

```javascript
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address));
```

Disconnect from the XRP ledger.

```javascript
  client.disconnect();
} // end of cancelCheck()
```

## 10.send-checks.html

```html
<html>
<head>
    <title>Send Checks</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <link href="modular-tutorials.css" rel="stylesheet">
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script>
    <script src="account-support.js"></script>
    <script src='send-xrp.js'></script>
    <script src='send-currency.js'></script>
    <script src='send-checks.js'></script>
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
    <h1>Send Checks</h1>
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
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Currency code for the check.">
                    <lable for="currencyField">Currency Code</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="currencyField" size="40"></input>
                    <br>
                </td> 
                <td>
                    <button type="button" onClick="sendCheck()">Send Check</button>
                </td>               
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Issuing account for the currency.">
                    <lable for="issuerField">Issuer</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="issuerField" size="40"></input>
                    <br>
                </td> 
                <td>
                    <button type="button" onClick="cashCheck()">Cash Check</button>
                </td>              
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Amount of XRP to send.">
                        <label for="amountField">Amount</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="amountField" size="40"></input>
                    <br>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="getChecks()">Get Checks</button>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Destination account address where XRP is sent.">
                    <lable for="destinationField">Destination</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="destinationField" size="40"></input>
                    <br>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="cancelCheck()">Cancel Check</button>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Check ID.">
                    <lable for="checkIdField">Check ID</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="checkIdField" size="40"></input>
                    <br>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="getTokenBalance()">Get Token Balance</button>
                </td>
            </tr>
            <tr>
                <td colspan="2">
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
