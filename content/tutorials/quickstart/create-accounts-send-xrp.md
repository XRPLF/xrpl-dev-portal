---
html: create-accounts-send-xrp.html
parent: xrpl-quickstart.html
blurb: Quickstart 1, create two accounts and transfer XRP between them.
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - XRP
---
# 1. Create Accounts and Send XRP

This example shows how to:


1. Create accounts on the Testnet, funded with 10000 test XRP with no actual value. 
2. Retrieve the accounts from seed values.
3. Transfer XRP between accounts.

When you create an account, you receive a public/private key pair offline. It does not appear on the ledger until it is funded with XRP. This example shows how to create accounts for Testnet, but not how to create an account that you can use on Mainnet.

![Token Test Harness](img/quickstart2.png)


## Prerequisites

To get started, create a new folder on your local disk and install the JavaScript library using `npm`.


```
    npm install xrpl
```


Download and expand the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive.

## Usage

To get test accounts:



1. Open `1.get-accounts-send-xrp.html` in a browser
2. Choose **Testnet** or **Devnet**.
3. Click **Get New Standby Account**.
4. Click **Get New Operational Account.**
5. Copy and paste the **Seeds** field in a persistent location, such as a Notepad, so that you can reuse the accounts after reloading the form.



![Standby and Operational Accounts](img/quickstart3.png)

You can transfer XRP between your new accounts. Each account has its own fields and buttons.

To transfer XRP between accounts:



1. Enter the **Amount** of XRP to send.
2. Enter the **Destination** account (for example, copy and paste the Operational **Account Field** to the Standby **Destination** field).
3. Click **Send XRP>** to transfer XRP from the standby account to the operational account, or **&lt;Send XRP** to transfer XRP from the operational account to the standby account.



![Transferred XRP](img/quickstart4.png)



# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} in the source repository for this website.



## ripplex-1-send-xrp.js

This example can be used with any XRP Ledger network, _Testnet_, or _Devnet_. You can update the code to choose different or additional XRP Ledger networks.


### getNet()


```javascript
// ******************************************************
// ************* Get the Preferred Network **************
// ******************************************************   

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
          document.getElementById('standbyResultField').value = results
        } else {
          document.getElementById('operationalResultField').value = results
        }
```


Connect to the server.


```javascript
        await client.connect()


        results += '\nConnected, funding wallet.'
        if (type == 'standby') {
          document.getElementById('standbyResultField').value = results
        } else {
          document.getElementById('operationalResultField').value = results
        }
```


Create and fund a test account wallet.


```javascript
       const my_wallet = (await client.fundWallet(null, { faucetHost: walletServer})).wallet
```


Get the current XRP balance for the account.


```javascript
        const my_balance = (await client.getXrpBalance(my_wallet.address)) 

```


If this is a standby account, populate the standby account fields.


```javascript
        if (type == 'standby') {
          document.getElementById('standbyAccountField').value = my_wallet.address
          document.getElementById('standbyPubKeyField').value = my_wallet.publicKey
          document.getElementById('standbyPrivKeyField').value = my_wallet.privateKey
          document.getElementById('standbyBalanceField').value = 
              (await client.getXrpBalance(my_wallet.address))
          document.getElementById('standbySeedField').value = my_wallet.seed
          results += '\nStandby account created.'
          document.getElementById('standbyResultField').value = results
```


Otherwise, populate the operational account fields.


```javascript
        } else {
          document.getElementById('operationalAccountField').value = my_wallet.address
          document.getElementById('operationalPubKeyField').value = my_wallet.publicKey
          document.getElementById('operationalPrivKeyField').value = my_wallet.privateKey
          document.getElementById('operationalSeedField').value = my_wallet.seed
          document.getElementById('operationalBalanceField').value = 
              (await client.getXrpBalance(my_wallet.address))
          results += '\nOperational account created.'
          document.getElementById('operationalResultField').value = results
        }
```


Insert the seed values for both accounts as they are created to the **Seeds** field as a convenience. You can copy the values and store them offline. When you reload this form or another in this tutorial, copy and paste them into the **Seeds** field to retrieve the accounts with the `getAccountsFromSeeds()` function.


```javascript
        document.getElementById('seeds').value = standbySeedField.value + '\n' + operationalSeedField.value
```


Disconnect from the XRP ledger. 


```
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


```
        let net = getNet()
        const client = new xrpl.Client(net)
        results = 'Connecting to ' + getNet() + '....'
        document.getElementById('standbyResultField').value = results
        await client.connect()
        results += '\nConnected, finding wallets.\n'
        document.getElementById('standbyResultField').value = results


```


Parse the **Seeds** field.


```


        var lines = seeds.value.split('\n');
```


Get the `standby_wallet` based on the seed in the first line. Get the `operational_wallet` based on the seed in the second line.


```
        const standby_wallet = xrpl.Wallet.fromSeed(lines[0])
        const operational_wallet = xrpl.Wallet.fromSeed(lines[1])


