---
html: xrpljs2-migration-guide.html
blurb: Learn how to migrate JavaScript code to the newer client library format.
parent: rippleapi-reference.html
---
# Migration Guide for ripple-lib 1.x to xrpl.js 2.x

Follow these instructions to migrate JavaScript / TypeScript code using the **ripple-lib** (1.x) library to use the **xrpl.js** (2.x) library for the XRP Ledger instead.

## High-Level Differences

Many fields and functions have "new" names in xrpl.js v2.0; or more accurately, xrpl.js now uses the same names as the [HTTP / WebSocket APIs](rippled-api.html). Structures that were unique to ripple-lib such as an "orderCancellation" object are gone; in their place the library uses the XRP Ledger's native [transaction types](transaction-types.html) like "OfferCancel". Many API methods that return these structures in ripple-lib 1.x are gone; instead, you'll make requests and get responses in the same format as in the WebSocket API.

The catch-all `RippleAPI` class from ripple-lib 1.x is also gone. With xrpl.js 2.x, there's a `Client` class to handle network operations, and all other operations are strictly offline. There's a new `Wallet` class for addresses & keys, and other classes and properties under the top-level `xrpl` object.

## Boilerplate Comparison

**ripple-lib 1.10.0:**

```js
const ripple = require('ripple-lib');

(async function() {
  const api = new ripple.RippleAPI({
    server: 'wss://xrplcluster.com'
  });

  await api.connect();

  // Your code here

  api.disconnect();
})();
```

**xrpl.js 2.0.0:**

```js
const xrpl = require("xrpl");

(async function() {
  const client = new xrpl.Client('wss://xrplcluster.com');

  await client.connect();

  // Your code here

  client.disconnect();
})();
```

## Validated Results

