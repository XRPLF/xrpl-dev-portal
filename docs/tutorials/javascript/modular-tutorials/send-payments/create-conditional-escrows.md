---
html: create-conditional-escrows-using-javascript.html
parent: send-payments-using-javascript.html
seo:
    description: Create, finish, or cancel condition-based escrow transactions.
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - XRP
---
# Create Conditional Escrows Using JavaScript

This example shows how to:

1. Create escrow payments that become available when any account enters a fulfillment code.

2. Complete a conditional escrow transaction.

3. Cancel a conditional escrow transaction.

[![Conditional Escrow Tester Form](/docs/img/conditional-escrow1.png)](/docs/img/conditional-escrow1.png)


## Prerequisites

Download and expand the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive.

## Usage

### Create Escrow

You  create a condition-based escrow using a fulfillment code associated with a condition code. Create the condition/fulfillment pair using the `five-bells-condition` application.

Install `five-bells-condition`:

1. In a terminal window, navigate to your local `Quickstart` directory (for convenience).
2. Enter the command `npm install five-bells-condition`.

To create a condition/fulfillment pair:

1. In a terminal window, navigate to your `Quickstart` directory.
2. Enter the command `node getConditionAndFulfillment.js`.
3. Copy and save the generated Condition and Fulfillment pair.

[![Condition and Fulfillment](/docs/img/conditional-escrow2.png)](/docs/img/conditional-escrow2.png)

To get test accounts:
 
1. Open `9.escrow-condition.html` in a browser
2. Choose **Testnet** or **Devnet**.
3. Get test accounts.
    1. If you have existing account seeds
        1. Paste account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    2. If you do not have account seeds:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.

[![Escrow Tester with Account Information](/docs/img/conditional-escrow3.png)](/docs/img/conditional-escrow3.png)

### Create Conditional Escrow:

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/aUMqCFBsPW4?si=nUC4-yBOweti02be" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

When you create a conditional escrow, you need to specify the amount you want to reserve and the `Condition` value you generated above. You can also set a cancel date and time, after which the escrow is no longer available.  

To create a conditional escrow:

1. Enter an **Amount** to transfer.
2. Copy the **Operational Account** value.
3. Paste it in the **Destination Account** field.
4. Enter the **Escrow Condition** value.
5. Enter the **Escrow Cancel (seconds)** value.
6. Click **Create Escrow**.
7. Copy and save the _Sequence Number_ of the escrow called out in the **Standby Result** field.

The escrow is created on the XRP Ledger instance, reserving your requested XRP amount plus the transaction cost.

When you create an escrow, capture and save the _Sequence Number_ so that you can use it to finish the escrow transaction.

[![Created Escrow Transaction](/docs/img/conditional-escrow4.png)](/docs/img/conditional-escrow4.png)

## Finish Conditional Escrow

Any account can finish the conditional escrow any time before the _Escrow Cancel_ time. Following on the example above, you can use the _Sequence Number_ to finish the transaction once the Escrow Cancel time has passed.

To finish a time-based escrow:

1. Paste the sequence number in the Operational account **Escrow Sequence Number** field.
2. Enter the `Fulfillment` code for the `Condition`.
3. Click **Finish Conditional Escrow**.

The transaction completes and balances are updated for both the Standby and Operational accounts.

[![Finished Escrow Transaction](/docs/img/conditional-escrow5.png)](/docs/img/conditional-escrow5.png)

## Get Escrows

Click **Get Escrows** for either the Standby account or the Operational account to see their current list of escrows. 

## Cancel Escrow

When the Escrow Cancel time passes, the escrow is no longer available to the recipient. The initiator of the escrow can reclaim the XRP, less the transaction fees. Any account can cancel an escrow once the cancel time has elapsed. Accounts that try to cancel the transaction prior to the **Escrow Cancel** time are charged the nominal transaction cost (12 drops), but the actual escrow cannot be cancelled until after the Escrow Cancel time.

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

## getConditionAndFulfillment.js

To generate a condition/fulfillment pair, use Node.js to run the `getConditionAndFulfillment.js` script.

```javascript
function getConditionAndFulfillment() {
```

Instantiate the `five-bells-condition` and `crypto` libraries.

```javascript
  const cc = require('five-bells-condition')
  const crypto = require('crypto')
```

Create a random 32-byte seed string.

```javascript
  const preimageData = crypto.randomBytes(32)
```

Create a fulfillment object.

