# Send XRP

This tutorial explains how to send a simple XRP Payment using RippleAPI for JavaScript. First, we step through the process with the XRP Test Net. Then, we compare that to the additional requirements for doing the equivalent in production.

## Prerequisites

<!-- Interactive example use ripple-lib and its prerequisites -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
<script type="application/javascript" src="assets/js/ripple-lib-1.4.1-min.js"></script>
<!-- Helper for interactive tutorial breadcrumbs -->
<script type="application/javascript" src="assets/js/interactive-tutorial.js"></script>

- This page provides JavaScript examples that use the ripple-lib (RippleAPI) library version 1.1.2. The [RippleAPI Beginners Guide](get-started-with-rippleapi-for-javascript.html) describes how to get started using RippleAPI to access XRP Ledger data from JavaScript.

- To send transactions in the XRP Ledger, you first need an address and secret key, and some XRP. You can get an address in the XRP Test Net with a supply of Test Net XRP using the following interface:

{{ start_step("Generate") }}
<button id="generate-creds-button" class="btn btn-primary">Generate credentials</button>
<div id='loader-0' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"> Generating Keys...</div>
<div id='address'></div>
<div id='secret'></div>
<div id='balance'></div>
<div id="populate-creds-status"></div>
{{ end_step() }}
<script type="application/javascript">
$(document).ready( () => {

  $("#generate-creds-button").click( () => {
    // Wipe existing results
    $("#address").html("")
    $("#secret").html("")
    $("#balance").html("")
    $("#populate-creds-status").html("")

    $("#loader-0").show()

    $.ajax({
      url: "https://faucet.altnet.rippletest.net/accounts",
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        $("#loader-0").hide()
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

        // Automatically populate examples with these credentials...
        // Set sender address
        let generated_addr = ""
        $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
          let eltext = $(this).text()
          $(this).text( eltext.replace(EXAMPLE_ADDR, data.account.address) )
        })

        // Set sender secret
        $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
          let eltext = $(this).text()
          $(this).text( eltext.replace(EXAMPLE_SECRET, data.account.secret) )
        })

        $("#populate-creds-status").text("Populated this page's examples with these credentials.")

        complete_step("Generate")

      },
      error: function() {
        $("#loader-0").hide();
        alert("There was an error with the Ripple Test Net, please try again.");
      }
    })
  })

  const EXAMPLE_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const EXAMPLE_SECRET = "s████████████████████████████"
  $("#populate-creds-button").click( () => {

  })

})
</script>

**Caution:** Ripple operates the XRP Test Net for testing purposes only, and regularly resets the state of the test net along with all balances. As a precaution, Ripple recommends **not** using the same addresses on the test net and production.


## Send a Payment on the Test Net
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Connect to a Test Net Server

To provide the necessary auto-fillable fields, ripple-lib must be connected to a server where it can get the current status of your account and the shared ledger itself. (For more security, you should sign transactions while being offline, but you must provide the auto-fillable fields manually if you do so.) You must be connected to the network to submit transactions to it.

The following code sample instantiates a new RippleAPI instance and connects to one of the public XRP Test Net servers that Ripple runs:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

For this tutorial, you can connect directly from your browser by pressing the following button:

{{ start_step("Connect") }}
<button id="connect-button" class="btn btn-primary">Connect to TestNet</button>
<div>
  <strong>Connection status:</strong>
  <span id="connection-status">Not connected</span>
  <div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"></div>
</div>
{{ end_step() }}

<script type="application/javascript">
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.on('connected', () => {
  $("#connection-status").text("Connected")
  $("#connect-button").prop("disabled", true)
  $("#loader-{{n.current}}").hide()

  // Update breadcrumbs & active next step
  complete_step("Connect")
  $("#interactive-prepare button").prop("disabled", false)
  $("#interactive-prepare button").prop("title", "")
})
api.on('disconnected', (code) => {
  $("#connection-status").text( "Disconnected ("+code+")" )
  $("#connect-button").prop("disabled", false)
  $(".connection-required").prop("disabled", true)
  $(".connection-required").prop("title", "Connection to Test Net required")
})
$("#connect-button").click(() => {
  $("#connection-status").text( "Connecting..." )
  $("#loader-{{n.current}}").show()
  api.connect()
})
</script>


### {{n.next()}}. Prepare Transaction

Typically, we create XRP Ledger transactions as objects in the JSON [transaction format](transaction-formats.html). The following example shows a minimal Payment specification:

```json
{
  "TransactionType": "Payment",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
```