By default, most methods in ripple-lib 1.x only returned results that were validated by the [consensus process](consensus.html) and final. The xrpl.js equivalents of many methods use the [`Client.request()` method](https://js.xrpl.org/classes/Client.html#request) to call the WebSocket API, where the XRP Ledger server's default settings often use the current (pending) ledger to serve data.

Sometimes you want to use the current open ledger to get data because it has the pending results of many transactions that are likely to succeed, such as when looking up the state of the [decentralized exchange](decentralized-exchange.html). In other cases, you want to use a validated ledger, which only incorporates the results of transactions that are finalized.

When making API requests with xrpl.js 2.0 using the , you should explicitly [specify what ledger to use](basic-data-types.html#specifying-ledgers). For example, to look up trust lines using a _validated ledger_:

**ripple-lib 1.x:**

```js
const trustlines = await api.getTrustlines("rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn")
console.log(trustlines)
```

**xrpl.js 2.0:**

```js
const trustlines = await client.request({
  "command": "account_lines",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
})
console.log(trustlines.result)
```


## Transaction Submission

In xrpl.js there are specific helper functions for signing and submitting transactions and waiting for the XRP Ledger blockchain to confirm those transactions' final outcomes. Use the `submitAndWait(tx_json, wallet)` method to sign a prepared transaction with the given wallet and submit it, like in this example:

```js
const tx_json = await client.autofill({
  "TransactionType": "AccountSet",
  "Account": wallet.address, // "wallet" is an instance of the Wallet class
  "SetFlag": xrpl.AccountSetAsfFlags.asfRequireDest
})
try {
  const submit_result = await client.submitAndWait(tx_json, wallet)
  // submitAndWait() doesn't return until the transaction has a final result.
  // Raises XrplError if the transaction doesn't get confirmed by the network.
  console.log("Transaction result:", submit_result)
} catch(err) {
  console.log("Error submitting transaction:", err)
}
```

Alternatively, you can use the `sign` method of a wallet to sign a transaction and then use `submitAndWait(tx_blob)` to submit it. This can be useful for building [reliable transaction submission](reliable-transaction-submission.html) that can recover from power outages and other disasters. (The library does not handle disaster recovery on its own.)

### Controlling LastLedgerSequence

In ripple-lib 1.x, you could specify a `instructions.maxLedgerVersionOffset` when preparing a transaction to define the `LastLedgerSequence` parameter of the prepared transaction as being some number of ledgers _after_ the latest validated one at the time. In 2.0, you can do this by looking up the latest validated ledger index, then specifying the `LastLedgerSequence` explicitly before auto-filling the transaction.

**xrpl.js 2.0:**

```js
const vli = await client.getLedgerIndex()

const prepared = await client.autofill({
  "TransactionType": "Payment",
  "Account": sender,
  "Amount": xrpl.xrpToDrops("50.2"),
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "LastLedgerSequence": vli+75 // gives ~5min, rather than the default ~1min
})
```

Like the old prepare methods, `Client.autofill()` provides a reasonable `LastLedgerSequence` value by default. To prepare a transaction _without_ a `LastLedgerSequence` field, pass it with the value `null`:

```js
const prepared = await client.autofill({
  "TransactionType": "Payment",
  "Account": sender,
  "Amount": xrpl.xrpToDrops("50.2"),
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "LastLedgerSequence": null // Transaction never expires
})
```


## Events and Subscriptions

In 1.x, you could subscribe to ledger events and API errors using the `.on()` method of the `RippleAPI` class; or you could subscribe to specific WebSocket message types using `.connection.on()`. These have been merged into the [`Client.on()` method](https://js.xrpl.org/classes/Client.html#on). Additionally, the client library no longer automatically subscribes to ledger close events when connecting to an XRP Ledger server, so **you must explicitly subscribe to the ledger stream** to get ledger close events in addition to adding a handler.

To subscribe to ledger close events, use `Client.request(method)` to call the [subscribe method][] with `"streams": ["ledger"]`. To attach event handlers, use `Client.on(event_type, callback)`. You can make these calls in either order.

The RippleAPI-specific `ledger` event type from 1.x has been removed; instead, use `ledgerClosed` events. These event messages contain the same data, but the format matches the [Ledger Stream](subscribe.html#ledger-stream) messages in the WebSocket API.

Example:

**ripple-lib 1.x:**

```js
api.on("ledger", (ledger) => {
  console.log(`Ledger #${ledger.ledgerVersion} closed!
    It contains ${ledger.transactionCount} transaction(s) and has
    the ledger_hash ${ledger.ledgerHash}.`
  )
})
// "ledger" events happen automatically while API is connected.
```

**xrpl.js 2.0:**

```js
client.on("ledgerClosed", (ledger) => {
  console.log(`Ledger #${ledger.ledger_index} closed!
    It contains ${ledger.txn_count} transaction(s) and has
    the ledger_hash ${ledger.ledger_hash}.`
  )
})
// Must explicitly subscribe to the "ledger" stream to get "ledgerClosed" events
client.request({
  "command": "subscribe",
  "streams": ["ledger"]
})
```


## Reference of Equivalents

In ripple-lib 1.x all methods and properties were on instances of the `RippleAPI` class. In xrpl.js 2.x, some methods are static methods of the library and some methods belong to specific classes.

| RippleAPI instance method / property | xrpl.js method / property| Notes |
|-------------------|----------------|---|
| `new ripple.RippleAPI({server: url})` | `new xrpl.Client(url)` | Use `xrpl.BroadcastClient([url1, url2, ..])` to connect to multiple servers. |
| `request(command, options)` | `Client.request(options)` | <ul><li>The `command` field moved into the `options` object for consistency with the WebSocket API.</li><li>In 1.x the return value of this method (when the Promise resolves) was only the `result` object. Now it returns the whole [WebSocket response format](response-formatting.html); to get the equivalent value, read the `result` field of the return value. |
| `hasNextPage(response)` | `Client.hasNextPage(response)` | See also: `Client.requestNextPage()` and `Client.requestAll()` |
| `requestNextPage(command, options, response)` | `Client.requestNextPage(response)` | |
| `computeBinaryTransactionHash(tx_blob)` | `xrpl.hashes.hashTx(tx_blob)` | |
| `classicAddressToXAddress()` | `xrpl.classicAddressToXAddress()` | Now a static method on the module. |
| `xAddressToClassicAddress()` | `xrpl.xAddressToClassicAddress()` | Now a static method on the module. |
| `renameCounterpartyToIssuer(object)` | (None) | No longer needed because xrpl.js always uses `issuer` already. |
| `formatBidsAndAsks(base, counter)` | (None) | No longer needed after changes to `getOrderbook()`. |
| `connect()` | `Client.connect()` | |
| `disconnect()` | `Client.disconnect()` | |
| `isConnected()` | `Client.isConnected()` | |
| `getServerInfo()` | `Client.request({command: "server_info"})` | Request/response match the [server_info method][] exactly. |
| `getFee()` | `Client.getFee()` | Returns a value in decimal XRP; if use this when constructing transactions be sure to convert to integer _drops of XRP_ instead. |
| `getLedgerVersion()` | `Client.getLedgerIndex()` | |
| `getTransaction(hash)` | `Client.request({command: "tx", transaction: hash})` | Request/response match the [tx method][] exactly. **Warning:** Unlike `getTransaction()`, the `tx` method can return [results that are not validated and final](#validated-results). Be sure to look for `"validated": true` in the response object before taking action in response to a transaction. |
| `getTransactions(address, options)` | `Client.request({"command": "account_tx", ..})` | Request/response match the [account_tx method][] exactly. |
| `getTrustlines(address, options)` |  `Client.request({"command": "account_lines", "ledger_index": "validated", ...})` | Request/response match the [account_lines method][] exactly. **Warning:** Unlike `getTrustlines()`, `account_lines` can return [results that are not validated and final](#validated-results). |
| `getBalances(address, options)` | `Client.getBalances(address, options)` | |
| `getBalanceSheet(address, options)` | (None) | Removed. Use `.getBalances()` instead. |
| `getPaths(options)` | `Client.request({"command": "ripple_path_find", ...})` | Request/response match the [ripple_path_find method][] exactly. |
| `getOrders(address, options)` | `Client.request({"command": "account_offers", "account": address, ...})` | Request/response match the [account_offers method][] exactly. |
| `getOrderbook(address, orderbook, options)` | `Client.getOrderbook(takerPays, takerGets, options)` | |
| `getSettings(address, options)` | `Client.request({"command": "account_info", "account": address, "ledger_index": "validated", ...})` | Use ***TODO: parseAccountRootFlags mention*** on the `Flags` field. **Warning:** Unlike `getTrustlines()`, `account_lines` can return [results that are not validated and final](#validated-results). |
| `getAccountInfo(address, options)` | | |
| `getAccountObjects(address, options)` | | |
| `getPaymentChannel(id)` | | |
| `getLedger(options)` | | |
| `parseAccountFlags(number)` | ***TBD parseAccountRootFlags*** | |
| `prepareTransaction(transaction, instructions)` | `Client.autofill(tx_json)` | ***TODO: maybe demonstrate how to mimic `maxLedgerVersionOffset`?*** |
| `preparePayment(address, payment, instructions)` | `Client.autofill(tx_json)` | Construct a [Payment transaction][] instead. |
| `prepareTrustline(address, trustline, instructions)` | `Client.autofill(tx_json)` | Construct a [TrustSet transaction][] instead. |
| `prepareOrder(address, order, instructions)` | `Client.autofill(tx_json)` | Construct an [OfferCreate transaction][] instead. |
| `prepareOrderCancellation(address, orderCancellation, instructions)` | `Client.autofill(tx_json)` | Construct an [OfferCancel transaction][] instead. |
| `prepareSettings(address, settings, instructions)` | `Client.autofill(tx_json)` | For most settings, construct an [AccountSet transaction][] instead. To rotate change a regular key, construct a [RegularKeySet transaction][]. To add or update multi-signing settings, construct a [SignerListSet transaction][] instead. |
| `prepareEscrowCreation(address, escrowCreation, instructions)` | `Client.autofill(tx_json)` | Construct an [EscrowCreate transaction][] instead. |
| `prepareEscrowCancellation(address, escrowCancellation, instructions)` | `Client.autofill(tx_json)` | Construct an [EscrowCancel transaction][] instead. |
| `prepareEscrowExecution(address, escrowExecution, instructions)` | `Client.autofill(tx_json)` | Construct an [EscrowFinish transaction][] instead. |
| `preparePaymentChannelCreate(address, paymentChannelCreate, instructions)` | `Client.autofill(tx_json)` | Construct a [PaymentChannelCreate transaction][] instead. |
| `preparePaymentChannelClaim(address, paymentChannelClaim, instructions)` | `Client.autofill(tx_json)` | Construct a [PaymentChannelClaim transaction][] instead. |
| `preparePaymentChannelFund(address, paymentChannelFund, instructions)` | `Client.autofill(tx_json)` | Construct a [PaymentChannelFund transaction][] instead. |
| `prepareCheckCreate(address, checkCreate, instructions)` | `Client.autofill(tx_json)` | Construct a [CheckCreate transaction][] instead. |
| `prepareCheckCancel(address, checkCancel, instructions)` | `Client.autofill(tx_json)` | Construct a [CheckCancel transaction][] instead. |
| `prepareCheckCash(address, checkCash, instructions)` | `Client.autofill(tx_json)` | Construct a [CheckCash transaction][] instead. |
| `prepareTicketCreate(address, ticketCount, instructions)` | `Client.autofill(tx_json)` | Construct a [TicketCreate transaction][] instead. |
| `sign(txJSON_string, secret, options)` | `Wallet.sign(tx_json)` | ***TODO: link summary of Wallet class.*** |
| `combine(signedTransactions)` | [`xrpl.multisign(signedTransactions)`](https://js.xrpl.org/modules.html#multisign) | |
| `submit(tx_blob)` | `Client.submit(tx_blob)` | Reliable transaction submission is now also available; for details, see [Transaction Submission](#transaction-submission). |
| `generateXAddress(options)` | `xrpl.generateXAddress(options)` | Now a static method on the module. |
| `generateAddress(options)` | (Removed) | Use `generateXAddress(options)` instead. |
| `isValidAddress(address)` | `xrpl.isValidAddress(address)` | Now a static method on the module. |
| `isValidSecret(secret)` | `xrpl.isValidSecret(secret)` | Now a static method on the module. |
| `deriveKeypair()`
| `deriveAddress()`
| `generateFaucetWallet()`
| `signPaymentChannelClaim()`
| `verifyPaymentChannelClaim()`
| `computeLedgerHash()`
| `xrpToDrops()`
| `dropsToXrp()`
| `iso8601ToRippleTime(timestamp)` | `ISOTimeToRippleTime(timestamp)` | Now a static method at the `xrpl` module level. | `rippleTimeToISO8601()`
| `txFlags`
| `accountSetFlags`
| `schemaValidator`
| `schemaValidate()`
| `.on("ledger", callback)` | `Client.on("ledgerClosed", callback)` | **Caution:** Must also subscribe to the ledger stream. For examples and details, see [Events and Subscriptions](#vents-and-subscriptions). |
| `.on("error", callback)` | `Client.on("error", callback)` | |
| `.on("connected", callback)`
| `.on("disconnected", callback)`


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
