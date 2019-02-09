# Send XRP

This tutorial walks through send a simple XRP Payment using JavaScript, by first stepping through the process using the XRP Test Net, then comparing that to the additional requirements for doing the equivalent in production.

## Prerequisites

This page provides JavaScript examples that use the ripple-lib (RippleAPI) library. The [RippleAPI Beginners Guide](get-started-with-rippleapi-for-javascript.html) describes how to get started using RippleAPI to access XRP Ledger data from JavaScript.

To send transactions in the XRP Ledger, you first need an address and secret key, and some XRP. You can get an address in the XRP Test Net with a supply of Test Net XRP using the following interface:

<div class="interactive-block test-net-inset">
  <button id="generate-creds-button" class="btn btn-primary">Generate credentials</button>
  <div id='loader' style="display: none;"><img class='throbber' src="assets/img/rippleThrobber.png"> Generating Keys...</div>
  <div id='address'></div>
  <div id='secret'></div>
  <div id='balance'></div>
  <button id="populate-creds-button" style="display: none;" class="btn btn-primary"></button>
</div><!--/.test-net-inset-->
<script type="application/javascript">
$(document).ready( () => {

  $("#generate-creds-button").click( () => {
    $.ajax({
      url: "https://faucet.altnet.rippletest.net/accounts",
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        $("#loader").hide()
        $("#address").hide().html("<strong>Address:</strong> " +
          '<span id="test-net-faucet-address">' +
          data.account.address
          + "</span>").show()
        $("#secret").hide().html('<strong>Secret:</strong> ' +
          '<span id="test-net-faucet-secret">' +
          data.account.secret +
          "</span>").show()
        $("#balance").hide().html('<strong>Balance:</strong> ' +
          Number(data.balance).toLocaleString('en') +
          ' XRP').show()
        $("#populate-creds-button").text("Populate examples with these credentials")
        $("#populate-creds-button").show()
      },
      error: function() {
        $("#loader").hide();
        alert("There was an error with the Ripple Test Net, please try again.");
      }
    })
  })

  const EXAMPLE_ADDR = "rD9bZqwXu67DuZDtNCjjeDUTNLb6iQnHDn"
  const EXAMPLE_SECRET = "s████████████████████████████"
  $("#populate-creds-button").click( () => {
    // Set sender address
    let generated_addr = ""
    $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
      let eltext = $(this).text()
      generated_addr = $("#test-net-faucet-address").text()
      $(this).text( eltext.replace(EXAMPLE_ADDR, generated_addr) )
    })

    // Set sender secret
    $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
      let eltext = $(this).text()
      let generated_secret = $("#test-net-faucet-secret").text()
      $(this).text( eltext.replace(EXAMPLE_SECRET, generated_secret) )
    })

    $("#populate-creds-button").text("... sender set to "+generated_addr+"!")
    $("#populate-creds-button").prop("disabled", true)
  })

})

</script>

Ripple operates the XRP Test Net for testing purposes only, and regularly resets the state of the test net along with all balances.


## Send a Payment on the Test Net
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Connect to a Test Net Server

To provide the necessary auto-fillable fields, ripple-lib must be connected to a server where it can get the current status of your account and the shared ledger itself. (You _can_ sign transactions while being offline, but you need to provide more fields yourself.) You also, obviously, need to be connected to the network to submit transactions to it.

The following code sample instantiates a new RippleAPI instance and connects to one of the public XRP Test Net servers that Ripple runs:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

For this tutorial, you can connect directly from your browser by pressing the following button:

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
<script type="application/javascript" src="assets/js/ripple-lib-1.1.2-min.js"></script>
<div class="interactive-block">
  <button id="connect-button" class="btn btn-primary">Connect to TestNet</button>
  <div>
    <strong>Connection status:</strong>
    <span id="connection-status">Not connected</span>
  </div>
</div>
<script type="application/javascript">
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.on('connected', () => {
  $("#connection-status").text("Connected")
  $(".connection-required").prop("disabled", false)
  $(".connection-required").prop("title", "")
})
api.on('disconnected', (code) => {
  $("#connection-status").text( "Disconnected ("+code+")" )
  $(".connection-required").prop("disabled", true)
  $(".connection-required").prop("title", "Connection to Test Net required")
})
$("#connect-button").click(() => {
  $("#connection-status").text( "Connecting..." )
  api.connect()
})
</script>