The bare minimum set of instructions you must provide for an XRP Payment is:

- An indicator that this is a payment. (`"TransactionType": "Payment"`)
- The sending address. (`"Account"`)
- The address that should receive the XRP (`"Destination"`). This can't be the same as the sending address.
- The amount of XRP to send (`"Amount"`). Typically, this is specified as an integer in "drops" of XRP, where 1,000,000 drops equals 1 XRP.

Technically, a viable transaction must contain some additional fields, and certain optional fields such as `LastLedgerSequence` are strongly recommended. The [`prepareTransaction()` method](rippleapi-reference.html#preparetransaction) automatically fills in good defaults for the remaining fields of a transaction. Here's an example of preparing the above payment:

```js
// Continuing after connecting to the API
async function doPrepare() {
  const sender = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const preparedTx = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": sender,
    "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
    "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
  }, {
    // Expire this transaction if it doesn't execute within ~5 minutes:
    "maxLedgerVersionOffset": 75
  })
  const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
  console.log("Prepared transaction instructions:", preparedTx.txJSON)
  console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
  console.log("Transaction expires after ledger:", maxLedgerVersion)
  return preparedTx.txJSON
}
txJSON = doPrepare()
```

{{ start_step("Prepare") }}
  <button id="prepare-button" class="btn btn-primary connection-required"
    title="Connect to Test Net first" disabled>Prepare
    example transaction</button>
  <div id="prepare-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#prepare-button").click( async function() {
    // Wipe existing results
    $("#prepare-output").html("")

    const sender = $("#test-net-faucet-address").text() || "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sender,
      "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
      "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
    }, {
      // Expire this transaction if it doesn't execute within ~5 minutes:
      "maxLedgerVersionOffset": 75
    })
    const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
    $("#tx-lls").text(maxLedgerVersion) //for the table in the later step

    $("#prepare-output").html(
      "<div><strong>Prepared transaction instructions:</strong> <pre><code id='prepared-tx-json'>" +
      JSON.stringify(JSON.parse(preparedTx.txJSON), null, 2) + "</code></pre></div>" +
      "<div><strong>Transaction cost:</strong> " +
      preparedTx.instructions.fee + " XRP</div>" +
      "<div><strong>Transaction expires after ledger:</strong> " +
      maxLedgerVersion + "</div>"
    )

    // Update breadcrumbs & active next step
    complete_step("Prepare")
    $("#interactive-sign button").prop("disabled", false)
    $("#interactive-sign button").prop("title", "")
  })
</script>


### {{n.next()}}. Sign the Transaction Instructions

Use the [sign() method](rippleapi-reference.html#sign) to sign the transaction with RippleAPI. The first argument is a string version of the JSON transaction to sign.

```js
// Continuing from the previous step...
const response = api.sign(txJSON, "s████████████████████████████")
const txID = response.id
console.log("Identifying hash:", txID)
const txBlob = response.signedTransaction
console.log("Signed blob:", txBlob)
```

The result of the signing operation is a transaction object containing a signature. Typically, XRP Ledger APIs expect a signed transaction to be the hexadecimal representation of the transaction's canonical [binary format](serialization.html), called a "blob".

The signing API also returns the transaction's ID, or identifying hash, which you can use to look up the transaction later. This is a 64-character hexadecimal string that is unique to this transaction.

{{ start_step("Sign") }}
<button id="sign-button" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Sign
  example transaction</button>
<div id="sign-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#sign-button").click( function() {
    // Wipe previous output
    $("#sign-output").html("")

    const preparedTxJSON = $("#prepared-tx-json").text()
    const secret = $("#test-net-faucet-secret").text()

    if (!secret) {
      alert("Can't sign transaction without a real secret. Generate credentials first.")
      return
    }

    signResponse = api.sign(preparedTxJSON, secret)

    $("#sign-output").html(
      "<div><strong>Signed Transaction blob:</strong> <code id='signed-tx-blob' style='overflow-wrap: anywhere; word-wrap: anywhere'>" +
      signResponse.signedTransaction + "</code></div>" +
      "<div><strong>Identifying hash:</strong> <span id='signed-tx-hash'>" +
      signResponse.id + "</span></div>"
    )

    // Update all breadcrumbs & activate next step
    complete_step("Sign")
    $("#interactive-submit button").prop("disabled", false)
  })
</script>


### {{n.next()}}. Submit the Signed Blob