```javascript
  const fulfillment = new cc.PreimageSha256()
```

Generate a fulfillment code.

```javascript
  fulfillment.setPreimage(preimageData)
```

Generate the condition value based on the fulfillment value.

```javascript
  const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase()
```

Return the condition.

```javascript
  console.log('Condition:', condition)
```

Convert the fulfillment code to a hexadecimal string.

```javascript
  const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase()
```

Return the fulfillment code. Keep it secret until you want to finish the escrow.

```javascript
  console.log('Fulfillment:', fulfillment_hex)
}
getConditionAndFulfillment()
```

## ripplex9-escrow-condition.js


### Create Conditional Escrow 

```javascript
async function createConditionalEscrow() {
```

Connect to your preferred ledger.

```javascript
  results  = "Connecting to the selected ledger.\n"
  standbyResultField.value = results
  let net = getNet()
  results = "Connecting to " + net + "....\n"
  const client = new xrpl.Client(net)
  await client.connect()

  results  += "Connected. Creating conditional escrow.\n"
  standbyResultField.value = results
```

Instantiate the standby and operational wallets

```javascript
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
```

Capture the amount to send in the escrow.

```javascript
  const sendAmount = standbyAmountField.value
```

Update the results field.

```javascript 
  results += "\nstandby_wallet.address: = " + standby_wallet.address
  standbyResultField.value = results
```

Create a date value and add your requested number of seconds.

```javascript
  let escrow_cancel_date = new Date()
  escrow_cancel_date = addSeconds(parseInt(standbyEscrowCancelDateField.value))
```

Prepare the `EscrowCreate` transaction.

```javascript
  const escrowTx = await client.autofill({
    "TransactionType": "EscrowCreate",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value,
    "CancelAfter": escrow_cancel_date,
    "Condition": standbyEscrowConditionField.value
  })
```

Sign the transaction.

```javascript
  const signed = standby_wallet.sign(escrowTx)
```

Submit the transaction and wait for the results.

```javascript
  const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results and update balance fields.

```javascript
  results += "\nSequence Number (Save!): " + JSON.stringify(tx.result.Sequence)
  results  += "\n\nBalance changes: " + 
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyResultField.value = results
```

Disconnect from the XRPL

```javascript
client.disconnect()

} // End of createTimeEscrow()
```

###  Finish Conditional Escrow 

Finish the escrow by submitting the condition and fulfillment codes.

```javascript
async function finishConditionalEscrow() {
```

Connect to your preferred XRP Ledger instance.

```javascript
  results  = "Connecting to the selected ledger.\n"
  operationalResultField.value = results
  let net = getNet()
  results += 'Connecting to ' + getNet() + '....'
  const client = new xrpl.Client(net)
  await client.connect()
  results  += "\nConnected. Finishing escrow.\n"
  operationalResultField.value = results
```

Get the standby and operational account wallets.

```javascript
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const sendAmount = operationalAmountField.value
  
  results += "\noperational_wallet.address: = " + operational_wallet.address
  operationalResultField.value = results
```

Prepare the transaction.

```javascript
  const prepared = await client.autofill({
    "TransactionType": "EscrowFinish",
    "Account": operationalAccountField.value,
    "Owner": standbyAccountField.value,
    "OfferSequence": parseInt(operationalEscrowSequenceField.value),
    "Condition": standbyEscrowConditionField.value,
    "Fulfillment": operationalFulfillmentField.value
  })
```

Sign the transaction.

```javascript

  const signed = operational_wallet.sign(prepared)
```

Submit the transaction and wait for the results.

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

Disconnect from the XRPL.

```javascript
  client.disconnect()

} // End of finishEscrow()
```


## 9.escrow-condition.html

```html
<html>
  <head>
    <title>Conditional Escrow Test Harness</title>
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
    <script src='ripplex9-escrow-condition.js'></script>
  </head>
  
<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->

  <body>
    <h1>Conditional Escrow Test Harness</h1>
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
                        Escrow Condition
                      </td>
                      <td>
                        <input type="text" id="standbyEscrowConditionField" size="40"></input>
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
                        <button type="button" onClick="createConditionalEscrow()">Create Conditional Escrow</button>
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
                        <button type="button" onClick="finishConditionalEscrow()">Finish Conditional Escrow</button>
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
                              Fulfillment Code
                            </td>
                            <td>
                              <input type="text" id="operationalFulfillmentField" size="40"></input>
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
                          <tr>
                            <td align="right">
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
