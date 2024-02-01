---
html: xrpljs2-migration-guide.html
seo:
    description: Learn how to migrate JavaScript code to the newer client library format.
parent: https://js.xrpl.org/
---
# Migration Guide for ripple-lib 1.x to xrpl.js 2.x

Follow these instructions to migrate JavaScript / TypeScript code using the **ripple-lib** (1.x) library to use the **xrpl.js** (2.x) library for the XRP Ledger instead.

**Tip:** You can still access [documentation for the legacy 1.x "RippleAPI"](https://github.com/XRPLF/xrpl.js/blob/1.x/docs/index.md) if necessary.

## High-Level Differences

Many fields and functions have "new" names in xrpl.js v2.0; or more accurately, xrpl.js now uses the same names as the [HTTP / WebSocket APIs](http-websocket-apis/index.md). Structures that were unique to ripple-lib such as an `orderCancellation` object are gone; in their place the library uses the XRP Ledger's native [transaction types](protocol/transactions/types/index.md) like "OfferCancel". Many API methods that return these structures in ripple-lib 1.x are gone; with 2.0, you make requests and get responses in the same format as in the WebSocket API.

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

By default, most methods in ripple-lib 1.x only returned results that were validated by the [consensus process](../concepts/consensus-protocol/index.md) and therefore final. <!-- STYLE_OVERRIDE: therefore --> The xrpl.js equivalents of many methods use the [`Client.request()` method](https://js.xrpl.org/classes/Client.html#request) to call the WebSocket API, where the XRP Ledger server's default settings often use the current (pending) ledger to serve data which is not final.

Sometimes you want to use the current open ledger because it has the pending results of many transactions that are likely to succeed, such as when looking up the state of the [decentralized exchange](../concepts/tokens/decentralized-exchange/index.md). In other cases, you want to use a validated ledger, which only incorporates the results of transactions that are finalized.

When making API requests with xrpl.js 2.0 using `Client.request()`, you should explicitly [specify what ledger to use](protocol/data-types/basic-data-types.md#specifying-ledgers). For example, to look up trust lines using the latest _validated ledger_:

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

In xrpl.js, there are specific helper functions for signing and submitting transactions and waiting for the XRP Ledger blockchain to confirm those transactions' final outcomes:

- Use `submitAndWait()` to submit a transaction and wait for its [final outcome](../concepts/transactions/finality-of-results/index.md). If the transaction becomes validated, this resolves to a [tx method][] response; otherwise, it raises an exception. An exception does not guarantee that the transaction was not validated. For example, if the server has a [ledger gap](../concepts/transactions/reliable-transaction-submission.md#ledger-gaps), then the transaction could have been validated in that gap.
- Use `submit()` to submit and return immediately. This resolves to a [submit method][] response, which shows the preliminary (non-final) result. This method only raises an exception if there was a problem sending the transaction to the XRP Ledger server.

For both methods, you can pass a signed transaction to the method directly, or you can sign the transaction right before submitting, by passing prepared transaction instructions and a [`Wallet` instance](#keys-and-wallets).

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
  // Does not handle disaster recovery.
  console.log("Transaction result:", submit_result)
} catch(err) {
  console.log("Error submitting transaction:", err)
}
```

Alternatively, you can use the `sign` method of a wallet to sign a transaction and then use `submitAndWait(tx_blob)` to submit it. This can be useful for building [reliable transaction submission](../concepts/transactions/reliable-transaction-submission.md) that can recover from power outages and other disasters. (The library does not handle disaster recovery on its own.)

### Controlling LastLedgerSequence
<!-- SPELLING_IGNORE: lastledgersequence -->

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

Like the old prepare methods, `Client.autofill()` provides a reasonable `LastLedgerSequence` value by default. To prepare a transaction _without_ a `LastLedgerSequence` field, provide a `LastLedgerSequence` with the value `null`:

```js
const prepared = await client.autofill({
  "TransactionType": "Payment",
  "Account": sender,
  "Amount": xrpl.xrpToDrops("50.2"),
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "LastLedgerSequence": null // Transaction never expires
})
```


## Keys and Wallets
<!-- STYLE_OVERRIDE: wallet -->

xrpl.js 2.0 introduces a new [`Wallet` class](https://js.xrpl.org/classes/Wallet.html) for managing [cryptographic keys](../concepts/accounts/cryptographic-keys.md) and signing transactions. This replaces functions that took seed or secret values in ripple-lib 1.x, and handles various address encoding and generation tasks as well.

### Generating Keys

**ripple-lib 1.x:**

```js
const api = new RippleAPI()
const {address, secret} = api.generateAddress({algorithm: "ed25519"})
console.log(address, secret)
// rJvMQ3cwtyrNpVJDTW4pZzLnGeovHcdE6E s████████████████████████████
```

**xrpl.js 2.0:**

```js
const wallet = xrpl.Wallet.generate("ed25519")
console.log(wallet)
// Wallet {
//   publicKey: 'ED872A4099B61B0C187C6A27258F49B421AC384FBAD23F31330E666A5F50E0ED7E',
//   privateKey: 'ED224D2BDCF6382030C7612654D2118C5CEE16344C81CB36EC7A01EC7D95C5F737',
//   classicAddress: 'rMV3CPSXAdRpW96bvvnSu4zHTZ6ETBkQkd',
//   seed: 's████████████████████████████'
// }
```

### Deriving from Seed and Signing

**ripple-lib 1.x:**

```js
const api = new RippleAPI()
const seed = 's████████████████████████████';
const keypair = api.deriveKeypair(seed)
const address = api.deriveAddress(keypair.publicKey)
const tx_json = {
  "Account": address,
  "TransactionType":"Payment",
  "Destination":"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount":"13000000",
  "Flags":2147483648,
  "LastLedgerSequence":7835923,
  "Fee":"13",
  "Sequence":2
}
const signed = api.sign(JSON.stringify(tx_json), seed)
```

**xrpl.js 2.0:**

```js
const wallet = xrpl.Wallet.fromSeed('s████████████████████████████')
const tx_json = {
  "Account": wallet.address,
  "TransactionType":"Payment",
  "Destination":"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount":"13000000",
  "Flags":2147483648,
  "LastLedgerSequence":7835923,
  "Fee":"13",
  "Sequence":2
}
const signed = wallet.sign(tx_json)
```


## Events and Subscriptions

In 1.x, you could subscribe to ledger events and API errors using the `.on()` method of the `RippleAPI` class; or you could subscribe to specific WebSocket message types using `.connection.on()`. These have been merged into the [`Client.on()` method](https://js.xrpl.org/classes/Client.html#on). Additionally, the client library no longer automatically subscribes to ledger close events when connecting to an XRP Ledger server. To get ledger close events, you still add a handler, but **you must also explicitly subscribe to the ledger stream**.

To subscribe to ledger close events, use `Client.request(method)` to call the [subscribe method][] with `"streams": ["ledger"]`. To attach event handlers, use `Client.on(event_type, callback)`. You can make these calls in either order.

The RippleAPI-specific `ledger` event type from 1.x has been removed; instead, use `ledgerClosed` events. These event messages contain the same data, but the format matches the [Ledger Stream](http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#ledger-stream) messages in the WebSocket API.

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

In ripple-lib 1.x all methods and properties were on instances of the `RippleAPI` class. In xrpl.js 2.x, some methods are static methods of the library and some methods belong to specific classes. In the following table, the notation `Client.method()` means that `method()` belongs to instances of the `Client` class.

**Note: The following table has 3 columns. You may need to scroll horizontally to see all the information.**

| RippleAPI instance method / property | xrpl.js method / property | Notes |
|-------------------|----------------|---|
| `new ripple.RippleAPI({server: url})` | [`new xrpl.Client(url)`](https://js.xrpl.org/classes/Client.html#constructor) | Use `xrpl.BroadcastClient([url1, url2, ..])` to connect to multiple servers. |
| `request(command, options)` | [`Client.request(options)`](https://js.xrpl.org/classes/Client.html#request) | The `command` field moved into the `options` object for consistency with the WebSocket API. In 1.x the return value of this method (when the Promise resolves) was only the `result` object. Now it returns the whole [WebSocket response format](http-websocket-apis/api-conventions/response-formatting.md); to get the equivalent value, read the `result` field of the return value. |
| `hasNextPage()` | [`xrpl.hasNextPage(response)`](https://js.xrpl.org/modules.html#hasNextPage) | See also: [`Client.requestNextPage()`](https://js.xrpl.org/classes/Client.html#requestNextPage) and [`Client.requestAll()`](https://js.xrpl.org/classes/Client.html#requestAll) |
| `requestNextPage()` | [`Client.requestNextPage()`](https://js.xrpl.org/classes/Client.html#requestNextPage) | |
| `computeBinaryTransactionHash()` | [`xrpl.hashes.hashTx()`](https://js.xrpl.org/modules.html#hashes) | |
| `classicAddressToXAddress()` | [`xrpl.classicAddressToXAddress()`](https://js.xrpl.org/modules.html#classicAddressToXAddress) | Now a static method on the module. |
| `xAddressToClassicAddress()` | [`xrpl.xAddressToClassicAddress()`](https://js.xrpl.org/modules.html#xAddressToClassicAddress) | Now a static method on the module. |
| `renameCounterpartyToIssuer(object)` | (Removed - see Notes column) | No longer needed because xrpl.js always uses `issuer` already. |
| `formatBidsAndAsks()` | (Removed - see Notes column) | No longer needed after changes to `getOrderbook()`. |
| `connect()` | [`Client.connect()`](https://js.xrpl.org/classes/Client.html#connect) | |
| `disconnect()` | [`Client.disconnect()`](https://js.xrpl.org/classes/Client.html#disconnect) | |
| `isConnected()` | [`Client.isConnected()`](https://js.xrpl.org/classes/Client.html#isConnected) | |
| `getServerInfo()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [server_info method][] instead. |
| `getFee()` | (Removed - see Notes column) | Use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) to provide a sensible [transaction cost][] automatically, or use `Client.request({"command": "fee"})` to look up information about the current transaction cost (in _drops of XRP_). |
| `getLedgerVersion()` | [`Client.getLedgerIndex()`](https://js.xrpl.org/classes/Client.html#getLedgerIndex) | |
| `getTransaction()` | [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [tx method][] instead. **Warning:** Unlike `getTransaction()`, the `tx` method can return [results that are not validated and final](#validated-results). Be sure to look for `"validated": true` in the response object before taking action in response to a transaction. |
| `getTransactions()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [account_tx method][] instead. |
| `getTrustlines()` |  (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call [account_lines method][] instead. **Warning:** Unlike `getTrustlines()`, `account_lines` can return [results that are not validated and final](#validated-results). |
| `getBalances()` | [`Client.getBalances()`](https://js.xrpl.org/classes/Client.html#getBalances) | |
| `getBalanceSheet()` | (Removed - see Notes column) | Use [`Client.getBalances()`](https://js.xrpl.org/classes/Client.html#getBalances) instead, or use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [gateway_balances method][]. |
| `getPaths()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call [ripple_path_find method][] instead. |
| `getOrders()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [account_offers method][] instead. |
| `getOrderbook()` | [`Client.getOrderbook()`](https://js.xrpl.org/classes/Client.html#getOrderbook) | |
| `getSettings()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [account_info method][] instead. Use `xrpl.parseAccountRootFlags()` on the `Flags` field to get the boolean values of individual flag settings. **Warning:** Unlike `getSettings()`, `account_info` can return [results that are not validated and final](#validated-results). |
| `getAccountInfo(address, options)` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [account_info method][] instead. **Warning:** Unlike `getAccountInfo()`, `account_info` can return [results that are not validated and final](#validated-results). |
| `getAccountObjects(address, options)` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [account_objects method][] instead. **Warning:** Unlike `getAccountObjects()`, `account_objects` can return [results that are not validated and final](#validated-results). |
| `getPaymentChannel()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [ledger_entry method](http-websocket-apis/public-api-methods/ledger-methods/ledger_entry.md#get-paychannel-object) instead. **Warning:** Unlike `getPaymentChannel()`, `ledger_entry` can return [results that are not validated and final](#validated-results). |
| `getLedger()` | (Removed - see Notes column) | Use [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) to call the [ledger method][] exactly. **Warning:** Unlike `getLedger()`, `ledger` can return [ledgers that are not validated and final](#validated-results). |
| `parseAccountFlags()` | [`xrpl.parseAccountRootFlags()`](https://js.xrpl.org/modules.html#parseAccountRootFlags) | Now a static method on the module. |
| `prepareTransaction()` | [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) | See [Transaction Submission](#transaction-submission) for details. |
| `preparePayment()` | (Removed - see Notes column) | Construct a [Payment transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareTrustline()` | (Removed - see Notes column) | Construct a [TrustSet transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareOrder()` | (Removed - see Notes column) | Construct an [OfferCreate transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareOrderCancellation()` | (Removed - see Notes column) | Construct an [OfferCancel transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareSettings()` | (Removed - see Notes column) | For most settings, construct an [AccountSet transaction][] instead. To rotate change a regular key, construct a [SetRegularKey transaction][]. To add or update multi-signing settings, construct a [SignerListSet transaction][] instead. In all three cases, use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) to prepare the transaction. |
| `prepareEscrowCreation()` | (Removed - see Notes column) | Construct an [EscrowCreate transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareEscrowCancellation()` | (Removed - see Notes column) | Construct an [EscrowCancel transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareEscrowExecution()` | (Removed - see Notes column) | Construct an [EscrowFinish transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `preparePaymentChannelCreate()` | (Removed - see Notes column) | Construct a [PaymentChannelCreate transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `preparePaymentChannelClaim()` | (Removed - see Notes column) | Construct a [PaymentChannelClaim transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `preparePaymentChannelFund()` | (Removed - see Notes column) | Construct a [PaymentChannelFund transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareCheckCreate()` | (Removed - see Notes column) | Construct a [CheckCreate transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareCheckCancel()` | (Removed - see Notes column) | Construct a [CheckCancel transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareCheckCash()` | (Removed - see Notes column) | Construct a [CheckCash transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `prepareTicketCreate()` | (Removed - see Notes column) | Construct a [TicketCreate transaction][] and use [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) instead. |
| `sign()` | [`Wallet.sign()`](https://js.xrpl.org/classes/Wallet.html#sign) | See [Keys and Wallets](#keys-and-wallets) for details. |
| `combine()` | [`xrpl.multisign()`](https://js.xrpl.org/modules.html#multisign) | |
| `submit()` | [`Client.submit()`](https://js.xrpl.org/classes/Client.html#submit) | Reliable transaction submission is now also available; for details, see [Transaction Submission](#transaction-submission). |
| `generateXAddress()` | [`xrpl.Wallet.generate()`](https://js.xrpl.org/classes/Wallet.html#generate) | Create a [`Wallet` instance](https://js.xrpl.org/classes/Wallet.html) with `xrpl.Wallet.generate()` then call `.getXAddress()` on the wallet instance to get an X-address. See [Keys and Wallets](#keys-and-wallets) for details. |
| `generateAddress()` | [`xrpl.Wallet.generate()`](https://js.xrpl.org/classes/Wallet.html#generate) | Creates a [`Wallet` instance](https://js.xrpl.org/classes/Wallet.html). See [Keys and Wallets](#keys-and-wallets) for details. |
| `isValidAddress()` | [`xrpl.isValidAddress()`](https://js.xrpl.org/modules.html#isValidAddress) | Now a static method on the module. |
| `isValidSecret()` | [`xrpl.isValidSecret()`](https://js.xrpl.org/modules.html#isValidSecret) | Now a static method on the module. |
| `deriveKeypair()` | [`xrpl.deriveKeypair()`](https://js.xrpl.org/modules.html#deriveKeypair) | Now a static method on the module. |
| `deriveAddress()` | (Removed - see Notes column) | Use `xrpl.decodeXAddress()` to get an X-address from a public key, then use `xAddressToClassicAddress()` to get the classic address if necessary. |
| `generateFaucetWallet()` | [`Client.fundWallet()`](https://js.xrpl.org/classes/Client.html#fundWallet) | The `on_testnet` boolean has been removed; the library automatically picks the Devnet or Testnet faucet as appropriate for the network you're connected to. You can optionally provide a [`Wallet` instance](https://js.xrpl.org/classes/Wallet.html) to have the faucet fund/refill the associated address; otherwise, the method creates a new Wallet instance. The return value now resolves to an object in the form `{wallet: <object: Wallet instance>, balance: <str: drops of XRP>}` |
| `signPaymentChannelClaim()` | [`xrpl.signPaymentChannelClaim()`](https://js.xrpl.org/modules.html#signPaymentChannelClaim) | Now a static method on the module. |
| `verifyPaymentChannelClaim()` | [`xrpl.verifyPaymentChannelClaim()`](https://js.xrpl.org/modules.html#verifyPaymentChannelClaim) | Now a static method on the module. |
| `computeLedgerHash()` | [`xrpl.hashes.hashLedger()`](https://js.xrpl.org/modules.html#hashes) | |
| `xrpToDrops()` | [`xrpl.xrpToDrops()`](https://js.xrpl.org/modules.html#xrpToDrops) | Now a static method on the module. |
| `dropsToXrp()` | [`xrpl.dropsToXrp()`](https://js.xrpl.org/modules.html#dropsToXrp) | Now a static method on the module. |
| `iso8601ToRippleTime()` | [`xrpl.isoTimeToRippleTime()`](https://js.xrpl.org/modules.html#isoTimeToRippleTime) | Now a static method on the module. |
| `rippleTimeToISO8601()` | [`xrpl.rippleTimeToISOTime()`](https://js.xrpl.org/modules.html#rippleTimeToISOTime) | Now a static method on the module. You can also use the new method [`rippleTimeToUnixTime()`](https://js.xrpl.org/modules.html#rippleTimeToUnixTime) to get a UNIX-style timestamp in milliseconds since the UNIX epoch of 1970-01-01 00:00:00 UTC. |
| `txFlags.Universal.FullyCanonicalSig` | (Removed - see Notes column) | No longer needed following the [RequireFullyCanonicalSig amendment][]. |
| `txFlags.Payment.NoRippleDirect` | `xrpl.PaymentFlags.tfNoDirectRipple` | |
| `txFlags.Payment.PartialPayment` | `xrpl.PaymentFlags.tfPartialPayment` | |
| `txFlags.Payment.LimitQuality` | `xrpl.PaymentFlags.tfLimitQuality` | |
| `txFlags.OfferCreate.Passive` | `xrpl.OfferCreateFlags.tfPassive` | |
| `txFlags.OfferCreate.ImmediateOrCancel` | `xrpl.OfferCreateFlags.tfImmediateOrCancel` | |
| `txFlags.OfferCreate.FillOrKill` | `xrpl.OfferCreateFlags.tfFillOrKill` | |
| `txFlags.OfferCreate.Sell` | `xrpl.OfferCreateFlags.tfSell` | |
| `accountSetFlags` | `xrpl.AccountSetAsfFlags` | Now an Enum at the module level. |
| `schemaValidator` | (Removed - see Notes column) | Use TypeScript to validate most types. |
| `schemaValidate()` | (Removed - see Notes column) | Use TypeScript to validate most types. You can also call `xrpl.validate(transaction)` to validate transaction objects. |
| `.on("ledger", callback)` | [`Client.on("ledgerClosed", callback)`](https://js.xrpl.org/classes/Client.html#on) | **Caution:** Must also subscribe to the ledger stream. For examples and details, see [Events and Subscriptions](#events-and-subscriptions). |
| `.on("error", callback)` | [`Client.on("error", callback)`](https://js.xrpl.org/classes/Client.html#on) | |
| `.on("connected", callback)` | [`Client.on("connected", callback)`](https://js.xrpl.org/classes/Client.html#on) | |
| `.on("disconnected", callback)` | [`Client.on("connected", callback)`](https://js.xrpl.org/classes/Client.html#on) | |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
