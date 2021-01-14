---
html: use-tickets.html
funnel: Build
doc_type: Tutorials
category: Manage Account Settings
blurb: Use Tickets to send a transaction outside of normal Sequence order.
filters:
    - interactive_steps
---
# Use Tickets

_(Requires the [TicketBatch amendment][] :not_enabled:)_

[Tickets](tickets.html) provide a way to send transactions out of the normal order. This tutorial walks through the steps of creating a Ticket, then using it to send another transaction.

## Prerequisites

<!-- Interactive example use ripple-lib and its prerequisites -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
<script type="application/javascript" src="{{target.ripple_lib_url}}"></script>
<!-- Helper for interactive tutorial breadcrumbs -->
<script type="application/javascript" src="assets/js/interactive-tutorial.js"></script>

- This page provides JavaScript examples that use the ripple-lib (RippleAPI) library. The [RippleAPI Beginners Guide](get-started-with-rippleapi-for-javascript.html) describes how to get started using RippleAPI to access XRP Ledger data from JavaScript.

- To use Tickets, you need a address and secret key, and some XRP. You can get all of these on the [Testnet](parallel-networks.html) using the following interface:

{% include '_snippets/generate-step.md' %}




## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Connect to a Testnet Server

You must be connected to the network to submit transactions to it. Currently, Tickets are only available on ***TODO: Devnet someday?*** stand-alone mode.

The following code sample instantiates a new RippleAPI instance and connects to one of the public XRP Devnet servers that Ripple runs:

```js
ripple = require('ripple-lib')

async function main() {
  api = new ripple.RippleAPI({server: 'wss://s.devnet.rippletest.net:51233'})
  await api.connect()

  // Code in the following examples continues here...
}

main()
```

**Note:** The code samples in this tutorial use JavaScript's [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

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
api = new ripple.RippleAPI({server: 'ws://localhost:6006'}) //TODO: change to Devnet when possible
api.on('connected', async function() {
  $("#connection-status").text("Connected")
  $("#connect-button").prop("disabled", true)
  $("#loader-{{n.current}}").hide()

  // Update breadcrumbs & activate next step
  complete_step("Connect")
  $("#check-sequence").prop("disabled", false)
  $("#check-sequence").prop("title", "")

  // TODO: remove this standalone mode "faucet" code
  resp = await api.request('wallet_propose')
  await api.request("submit", {"secret": "masterpassphrase", "tx_json": {
      "TransactionType": "Payment", "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "Amount": "100000000000", "Destination": resp.account_id
    }})
  await api.request("ledger_accept")

  // Populate creds
  const EXAMPLE_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const EXAMPLE_SECRET = "s████████████████████████████"
  $("#address").hide().html("<strong>Address:</strong> " +
    '<span id="use-address">' +
    resp.account_id +
    "</span>").show()
  $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
    let eltext = $(this).text()
    $(this).text( eltext.replace(EXAMPLE_ADDR, resp.account_id) )
  })
  $("#secret").hide().html("<strong>Secret:</strong> " +
    '<span id="use-secret">' +
    resp.master_seed
    + "</span>").show()
  $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
    let eltext = $(this).text()
    $(this).text( eltext.replace(EXAMPLE_SECRET, resp.master_seed) )
  })

  // END temp standalone faucet code
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


### {{n.next()}}. Check Sequence Number

If you already have at least one Ticket available in the ledger, you can skip this step. Otherwise, you need to get ready to create some Tickets for your other transactions to use.

Before you create any Tickets, you should check what [Sequence Number][] your account is at. You want the current Sequence number for the next step, and the Ticket Sequence numbers it sets aside start from this number.

```js
async function get_sequence() {
  const account_info = await api.request("account_info", {
      "account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  })
  console.log("Current sequence:", account_info.account_data.Sequence)
  return account_info.account_data.Sequence
}

let current_sequence = get_sequence()
```

{{ start_step("Check Sequence") }}
<button id="check-sequence" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Check Sequence Number</button>
<div id="check-sequence-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#check-sequence").click( async function() {
    const address = $("#use-address").text()
    // Wipe previous output
    $("#check-sequence-output").html("")
    const account_info = await api.request("account_info", {"account": address})

    $("#check-sequence-output").append(
      `<p>Current sequence: <code id="current_sequence">${account_info.account_data.Sequence}</code></p>`)


    // Update breadcrumbs & activate next step
    complete_step("Check Sequence")
    $("#prepare-and-sign").prop("disabled", false)
    $("#prepare-and-sign").prop("title", "")
  })
</script>


### {{n.next()}}. Prepare and Sign TicketCreate