Use the [submit() method](rippleapi-reference.html#submit) to submit a transaction to the network. It's also a good idea to use the [getLedgerVersion() method](rippleapi-reference.html#getledgerversion) to take note of the latest validated ledger index before you submit. The earliest ledger version that your transaction could get into as a result of this submission is one higher than the latest validated ledger when you submit it.

Of course, if the same transaction was previously submitted, it could already be in a previous ledger. (It can't succeed a second time, but you may not realize it succeeded if you aren't looking in the right ledger versions.)

```js
// use txBlob from the previous example
async function doSubmit(txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion()

  const result = await api.submit(txBlob)

  console.log("Tentative result code:", result.resultCode)
  console.log("Tentative result message:", result.resultMessage)

  // Return the earliest ledger index this transaction could appear in
  // as a result of this submission, which is the first one after the
  // validated ledger at time of submission.
  return latestLedgerVersion + 1
}
const earliestLedgerVersion = doSubmit(txBlob)
```

This method returns the **tentative** result of trying to apply the transaction locally. This result _can_ change when the transaction is included in a validated ledger: transactions that succeed initially might ultimately fail, and transactions that fail initially might ultimately succeed. Still, the tentative result often matches the final result, so it's OK to get excited if you see `tesSUCCESS` here. 😁

If you see any other result, you should check the following:

- Are you using the correct addresses for the sender and destination?
- Did you forget any other fields of the transaction, skip any steps, or make any other typos?
- Do you have enough Test Net XRP to send the transaction? The amount of XRP you can send is limited by the [reserve requirement](reserves.html), which is currently 20 XRP with an additional 5 XRP for each "object" you own in the ledger. (If you generated a new address with the Test Net Faucet, you don't own any objects.)
- Are you connected to a server on the test network?

See the full list of [transaction results](transaction-results.html) for more possibilities.


{{ start_step("Submit") }}
  <button id="submit-button" class="btn btn-primary connection-required"
    title="Connection to Test Net required" disabled>Submit
    example transaction</button>
    <div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"></div>
    <div id="submit-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#submit-button").click( async function() {
    $("#submit-output").html("") // Wipe previous output
    $("#loader-{{n.current}}").show()

    const txBlob = $("#signed-tx-blob").text()
    const earliestLedgerVersion = await api.getLedgerVersion()
    $("#earliest-ledger-version").text(earliestLedgerVersion)

    try {
      const result = await api.submit(txBlob)
      $("#loader-{{n.current}}").hide()
      $("#submit-output").html(
        "<div><strong>Tentative result:</strong> " +
        result.resultCode + " - " +
        result.resultMessage +
        "</div>"
      )

      // Update breadcrumbs & active next step
      complete_step("Submit")
    }
    catch(error) {
      $("#loader-{{n.current}}").hide()
      $("#submit-output").text("Error: "+error)
    }

  })
</script>

### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

You use the `ledger` event type in RippleAPI to trigger your code to run whenever there is a new validated ledger version. For example:

```js
api.on('ledger', ledger => {
  console.log("Ledger version", ledger.ledgerVersion, "was just validated.")
  if (ledger.ledgerVersion > maxLedgerVersion) {
    console.log("If the transaction hasn't succeeded by now, it's expired")
  }
})
```

{{ start_step("Wait") }}
<table>
  <tr>
    <th>Latest Validated Ledger Version:</th>
    <td id="current-ledger-version">(Not connected)</td>
  </tr>
    <tr>
      <th>Ledger Version at Time of Submission:</th>
      <td id="earliest-ledger-version">(Not submitted)</td>
    </tr>
  <tr>
    <th>Transaction LastLedgerSequence:</th>
    <td id="tx-lls"></td>
  </tr>
</table>
{{ end_step() }}

<script type="application/javascript">
api.on('ledger', ledger => {
  $("#current-ledger-version").text(ledger.ledgerVersion)

  if ( $(".breadcrumb-item.bc-wait").hasClass("active") ) {
    // Advance to "Check" as soon as we see a ledger close
    complete_step("Wait")
    $("#get-tx-button").prop("disabled", false)
  }
})
</script>


### {{n.next()}}. Check Transaction Status

To know for sure what a transaction did, you must look up the outcome of the transaction when it appears in a validated ledger version. For example, you can use the [getTransaction() method](rippleapi-reference.html#gettransaction) to check the status of a transaction:

```js
// Continues from previous examples.
// earliestLedgerVersion was noted when the transaction was submitted.
// txID was noted when the transaction was signed.
try {
  tx = await api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion})
  console.log("Transaction result:", tx.outcome.result)
  console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
} catch(error) {
  console.log("Couldn't get transaction outcome:", error)
}

```

The RippleAPI `getTransaction()` method only returns success if the transaction is in a validated ledger version. Otherwise, the `await` expression raises an exception.

**Caution:** Other APIs may return tentative results from ledger versions that have not yet been validated. For example, if you use the `rippled` APIs' [tx method][], be sure to look for `"validated": true` in the response to confirm that the data comes from a validated ledger version. Transaction results that are not from a validated ledger version are subject to change. For more information, see [Finality of Results](finality-of-results.html).

{{ start_step("Check") }}
<button id="get-tx-button" class="btn btn-primary connection-required"
  title="Connection to Test Net required" disabled>Check transaction status</button>
<div id="get-tx-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#get-tx-button").click( async function() {
    // Wipe previous output
    $("#get-tx-output").html("")

    const txID = $("#signed-tx-hash").text()
    const earliestLedgerVersion = parseInt($("#earliest-ledger-version").text(), 10)

    try {
      const tx = await api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion})

      $("#get-tx-output").html(
        "<div><strong>Transaction result:</strong> " +
        tx.outcome.result + "</div>" +
        "<div><strong>Balance changes:</strong> <pre><code>" +
        JSON.stringify(tx.outcome.balanceChanges, null, 2) +
        "</pre></code></div>"
      )

      complete_step("Check")
    } catch(error) {
      $("#get-tx-output").text("Couldn't get transaction outcome:" + error)
    }

  })
