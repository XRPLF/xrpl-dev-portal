---
html: create-accounts-send-xrp-using-javascript.html
parent: send-payments-using-javascript.html
seo:
    description: Create two accounts and transfer XRP between them.
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - XRP
---
# Create Accounts and Send XRP Using JavaScript

This example shows how to:

1. Create accounts on the Testnet, funded with 1000 test XRP with no actual value. 
2. Retrieve the accounts from seed values.
3. Transfer XRP between accounts.

When you create an account, you receive a public/private key pair offline. Your account does not appear on the ledger until it is funded with XRP. This example shows how to create accounts for Testnet, but not how to create an account that you can use on Mainnet.

[![XRPL Base Module](/docs/img/mt-send-xrp-1-xrpl-base-module.png)](/docs/img/mt-send-xrp-1-xrpl-base-module.png)

## Prerequisites

To get started, create a new folder on your local disk and install the JavaScript library using `npm`.

```
npm install xrpl
```

Download and expand the [Payment Modular Tutorial Samples](/_code-samples/modular-tutorials/payment-modular-tutorials.zip) archive.

{% admonition type="info" name="Note" %}Without the Payment Modular Tutorials Samples, you will not be able to try the examples that follow. {% /admonition %}

## Usage

To get test accounts:

1. Open `1.get-accounts-send-xrp.html` in a browser
2. Choose **Testnet** or **Devnet**.
3. Click **Get New Account 1**.
4. Click **Get New Account 2.**
5. Optionally fill in **Account 1 Name** and **Account 2 Name**.

The name fields are there for you to create an arbitrary label to make the account easier to recognize when switching back and forth than the 34 character account address. For example, I might name the accounts after my friends _Alfredo_ and _Binti_. The name is a local value that is never sent to the XRPL server.

[![Accounts 1 and 2](/docs/img/mt-send-xrp-2-named-accounts.png)](/docs/img/mt-send-xrp-2-named-accounts.png)

To transfer XRP from Account 1 to Account 2:

1. Click the **Account 1** radio button. The information about Account 1 populates the uneditable fields of the form. 
2. Enter the **Amount** of XRP to send.
2. Copy and paste the **Account 2 Address** value to the **Destination** field.
3. Click **Send XRP** to transfer XRP from Account 1 to Account 2.

The **Results** field shows the change in balance in each of the accounts. Note that sending the XRP cost an additional .000001 XRP as the transfer fee. The transfer fee is small enough to be no burden for legitimate users, but is there to stop spammers from making DDS attacks against the XRP Ledger (sending millions of false transactions will quickly add up to real money).

[![Transferred XRP](/docs/img/mt-send-xrp-3-transferred-xrp.png)](/docs/img/mt-send-xrp-3-transferred-xrp.png)

Click **Account 2** to see its XRP balance.

To transfer XRP from Account 2 back to Account 1:

1. Click the **Account 2** radio button.
2. Enter the **Amount** of XRP to send.
3. Copy and paste the **Account 1 Address** value to the **Destination** field.
4. Click **Send XRP** to transfer XRP from Account 1 to Account 2.
5. Click the **Account 1** radio button to see its new XRP balance.


[![Transferred XRP from Account 2 to Account 1](/docs/img/mt-send-xrp-4-account2-send-xrp.png)](/docs/img/mt-send-xrp-4-account2-send-xrp.png)

## Gather and Distribute Account Information

For most exercises, it's fine if you want to create a new account. If want to use the same account in another exercise, you can gather the information from both accounts to the **Result** field to paste into the next form.

1. Click **Gather Account Info**.
2. Copy the name, address, and seed values from the **Result** field.

[![Copy gathered info from the Result field.](/docs/img/mt-send-xrp-5-gather-account-info.png)](/docs/img/mt-send-xrp-5-gather-account-info.png)

3. Go to the next modular tutorial form.
4. Paste the values in the **Result** field.
5. Click **Distribute Account Info** to populate all of the Account 1 and Account 2 fields.

## Getting the XRP Balance

The **XRP Balance** field is automatically updated when you choose **Account 1** or **Account 2**. If you send XRP to an account from another application and you want to see the result, you can click **Get XRP Balance** at any time to see the currently available XRP.

## Getting the Token Balance

You can see the balance of all issued currencies, MPTs, and other tokens by clicking **Get Token Balance**. You can issue and send tokens in many of the modular tutorials that build off the XRPL Base Module.

# Code Walkthrough

You can download the [Payment Modular Tutorials](/_code-samples/modular-tutorials/payment-modular-tutorials.zip) from the source repository for this website.

## account-support.js

This file contains the functions all of the modular examples use to create, use, and reuse accounts.

### getNet()

This function can be used with _Testnet_, or _Devnet_. It allows you to select between them with a radio button to set the _net_ variable with the server URL.

```javascript
function getNet() {
  let net
  if (document.getElementById("tn").checked) net = "wss://s.altnet.rippletest.net:51233/"
  if (document.getElementById("dn").checked) net = "wss://s.devnet.rippletest.net:51233/"
  return net
} // End of getNet()
```
### getAccount()

The `getAccount()` function uses the faucet host to fund a new account wallet

```javascript
async function getAccount() {
```

Get the selected network, create a new client, and connect to the XRPL serever.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  resultField.value = `===Getting Account===\n\nConnected to ${net}.`
```

Request a new wallet funded with play-money XRP for experimentation.

```javascript
  try {
    let faucetHost = null
    const my_wallet = (await client.fundWallet(null, { faucetHost})).wallet
    const newAccount = [my_wallet.address, my_wallet.seed]
    return (newAccount)
  }
