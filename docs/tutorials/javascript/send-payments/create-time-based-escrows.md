---
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


[![Time-based Escrow Form](/docs/img/mt-time-escrow-1-empty-form.png)](/docs/img/mt-time-escrow-1-empty-form.png)

## Prerequisites

Download and expand the [Modular Tutorials](../../../../_code-samples/modular-tutorials/payment-modular-tutorials.zip)<!-- {.github-code-download} --> archive.

## Usage

To get test accounts:

1. Open `create-time-based-escrows.html` in a browser
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

[![Escrow Tester with Account Information](/docs/img/mt-time-escrow-2-form-with-accounts.png)](/docs/img/mt-time-escrow-2-form-with-accounts.png)

## Create Escrow

You can create a time-based escrow with a minimum time to finish the escrow and a cancel time after which the funds in escrow are no longer available to the recipient. This is a test harness: while a practical scenario might express time in days or weeks, this form lets you set the finish and cancel times in seconds so that you can quickly run through a variety of scenarios. (There are 86,400 seconds in a day, if you want to play with longer term escrows.)

To create a time-based escrow:

1. Enter an **Amount** to transfer. For example, _10_.
2. Enter the **Destination**. (For example, the Account 2 address.)
4. Set the **Escrow Finish Time** value, in seconds. For example, enter _10_.
5. Set the **Escrow Cancel Time** value, in seconds. For example, enter _120_.
6. Click **Create Time-based Escrow**.
7. Copy the _Sequence Number_ of the escrow called out in the **Standby Result** field.

The escrow is created on the XRP Ledger instance, reserving 10 XRP plus the transaction cost. When you create an escrow, capture and save the **Sequence Number** so that you can use it to finish the escrow transaction.

The escrow finish and cancel times are expressed in seconds here to let you experiment with scenarios where the escrows are outside the time constraints. In practice, escrow times might be expressed in days, weeks, months, or years.

[![Completed Escrow Transaction](/docs/img/mt-time-escrow-3-create-escrow.png)](/docs/img/mt-time-escrow-3-create-escrow.png)

## Finish Escrow

The recipient of the XRP held in escrow can finish the transaction any time within the time window after the Escrow Finish date and time but before the Escrow Cancel date and time. Following on the example above, you can use the _Sequence Number_ to finish the transaction once 10 seconds have passed.

To finish a time-based escrow:

1. Paste the sequence number in the Operational account **Escrow Sequence Number** field.
2. Copy and paste the address that created the escrow in the **Escrow Owner** field.
2. Click **Finish Time-based Escrow**.

The transaction completes and balances are updated for both the Standby and Operational accounts.

[![Completed Escrow Transaction](/docs/img/mt-time-escrow-4-fulfill-escrow.png)](/docs/img/mt-time-escrow-4-fulfill-escrow.png)

## Get Escrows

Click **Get Escrows** for either the Standby account or the Operational account to see their current list of escrows. If you click the buttons now, there are no escrows at the moment.