</script>

## Differences for Production

To send an XRP payment on the production XRP Ledger, the steps you take are largely the same. However, there are some key differences in the necessary setup:

- [Getting real XRP isn't free.](#getting-a-real-xrp-account)
- [You must connect to a server that's synced with the production XRP Ledger network.](#connecting-to-the-production-xrp-ledger)

### Getting a Real XRP Account

This tutorial uses a button to get an address that's already funded with Test Net XRP, which only works because Test Net XRP is not worth anything. For actual XRP, you need to get XRP from someone who already has some. (For example, you might buy it on an exchange.) You can generate an address and secret that'll work on either production or the test net using RippleAPI's [generateAddress() method](rippleapi-reference.html#generateaddress):

```js
const generated = api.generateAddress()
console.log(generated.address) // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
console.log(generated.secret) // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```

**Warning:** You should only use an address and secret that you generated securely, on your local machine. If another computer generated the address and secret and sent it to you over a network, it's possible that someone else on the network may see that information. If they do, they'll have as much control over your XRP as you do. It's also recommended not to use the same address for the test net and for production, because transactions that you created for use on one network could potentially also be viable on the other network, depending on the parameters you provided.

Generating an address and secret doesn't get you XRP directly; it's just choosing a random number. You must also receive XRP at that address to [fund the account](accounts.html#creating-accounts). A common way to acquire XRP is to buy it from an exchange, then withdraw it to your own address. For more information, see Ripple's [XRP Buying Guide](https://ripple.com/xrp/buy-xrp/).

### Connecting to the Production XRP Ledger

When you instantiate the `RippleAPI` object, you must specify a server that's synced with the appropriate XRP Ledger. For many cases, you can use Ripple's public servers, such as in the following snippet:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s1.ripple.com:51233'})
api.connect()
```

If you [install `rippled`](install-rippled.html) yourself, it connects to the production network by default. (You can also [configure it to connect to the test net](connect-your-rippled-to-the-xrp-test-net.html) instead.) After the server has synced (typically within about 15 minutes of starting it up), you can connect RippleAPI to it locally, which has [various benefits](rippled-server-modes.html#reasons-to-run-a-stock-server). The following example shows how to connect RippleAPI to a server running the default configuration:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'ws://localhost:6006'})
api.connect()
```

**Tip:** The local connection uses the WebSocket protocol (`ws`) unencrypted rather than the TLS-encrypted version (`wss`). This is secure only because the communications never leave the same machine, and is easier to set up because it does not require a TLS certificate. For connections on an outside network, always use `wss`.

## Next Steps

After completing this tutorial, you may want to try the following:

- Build [Reliable transaction submission](reliable-transaction-submission.html) for production systems.
- Consult the [RippleAPI JavaScript Reference](rippleapi-reference.html) for the full range of XRP Ledger functionality.
- Customize your [Account Settings](manage-account-settings.html).
- Learn how [Transaction Metadata](transaction-metadata.html) describes the outcome of a transaction in detail.
- Explore [Complex Payment Types](complex-payment-types.html) like escrow and payment channels.
- Read best practices for [XRP Ledger Businesses](xrp-ledger-businesses.html).



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
