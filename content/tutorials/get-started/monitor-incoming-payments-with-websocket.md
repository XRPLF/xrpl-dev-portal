# Monitor Incoming Payments with WebSocket

This tutorial shows how to monitor for incoming [payments](payment-types.html) using the [WebSocket `rippled` API](rippled-api.html). Since all XRP Ledger transactions are public, anyone can monitor incoming payments to any address.

WebSocket follows a model where the client and server establish one connection, then send messages both ways through the same connection, which remains open until explicitly closed (or until the connection fails). This is in contrast to the HTTP-based API model (including JSON-RPC and RESTful APIs), where the client opens and closes a new connection for each request.[¹](#footnote-1)<a id="from-footnote-1"></a>

**Tip:** The examples in this page use JavaScript so that the examples can run natively in a web browser. If you are developing in JavaScript, you can also use the [RippleAPI library for JavaScript](rippleapi-reference.html) to simplify some tasks. This tutorial shows how to monitor for transactions _without_ using RippleAPI so that you can translate the steps to other programming languages that don't have RippleAPI.

## Prerequisites

- The examples in this page use JavaScript and the WebSocket protocol, which are available in all major modern browsers. If you have some JavaScript knowledge and expertise in another programming language with a WebSocket client, you can follow along while adapting the instructions to the language of your choice.
- You need a stable internet connection and access to a `rippled` server. The embedded examples connect to Ripple's pool of public servers. If you [run your own `rippled` server](install-rippled.html), you can also connect to that server locally.
- To properly handle XRP values without rounding errors, you need access to a number type that can do math on 64-bit unsigned integers. The examples in this tutorial use [big.js](https://github.com/MikeMcl/big.js/). If you are working with [issued currencies](issued-currencies.html), you need even more precision. For more information, see [Currency Precision](currency-formats.html#xrp-precision).

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

The following JavaScript code connects to one of Ripple's public server clusters. It then logs a message to the console, sends a request using the [ping method][] and sets up a handler to log to the console again when it receives any message from the server side.

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
socket.addEventListener('close', (event) => {
  // Use this event to detect when you have become disconnected
  // and respond appropriately.
  console.log('Disconnected...')
})
```

The above example opens a secure connection (`wss://`) to one of Ripple's public API servers on the [Test Net](xrp-test-net-faucet.html). To connect to a locally-running `rippled` server with the default configuration instead, open an _unsecured_ connection (`ws://`) on port **6006** locally, using the following first line:

```js
const socket = new WebSocket('ws://localhost:6006')
```

**Tip:** By default, connecting to a local `rippled` server gives you access to the full set of [admin methods](admin-rippled-methods.html) and admin-only data in some responses such as [server_info][server_info method], in addition to the [public methods](public-rippled-methods.html) that are available when you connect to public servers over the internet.

Example:

{{ start_step("Connect") }}
<button id="connect-button" class="btn btn-primary">Connect</button>
<strong>Connection status:</strong>
<span id="connection-status">Not connected</span>
<div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"></div>
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
    writeToConsole("#monitor-console-connect", "Got message from server: " +
          JSON.stringify(event.data))
  })
})
</script>


## {{n.next()}}. Dispatch Incoming Messages to Handlers

Since WebSocket connections can have several messages going each way and there is not a strict 1:1 correlation between requests and responses, you need to identify what to do with each incoming message. A good model for coding this is to set up a "dispatcher" function that reads incoming messages and relays each message to the correct code path for handling it. To help dispatch messages appropriately, the `rippled` server provides a `type` field on every WebSocket message:

- For any message that is a direct response to a request from the client side, the `type` is the string `response`. In this case, the server also provides the following:

    - An `id` field that matches the `id` provided in the request this is a response for. (This is important because responses may arrive out of order.)

    - A `status` field that indicates whether the API successfully processed your request. The string value `success` indicates [a successful response](response-formatting.html). The string value `error` indicates [an error](error-formatting.html).

        **Warning:** When submitting transactions, a `status` of `success` at the top level of the WebSocket message does not mean that the transaction itself succeeded. It only indicates that the server understood your request. For looking up a transaction's actual outcome, see [Look Up Transaction Results](look-up-transaction-results.html).

