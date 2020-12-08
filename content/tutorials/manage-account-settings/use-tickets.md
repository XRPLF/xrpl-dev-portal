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
api = new ripple.RippleAPI({server: 'wss://s.devnet.rippletest.net:51233'})
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
api = new ripple.RippleAPI({server: 'wss://localhost:'}) //TODO: change to Devnet when possible
api.on('connected', async function() {
  $("#connection-status").text("Connected")
  $("#connect-button").prop("disabled", true)
  $("#loader-{{n.current}}").hide()

  // Update breadcrumbs & active next step
  complete_step("Connect")
  $("#interactive-prepare button").prop("disabled", false)//TODO: change ID
  $("#interactive-prepare button").prop("title", "")

  // TODO: remove this standalone mode "faucet" code
  resp = await api.request('wallet_propose')
  await api.request("submit", {secret: "masterpassphrase", tx_json: {
      "TransactionType": "Payment", "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "Amount": "100000000000", "Destination": resp.account_id
    }})

  // Populate creds
  const EXAMPLE_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const EXAMPLE_SECRET = "s████████████████████████████"
  $("#address").hide().html("<strong>Address:</strong> " +
    '<span id="use-address">' +
    resp.account_id
    + "</span>").show()
  $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
    let eltext = $(this).text()
    $(this).text( eltext.replace(EXAMPLE_ADDR, resp.account_id) )
  })
  $("#address").hide().html("<strong>Secret:</strong> " +
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
      account: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    }
  );
  console.log("Current sequence:", account_info.account_data.Sequence)
  return account_info.account_data.Sequence;
}

let current_sequence = get_sequence()
```

{{ start_step("Check Sequence") }}
<button id="check-sequence" class="btn btn-primary connection-required"
  title="Complete all previous steps first" disabled>Check Sequence Number</button>
<div id="check-sequence-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#check-sequence-button").click( async function() {
    const address = $("#use-address").text()
    // Wipe previous output
    $("#check-sequence-output").html("")
    const account_info = await api.request("account_info", {account: address})

    $("#check-sequence").append("Current sequence: "+account_info.account_data.Sequence)
    // TODO: populate Sequence number in next example
  }
</script>


### {{n.next()}}. Prepare and Sign TicketCreate

If you already have at least one Ticket available in the ledger, you can skip this step. Otherwise, you need to prepare the transaction to create some Tickets.

Construct a [TicketCreate transaction][] the sequence number you determined in the previous step. Use the `TicketCount` field to set how many Tickets to create. For example, this example [prepares a transaction](rippleapi-reference.html#preparetransaction) that would make 10 Tickets:

```js
async function prepareAndSign(txo) {
  const response = await api.prepareTransaction(txo)
  console.log("Prepared transaction:", response.txJSON)

  const response2 = await api.sign(response.txJSON, "s████████████████████████████")
  console.log("Transaction hash:", response2.id)
  return response2.signedTransaction
};

let tx_blob = prepareAndSign({
  "TransactionType": "TicketCreate",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "TicketCount": 10,
  "Sequence": current_sequence
})
```

### {{n.next()}}. Submit TicketCreate

If you already have at least one Ticket available in the ledger, you can skip this step. Otherwise, you need to send a transaction to create some Tickets.

Submit the signed transaction blob that you created in the previous step. For example:

### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

You use the `ledger` event type in RippleAPI to trigger your code to run whenever there is a new validated ledger version. For example:

```js
api.on('ledger', ledger => {
  console.log("Ledger version", ledger.ledgerVersion, "was validated.")
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
  <tr id="tx-validation-status">
  </tr>
</table>
{{ end_step() }}

<script type="application/javascript">
// TODO: change this to wait for a specific tx
api.on('ledger', ledger => {
  $("#current-ledger-version").text(ledger.ledgerVersion)

  if ( $(".breadcrumb-item.bc-wait").hasClass("active") ) {
    complete_step("Wait")
    //TODO
  }
})
</script>

### {{n.next()}}. Prepare Ticketed Transaction

Now that you have a Ticket available, you can prepare a transaction that uses it.

This can be any [type of transaction](transaction-types.html) you like. For this example, we use an [AccountSet transaction][] to set a `MessageKey`



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
