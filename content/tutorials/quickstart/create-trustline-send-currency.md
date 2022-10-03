---
html: create-trustline-send-currency.html
parent: xrpl-quickstart.html
blurb: Quickstart step 2, create TrustLines and send currency.
labels:
  - Cross-Currency
  - Payments
  - Quickstart
  - Tokens

---

# 2. Create Trust Line and Send Currency

This example shows how to:



1. Configure accounts to allow transfer of funds to third party accounts.
2. Set a currency type for transactions.
3. Create a trust line between the standby account and the operational account.
4. Send issued currency between accounts.
5. Display account balances for all currencies.


![Test harness with currency transfer](img/quickstart5.png)


You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try each of the samples in your own browser.


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


## Create TrustLine

To create a trustline between accounts:



3. Enter a [currency code](https://www.iban.com/currency-codes) in the **Currency** field.
4. Enter the maximum transfer limit in the **Amount** field.
5. Enter the destination account value in the **Destination** field.
6. Click **Create Trustline**.



![Trustline results](img/quickstart6.png)



## Send an Issued Currency Token

To transfer an issued currency token, once you have created a trust line:



1. Enter the **Amount**.
2. Enter the **Destination**.
3. Enter the **Currency** type.
4. Click **Send Currency**.



![Currency transfer](img/quickstart7.png)



# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/js/quickstart.zip){.github-code-download} archive to try each of the samples in your own browser.

## ripplex2-send-currency.js


### Configure Account

When transferring fiat currency, the actual transfer of funds is not simultaneous, as it is with XRP. If currency is transferred to a third party for a different currency, there can be a devaluation of the currency that impacts the originating account. To avoid this situation, this up and down valuation of currency, known as _rippling_, is not allowed by default. Currency transferred from one account can only be transferred back to the same account. To enable currency transfer to third parties, you need to set the _rippleDefault_ value to true. The Token Test Harness provides a checkbox to enable or disable rippling.


```
// *******************************************************
// **************** Configure Account ********************
// *******************************************************
```


Connect to the ledger


```
      async function configureAccount(type, rippleDefault) {
        let net = getNet()
        const client = new xrpl.Client(net)
        results = 'Connecting to ' + getNet() + '....'
        document.getElementById('standbyResultField').value = results
        await client.connect()
        results += '\nConnected, finding wallet.'
        document.getElementById('standbyResultField').value = results
```


Get the account wallets.


```
        if (type=='standby') {
          my_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
        } else {
          my_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        }
        results += '\Ripple Default Setting: ' + rippleDefault
        document.getElementById('standbyResultField').value = results
```


Prepare the transaction. If the _rippleDefault_ argument is true, set the `asfDefaultRipple` flag. If it is false, clear the `asfDefaultRipple` flag.


```
        let settings_tx = {}
        if (rippleDefault) {
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
          document.getElementById('standbyResultField').value = results
```


Autofill the default values for the transaction.


```

          const cst_prepared = await client.autofill(settings_tx)
```


Sign the transaction.


```
          const cst_signed = my_wallet.sign(cst_prepared)
```


Submit the transaction and wait for the result.


```
          const cst_result = await client.submitAndWait(cst_signed.tx_blob)
```


Report the result.


```
          if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
          results += '\nAccount setting succeeded.'
          document.getElementById('standbyResultField').value = results
          } else {
          throw 'Error sending transaction: ${cst_result}'
          results += '\nAccount setting failed.'
          document.getElementById('standbyResultField').value = results
          }


        client.disconnect()
      } // End of configureAccount()
```



### Create Trust Line

A trust line enables two accounts to trade a defined currency up to a set limit. This gives the participants assurance that any exchanges are between known entities at agreed upon maximum amounts.


```
// *******************************************************
// ***************** Create TrustLine ********************
// *******************************************************


      async function createTrustline(type) {
        let net = getNet()
        const client = new xrpl.Client(net)
        results = 'Connecting to ' + getNet() + '....'
        document.getElementById('standbyResultField').value = results


        await client.connect()


        results += '\nConnected.'
        document.getElementById('standbyResultField').value = results
```


Get the standby and operational wallets.


```
        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
        const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
```
Capture the currency code from the standby currency field.

```
        const currency_code = standbyCurrencyField.value

```


Define the transaction, capturing the currency code and (limit) amount from the form fields.


```
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


```
        const ts_prepared = await client.autofill(trustSet_tx)
```


Sign the transaction.


```
        const ts_signed = operational_wallet.sign(ts_prepared)
        results += '\nCreating trust line from operational account to standby account...'
        document.getElementById('standbyResultField').value = results
```


Submit the transaction and wait for the results.


```
        const ts_result = await client.submitAndWait(ts_signed.tx_blob)
```


Report the results.


```
        if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
          results += '\nTrustline established between account \n' + operational_wallet.address + ' \n and account\n' + standby_wallet.address + '.'
          document.getElementById('standbyResultField').value = results
        } else {
          results += '\nTrustLine failed. See JavaScript console for details.'
          document.getElementById('standbyResultField').value = results     
          throw 'Error sending transaction: ${ts_result.result.meta.TransactionResult}'
        }
      } //End of createTrustline()
