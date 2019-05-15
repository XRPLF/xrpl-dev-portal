# Monitor Incoming Payments with WebSocket

This tutorial shows how to monitor for incoming payments using the [WebSocket `rippled` API](rippled-api.html). Since all XRP Ledger transactions are public, anyone can monitor incoming payments to any address.

WebSocket follows a model where the client and server establish one connection, then send messages both ways through the same connection, which remains open until explicitly closed (or until the connection fails). This is in contrast to the HTTP-based API model (including JSON-RPC and RESTful APIs), where the client opens and closes a new connection for each request[¹](#footnote-1)<a id="from-footnote-1"></a>.

**Tip:** The examples in this page use JavaScript so that the examples can run natively in a web browser. If you are developing in JavaScript, you can also use the [RippleAPI library for JavaScript](https://developers.ripple.com/rippleapi-reference.html) to simplify some tasks. This tutorial shows how to monitor for transactions _without_ using RippleAPI so that you can translate the steps to other programming languages that don't have RippleAPI.

## Prerequisites

- The examples in this page use JavaScript and the WebSocket protocol, which are available in all major modern browsers. If you have some JavaScript knowledge and expertise in another programming language with a WebSocket client, you can follow along while adapting the instructions to the language of your choice.
- You need a stable internet connection and access to a `rippled` server. The embedded examples connect to Ripple's pool of public servers. If you [run your own `rippled` server](install-rippled.html), you can also connect to that server locally.
- To properly handle XRP values without rounding error, you need access to a number type that can do math on 64-bit unsigned integers. The examples in this tutorial use [big.js](https://github.com/MikeMcl/big.js/). If you are working with [issued currencies](issued-currencies.html), you need even more precision. For more information, see [Currency Precision](currency-formats.html#xrp-precision).

<!-- Helper for interactive tutorial breadcrumbs -->
<script type="application/javascript" src="assets/vendor/big.min.js"></script>
<script type="application/javascript" src="assets/js/interactive-tutorial.js"></script>
<script type="application/javascript">
// Helper stuff for this interactive tutorial specifically

function writeToConsole(console_selector, message) {
  let write_msg = "<div class='console-entry'>" + message + "</div>"
  $(console_selector).find(".placeholder").remove()
  $(console_selector).append(write_msg)
  // TODO: JSON pretty-printing, maybe w/ multiple input args?
}

</script>

{% set n = cycler(* range(1,99)) %}

## {{n.next()}}. Connect to the XRP Ledger

The first step of monitoring for incoming payments is to connect to the XRP Ledger, specifically a `rippled` server.

The following JavaScript code connects to one of Ripple's public server clusters. It then logs a message to the console, sends a requesting using the [ping method][] and sets up a handler to log to the console again when it receives any message from the server side.

```js
const socket = new WebSocket('wss://s.altnet.rippletest.net:51233')
socket.addEventListener('open', (event) => {
  // This callback runs when the connection is open
  console.log("Connected!")
  const command = {
    "id": "on_open_ping_1",
    "command": "ping"
  }
  socket.send(JSON.stringify(command))
})
socket.addEventListener('message', (event) => {
  console.log('Got message from server:', event.data)
})
```

The above example opens a secure connection (`wss://`) to one of Ripple's public API servers on the [Test Net](xrp-test-net-faucet.html). To connect to a locally-running `rippled` server with the default configuration instead, open an _unsecured_ connection (`ws://`) on port **6006** locally, using the following first line:

```js
const socket = new WebSocket('ws://localhost:6006')
```

**Tip:** By default, connecting to a local `rippled` server gives you access to the full set of [admin methods](admin-rippled-methods.html) and admin-only data in some responses such as [server_info][server_info method], in addition to the [public methods](public-rippled-methods.html) that are available when you connect to a public servers over the internet.

Example:

{{ start_step("Connect") }}
<button id="connect-button" class="btn btn-primary">Connect</button>
<strong>Connection status:</strong>
<span id="connection-status">Not connected</span>
<div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/rippleThrobber.png"></div>
<h5>Console:</h5>
<div class="ws-console" id="monitor-console-connect"><span class="placeholder">(Log is empty)</span></div>
{{ end_step() }}

<script type="application/javascript">
let socket;
$("#connect-button").click((event) => {
  socket = new WebSocket('wss://s.altnet.rippletest.net:51233')
  socket.addEventListener('open', (event) => {
    // This callback runs when the connection is open
    writeToConsole("#monitor-console-connect", "Connected!")
    $("#connection-status").text("Connected")
    const command = {
      "id": "on_open_ping_1",
      "command": "ping"
    }
    socket.send(JSON.stringify(command))

    complete_step("Connect")
    $("#connect-button").prop("disabled", "disabled")
    $("#enable_dispatcher").prop("disabled",false)
  })
  socket.addEventListener('close', (event) => {
    $("#connection-status").text("Disconnected")
    $("#connect-button").prop("disabled", false)
  })
  socket.addEventListener('message', (event) => {
    writeToConsole("#monitor-console-connect", "Got message from server: "+JSON.stringify(event.data))
  })
})
</script>


## {{n.next()}}. Dispatch Incoming Messages to Handlers

Since WebSocket connections can have several messages going each way and there is not a strict 1:1 correlation between requests and responses, you need to identify what to do with each incoming message. A good model for coding this is to set up a "dispatcher" function that reads incoming messages and relays each message to the correct code path for handling it. To help dispatch messages appropriately, the `rippled` server provides a `type` field on every WebSocket message:

- For any message that is a direct response to a request from the client side, the `type` is the string `response`. In this case, the server also provides the following:

    - An `id` field that matches the `id` provided in the request this is a response for. (This is important because responses may arrive out of order.)

    - A `status` field that indicates whether the API successfully processed your request. The string value `success` indicates [a successful response](response-formatting.html). The string value `error` indicates [an error](error-formatting.html).

        **Warning:** When submitting transactions, a `status` of `success` at the top level of the WebSocket message does not mean that the transaction itself succeeded. It only indicates that the server understood your request. For looking up a transaction's actual outcome, see [Look Up Transaction Results](look-up-transaction-results.html).

- For follow-up messages from [subscriptions](subscribe.html), the `type` indicates the type of follow-up message it is, such as the notification of an new transaction, ledger, or validation; or a follow-up to an ongoing [pathfinding request](path_find.html). Your client only receives these messages if it subscribes to them.

**Tip:** The [RippleAPI library for JavaScript](rippleapi-reference.html) handles this step by default. All asynchronous API requests use Promises to provide the response, and you can listen to streams using the [`.on(event, callback)` method](rippleapi-reference.html#listening-to-streams).

The following JavaScript code defines a helper function to make API requests into convenient asynchronous [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), and sets up an interface to map other types of messages to global handlers:

```js
const AWAITING = {}
const handleResponse = function(data) {
  if (!data.hasOwnProperty("id")) {
    console.error("Got response event without ID:", data)
    return
  }
  if (AWAITING.hasOwnProperty(data.id)) {
    AWAITING[data.id].resolve(data)
  } else {
    console.error("Response to un-awaited request w/ ID "+data.id)
  }
}

let autoid_n = 0
function api_request(options) {
  if (!options.hasOwnProperty("id")) {
    options.id = "autoid_" + (autoid_n++)
  }

  let resolveHolder;
  AWAITING[options.id] = new Promise((resolve, reject) => {
    // Save the resolve func to be called by the handleResponse function later
    this.resolve = resolve
    try {
      // Use the socket opened in the previous example...
      socket.send(JSON.stringify(options))
    } catch {
      reject()
    }
  })
  AWAITING[options.id].resolve = resolveHolder;
  return AWAITING[options.id]
}

const WS_HANDLERS = {
  "response": handleResponse
  // Fill this out with your handlers in the following format:
  // "type": function(event) { /* handle event of this type */ }
}
socket.addEventListener('message', (event) => {
  const parsed_data = JSON.parse(event.data)
  if (WS_HANDLERS.hasOwnProperty(parsed_data.type)) {
    // Call the mapped handler
    WS_HANDLERS[parsed_data.type](parsed_data)
  } else {
    console.log("Unhandled message from server", event)
  }
})

// Demonstrate api_request functionality
async function pingpong() {
  console.log("Ping...")
  const response = await api_request({command: "ping"})
  console.log("Pong!", response)
}
pingpong()
```

{{ start_step("Dispatch Messages") }}
<button id="enable_dispatcher" class="btn btn-primary" disabled="disabled">Enable Dispatcher</button>
<button id="dispatch_ping" class="btn btn-primary" disabled="disabled">Ping!</button>
<h5>Responses</h5>
<div class="ws-console" id="monitor-console-ping"><span class="placeholder">(Log is empty)</span></div>
{{ end_step() }}

<script type="application/javascript">
const AWAITING = {}
const handleResponse = function(data) {
  if (!data.hasOwnProperty("id")) {
    writeToConsole("#monitor-console-ping", "Got response event without ID:", data)
    return
  }
  if (AWAITING.hasOwnProperty(data.id)) {
    AWAITING[data.id].resolve(data)
  } else {
    writeToConsole("#monitor-console-ping", "Response to un-awaited request w/ ID "+data.id)
  }
}

let autoid_n = 0
function api_request(options) {
  if (!options.hasOwnProperty("id")) {
    options.id = "autoid_" + (autoid_n++)
  }
  let resolveFunc;
  AWAITING[options.id] = new Promise((resolve, reject) => {
    // Save the resolve func to be called by the handleResponse function later
    resolveFunc = resolve
    try {
      // Use the socket opened in the previous example...
      socket.send(JSON.stringify(options))
    } catch {
      reject()
    }
  })
  AWAITING[options.id].resolve = resolveFunc
  return AWAITING[options.id]
}

const WS_HANDLERS = {
  "response": handleResponse
}
$("#enable_dispatcher").click((clickEvent) => {
  socket.addEventListener('message', (event) => {
    const parsed_data = JSON.parse(event.data)
    if (WS_HANDLERS.hasOwnProperty(parsed_data.type)) {
      // Call the mapped handler
      WS_HANDLERS[parsed_data.type](parsed_data)
    } else {
      writeToConsole("#monitor-console-ping", "Unhandled message from server: "+event)
    }
  })
  complete_step("Dispatch Messages")
  $("#dispatch_ping").prop("disabled", false)
  $("#tx_subscribe").prop("disabled", false)
})

async function pingpong() {
  const response = await api_request({command: "ping"})
  writeToConsole("#monitor-console-ping", "Pong! "+JSON.stringify(response))
}

$("#dispatch_ping").click((event) => {
  pingpong()
})
</script>

## {{n.next()}}. Subscribe to the Account

To get a live notification whenever a transaction affects your account, you can subscribe to the account with the [subscribe method][]. In fact, it doesn't have to be your own account: since all transactions are public, you can subscribe to any account or even a combination of accounts.

After you subscribe to one or more accounts, you the server sends a message with `"type": "transaction"` on each _validated_ transaction that affects any of the specified accounts in some way. To confirm this, look for `"validated": true` in the transaction messages.

The following code sample subscribes to the Test Net Faucet's sending address. It logs a message on each such transaction by adding a handler to the dispatcher from the previous step.

```js
async function do_subscribe() {
  const sub_response = await api_request({
    command:"subscribe",
    accounts: ["rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"]
  })
  if (sub_response.status === "success") {
    console.log("Successfully subscribed!")
  } else {
    console.error("Error subscribing: ", sub_response)
  }
}
do_subscribe()

const log_tx = function(tx) {
  console.log(tx.transaction.TransactionType+" transaction sent by " +
              tx.transaction.Account +
              "\n  Result: "+tx.meta.TransactionResult +
              " in ledger " + tx.ledger_index +
              "\n  Validated? " + tx.validated)
}
WS_HANDLERS["transaction"] = log_tx
```

For the following example, try opening the [Transaction Sender](tx-sender.html) in a different window or even on a different device and sending transactions to the address you subscribed to:

{{ start_step("Subscribe") }}
<label for="subscribe_address">Test Net Address:</label>
<input type="text" class="form-control" id="subscribe_address" value="rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM">
<button id="tx_subscribe" class="btn btn-primary" disabled="disabled">Subscribe</button>
<h5>Transactions</h5>
<div class="ws-console" id="monitor-console-subscribe"><span class="placeholder">(Log is empty)</span></div>
{{ end_step() }}

<script type="application/javascript">
async function do_subscribe() {
  const sub_address = $("#subscribe_address").val()
  const sub_response = await api_request({
    command:"subscribe",
    accounts: [sub_address]
  })
  if (sub_response.status === "success") {
    writeToConsole("#monitor-console-subscribe", "Successfully subscribed!")
  } else {
    writeToConsole("#monitor-console-subscribe",
                   "Error subscribing: "+JSON.stringify(sub_response))
  }
}
$("#tx_subscribe").click((event) => {
  do_subscribe()
  complete_step("Subscribe")
  $("#tx_read").prop("disabled", false)
})

const log_tx = function(tx) {
  writeToConsole("#monitor-console-subscribe",
                  tx.transaction.TransactionType+" transaction sent by " +
                  tx.transaction.Account +
                  "<br/>&nbsp;&nbsp;Result: "+tx.meta.TransactionResult +
                  " in ledger " + tx.ledger_index +
                  "<br/>&nbsp;&nbsp;Validated? " + tx.validated)
}
WS_HANDLERS["transaction"] = log_tx
</script>


## {{n.next()}}. Read Incoming Payments

When you subscribe to an account, you get messages for _all transactions to or from the account_, as well as _transactions that affect the account indirectly_, such as trading its [issued currencies](issued-currencies.html). If your goal is to recognize when the account has received incoming payments, you must filter the transactions stream and process the payments based on the amount they actually delivered. Look for the following information:

- The **`validated` field** indicates that the transaction's outcome is [final](finality-of-results.html). This should always be the case when you subscribe to `accounts`, but if you _also_ subscribe to `accounts_proposed` or the `transactions_proposed` stream then the server sends similar messages on the same connection for unconfirmed transactions. As a precaution, it's best to always check the `validated` field.
- The **`meta.TransactionResult` field** is the [transaction result](transaction-results.html). If the result is not `tesSUCCESS`, the transaction failed and cannot have delivered any value.
- The **`transaction.Account`** field is the sender of the transaction. If you are only looking for transactions sent by others, you can ignore any transactions where this field matches your account's address. (Keep in mind, it _is_ possible to make a cross-currency payment to yourself.)
- The **`transaction.TransactionType` field** is the type of transaction. The transaction types that can possibly deliver currency to an account are as follows:
    - **[Payment transactions][]** can deliver XRP or [issued currencies](issued-currencies.html). Filter these by the `transaction.Destination` field, which contains the address of the recipient, and always use the `meta.delivered_amount` to see how much the payment actually delivered. XRP amounts are [formatted as strings](basic-data-types.html#specifying-currency-amounts).

        **Warning:** If you use the `transaction.Amount` field instead, you may be vulnerable to the [partial payments exploit](partial-payments.html#partial-payments-exploit). Malicious users can use this exploit to trick you into allowing the malicious user to trade or withdraw more money than they paid you.

    - **[CheckCash transactions][]** :not_enabled: allow an account to receive money authorized by a different account's [CheckCreate transaction][]. Look at the metadata of a **CheckCash transaction** to see how much currency the account received.

    - **[EscrowFinish transactions][]** can deliver XRP by finishing an [Escrow](escrow.html) created by a previous [EscrowCreate transaction][]. Look at the metadata of the **EscrowFinish transaction** to see which account received XRP from the escrow and how much.

    - **[OfferCreate transactions][]** can deliver XRP or issued currencies by consuming offers your account has previous placed in the XRP Ledger's [decentralized exchange](decentralized-exchange.html). If you never place offers, you cannot receive money this way. Look at the metadata to see what currency the account received, if any, and how much.

    - **[PaymentChannelClaim transactions][]** can deliver XRP from a [payment channel](payment-channels.html). Look at the metadata to see which accounts, if any, received XRP from the transaction.

    - **[PaymentChannelFund transactions][]** can return XRP from a closed (expired) payment channel to the sender.

- The **`meta` field** contains [transaction metadata](transaction-metadata.html), including exactly how much of which currency or currencies was delivered where. See [Look Up transaction Results](look-up-transaction-results.html) for more information on how to understand transaction metadata.

The following sample code looks at transaction metadata of all the above transaction types to report how much XRP an account received:

```js
{% include '_code-samples/monitor-payments-websocket/read-amount-received.js' %}
```

{{ start_step("Read Payments") }}
<button id="tx_read" class="btn btn-primary" disabled="disabled">Start Reading</button>
<h5>Transactions</h5>
<div class="ws-console" id="monitor-console-read"><span class="placeholder">(Log is empty)</span></div>
{{ end_step() }}

<script type="application/javascript">
function CountXRPDifference(affected_nodes, address) {
  // Helper to find an account in an AffectedNodes array and see how much
  // its balance changed, if at all. Fortunately, each account appears at most
  // once in the AffectedNodes array, so we can return as soon as we find it.

  // Note: this reports the net balance change. If the address is the sender,
  // any XRP balance changes combined with the transaction cost.

  for (let i=0; i<affected_nodes.length; i++) {
    if ((affected_nodes[i].hasOwnProperty("ModifiedNode"))) {
      // modifies an existing ledger entry
      let ledger_entry = affected_nodes[i].ModifiedNode
      if (ledger_entry.LedgerEntryType === "AccountRoot" &&
          ledger_entry.FinalFields.Account === address) {
        if (!ledger_entry.PreviousFields.hasOwnProperty("Balance")) {
          writeToConsole("#monitor-console-read", "XRP balance did not change.")
        }
        // Balance is in PreviousFields, so it changed. Time for
        // high-precision math!
        const old_balance = new Big(ledger_entry.PreviousFields.Balance)
        const new_balance = new Big(ledger_entry.FinalFields.Balance)
        const diff_in_drops = new_balance.minus(old_balance)
        const xrp_amount = diff_in_drops.div(10e6)
        if (xrp_amount.gte(0)) {
          writeToConsole("#monitor-console-read", "Received "+xrp_amount.toString()+" XRP.")
          return
        } else {
          writeToConsole("#monitor-console-read", "Spent "+xrp_amount.abs().toString()+" XRP.")
          return
        }
      }
    } else if ((affected_nodes[i].hasOwnProperty("CreatedNode"))) {
      // created a ledger entry. maybe the account just got funded?
      let ledger_entry = affected_nodes[i].CreatedNode
      if (ledger_entry.LedgerEntryType === "AccountRoot" &&
          ledger_entry.NewFields.Account === address) {
        const balance_drops = new Big(ledger_entry.NewFields.Balance)
        const xrp_amount = balance_drops.div(10e6)
        writeToConsole("#monitor-console-read", "Received "+xrp_amount.toString()+" XRP (account funded).")
        return
      }
    } // accounts cannot be deleted at this time, so we ignore DeletedNode
  }

  writeToConsole("#monitor-console-read", "Did not find address in affected nodes.")
  return
}

function CountXRPReceived(tx, address) {
  if (tx.meta.TransactionResult !== "tesSUCCESS") {
    writeToConsole("#monitor-console-read", "Transaction failed.")
    return
  }
  if (tx.transaction.TransactionType === "Payment") {
    if (tx.transaction.Destination !== address) {
      writeToConsole("#monitor-console-read", "Not the destination of this payment. (We're "+address+"; they're "+tx.transaction.Destination+")")
      return
    }
    if (typeof tx.meta.delivered_amount === "string") {
      const amount_in_drops = new Big(tx.meta.delivered_amount)
      const xrp_amount = amount_in_drops.div(10e6)
      writeToConsole("#monitor-console-read", "Received " + xrp_amount.toString() + " XRP.")
      return
    } else {
      writeToConsole("#monitor-console-read", "Received non-XRP currency.")
      return
    }
  } else if (["PaymentChannelClaim", "PaymentChannelFund", "OfferCreate",
          "CheckCash", "EscrowFinish"].includes(
          tx.transaction.TransactionType)) {
    CountXRPDifference(tx.meta.AffectedNodes, address)
  } else {
    writeToConsole("#monitor-console-read", "Not a currency-delivering transaction type (" +
                tx.transaction.TransactionType + ").")
  }
}

$("#tx_read").click((event) => {
  // Wrap the existing "transaction" handler to do the old thing and also
  // do the CountXRPReceived thing
  const sub_address = $("#subscribe_address").val()
  const old_handler = WS_HANDLERS["transaction"]
  const new_handler = function(data) {
    old_handler(data)
    CountXRPReceived(data, sub_address)
  }
  WS_HANDLERS["transaction"] = new_handler
  // Disable the button so you can't stack up multiple levels of the new handler
  $("#tx_read").prop("disabled", "disabled")
  complete_step("Read Payments")
})
</script>

## {{n.next()}}. Look Out for Gaps

Notifications about new transactions _should_ all arrive in the correct order, without anything missing, but internet can be unreliable. If your software loses connectivity or other unexpected situations occur, some transaction messages could be delayed or never arrive at all. You can compensate for this by following the "cryptographic chain of evidence" the XRP Ledger provides with each transaction. That way, you know when you're missing something, and you can look up any missing transactions until you connect back to the transactions you already know about.

You can follow the history of changes to an [object in the XRP Ledger](ledger-data-types.html) by looking at the `PreviousTxnID` field of that object and checking the transaction whose [identifying hash][] matches. (The `PreviousTxnLgrSeq` field tells you what [ledger index][] has the transaction, so you know how far back to go in the [ledger history](ledger-history.html) to find the transaction.) The metadata for that transaction shows the changes made by the transaction, and the _previous_ `PreviousTxnID` value, so you can repeat the process as far back as you need to go.

To look for gaps that might affect a transaction's XRP balance, you can use this technique on the `AccountRoot` object for the account as follows:

1. When you first connect, establish a starting point by calling the [account_info method][] to look up the latest `PreviousTxnID` value and save it.
2. Whenever you get a new transaction, look through the modified ledger objects to see if the account in question was modified. This is the same as how you read the account's balance changes. Specifically, you should look in the `meta.AffectedNodes` array for a `ModifiedNode` object of ledger entry type `AccountRoot`, where the `FinalFields.Account` value matches the address of the account.
    - If no such object exists, the account was not directly modified by the transaction. Since the XRP Ledger tracks XRP balances in this object, you know that the account's XRP balance did not change[²](#footnote-2) <a id="from-footnote-2"></a>. (The `accounts` stream also reports several types of transactions that _indirectly_ affect an account without modifying the `AccountRoot` object itself.)
3. If the account _was_ modified, compare the `ModifiedNode` object's `PreviousTxnID` field to the value you have saved.
    - If they match, you did not miss any changes to that account's XRP balance. Update your saved `PreviousTxnID` to the identifying hash of the new transaction (the `transaction.hash` field in `transaction`-type subscription messages). **Continue processing transactions normally.**
4. If the account was modified _and_ the `PreviousTxnID` value did not match the hash you were expecting, use the [tx method][] to look up the missing transaction, using the `PreviousTxnID` value from the new transaction to identify the missing transaction. We'll call this the "gap" transaction.
    - If the `tx` method returns a "not found" error, make sure your server has the ledger in its history. Look at the range of `complete_ledgers` reported by the [server_info method][] and confirm that the `PreviousTxnLgrSeq` value is within the specified range. If necessary, use a [full history server](full-history-server.html) to look up old transaction history.
5. In the "gap" transaction, find the modified account in the `meta.AffectedNodes` array (as in step 2) and compare its `PreviousTxnID` field to the value you were originally expecting.
    - If the value matches, you have successfully closed the gap. Save the identifying hash of the newest transaction, and resume processing new transactions as normal. (Don't use the transaction you looked up last; use the transaction that caused you to realize you had a gap.) **Resume processing transactions normally.**
6. If the `PreviousTxnID` of the "gap" transaction does not match the value you were expecting, there are multiple "gap" transactions. Repeat steps 4 and 5 until you close the gap.
    - If you haven't filled the gap by the time you reach a the transaction that created the object (where the account appears as a `CreatedNode` entry instead of a `ModifiedNode` entry), something has gone wrong and there is a bug somewhere.

```js
{% include '_code-samples/monitor-payments-websocket/chaining.js' %}
```

***TODO: interactive gap detector (maybe you can force it to have gaps by temporarily switching your browser to offline mode?)***

## Footnotes

[1.](#from-footnote-1) <a id="footnote-1"></a> In practice, when calling an HTTP-based API multiple times, the client and server may reuse the same connection for several requests and responses. This practice is called [HTTP persistent connection, or keep-alive](https://en.wikipedia.org/wiki/HTTP_persistent_connection). From a development standpoint, the code to use an HTTP-based API is the same regardless of whether the underlying connection is new or reused.

[2.](#from-footnote-2) <a id="footnote-2"></a> The `Balance` field of an account tracks the XRP held directly by the account. This does not include XRP set aside in [payment channels](payment-channels.html) or [escrows](escrow.html). Additionally, some portion of that `Balance` is set aside for [reserves](reserves.html) and cannot be spent normally.




<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