- For follow-up messages from [subscriptions](subscribe.html), the `type` indicates the type of follow-up message it is, such as the notification of a new transaction, ledger, or validation; or a follow-up to an ongoing [pathfinding request](path_find.html). Your client only receives these messages if it subscribes to them.

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
    console.error("Response to un-awaited request w/ ID " + data.id)
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
    resolveHolder = resolve
    try {
      // Use the socket opened in the previous example...
      socket.send(JSON.stringify(options))
    } catch(error) {
      reject(error)
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
    writeToConsole("#monitor-console-ping", "Response to un-awaited request w/ ID " + data.id)
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
    } catch(error) {
      reject(error)
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
      writeToConsole("#monitor-console-ping", "Unhandled message from server: " + event)
    }
  })
  complete_step("Dispatch Messages")
  $("#dispatch_ping").prop("disabled", false)
  $("#tx_subscribe").prop("disabled", false)
})

async function pingpong() {
  const response = await api_request({command: "ping"})
  writeToConsole("#monitor-console-ping", "Pong! " + JSON.stringify(response))
}

$("#dispatch_ping").click((event) => {
  pingpong()
})
</script>

## {{n.next()}}. Subscribe to the Account

To get a live notification whenever a transaction affects your account, you can subscribe to the account with the [subscribe method][]. In fact, it doesn't have to be your own account: since all transactions are public, you can subscribe to any account or even a combination of accounts.

After you subscribe to one or more accounts, the server sends a message with `"type": "transaction"` on each _validated_ transaction that affects any of the specified accounts in some way. To confirm this, look for `"validated": true` in the transaction messages.

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
  console.log(tx.transaction.TransactionType + " transaction sent by " +
              tx.transaction.Account +
              "\n  Result: " + tx.meta.TransactionResult +
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
                   "Error subscribing: " + JSON.stringify(sub_response))
  }
}
$("#tx_subscribe").click((event) => {
  do_subscribe()
  complete_step("Subscribe")
  $("#tx_read").prop("disabled", false)
})

