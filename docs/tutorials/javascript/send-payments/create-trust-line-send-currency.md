---
html: create-trustline-send-currency-using-javascript.html
parent: send-payments-using-javascript.html
seo:
    description: Create Trust Lines and send currency.
labels:
  - Cross-Currency
  - Payments
  - Tokens

---
# Create Trust Line and Send Currency Using JavaScript

This example shows how to:

1. Create a trust line between two accounts.
2. Send issued currency between accounts.
3. Display account balances for all currencies.

[![Send Currency test harness](/docs/img/mt-send-currency-1-empty-form-info.png )](/docs/img/mt-send-currency-1-empty-form-info.png)

You can download the [Payment Modular Tutorials](/_code-samples/modular-tutorials/payment-modular-tutorials.zip) from the source repository for this website.

{% admonition type="info" name="Note" %}Without the Payment modular tutorials, you will not be able to try the examples that follow. {% /admonition %}

## Usage

Open the Send Currency test harness and get accounts:

1. Open `send-currency.html` in a browser.
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

[![Distribute Account Information](/docs/img/mt-send-currency-2-distribute-accounts.png)](/docs/img/mt-send-currency-2-distribute-accounts.png)

If you want an account to be able to transfer issued currency to accounts other than the issuer, the issuer account must be configured to allow rippling. See _Issuer_ in the [Configuring Accounts](../../../concepts/accounts/configuring-accounts.md#issuer) topic.

Accounts can always transfer currency tokens back to the original issuer.

## Create Trust Line

In order to trade standard tokens, you must first establish a trust line from the receiving account to the issuing account.

To create a trust line between accounts:

1. Click **Account 2** to populate the uneditable fields in the form.
2. Enter a [currency code](https://www.iban.com/currency-codes) in the **Currency Code** field.
3. Enter the maximum transfer limit in the **Amount** field.
4. Copy and paste the **Account 1 Address** value to the **Issuer** field.
5. Click **Create Trust Line**.

[![Trust line results](/docs/img/mt-send-currency-3-create-trustline.png)](/docs/img/mt-send-currency-3-create-trustline.png)

## Send an Issued Currency Token

To transfer an issued currency token, once you have created a trust line:

1. Click **Account 1**.
3. Enter the **Currency Code**.
4. Copy and paste the **Account 1 Address** to the **Issuer** field.
4. Enter the **Amount** of issued currency to send.
2. Copy and paste the **Account 2 Address** to the **Destination** field.
4. Click **Send Currency**.

[![Currency transfer](/docs/img/mt-send-currency-4-send-currency.png)](/docs/img/mt-send-currency-4-send-currency.png)

## Get the Current Token Balance

To see the balances for all issued tokens for an account.

1. Click **Account 1** or **Account 2**.
2. Click **Get Token Balance**.

The balance for an issuing account is shown as an obligation.

[![Currency transfer](/docs/img/mt-send-currency-5-issuer-token-balance.png)](/docs/img/mt-send-currency-5-issuer-token-balance.png)

The balance for a holder account is shown as an asset.

[![Currency transfer](/docs/img/mt-send-currency-6-holder-token-balance.png)](/docs/img/mt-send-currency-6-holder-token-balance.png)

# Code Walkthrough

You can download the [Payment Modular Tutorials](/_code-samples/modular-tutorials/payment-modular-tutorials.zip) from the source repository for this website.

## send-currency.js

There are two asynchronous functions in the send-currency.js file that build on the base module to add new behavior for sending issued currency between accounts.

### Create Trust Line

A trust line enables two accounts to trade a defined currency up to a set limit. This gives the participants assurance that any exchanges are between known entities at agreed upon maximum amounts.

Connect to the XRPL server.

```javascript
async function createTrustLine() {
  const net = getNet() 
  const client = new xrpl.Client(net)
  await client.connect()
  let results = "\nConnected. Creating trust line.\n"
  resultField.value = results
```

Create a `TrustSet` transaction, passing the currency code, issuer account, and the total value the holder is willing to accept.

```javascript
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const trustSet_tx = {
      "TransactionType": "TrustSet",
      "Account": accountAddressField.value,
      "LimitAmount": {
        "currency": currencyField.value,
        "issuer": issuerField.value,
        "value": amountField.value
      }
    }
```

Autofill the remaining default transaction parameters.

```javascript
    const ts_prepared = await client.autofill(trustSet_tx)
```

Sign and send the transaction to the XRPL server, then wait for the results.

```javascript
  const ts_signed = wallet.sign(ts_prepared)
  resultField.value = results
  const ts_result = await client.submitAndWait(ts_signed.tx_blob)
```

Report the results of the transaction.

```javascript
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        results += '\n===Trust line established between account \n' +
        accountAddressField.value + ' \n and account\n' + issuerField.value + '.'
        resultField.value = results
    } else {
        results += `\n===Transaction failed: ${ts_result.result.meta.TransactionResult}`
        resultField.value = results     
    }
  }
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript
  catch (error) {
    console.error('===Error creating trust line:', error);
    results += `\n===Error: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
}
//End of createTrustline()
```

### sendCurrency()
This transaction actually sends a transaction that changes balances on both sides of the trust line.

Connect to the XRP Ledger and get the account wallet.

```javascript
async function sendCurrency() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  resultField.value = results
  await client.connect()
  results += '\nConnected.'
  resultField.value = results
```

Create a payment transaction to the destination account, specifying the amount using the currency, value, and issuer.

```javascript
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const send_currency_tx = {
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Amount": {
        "currency": currencyField.value,
        "value": amountField.value,
        "issuer": issuerField.value
      },
      "Destination": destinationField.value
    }
  ```

Autofill the remaining default transaction parameters.

```javascript
    const pay_prepared = await client.autofill(send_currency_tx)
```

Sign and send the prepared payment transaction to the XRP Ledger, then await and report the results.

```javascript
    const pay_signed = wallet.sign(pay_prepared)
    results += `\n\n===Sending ${amountField.value} ${currencyField.value} to ${destinationField.value} ...`
    resultField.value = results
    const pay_result = await client.submitAndWait(pay_signed.tx_blob)
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        results += '\n===Transaction succeeded.'
        resultField.value = results
    } else {
        results += `\n===Transaction failed: ${pay_result.result.meta.TransactionResult}`
        resultField.value = results
        xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
    }
  }
```

Update the XRP value field to reflect the transaction fee.

```javascript
  catch (error) {
    console.error('Error sending transaction:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} // end of sendCurrency()

```

## send-currency.html

Update the form to support the new functions.

```html
<html>
<head>
    <title>Send Currency</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <link href="modular-tutorials.css" rel="stylesheet">
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script>
    <script src="account-support.js"></script>
    <script src='send-xrp.js'></script>
    <script src='send-currency.js'></script>
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
    <h1>Send Currency</h1>
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
                    <span class="tooltip" tooltip-data="Currency code for the trust line.">
                    <lable for="currencyField">Currency Code</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="currencyField" size="40"></input>
                    <br>
                </td> 
                <td>
                    <button type="button" onClick="createTrustLine()">Create Trust Line</button>
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
                    <button type="button" onClick="sendCurrency()">Send Currency</button>
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
                    <button type="button" onClick="getTokenBalance()">Get Token Balance</button>
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