For the purposes of this tutorial, follow the steps in [Create Escrow](#create-escrow), above, to create a new escrow transaction, perhaps setting **Escrow Cancel (seconds)** field to _600_ seconds to give you extra time to explore. Remember to capture the _Sequence Number_ from the transaction results.

Click **Get Escrows**.

[![Get Escrows results](/docs/img/mt-time-escrow-5-get-escrows.png)](/docs/img/mt-time-escrow-5-get-escrows.png)


## Cancel Escrow

When the Escrow Cancel time passes, the escrow is no longer available to the recipient. The initiator of the escrow can reclaim the XRP, less the transaction fees. If you try to cancel the transaction prior to the **Escrow Cancel** time, you are charged for the transaction, but the actual escrow cannot be cancelled until the time limit is reached.

You can wait the allotted time for the escrow you created in the previous step, then use it to try out the **Cancel Escrow** button

To cancel an expired escrow:

1. Enter the sequence number in the **Escrow Sequence Number** field.
2. Enter the address of the account that created the escrow in the **Escrow Owner** field.
2. Click **Cancel Escrow**.

The funds are returned to the owner account, less the initial transaction fee.

[![Cancel Escrow results](/docs/img/mt-time-escrow-6-cancel-escrow.png)](/docs/img/mt-time-escrow-6-cancel-escrow.png)

## Oh No! I Forgot to Save the Sequence Number!

If you forget to save the sequence number, you can find it in the escrow transaction record.

1. If needed, create a new escrow as described in [Create Escrow](#create-escrow), above.
2. Click **Get Escrows** to get the escrow information.
3. Copy the _PreviousTxnID_ value from the results.
   [![Previous Transaction ID in Get Escrows results](/docs/img/mt-conditional-escrow-6-get-escrows.png)](/docs/img/mt-conditional-escrow-6-get-escrows.png)
4. Paste the _PreviousTxnID_ in the **Transaction** field.
5. Click **Get Transaction**.
6. Locate the _ModifiedNode.PreviousFields.Sequence_ value in the results.
   [![Sequence number in results](/docs/img/mt-conditional-escrow-7-sequence-value.png)](/docs/img/mt-conditional-escrow-7-sequence-value.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)in the source repository for this website.

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
async function createTimeBasedEscrow() {
```

Instantiate two new date objects, then set the dates to the current date plus the set number of seconds for the finish and cancel dates.

```javascript
  let escrow_finish_date = new Date()
  let escrow_cancel_date = new Date()
  escrow_finish_date = addSeconds(parseInt(escrowFinishTimeField.value))
  escrow_cancel_date = addSeconds(parseInt(escrowCancelTimeField.value))
```

Connect to the ledger and get the account wallet.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}.===\n\n===Creating time-based escrow.===\n`
  resultField.value = results
```

Define the transaction object.

```javascript
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const sendAmount = amountField.value
    const escrowTx = await client.autofill({
      "TransactionType": "EscrowCreate",
      "Account": wallet.address,
      "Amount": xrpl.xrpToDrops(sendAmount),
      "Destination": destinationField.value,
      "FinishAfter": escrow_finish_date,
      "CancelAfter": escrow_cancel_date
    })

  ```

  Sign the prepared transaction object.

```javascript
    const signed = wallet.sign(escrowTx)
  }
```

Submit the signed transaction object and wait for the results.

```javascript
    const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
    results += "\n===Success! === *** Save this sequence number: " + tx.result.tx_json.Sequence
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
    resultField.value = results
  }
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript
  catch (error) {
    results += "\n===Error: " + error.message
    resultField.value = results
  }
  finally {
    client.disconnect()
  }
```


### Finish Time-based Escrow

```javascript
async function finishEscrow() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}. Finishing escrow.===\n`
  resultField.value = results
```

Define the transaction. The _Owner_ is the account that created the escrow. The _OfferSequence_ is the sequence number of the escrow transaction. Automatically fill in the common fields for the transaction.

```javascript
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const prepared = await client.autofill({
    "TransactionType": "EscrowFinish",
    "Account": accountAddressField.value,
    "Owner": escrowOwnerField.value,
    "OfferSequence": parseInt(escrowSequenceNumberField.value)
  })
```

Sign the transaction definition.

```javascript
  const signed = wallet.sign(prepared)
```

Submit the signed transaction to the XRP ledger.

```javascript
  const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
  results  += "\n===Balance changes===" + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  resultField.value = results
```

Update the **XRP Balance** field.

```javascript
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
```

Catch and report any errors, then disconnect from the XRP Ledger.

```javascript
  catch (error) {
    results += "\n===Error: " + error.message + "==="
    resultField.value = results
  }
  finally {
    client.disconnect()
  }
```

### Get  Escrows

Get the escrows created by or destined to the current account.

```javascript
async function getEscrows() {
```

Connect to the network. The information you are looking for is public information, so there is no need to instantiate your wallet.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}.\nGetting account escrows.===\n`
  resultField.value = results
```

Create the `account_objects` request. Specify that you want objects of the type _escrow_.

```javascript
  try {
    const escrow_objects = await client.request({
      "id": 5,
      "command": "account_objects",
      "account": accountAddressField.value,
      "ledger_index": "validated",
      "type": "escrow"
    })
```

Report the results.

```javascript
    results += JSON.stringify(escrow_objects.result, null, 2)
    resultField.value = results
  }
```
Catch and report any errors, then disconnect from the XRP Ledger.