```


Get the current XRP balances for the accounts.


```
        const standby_balance = (await client.getXrpBalance(standby_wallet.address))  
        const operational_balance = (await client.getXrpBalance(operational_wallet.address))  
```


Populate the fields for the standby and operational accounts.


```
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


```


Disconnect from the XRP Ledger.


```
       client.disconnect()


      } // End of getAccountsFromSeeds()
```



### Send XRP


```
// *******************************************************
// ******************** Send XRP *************************
// *******************************************************

      async function sendXRP() {
```


Connect to your selected ledger.


```


        results  = "Connecting to the selected ledger.\n"
        document.getElementById('standbyResultField').value = results
        let net = getNet()
        results = 'Connecting to ' + getNet() + '....'
        const client = new xrpl.Client(net)
        await client.connect()


        results  += "\nConnected. Sending XRP.\n"
        document.getElementById('standbyResultField').value = results


        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
        const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        const sendAmount = standbyAmountField.value


        results += "\nstandby_wallet.address: = " + standby_wallet.address
        document.getElementById('standbyResultField').value = results


```

Prepare the transaction. This is a Payment transaction from the standby wallet to the operational wallet.

The _Payment_ transaction expects the XRP to be expressed in drops, or 1/millionth of an XRP.  You can use the xrpToDrops utility to convert the send amount for you (which beats having to type an extra 6 zeroes to send 1 XRP).


```
        const prepared = await client.autofill({
          "TransactionType": "Payment",
          "Account": standby_wallet.address,
          "Amount": xrpl.xrpToDrops(sendAmount),
          "Destination": standbyDestinationField.value
        })


```


Sign the prepared transaction.


```
        const signed = standby_wallet.sign(prepared)


```


Submit the transaction and wait for the results.


```
        const tx = await client.submitAndWait(signed.tx_blob)
```


Request the balance changes caused by the transaction and report the results.


```


         results  += "\nBalance changes: " + 
            JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
         document.getElementById('standbyResultField').value = results

        document.getElementById('standbyBalanceField').value = 
          (await client.getXrpBalance(standby_wallet.address))
        document.getElementById('operationalBalanceField').value = 
          (await client.getXrpBalance(operational_wallet.address))                 
        client.disconnect()


      } // End of sendXRP()
```



### Reciprocal Transactions

For each of the transactions, there is an accompanying reciprocal transaction, with the prefix _oP,_ for the operational account. See the corresponding function for the standby account for code commentary.


```
// **********************************************************************
// ****** Reciprocal Transactions ****************************************
// **********************************************************************


// *******************************************************
// ********* Send XRP from Operational account ***********
// *******************************************************


      async function oPsendXRP() {


        results  = "Connecting to testnet.\n"
        document.getElementById('operationalResultField').value = results
        let net = getNet()
        results = 'Connecting to ' + getNet() + '....'
        const client = new xrpl.Client(net)
        await client.connect()


        results  += "\nConnected. Sending XRP.\n"
        document.getElementById('operationalResultField').value = results


        const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
        const sendAmount = operationalAmountField.value


        results += "\noperational_wallet.address: = " + operational_wallet.address
        document.getElementById('operationalResultField').value = results


        // ---------------------------------- Prepare transaction
        // Note that the destination is hard coded.
        const prepared = await client.autofill({
          "TransactionType": "Payment",
          "Account": operational_wallet.address,
          "Amount": xrpl.xrpToDrops(operationalAmountField.value),
          "Destination": operationalDestinationField.value
        })


        // ---------------------------- Sign prepared instructions
        const signed = operational_wallet.sign(prepared)


        // ------------------------------------ Submit signed blob
        const tx = await client.submitAndWait(signed.tx_blob)


         results  += "\nBalance changes: " + 
            JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
         document.getElementById('operationalResultField').value = results


        document.getElementById('standbyBalanceField').value = 
          (await client.getXrpBalance(standby_wallet.address))
        document.getElementById('operationalBalanceField').value = 
          (await client.getXrpBalance(operational_wallet.address))                 


        client.disconnect()


      } // End of oPsendXRP()
```



## 1.get-accounts-send-xrp.html

Create a standard HTML form to send transactions and requests, then display the results.  


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
    <script src='https://unpkg.com/xrpl@2.2.3'></script>
    <script src='ripplex1-send-xrp.js'></script>
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
                  </table>
                  <p align="right">
                    <textarea id="standbyResultField" cols="80" rows="20" ></textarea>
                  </p>
                </td>
                </td>
                <td>
                  <table>
                    <tr valign="top">
                      <td align="center" valign="top">
                        <button type="button" onClick="sendXRP()">Send XRP&#62;</button>
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
                  <table>
                    <tr>
                      <td align="center" valign="top">
                        <button type="button" onClick="oPsendXRP()">&#60;Send XRP</button>
                        </td>
                        <td align="right">
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

| Previous                                | Next                                                                          |
| :---                                    |                                                                          ---: |
| [← XRPL Quickstart >](xrpl-quickstart.html) | [2. Create Trust Line and Send Currency → >](create-trustline-send-currency.html) |