```



### Send Issued Currency

Once you have created a trust line from an account to your own, you can send issued currency tokens to that account, up to the established limit.


```
// *******************************************************
// *************** Send Issued Currency ******************
// *******************************************************


      async function sendCurrency() {
```


Connect to the ledger.


```
        let net = getNet()
        const client = new xrpl.Client(net)
        results = 'Connecting to ' + getNet() + '....'
        document.getElementById('standbyResultField').value = results


        await client.connect()


        results += '\nConnected.'
        document.getElementById('standbyResultField').value = results
```


Get the account wallets.

  


```
        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
        const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        const currency_code = standbyCurrencyField.value
        const issue_quantity = standbyAmountField.value


        const send_token_tx = {
          "TransactionType": "Payment",
          "Account": standby_wallet.address,
          "Amount": {
            "currency": currency_code,
            "value": issue_quantity,
            "issuer": standby_wallet.address
          },
          "Destination": standbyDestinationField.value
        }
```


Prepare the transaction by automatically filling default values.


```
        const pay_prepared = await client.autofill(send_token_tx)
```


Sign the transaction.


```
        const pay_signed = standby_wallet.sign(pay_prepared)
        results += 'Sending ${issue_quantity} ${currency_code} to ' + standbyDestinationField.value + '...'
        document.getElementById('standbyResultField').value = results
```


Submit the transaction and wait for the results.


```
        const pay_result = await client.submitAndWait(pay_signed.tx_blob)
```


Report the results.


```
        if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
          results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}'
          document.getElementById('standbyResultField').value = results
        } else {
          results += 'Transaction failed: See JavaScript console for details.'
          document.getElementById('standbyResultField').value = results
          throw 'Error sending transaction: ${pay_result.result.meta.TransactionResult}'
        }
        document.getElementById('standbyBalanceField').value = 
              (await client.getXrpBalance(standby_wallet.address))
        document.getElementById('operationalBalanceField').value = 
              (await client.getXrpBalance(operational_wallet.address))
        client.disconnect()
        getBalances()


      } // end of sendCurrency()
```



### Get Balances


```
// *******************************************************
// ****************** Get Balances ***********************
// *******************************************************
      async function getBalances() {
```


Connect to the ledger.


```
        let net = getNet()
        const client = new xrpl.Client(net)
        results = 'Connecting to ' + getNet() + '....'
        document.getElementById('standbyResultField').value = results
        await client.connect()
        results += '\nConnected.'
        document.getElementById('standbyResultField').value = results
```


Get the account wallets.


```
        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
        const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
        results= "\nGetting standby account balances...\n"
```


Define and send the request for the standby account, then wait for the results.


```
        const standby_balances = await client.request({
          command: "gateway_balances",
          account: standby_wallet.address,
          ledger_index: "validated",
          hotwallet: [operational_wallet.address]
        })
```


Report the results.


```
        results += JSON.stringify(standby_balances.result, null, 2)
        document.getElementById('standbyResultField').value = results   
```


Define and send the request for the operational account, then wait for the results.


```
        results= "\nGetting operational account balances...\n"
        const operational_balances = await client.request({
          command: "account_lines",
          account: operational_wallet.address,
          ledger_index: "validated"
        })
```


Report the results.


```
        results += JSON.stringify(operational_balances.result, null, 2)
        document.getElementById('operationalResultField').value = results
```


Update the form with current XRP balances.


```
         document.getElementById('operationalBalanceField').value = 
          (await client.getXrpBalance(operational_wallet.address))
        document.getElementById('standbyBalanceField').value = 
          (await client.getXrpBalance(standby_wallet.address))
```


Disconnect from the ledger.


```
        client.disconnect()      
      } // End of getBalances()