```

Catch and report any errors.

```javascript
  catch (error) {
    console.error('Error getting account:', error);
    results = `\n===Error: ${error.message}===\n`
    resultField.value += results
    throw error; // Re-throw the error to be handled by the caller
  }
```

Disconnect from the XRPL server and return the address and seed information.

```javascript
  client.disconnect()
  return (newAccount)
} // End of getAccount()
```

### getNewAccount1() and getNewAccount2()

These are wrapper functions that call the getAccount() function, then populate the account address and account seed fields for Account1 or Account2, respectively.

```javascript
async function getNewAccount1() {
  account1address.value = "=== Getting new account. ===\n\n"
  account1seed.value = ""
  const accountInfo= await getAccount()
  account1address.value = accountInfo[0]
  account1seed.value = accountInfo[1]
}


async function getNewAccount2() {
  account2address.value = "=== Getting new account. ===\n\n"
  account2seed.value = ""
  const accountInfo= await getAccount()
  account2address.value = accountInfo[0]
  account2seed.value = accountInfo[1]
}
```

### getAccountFromSeed()

This function uses an existing seed value to access the client information from the XRP Ledger, then return the account address.

```javascript
async function getAccountFromSeed(my_seed) {
  const net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = '===Finding wallet.===\n\n'
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(my_seed)
    const address = wallet.address
    results += "===Wallet found.===\n\n"
    results += "Account address: " + address + "\n\n"
    resultField.value = results
    return (address)
  }
```
Catch and report any errors.

```javascript
    catch (error) {
    console.error('===Error getting account from seed:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  ```

  Disconnect from the XRP Ledger and return the .

  ```javascript
  finally {
    await client.disconnect();
  }
} // End of getAccountFromSeed()
```
### getAccountFromSeed1 and getAccountFromSeed2

These wrapper functions populate the Account1 Address or Account2 address from a seed value, respectively.

```javascript
async function getAccountFromSeed1() {
  account1address.value = await getAccountFromSeed(account1seed.value)
}

async function getAccountFromSeed2() {
  account2address.value = await getAccountFromSeed(account2seed.value)
}
```

### gatherAccountInfo()

This local function copies the name, account, and seed values for Account1 and Account2 and displays the information in the **Result** field. You can then copy the information to reuse in another modular tutorial.

```javascript
function gatherAccountInfo() {
  let accountData = account1name.value + "\n" + account1address.value + "\n" + account1seed.value + "\n"
  accountData += account2name.value + "\n" + account2address.value + "\n" + account2seed.value
  resultField.value = accountData
}
```

### distributeAccountInfo()

This local function parses structured account information from the **Result** field and distributes it to the corresponding account fields. It is the counterpart to the gatherAccountInfo() utility. The purpose is to let you continue to use the same accounts in all of the modular examples. If you have information that doesn't perfectly conform, you can still use this utility to populate the fields with the information that does fit the format.

```javascript
function distributeAccountInfo() {
  let accountInfo = resultField.value.split("\n")
  account1name.value = accountInfo[0]
  account1address.value = accountInfo[1]
  account1seed.value = accountInfo[2]
  account2name.value = accountInfo[3]
  account2address.value = accountInfo[4]
  account2seed.value = accountInfo[5]
}
```

### populate1() and populate2

These local functions populate the active form fields with values for their correesponding accounts.

```javascript
function populate1() {
  accountNameField.value = account1name.value
  accountAddressField.value = account1address.value
  accountSeedField.value = account1seed.value
  getXrpBalance()
}

function populate2() {
  accountNameField.value = account2name.value
  accountAddressField.value = account2address.value
  accountSeedField.value = account2seed.value
  getXrpBalance()
}
```

### getXrpBalance()

Connect to the XRP Ledger, send a `getXrpBalance()` request for the current acitve account, then display it in the **XRP Balance Field**.

```javascript
async function getXrpBalance() {
  const net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Getting XRP balance...===\n\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const balance = await client.getXrpBalance(wallet.address)
    results += accountNameField.value + " current XRP balance: " + balance + "\n\n"
    xrpBalanceField.value = await client.getXrpBalance(accountAddressField.value)
    resultField.value = results
  }
  ```

  Catch any errors and disconnect from the XRP Ledger.

  ```javascript
  catch (error) {
    console.error('Error getting XRP balance:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
```
### getTokenBalance()

Get the balance of all tokens for the current active account. This is a function that is used frequently in other modular tutorials that deal with currencies other than XRP.

```javascript
async function getTokenBalance() {
```

Connect with the network.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()   
  let results = `===Connected to ${net}.===\n===Getting account token balance...===\n\n`
  resultField.value += results
```

Send a request to get the account balance, then wait for the results.

```javascript
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const balance = await client.request({
      command: "gateway_balances",
      account: wallet.address,
      ledger_index: "validated",
    })
    results = accountNameField.value + "\'s token balance(s): " + JSON.stringify(balance.result, null, 2) + "\n"
    resultField.value += results
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
  }
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript

  catch (error) {
    console.error('Error getting token balance:', error);
    results = `\nError: ${error.message}\n`
    resultField.value += results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} 
```

## base-module.html

Create a standard HTML form to send transactions and requests, then display the results.  

```html
<html>
<head>
    <title>XRPL Base Module</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <link href="modular-tutorials.css" rel="stylesheet">
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script>
    <script src="account-support.js"></script>
    <script src='send-xrp.js'></script>
</head>

<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->

<body>
    <h1>XRPL Base Module</h1>
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
                <td>
                    <button type="button" onClick="sendXRP()">Send XRP</button>
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
                    <button type="button" onClick="getXrpBalance()">Get XRP Balance</button>
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