const log_tx = function(tx) {
  writeToConsole("#monitor-console-subscribe",
                  tx.transaction.TransactionType + " transaction sent by " +
                  tx.transaction.Account +
                  "<br/>&nbsp;&nbsp;Result: " + tx.meta.TransactionResult +
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

    - **[OfferCreate transactions][]** can deliver XRP or issued currencies by consuming offers your account has previously placed in the XRP Ledger's [decentralized exchange](decentralized-exchange.html). If you never place offers, you cannot receive money this way. Look at the metadata to see what currency the account received, if any, and how much.

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
        const xrp_amount = diff_in_drops.div(1e6)
        if (xrp_amount.gte(0)) {
          writeToConsole("#monitor-console-read", "Received " + xrp_amount.toString()+" XRP.")
          return
        } else {
          writeToConsole("#monitor-console-read", "Spent " + xrp_amount.abs().toString() + " XRP.")
          return
        }
      }
    } else if ((affected_nodes[i].hasOwnProperty("CreatedNode"))) {
      // created a ledger entry. maybe the account just got funded?
      let ledger_entry = affected_nodes[i].CreatedNode
      if (ledger_entry.LedgerEntryType === "AccountRoot" &&
          ledger_entry.NewFields.Account === address) {
        const balance_drops = new Big(ledger_entry.NewFields.Balance)
        const xrp_amount = balance_drops.div(1e6)
        writeToConsole("#monitor-console-read", "Received " + xrp_amount.toString() + " XRP (account funded).")
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
      writeToConsole("#monitor-console-read", "Not the destination of this payment. (We're " +
                      address + "; they're " + tx.transaction.Destination + ")")
      return
    }
    if (typeof tx.meta.delivered_amount === "string") {
      const amount_in_drops = new Big(tx.meta.delivered_amount)
      const xrp_amount = amount_in_drops.div(1e6)
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

## Next Steps

- [Look Up Transaction Results](look-up-transaction-results.html) to see exactly what a transaction did, and build your software to react appropriately.
- Try [Sending XRP](send-xrp.html) from your own address.
- Try monitoring for transactions of advanced types like [Escrows](escrow.html), [Checks](checks.html), or [Payment Channels](payment-channels.html), and responding to incoming notifications.
<!--{# TODO: uncomment when it's ready. - To more robustly handle internet instability, [Follow a Transaction Chain](follow-a-transaction-chain.html) to detect if you missed a notification. #}-->

## Other Programming Languages

Many programming languages have libraries for sending and receiving data over a WebSocket connection. If you want a head-start on communicating with `rippled`'s WebSocket API in a language other than JavaScript, the following examples demonstrate similar functionality:

<!-- MULTICODE_BLOCK_START -->

*Go*

```go
package main

// Connect to the XRPL Ledger using websocket and subscribe to an account
// translation from the JavaScript example to Go
// https://developers.ripple.com/monitor-incoming-payments-with-websocket.html
// This example uses the Gorilla websocket library to create a websocket client
// install: go get github.com/gorilla/websocket

import (
	"encoding/json"
	"flag"
	"log"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

// websocket address
var addr = flag.String("addr", "s.altnet.rippletest.net:51233", "http service address")

// Payload object
type message struct {
	Command  string   `json:"command"`
	Accounts []string `json:"accounts"`
}

func main() {
	flag.Parse()
	log.SetFlags(0)

	var m message

	// check for interrupts and cleanly close the connection
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	u := url.URL{Scheme: "ws", Host: *addr, Path: "/"}
	log.Printf("connecting to %s", u.String())

	// make the connection
	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	// on exit close
	defer c.Close()

	done := make(chan struct{})

	// send a subscribe command and a target XRPL account
	m.Command = "subscribe"
	m.Accounts = append(m.Accounts, "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM")

	// struct to JSON marshalling
	msg, _ := json.Marshal(m)
	// write to the websocket
	err = c.WriteMessage(websocket.TextMessage, []byte(string(msg)))
	if err != nil {
		log.Println("write:", err)
		return
	}

	// read from the websocket
	_, message, err := c.ReadMessage()
	if err != nil {
		log.Println("read:", err)
		return
	}
	// print the response from the XRP Ledger
	log.Printf("recv: %s", message)

	// handle interrupt
	for {
		select {
		case <-done:
			return
		case <-interrupt:
			log.Println("interrupt")

			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("write close:", err)
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
```

<!-- MULTICODE_BLOCK_END -->

**Tip:** Don't see the programming language of your choice? Click the "Edit on GitHub" link at the top of this page and contribute your own sample code!


## Footnotes

[1.](#from-footnote-1) <a id="footnote-1"></a> In practice, when calling an HTTP-based API multiple times, the client and server may reuse the same connection for several requests and responses. This practice is called [HTTP persistent connection, or keep-alive](https://en.wikipedia.org/wiki/HTTP_persistent_connection). From a development standpoint, the code to use an HTTP-based API is the same regardless of whether the underlying connection is new or reused.

## See Also

- **Concepts:**
    - [Transaction Basics](transaction-basics.html)
    - [Finality of Results](finality-of-results.html) - How to know when a transaction's success or failure is final. (Short version: if a transaction is in a validated ledger, its outcome and metadata are final.)
- **Tutorials:**
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
- **References:**
    - [Transaction Types](transaction-types.html)
    - [Transaction Metadata](transaction-metadata.html) - Summary of the metadata format and fields that appear in metadata
    - [Transaction Results](transaction-results.html) - Tables of all possible result codes for transactions.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