```



### Reciprocal Transactions

For each of the transactions, there is an accompanying reciprocal transaction, with the prefix _oP,_ for the operational account. See the corresponding function for the standby account for code commentary. The `getBalances()` request does not have a reciprocal transaction, because it reports balances for both accounts.


```
// *******************************************************
// ************ Create Operational TrustLine *************
// *******************************************************


      async function oPcreateTrustline() {
        let net = getNet()
        const client = new xrpl.Client(net)
        results = 'Connecting to ' + getNet() + '....'
        document.getElementById('operationalResultField').value = results


        await client.connect()


        results += '\nConnected.'
        document.getElementById('operationalResultField').value = results


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
        results += '\nCreating trust line from operational account to ' + operationalDestinationField.value + ' account...'
        document.getElementById('operationalResultField').value = results
        const ts_result = await client.submitAndWait(ts_signed.tx_blob)
        if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
          results += '\nTrustline established between account \n' + standby_wallet.address + ' \n and account\n' +
            operationalDestinationField.value + '.'
          document.getElementById('operationalResultField').value = results
        } else {
          results += '\nTrustLine failed. See JavaScript console for details.'
          document.getElementById('operationalResultField').value = results     
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
        document.getElementById('operationalResultField').value = results


        await client.connect()


        results += '\nConnected.'
        document.getElementById('operationalResultField').value = results


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
        results += 'Sending ${issue_quantity} ${currency_code} to ' + operationalDestinationField.value + '...'
        document.getElementById('operationalResultField').value = results
        const pay_result = await client.submitAndWait(pay_signed.tx_blob)
        if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
          results += 'Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}'
          document.getElementById('operationalResultField').value = results
        } else {
          results += 'Transaction failed: See JavaScript console for details.'
          document.getElementById('operationalResultField').value = results
          throw 'Error sending transaction: ${pay_result.result.meta.TransactionResult}'
        }
        document.getElementById('standbyBalanceField').value = 
              (await client.getXrpBalance(standby_wallet.address))
        document.getElementById('operationalBalanceField').value = 
              (await client.getXrpBalance(operational_wallet.address))
        getBalances()
        client.disconnect()

      } // end of oPsendCurrency()
```



## 2.create-trustline-send-currency.html

Update the form to support the new functions.


```
<html>
  <head>
    <title>Token Test Harness</title>
    <script src='https://unpkg.com/xrpl@2.2.3'></script>
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
      <input type="radio" id="xls" name="server"
        value="wss://xls20-sandbox.rippletest.net:51233" checked>
      <label for="xls20">XLS20-NFT</label>
      &nbsp;&nbsp;
      <input type="radio" id="tn" name="server"
        value="wss://s.altnet.rippletest.net:51233">
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
                        <input type="text" id="standbyAmountField" size="40" value="100"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Destination
                      </td>
                      <td>
                        <input type="text" id="standbyDestinationField" size="40" value="100"></input>
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
                              <input type="text" id="operationalAmountField" size="40" value="100"></input>
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

---


| Previous      | Next                                                             |
| :---          |                                                             ---: |
| [← 1. Create Accounts and Send XRP >](create-accounts-send-xrp.html) | [3. Mint and Burn NFTokens → >](mint-and-burn-nftokens.html) |
