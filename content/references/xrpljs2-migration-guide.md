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
  const api = new xrpl.Client('wss://xrplcluster.com');

  await api.connect();

  // Your code here

  api.disconnect();
})();
```

## Quick Reference of Equivalents

In ripple-lib 1.x all methods and properties were on instances of the `RippleAPI` class. In xrpl.js 2.x, some methods are static methods of the library and some methods belong to specific classes.

| RippleAPI instance method / property | xrpl.js method / property| Notes |
|-------------------|----------------|---|
| `new ripple.RippleAPI({server: url})` | `new xrpl.Client(url)` | Use `xrpl.BroadcastClient([url1, url2, ..])` to connect to multiple servers. |
| `request(command, options)` | `Client.request(options)` | The `command` field moved into the `options` object for consistency with the WebSocket API. |
| `hasNextPage(response)` | ***TODO (check for marker?)*** | See also: `Client.requestNextPage()` and `Client.requestAll()` |
| `requestNextPage(command, options, response)` | `Client.requestNextPage(response)` | |
| `computeBinaryTransactionHash(tx_blob)` | `computeSignedTransactionHash(tx_blob)` | |
| `classicAddressToXAddress(address)` | ***TBD moving to utils?*** | |
| `xAddressToClassicAddress(xAddress)` | ***TBD moving to utils?*** | |
| `renameCounterpartyToIssuer(object)` | (None) | xrpl.js always uses `issuer` already. |
| `formatBidsAndAsks(base, counter)` | ***TBD moving to utils?*** | |
| `connect()` | `Client.connect()` | |
| `disconnect()` | `Client.disconnect()` |
| `isConnected()` | `Client.isConnected()` |
| `getServerInfo()` | `Client.request({command: "server_info"})` | Request/response match the [server_info method][] exactly. |
| `getFee()` | `Client.getFee()` ***TODO: confirm*** |
| `getLedgerVersion()` | `(await api.request({"command": "ledger", "ledger_index": "validated"})).result.ledger.ledger_index` | ***TODO: follow up if an easier way gets re-added***
| `getTransaction(hash)` | `Client.request({command: "tx", transaction: hash})` | Request/response match the [tx method][] exactly. |
| `getTransactions(address, options)` | `Client.request({command: "account_tx", ..})` | Request/response match the [account_tx method][] exactly. |
| `getTrustlines(address, options)` |  `Client.request({command: "account_lines", ..})` | Request/response match the [account_lines method][] exactly. |
...
| `isValidAddress(address)` | ***TBD maybe in utils?*** | Separate from isValidXAddress / isValidClassicAddress |
| `iso8601ToRippleTime(timestamp)` | `ISOTimeToRippleTime(timestamp)` | Now a static method at the `xrpl` module level. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