If you already have at least one Ticket available in the ledger, you can skip this step. Otherwise, you need to prepare the transaction to create some Tickets.

Construct a [TicketCreate transaction][] the sequence number you determined in the previous step. Use the `TicketCount` field to set how many Tickets to create. For example, this example [prepares a transaction](rippleapi-reference.html#preparetransaction) that would make 10 Tickets:

```js
let prepared = await api.prepareTransaction({
  "TransactionType": "TicketCreate",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "TicketCount": 10,
  "Sequence": current_sequence
})
console.log("Prepared transaction:", prepared.txJSON)
let lastledgersequence = prepared.instructions.maxLedgerVersion

let signed = await api.sign(prepared.txJSON, "s████████████████████████████")
console.log("Transaction hash:", signed.id)

let tx_blob = signed.signedTransaction
```

Take note of the transaction's `LastLedgerSequence` value so you can [be sure whether or not it got validated](reliable-transaction-submission.html) later.


{{ start_step("Prepare & Sign") }}
<button id="prepare-and-sign" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Prepare & Sign</button>
<div id="prepare-and-sign-output"></div>
{{ end_step() }}


<script type="application/javascript">
  $("#prepare-and-sign").click( async function() {
    const address = $("#use-address").text()
    const secret = $("#use-secret").text()
    const current_sequence = parseInt($("#current_sequence").text())
    // TODO: error checking for if those aren't set properly
    // Wipe previous output
    $("#prepare-and-sign-output").html("")

    let prepared = await api.prepareTransaction({
      "TransactionType": "TicketCreate",
      "Account": address,
      "TicketCount": 10,
      "Sequence": current_sequence
    })

    $("#prepare-and-sign-output").append(
      `<p>Prepared transaction:</p><pre><code>${pretty_print(prepared.txJSON)}</code></pre>`)
    $("#lastledgersequence").html(
      `<code>${prepared.instructions.maxLedgerVersion}</code>`)

    let signed = await api.sign(prepared.txJSON, secret)
    $("#prepare-and-sign-output").append(
      `<p>Transaction hash: <code id="tx_id">${signed.id}</code></p>`)

    let tx_blob = signed.signedTransaction
    $("#prepare-and-sign-output").append(
      `<pre style="visibility: none"><code id="tx_blob">${tx_blob}</code></pre>`)

    // Update breadcrumbs & activate next step
    complete_step("Prepare & Sign")
    $("#ticketcreate-submit").prop("disabled", false)
    $("#ticketcreate-submit").prop("title", "")

  })
</script>


### {{n.next()}}. Submit TicketCreate

If you already have at least one Ticket available in the ledger, you can skip this step. Otherwise, you need to send a transaction to create some Tickets.

Submit the signed transaction blob that you created in the previous step. For example:

```js
let prelim_result = await api.request("submit", {"tx_blob": tx_blob})
console.log("Preliminary result:", prelim_result)
```

{{ start_step("Submit") }}
<button id="ticketcreate-submit" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Submit</button>
<div id="ticketcreate-submit-output"></div>
{{ end_step() }}


<script type="application/javascript">
  $("#ticketcreate-submit").click( async function() {
    const tx_blob = $("#tx_blob").text()
    // Wipe previous output
    $("#ticketcreate-submit-output").html("")

    waiting_for_tx = $("#tx_id").text() // next step uses this
    let prelim_result = await api.request("submit", {"tx_blob": tx_blob})
    $("#ticketcreate-submit-output").append(
      `<p>Preliminary result:</p><pre><code>${pretty_print(prelim_result)}</code></pre>`)
    $("#earliest-ledger-version").text(prelim_result.validated_ledger_index)

    // TODO: remove for devnet/testnet
    await api.request("ledger_accept")

    // Update breadcrumbs
    complete_step("Submit")
  })
</script>

### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

You use the `ledger` event type in RippleAPI to trigger your code to run whenever there is a new validated ledger version. For example:

```js
api.on('ledger', ledger => {
  console.log("Ledger version", ledger.ledgerVersion, "was validated.")
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
    <th><code>LastLedgerSequence</code>:</th>
    <td id="lastledgersequence">(Not prepared)</td>
  </tr>
  <tr id="tx-validation-status">
  </tr>
</table>
{{ end_step() }}

<script type="application/javascript">
let waiting_for_tx = null;
api.on('ledger', async (ledger) => {
  $("#current-ledger-version").text(ledger.ledgerVersion)

  if (waiting_for_tx) {
    try {
      tx_result = await api.request("tx", {
          "transaction": waiting_for_tx,
          "min_ledger": parseInt($("#earliest-ledger-version").text()),
          "max_ledger": parseInt(ledger.ledgerVersion)
      })
      console.log(tx_result)
      if (tx_result.validated) {
        $("#tx-validation-status").html(
          `<th>Final Result:</th><td>${tx_result.meta.TransactionResult} (Validated)</td>`)

        if ( $(".breadcrumb-item.bc-wait").hasClass("active") ) {
          complete_step("Wait")
          $("#check-tickets").prop("disabled", false)
          $("#check-tickets").prop("title", "")
        }
      }
    } catch(error) {
      console.error(error);
      // TODO: catch final failures here if possible
    }
  }

})
</script>

### (Optional) Intermission

The power of Tickets is that you can send other transactions during this time, and generally carry on with your account's normal business during this time. If you are planning on using a given Ticket, then as long as you don't use that Ticket for something else, you're free to continue using your account as normal. When you want to send the transaction using a Ticket, you can do that in parallel with other transactions using regular sequence numbers or different Tickets, and submit any of them in any order when you're ready.

***TODO: Maybe insert a mini-tx-sender-like board of buttons here?***

### {{n.next()}}. Check Available Tickets

When you want to send a Ticketed transaction, you need to know what Ticket Sequence number to use for it. If you've been keeping careful track of your account, you already know which Tickets you have, but if you're not sure, you can use the [account_objects method][] (or [`getAccountObjects()`](rippleapi-reference.html#getaccountobjects)) to look up your available tickets. For example:

```js
let response = await api.request("account_objects", {
    "account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "type": "ticket"
  })

console.log("Available Tickets:", response.account_objects)
```


{{ start_step("Check Tickets") }}
<button id="check-tickets" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Submit</button>
<div id="check-tickets-output"></div>
{{ end_step() }}


<script type="application/javascript">
  $("#check-tickets").click( async function() {
    const address = $("#use-address").text()
    // Wipe previous output
    $("#check-tickets-output").html("")

    let response = await api.request("account_objects", {
        "account": address,
        "type": "ticket"
      })
    $("#check-tickets-output").html(`<pre><code>${pretty_print(response)}</code></pre>`)

    // Update breadcrumbs & activate next step
    complete_step("Check Tickets")
    $("#prepare-ticketed-tx").prop("disabled", false)
    $("#prepare-ticketed-tx").prop("title", "")
  })
</script>

### {{n.next()}}. Prepare Ticketed Transaction

Now that you have a Ticket available, you can prepare a transaction that uses it.

This can be any [type of transaction](transaction-types.html) you like. The following example uses an [AccountSet transaction][] to set a `MessageKey` since that doesn't require any other setup in the ledger. Set the `Sequence` field to `0` and include a `TicketSequence` field with the Ticket Sequence number of one of your available Tickets.

```js
let prepared_t = await api.prepareTransaction({
  "TransactionType": "AccountSet",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "MessageKey": "DEADBEEF",
  "TicketSequence": use_ticket,
  "Sequence": 0
}, {
  // Adjust instructions to allow more time before submitting the transaction
  maxLedgerVersionOffset: 20
  //maxLedgerVersion: null // or, let the transaction remain valid indefinitely
})
console.log("Prepared JSON:", prepared_t.txJSON)

let signed_t = await api.sign(prepared_t.txJSON,
                                   "s████████████████████████████")
console.log("Transaction hash:", signed_t.id)
let tx_blob_t = signed.signedTransaction
console.log("Signed transaction blob:", tx_blob_t)
```

**Tip:** If you don't plan to submit the TicketCreate transaction right away, you should explicitly set the [instructions'](rippleapi-reference.html#transaction-instructions) `maxLedgerVersionOffset` to a larger number of ledgers. To create a transaction that could remain valid indefinitely, set the `maxLedgerVersion` to `null`.

{{ start_step("Prepare Ticketed Tx") }}
<button id="prepare-ticketed-tx" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Prepare Ticketed Transaction</button>
<div id="prepare-ticketed-tx-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#prepare-ticketed-tx").click(async function() {
    // TODO
  })
</script>

### {{n.next()}}. Submit Ticketed Transaction

Submit the signed transaction blob that you created in the previous step. For example:

```js
let prelim_result_t = await api.submit(tx_blob_t)
console.log("Preliminary result:", prelim_result_t)
```

### {{n.next()}}. Wait for Validation

```js
TODO
```


## See Also

- **Concepts:**
    - [Tickets](tickets.html)
    - [Multi-Signing](multi-signing.html)
- **Tutorials:**
    - [Set Up Multi-Signing](set-up-multi-signing.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [account_objects method][]
    - [sign_for method][]
    - [submit_multisigned method][]
    - [TicketCreate transaction][]
    - [Transaction Common Fields](transaction-common-fields.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
