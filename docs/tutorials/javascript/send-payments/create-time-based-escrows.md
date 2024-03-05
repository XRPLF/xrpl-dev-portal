---
html: create-time-based-escrows-using-javascript.html
parent: send-payments-using-javascript.html
seo:
    description: Create, finish, or cancel time-based escrow transactions.
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - XRP
---
# Create Time-based Escrows Using JavaScript

This example shows how to:


1. Create escrow payments that become available at a specified time and expire at a specified time.
2. Finish an escrow payment.
3. Retrieve information on escrows attached to an account.
3. Cancel an escrow payment and return the XRP to the sending account.


[![Escrow Tester Form](/docs/img/quickstart-escrow1.png)](/docs/img/quickstart-escrow1.png)

## Prerequisites

Download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} -->.

## Usage

To get test accounts:

1. Open `8.escrow.html` in a browser
2. Choose **Testnet** or **Devnet**.
3. Get test accounts.
    1. If you have existing account seeds
        1. Paste account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have account seeds:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.

[![Escrow Tester with Account Information](/docs/img/quickstart-escrow2.png)](/docs/img/quickstart-escrow2.png)

## Create Escrow

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/L-mSItlK36M?si=bltVKY7AtTnG0ucL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

You can create a time-based escrow with a minimum time to finish the escrow and a cancel time after which the funds in escrow are no longer available to the recipient. This is a test harness: while a practical scenario might express time in days or weeks, this form lets you set the finish and cancel times in seconds so that you can quickly run through a variety of scenarios. (There are 86,400 seconds in a day, if you want to play with longer term escrows.)

To create a time-based escrow:

1. Enter an **Amount** to transfer.
2. Copy the **Operational Account** value.
3. Paste it in the **Destination Account** field.
4. Set the **Escrow Finish (seconds)** value. For example, enter _10_.
5. Set the **Escrow Cancel (seconds)** value. For example, enter _120_.
6. Click **Create Escrow**.
7. Copy the _Sequence Number_ of the escrow called out in the **Standby Result** field.

The escrow is created on the XRP Ledger instance, reserving 100 XRP plus the transaction cost. When you create an escrow, capture and save the **Sequence Number** so that you can use it to finish the escrow transaction.

[![Completed Escrow Transaction](/docs/img/quickstart-escrow3.png)](/docs/img/quickstart-escrow3.png)

## Finish Escrow

The recipient of the XRP held in escrow can finish the transaction any time within the time window after the Escrow Finish date and time but before the Escrow Cancel date and time. Following on the example above, you can use the _Sequence Number_ to finish the transaction once 10 seconds have passed.

To finish a time-based escrow:

1. Paste the sequence number in the Operational account **Escrow Sequence Number** field.
2. Click **Finish Escrow**.

The transaction completes and balances are updated for both the Standby and Operational accounts.

[![Completed Escrow Transaction](/docs/img/quickstart-escrow4.png)](/docs/img/quickstart-escrow4.png)

## Get Escrows

Click **Get Escrows** for either the Standby account or the Operational account to see their current list of escrows. If you click the buttons now, there are no escrows at the moment.