### {{n.next()}}. Prepare Transaction

Typically, we create XRP Ledger transactions as objects in the JSON [transaction format](transaction-formats.html). The following example shows a minimal Payment specification:

```json
{
  "TransactionType": "Payment",
  "Account": "rD9bZqwXu67DuZDtNCjjeDUTNLb6iQnHDn",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
```

The bare minimum set of instructions you must provide for an XRP Payment is:

- An indicator that this is a payment. (`"TransactionType": "Payment"`)
- The sending address. (`"Account"`)
- The address that should receive the XRP (`"Destination"`). This can't be the same as the sending address.
- The amount of XRP to send (`"Amount"`). Typically, this is specified as an integer in "drops" of XRP, where 1,000,000 drops equals 1 XRP.

Technically, a viable transaction must contain some additional fields, and certain optional fields like `LastLedgerSequence` are strongly recommended. The [`prepareTransaction()` method](rippleapi-reference.html#preparetransaction) automatically fills in good defaults for the remaining fields of a transaction. Here's an example of preparing the above payment:

```js
// Continuing after connecting to the API
async function() {
const sender = "rD9bZqwXu67DuZDtNCjjeDUTNLb6iQnHDn"
const preparedTx = await api.prepareTransaction({
  "TransactionType": "Payment",
  "Account": sender,
  "Amount": api.xrpToDrops("2"), // Same as "Amount": "2000000"
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}, {
  // Expire this transaction if it doesn't execute within ~5 minutes:
  "maxLedgerVersionOffset": 75
})
const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
console.log("Prepared transaction instructions:", preparedTx.txJSON)
console.log("XRP transaction cost:", preparedTx.instructions.fee)
console.log("Transaction expires after ledger:", maxLedgerVersion)
}()
```

***TODO: This example doesn't work (something with how I'm using prepareTransaction)***

<div class="interactive-block">
  <button id="prepare-button" class="btn btn-primary connection-required"
    title="Connection to Test Net required" disabled="disabled">Prepare
    example transaction</button>
  <div id="prepare-output"></div>
</div>
<script type="application/javascript">
  $("#prepare-button").click( async function() {
    const sender = "rD9bZqwXu67DuZDtNCjjeDUTNLb6iQnHDn"
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sender,
      "Amount": api.xrpToDrops("2"), // Same as "Amount": "2000000"
      "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
    }, {
      // Expire this transaction if it doesn't execute within ~5 minutes:
      "maxLedgerVersionOffset": 75
    })
    const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion

    $("#prepare-output").html(
      "<div><strong>Prepared transaction instructions:</strong> " +
      preparedTx.txJSON + "</div>" +
      "<div><strong>XRP transaction cost:</strong> " +
      preparedTx.instructions.fee + "</div>" +
      "<div><strong>Transaction expires after ledger:</strong> " +
      maxLedgerVersion + "</div>"
    )
  })
</script>


### {{n.next()}}. Sign the Transaction Instructions

Use the [sign() method](rippleapi-reference.html#sign) to sign the transaction string with RippleAPI. If you constructed the transaction manually, as in this example, you must convert it from JSON to string first.

```js
// Continuing from the previous step...
const response = api.sign(preparedTx.txJSON, "s████████████████████████████")
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
  if (ledger.ledgerVersion > maxLedgerVersion) {
    console.log("If the transaction hasn't succeeded by now, it's expired")
  }
})
```


### {{n.next()}}. Check Transaction Status

To know for sure what a transaction did, you must look up the outcome of the transaction when it appears in a validated ledger version. For example, you can use the [getTransaction() method](rippleapi-reference.html#gettransaction) to check the status of a transaction:

```js
tx = await api.getTransaction(txID)
console.log("Transaction result:", tx.outcome.result)
console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
```

The RippleAPI `getTransaction()` method only returns success if the transaction is in a validated ledger version.

**Caution:** Other APIs may return tentative results from ledger versions that have not yet been validated. For example, if you use the `rippled` APIs' [tx method][], be sure to look for `"validated": true` in the response to confirm that the data comes from a validated ledger version. Transaction results that are not from a validated ledger version are subject to change. For more information, see [Finality of Results](finality-of-results.html).





<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