```javascript
  catch (error) {
    results += "\nError: " + error.message
    resultField.value = results
  }
  finally {
    client.disconnect()
  }
}
```

### Get Transaction Info 

```javascript
async function getTransaction() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}.===\n===Getting transaction information.===\n`
  resultField.value = results
```
  
Prepare and send the transaction information request. The only required parameter is the transaction ID.
  
```javascript
  try {
    const tx_info = await client.request({
      "id": 1,
      "command": "tx",
      "transaction": transactionField.value,
    })
```
Report the results.
  
```javascript
    results += JSON.stringify(tx_info.result, null, 2)
    resultField.value = results
  }
```
  
Catch and report any errors, then disconnect from the XRP Ledger.  
  
```javascript
  catch (error) {
    results += "\nError: " + error.message
    resultField.value = results
  }
  finally {
    client.disconnect()
  }
} // End of getTransaction()
```

### Cancel Escrow

Cancel an escrow after it passes the expiration date and time.

```javascript
async function cancelEscrow() {
```

Connect to the XRP Ledger instance and get the account wallet.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}. Cancelling escrow.===`
  resultField.value = results
```

Prepare the EscrowCancel transaction, passing the escrow owner and offer sequence values.

```javascript
  try {
    const prepared = await client.autofill({
      "TransactionType": "EscrowCancel",
      "Account": accountAddressField.value,
      "Owner": escrowOwnerField.value,
      "OfferSequence": parseInt(escrowSequenceNumberField.value)
    })
```

Sign the transaction.

```javascript
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const signed = wallet.sign(prepared)
```

Submit the transaction and wait for the response.

``` javascript
    const tx = await client.submitAndWait(signed.tx_blob)
```

Report the results.

```javascript
    results += "\n===Balance changes: " +
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
)
```

Catch and report any errors, then disconnect from the XRP Ledger instance.

```javascript
   }
  catch (error) {
    results += "\n===Error: " + error.message
    resultField.value = results
  }
  finally {
    client.disconnect()
  }
}
```

## create-time-escrow.html

```html
<html>
<head>
    <title>Create a Time-based Escrow</title>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <link href="modular-tutorials.css" rel="stylesheet">
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script>
    <script src="account-support.js"></script>
    <script src='create-time-escrow.js'></script>
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
    <h1>Create a Time-based Escrow</h1>
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
                    <span class="tooltip" tooltip-data="Amount of XRP to send.">
                        <label for="amountField">Amount</label>
                    </span>
                </td>
                <td>
                    <input type="text" id="amountField" size="40"></input>
                </td>
            </tr>
           <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Destination account address where the escrow is sent.">
                    <lable for="destinationField">Destination</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="destinationField" size="40"></input>
                    <br>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="createTimeBasedEscrow()">Create Time-based Escrow</button>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Escrow finish time, in seconds.">
                    <lable for="escrowFinishTimeField">Escrow Finish Time</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="escrowFinishTimeField" size="40"></input>
                    <br>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="getEscrows()">Get Escrows</button>
                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Escrow cancel time, in seconds.">
                    <lable for="escrowCancelTimeField">Escrow Cancel Time</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="escrowCancelTimeField" size="40"></input>
                    <br>
                </td>
                <td align="left" valign="top">
                    <button type="button" onClick="finishTimeBasedEscrow()">Finish Time-based Escrow</button>

                </td>
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Escrow sequence number, used when finishing the escrow.">
                    <lable for="escrowSequenceNumberField">Escrow Sequence Number</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="escrowSequenceNumberField" size="40"></input>
                    <br>
                </td> 
                <td>
                    <button type="button" onClick="cancelEscrow()">Cancel Escrow</button>
                </td>              
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Escrow owner, the account that created the escrow.">
                    <lable for="escrowOwnerField">Escrow Owner</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="escrowOwnerField" size="40"></input>
                    <br>
                </td> 
                <td>
                    <button type="button" onClick="getTransaction()">Get Transaction</button>
                </td>              
            </tr>
            <tr>
                <td align="right">
                    <span class="tooltip" tooltip-data="Transaction number, used with the Get Transaction button.">
                    <lable for="transactionField">Transaction</lable>
                    </span>
                </td>
                <td>
                    <input type="text" id="transactionField" size="40"></input>
                    <br>
                </td> 
                <td>
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