For the purposes of this tutorial, follow the steps in [Create Escrow](#create-escrow), above, to create a new escrow transaction, perhaps setting **Escrow Cancel (seconds)** field to _600_ seconds to give you extra time to explore. Remember to capture the _Sequence Number_ from the transaction results.

Click **Get Escrows** for both the Standby and the Operational account. The `account_info` request returns the same `account_object` for both accounts, demonstrating the link between the accounts created by the escrow transaction.

[![Get Escrows results](/docs/img/quickstart-escrow5.png)](/docs/img/quickstart-escrow5.png)


## Cancel Escrow

When the Escrow Cancel time passes, the escrow is no longer available to the recipient. The initiator of the escrow can reclaim the XRP, less the transaction fees. If you try to cancel the transaction prior to the **Escrow Cancel** time, you are charged for the transaction, but the actual escrow cannot be cancelled until the time limit is reached.

You can wait the allotted time for the escrow you created in the previous step, then use it to try out the **Cancel Escrow** button

To cancel an expired escrow:

1. Enter the sequence number in the Standby **Escrow Sequence Number** field.
2. Click **Cancel Escrow**.

The funds are returned to the Standby account, less the initial transaction fee.

[![Cancel Escrow results](/docs/img/quickstart-escrow6.png)](/docs/img/quickstart-escrow6.png)

## Oh No! I Forgot to Save the Sequence Number!

If you forget to save the sequence number, you can find it in the escrow transaction record.

1. Create a new escrow as described in [Create Escrow](#create-escrow), above.
2. Click **Get Escrows** to get the escrow information.
3. Copy the _PreviousTxnID_ value from the results.
   ![Transaction ID in Get Escrows results](/docs/img/quickstart-escrow7.png)
4. Paste the _PreviousTxnID_ in the **Transaction to Look Up** field.
   ![Transaction to Look Up field](/docs/img/quickstart-escrow8.png)
5. Click **Get Transaction**.
6. Locate the _Sequence_ value in the results.
   ![Sequence number in results](/docs/img/quickstart-escrow9.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> in the source repository for this website.

## ripple8-escrow.js

This example can be used with any XRP Ledger network, _Testnet_, or _Devnet_. You can update the code to choose different or additional XRP Ledger networks.

### Add Seconds to Date

This function accomplishes two things. It creates a new date object and adds the number of seconds taken from a form field. Then, it adjusts the date from the JavaScript format to the XRP Ledger format.

You provide the _numOfSeconds_ argument, the second parameter is a new Date object.
```javascript
function addSeconds(numOfSeconds, date = new Date()) {
```

Set the _seconds_ value to the date seconds plus the number of seconds you provide.

```javascript
  date.setSeconds(date.getSeconds() + numOfSeconds);
```

JavaScript dates are in milliseconds. Divide the date by 1000 to base it on seconds.

```javascript
  date = Math.floor(date / 1000)
```

Subtract the number of seconds in the Ripple epoch to convert the value to an XRP Ledger compatible date value.

```javascript
  date = date - 946684800
```

Return the result.

```javascript
  return date;
}
```

### Create Time-based Escrow

```javascript
async function createTimeEscrow() {
```

Instantiate two new date objects, then set the dates to the current date plus the set number of seconds for the finish and cancel dates.

```javascript
  let escrow_finish_date = new Date()
  let escrow_cancel_date = new Date()
  escrow_finish_date = addSeconds(parseInt(standbyEscrowFinishDateField.value))
  escrow_cancel_date = addSeconds(parseInt(standbyEscrowCancelDateField.value))
```

Connect to the ledger.

```javascript
  results  = "Connecting to the selected ledger.\n"
  standbyResultField.value = results
  let net = getNet()
  results = "Connecting to " + net + "....\n"
  const client = new xrpl.Client(net)
  await client.connect()
  results  += "Connected. Creating time-based escrow.\n"
  standbyResultField.value = results
```

Get the wallet information based on the account seed values.

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const sendAmount = standbyAmountField.value
  results += "\nstandby_wallet.address: = " + standby_wallet.address
  standbyResultField.value = results
```

Define the `EscrowCreate` transaction, automatically filling values in common fields.

```javascript
  const escrowTx = await client.autofill({
    "TransactionType": "EscrowCreate",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value,
    "FinishAfter": escrow_finish_date,
    "CancelAfter": escrow_cancel_date
  })
```

Sign the escrow transaction definition.

```javascript
  const signed = standby_wallet.sign(escrowTx)
```

Submit the transaction.

```javascript
  const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
  results += "\nSequence Number (Save!): " + JSON.stringify(tx.result.Sequence)
  results += "\n\nBalance changes: " + 
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyResultField.value = results
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // End of createTimeEscrow()
```

### Finish Time-based Escrow

```javascript
async function finishEscrow() {
```

Connect to the XRP Ledger and get the account wallets.

```javascript
  results  = "Connecting to the selected ledger.\n"
  operationalResultField.value = results
  let net = getNet()
  results = 'Connecting to ' + getNet() + '....'
  const client = new xrpl.Client(net)
  await client.connect()

  results  += "\nConnected. Finishing escrow.\n"
  operationalResultField.value = results

  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const sendAmount = operationalAmountField.value
  
  results += "\noperational_wallet.address: = " + operational_wallet.address
  operationalResultField.value = results
```

Define the transaction. The _Owner_ is the account that created the escrow. The _OfferSequence_ is the sequence number of the escrow transaction. Automatically fill in the common fields for the transaction.

```javascript
  const prepared = await client.autofill({
    "TransactionType": "EscrowFinish",
    "Account": operationalAccountField.value,
    "Owner": standbyAccountField.value,
    "OfferSequence": parseInt(operationalEscrowSequenceField.value)
  })
```

Sign the transaction definition.

```javascript
  const signed = operational_wallet.sign(prepared)
```

Submit the signed transaction to the XRP ledger.

```javascript

  const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results

  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
```

Disconnect from the XRP Ledger.

```javascript
  client.disconnect()
} // End of finishEscrow()
```

### Get Standby Escrows

Get the escrows associated with the Standby account.

```javascript
async function getStandbyEscrows() {
```

Connect to the network. The information you are looking for is public information, so there is no need to instantiate your wallet.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  standbyResultField.value = results

  results= "\nGetting standby account escrows...\n"
```

Create the `account_objects` request. Specify that you want objects of the type _escrow_.

```javascript
  const escrow_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": standbyAccountField.value,
    "ledger_index": "validated",
    "type": "escrow"
  })
```

Report the results.

```javascript
  results += JSON.stringify(escrow_objects.result, null, 2)
  standbyResultField.value = results
```

Disconnect from the XRP Ledger

```javascript
  client.disconnect()
} // End of getStandbyEscrows()
```

### Get Operational Escrows

This function is the same as `getStandbyEscrows()`, but for the Operational account.

```javascript
async function getOperationalEscrows() {
```

Connect to the network. The information you are looking for is public information, so there is no need to instantiate your wallet.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  operationalResultField.value = results

  results= "\nGetting operational account escrows...\n"
```

Create the `account_objects` request. Specify that you want objects of the type _escrow_.

```javascript
  const escrow_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": operationalAccountField.value,
    "ledger_index": "validated",
    "type": "escrow"
  })
```

Report the results.

```javascript
  results += JSON.stringify(escrow_objects.result, null, 2)
  operationalResultField.value = results
```

Disconnect from the XRP Ledger instance.

```javascript
  client.disconnect()
} // End of getOperationalEscrows()
```

### Get Transaction Info 

```javascript
async function getTransaction() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  operationalResultField.value = results

  results= "\nGetting transaction information...\n"
```
  
Prepare and send the transaction information request. The only required parameter is the transaction ID.
  
```javascript
  const tx_info = await client.request({
    "id": 1,
    "command": "tx",
    "transaction": operationalTransactionField.value,
  })
```
Report the results.
  
```javascript
  results += JSON.stringify(tx_info.result, null, 2)
  operationalResultField.value = results
```
  
Disconnect from the XRP Ledger instance.  
  
```javascript
  client.disconnect()
} // End of getTransaction()
```

### Cancel Escrow

Cancel an escrow after it passes the expiration date.

```javascript
async function cancelEscrow() {
```

Connect to the XRP Ledger instance.

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
```

Prepare the EscrowCancel transaction.

```javascript
  const prepared = await client.autofill({
    "TransactionType": "EscrowCancel",
    "Account": standby_wallet.address,
    "Owner": standbyAccountField.value,
    "OfferSequence": parseInt(standbyEscrowSequenceNumberField.value)
  })
```

Sign the transaction.
```javascript
  const signed = standby_wallet.sign(prepared)
```

Submit the transaction and wait for the response.

``` javascript
  const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyResultField.value = results
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
```

Disconnect from the XRP Ledger instance.

```javascript
  client.disconnect()
}
```

## 8.escrow.html

```html
<html>
  <head>
    <title>Time-based Escrow Test Harness</title>
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
    <script src='ripplex2-send-currency.js'></script>
    <script src='ripplex8-escrow.js'></script>
  </head>
  
<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->

  <body>
    <h1>Time-based Escrow Test Harness</h1>
    <form id="theForm">
      Choose your ledger instance:  
      &nbsp;&nbsp;
      <input type="radio" id="tn" name="server"
        value="wss://s.altnet.rippletest.net:51233" checked>
      <label for="tn">Testnet</label>
      &nbsp;&nbsp;
      <input type="radio" id="dn" name="server"
        value="wss://s.devnet.rippletest.net:51233">
      <label for="dn">Devnet</label>
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
                        Destination Account
                      </td>
                      <td>
                        <input type="text" id="standbyDestinationField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Escrow Finish (seconds)
                      </td>
                      <td>
                        <input type="text" id="standbyEscrowFinishDateField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Escrow Cancel (seconds)
                      </td>
                      <td>
                        <input type="text" id="standbyEscrowCancelDateField" size="40"></input>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td align="right">
                        Escrow Sequence Number
                      </td>
                      <td>
                        <input type="text" id="standbyEscrowSequenceNumberField" size="40"></input>
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
                        <button type="button" onClick="sendXRP()">Send XRP &#62;</button>
                        <br/><br/>
                        <button type="button" onClick="getBalances()">Get Balances</button>       
                        <br/>
                        <button type="button" onClick="createTimeEscrow()">Create Time-based Escrow</button>
                        <br/>
                        <button type="button" onClick="getStandbyEscrows()">Get Escrows</button>
                        <br/>
                        <button type="button" onClick="cancelEscrow()">Cancel Escrow</button>
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
          <td>
            <table>
              <tr>
                <td>
                <td>
                  <table>
                    <tr valign="top">
                      <td align="center" valign="top">
                        <button type="button" onClick="oPsendXRP()">&#60; Send XRP</button>
                        <br/><br/>
                        <button type="button" onClick="getBalances()">Get Balances</button>
                        <br/>
                        <button type="button" onClick="finishEscrow()">Finish Time-based Escrow</button>
                        <br/>
                        <button type="button" onClick="getOperationalEscrows()">Get Escrows</button>
                        <br/>
                        <button type="button" onClick="getTransaction()">Get Transaction</button>
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
                          <tr>
                            <td align="right">
                              Escrow Sequence Number
                            </td>
                            <td>
                              <input type="text" id="operationalEscrowSequenceField" size="40"></input>
                              <br>
                            </td>
                          </tr>
                          <tr>                            <td align="right">
                              Transaction to Look Up
                            </td>
                            <td>
                              <input type="text" id="operationalTransactionField" size="40"></input>
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
