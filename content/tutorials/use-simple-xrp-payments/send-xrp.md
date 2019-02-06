# Send XRP

This tutorial walks through send a simple XRP Payment using JavaScript, by first stepping through the process using the XRP Test Net, then comparing that to the additional requirements for doing the equivalent in production.

## Prerequisites

This page provides JavaScript examples that use the ripple-lib (RippleAPI) library. The [RippleAPI Beginners Guide](get-started-with-rippleapi-for-javascript.html) describes how to get started using RippleAPI to access XRP Ledger data from JavaScript.

## Send a Payment on the Test Net
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get an XRP Test Net Address

To send transactions in the XRP Ledger, you first need an address and secret key, and some XRP. You can get an address in the XRP Test Net with a supply of Test Net XRP using the following interface:

<script type="application/javascript" src="assets/js/test-net.js"></script>
<div class="test-net-inset">
  <button id="generate-creds-button" class="btn btn-primary">Generate credentials</button>
  <div id='your-credentials'></div>
  <div id='loader' style="display: none;"><img class='throbber' src="assets/img/rippleThrobber.png"> Generating Keys...</div>
  <div id='address'></div>
  <div id='secret'></div>
  <div id='balance'></div>
</div><!--/.test-net-inset-->

Ripple operates the XRP Test Net for testing purposes only, and regularly resets the state of the test net along with all balances.

### {{n.next()}}. Prepare Transaction

Typically, we prepare XRP Ledger transactions as objects in [JSON](https://en.wikipedia.org/wiki/JSON) format. The following example shows a minimal Payment specification:

```json
{
  "TransactionType": "Payment",
  "Account": "rD9bZqwXu67DuZDtNCjjeDUTNLb6iQnHDn",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
```

The bare minimum set of instructions for an XRP Payment is:

- An indicator that this is a payment. (`"TransactionType": "Payment"`)
- The sending address. (`"Account"`)
- The address that should receive the XRP (`"Destination"`). This can't be the same as the sending address.
- The amount of XRP to send (`"Amount"`). Typically, this is specified as an integer in "drops" of XRP, where 1,000,000 drops equals 1 XRP.

Technically, a viable transaction must contain some additional fields, but your client library can automatically choose sensible values for those if it's online. Some optional fields, such as `LastLedgerSequence`, are strongly recommended when sending payments with real value. For details, see [Differences for Production](#differences-for-production) below.

**Tip:** The above example uses the standard JSON [transaction format](transaction-formats.html). You can also use RippleAPI's `preparePayment()` method to generate the transaction's JSON format.


### {{n.next()}}. Connect to a Test Net Server

To provide the necessary auto-fillable fields, ripple-lib must be connected to a server where it can get the current status of your account and the shared ledger itself. (You _can_ sign transactions while being offline, but you need to provide more fields yourself.) You also, obviously, need to be connected to the network to submit transactions to it.

The following code sample instantiates a new RippleAPI instance and connects to one of the public XRP Test Net servers that Ripple runs:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

### {{n.next()}}. Sign the Transaction Instructions

Use the [sign() method](rippleapi-reference.html#sign) to sign the transaction string with RippleAPI. If you constructed the transaction manually, as in this example, you must convert it from JSON to string first.

```js
let payment_json = {
  "TransactionType": "Payment",
  "Account": "rD9bZqwXu67DuZDtNCjjeDUTNLb6iQnHDn",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
// TODO: 'api' should be online
const response = api.sign(
  JSON.stringify(payment_json),
  "s████████████████████████████")
const txID = response.id
console.log("Identifying hash:", txID)
const txBlob = response.signedTransaction
console.log("Signed blob:", txBlob)
```

The result of the signing operation is a transaction object containing a signature. Typically, XRP Ledger APIs expect a signed transaction to be the hexadecimal representation of the transaction's canonical [binary format](serialization.html), called a "blob". For a Payment such as this one, a signed transaction blob looks like this (with line breaks added here for readability):

```text
1200006140000000001E8480732102CD9D02581F13380BB1876313C1C2AA83267CD73
45802BFC9BA9311774B9B18A574473045022100DBCB5FE6CEC0CE81B077A11710CB40
E6A4F9939A45C3B4FBCFFC73C145E14CEC022044857DBE49B50DA14D7369D9BF44202
07ACB369571EBD905CE8FA37C4154820281148541B0FE2928E372CCAD5A1CC6F47FE8
5C15DD0B83148008F9193579C7D32FAF4AD1A9BFFDB236F148E3
```

The signing API also returns the transaction's ID, or identifying hash, which you can use to look up the transaction later. This is a 64-character hexadecimal string that is unique to this transaction. The following is the identifying hash of the transaction from the same example:

```text
D403EC6E03A68A4B7624508BAA271143A65D3AAA5D470BECD3A38EC54CEAF85E
```


### {{n.next()}}. Submit the Signed Blob

```js
// txBlob from the previous example
api.submit(txBlob).then(result => {
  console.log("Tentative result code:", result.resultCode)
  console.log("Tentative result message:", result.resultMessage)
})
```

This method returns the **tentative** result of trying to apply the transaction locally. This result _can_ change when the transaction is included in a validated ledger: transactions that succeed initially might ultimately fail, and transactions that fail initially might ultimately succeed. Still, the tentative result often matches the final result, so it's OK to get excited if you see `tesSUCCESS` here. 😁

If you see any other result, you should check the following:

- Are you using the correct addresses for the sender and destination?
- Did you forget any other fields of the transaction, skip any steps, or make any other typos?
- Do you have enough Test Net XRP to send the transaction? The amount of XRP you can send is limited by the [reserve requirement](reserves.html), which is currently 20 XRP with an additional 5 XRP for each "object" you own in the ledger. (If you generated a new address with the Test Net Faucet, you don't own any objects.)
- That you are connected to a server on the test network.

See the full list of [transaction results](transaction-results.html) for more possibilities.


### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see )

You can trigger code to run using the `ledger` event type in RippleAPI. For example:

```js
api.on('ledger', ledger => {
  console.log("Ledger version", ledger.ledgerVersion, "was just validated.")
})
```


### {{n.next()}}. Check Transaction Status

To know for sure what a transaction did, you must look up the outcome of the transaction when it appears in a validated ledger version. For example, you can use the [getTransaction() method](rippleapi-reference.html#gettransaction) to check the status of a transaction:

```js
api.getTransaction(txID).done(tx => {
  console.log("Transaction result:", tx.outcome.result)
  console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
})
```

The RippleAPI `getTransaction()` method only returns success if the transaction is in a validated ledger version.

**Caution:** Other APIs may return tentative results from ledger versions that have not yet been validated. For example, if you use the `rippled` APIs' [tx method][], be sure to look for `"validated": true` in the response to confirm that the data comes from a validated ledger version. Any transaction results that are not from a validated ledger version are subject to change.





<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
