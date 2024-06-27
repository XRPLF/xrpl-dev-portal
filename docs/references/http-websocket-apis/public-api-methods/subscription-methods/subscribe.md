---
html: subscribe.html
parent: subscription-methods.html
seo:
    description: Listen for updates about a particular subject.
labels:
  - Payments
  - Blockchain
  - Accounts
  - Smart Contracts
---
# subscribe
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Subscribe.cpp "Source")

The `subscribe` method requests periodic notifications from the server when certain events happen.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="Subscribe to accounts" %}
```json
{
  "id": "Example watch Bitstamp's hot wallet",
  "command": "subscribe",
  "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
}
```
{% /tab %}

{% tab label="Subscribe to order book" %}
```json
{
    "id": "Example subscribe to XRP/GateHub USD order book",
    "command": "subscribe",
    "books": [
        {
            "taker_pays": {
                "currency": "XRP"
            },
            "taker_gets": {
                "currency": "USD",
                "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
            },
            "snapshot": true
        }
    ]
}
```
{% /tab %}

{% tab label="Subscribe to ledger stream" %}
```json
{
  "id": "Example watch for new validated ledgers",
  "command": "subscribe",
  "streams": ["ledger"]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#subscribe)

The request includes the following parameters:

| `Field`             | Type   | Description                                   |
|:--------------------|:-------|:----------------------------------------------|
| `streams`           | Array  | _(Optional)_ Array of string names of generic streams to subscribe to, as explained below |
| `accounts`          | Array  | _(Optional)_ Array with the unique addresses of accounts to monitor for validated transactions. The addresses must be in the XRP Ledger's [base58][] format. The server sends a notification for any transaction that affects at least one of these accounts. |
| `accounts_proposed` | Array  | _(Optional)_ Like `accounts`, but include transactions that are not yet finalized. |
| `books`             | Array  | _(Optional)_ Array of objects defining [order books](http://www.investopedia.com/terms/o/order-book.asp) to monitor for updates, as detailed below. |
| `url`               | String | (Optional for Websocket; Required otherwise) URL where the server sends a JSON-RPC callbacks for each event. *Admin-only.* |
| `url_username`      | String | _(Optional)_ Username to provide for basic authentication at the callback URL. |
| `url_password`      | String | _(Optional)_ Password to provide for basic authentication at the callback URL. |

The following parameters are deprecated and may be removed without further notice: `user`, `password`, `rt_accounts`.

The `streams` parameter provides access to the following default streams of information:

- `book_changes` - Sends a message with order book changes whenever the consensus process declares a new validated ledger.
- `consensus` - Sends a message whenever the server changes phase in the consensus cycle.
- `ledger` - Sends a message whenever the consensus process declares a new validated ledger.
- `manifests` - Sends a message whenever the server receives an update to a validator's ephemeral signing key.
- `peer_status` - **(Admin only)** Information about connected peer `rippled` servers, especially with regards to the consensus process.
- `transactions` - Sends a message whenever a transaction is included in a closed ledger.
- `transactions_proposed` - Sends a message whenever a transaction is included in a closed ledger, as well as some transactions that have not yet been included in a validated ledger and may never be. Not all proposed transactions appear before validation.
    **Note:** [Even some transactions that don't succeed are included](../../../protocol/transactions/transaction-results/index.md) in validated ledgers, because they take the anti-spam transaction fee.
- `server` - Sends a message whenever the status of the `rippled` server (for example, network connectivity) changes.
- `validations` - Sends a message whenever the server receives a validation message, regardless of if the server trusts the validator. (An individual `rippled` declares a ledger validated when the server receives validation messages from at least a quorum of trusted validators.)

**Note:** The following streams are not available from Clio and `rippled` servers in [Reporting Mode][]: `server`, `peer_status`, `consensus`. Both will return the `reportingUnsupported` error if you request one of these streams. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}Updated in: rippled 1.8.1{% /badge %} {% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}New in: Clio v2.0{% /badge %}

Each member of the `books` array, if provided, is an object with the following fields:

| `Field`      | Type    | Description                                         |
|:-------------|:--------|:----------------------------------------------------|
| `taker_gets` | Object  | Specification of which currency the account taking the Offer would receive, as a [currency object with no amount](../../../protocol/data-types/currency-formats.md#specifying-without-amounts). |
| `taker_pays` | Object  | Specification of which currency the account taking the Offer would pay, as a [currency object with no amount](../../../protocol/data-types/currency-formats.md#specifying-without-amounts). |
| `taker`      | String  | Unique [account address](../../../../concepts/accounts/index.md) to use as a perspective for viewing offers, in the XRP Ledger's [base58][] format. (This affects the funding status and fees of [Offers](../../../../concepts/tokens/decentralized-exchange/offers.md).) |
| `snapshot`   | Boolean | _(Optional)_ If `true`, return the current state of the order book once when you subscribe before sending updates. The default is `false`. |
| `both`       | Boolean | _(Optional)_ If `true`, return both sides of the order book. The default is `false`. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "Example watch Bitstamp's hot wallet",
  "status": "success",
  "type": "response",
  "result": {}
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][]. The fields contained in the response vary depending on what subscriptions were included in the request.

* `accounts` and `accounts_proposed` - No fields returned.
* *Stream: `server`* - Information about the server status, such as `load_base` (the current load level of the server), `random` (a randomly-generated value), and others, subject to change.
* *Stream: `transactions`*, *Stream: `transactions_proposed`*, *Stream: `validations`*, and *Stream: `consensus`* - No fields returned.
* *Stream: `ledger`* - Information about the ledgers on hand and current fee schedule. This includes the same fields as a [ledger stream message](#ledger-stream), except that it omits the `type` and `txn_count` fields.
* `books` - No fields returned by default. If `"snapshot": true` is set in the request, returns `offers` (an array of offer definition objects defining the order book).

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noPermission` - The request included the `url` field, but you are not connected as an admin.
* `unknownStream` - One or more the members of the `streams` field of the request is not a valid stream name.
* `malformedStream` - The `streams` field of the request is not formatted properly.
* `malformedAccount` - One of the addresses in the `accounts` or `accounts_proposed` fields of the request is not a properly-formatted XRP Ledger address. (**Note:**: You _can_ subscribe to the stream of an address that does not yet have an entry in the global ledger to get a message when that address becomes funded.)
* `srcCurMalformed` - One or more `taker_pays` sub-fields of the `books` field in the request is not formatted properly.
* `dstAmtMalformed` - One or more `taker_gets` sub-fields of the `books` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more `taker_pays` sub-fields of the `books` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of one or more `taker_gets` sub-fields of the `books` field in the request is not valid.
* `badMarket` - One or more desired order books in the `books` field does not exist; for example, offers to exchange a currency for itself.

When you subscribe to a particular stream, you receive periodic responses on that stream until you unsubscribe or close the WebSocket connection. The content of those responses depends on what you subscribed to. Here are some examples:

## Ledger Stream

The `ledger` stream only sends `ledgerClosed` messages when [the consensus process](../../../../concepts/consensus-protocol/index.md) declares a new validated ledger. The message identifies the ledger and provides some information about its contents.

```json
{
  "type": "ledgerClosed",
  "fee_base": 10,
  "fee_ref": 10,
  "ledger_hash": "687F604EF6B2F67319E8DCC8C66EF49D84D18A1E18F948421FC24D2C7C3DB464",
  "ledger_index": 7125358,
  "ledger_time": 455751310,
  "reserve_base": 20000000,
  "reserve_inc": 5000000,
  "txn_count": 7,
  "validated_ledgers": "32570-7125358"
}
```

The fields from a ledger stream message are as follows:

| `Field`             | Type                      | Description                |
|:--------------------|:--------------------------|:---------------------------|
| `type`              | String                    | `ledgerClosed` indicates this is from the ledger stream |
| `fee_base`          | Number                    | The [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#reference-transaction-cost) as of this ledger version, in [drops of XRP][]. If this ledger version includes a [SetFee pseudo-transaction](../../../protocol/transactions/pseudo-transaction-types/setfee.md) the new transaction cost applies starting with the following ledger version. |
| `fee_ref`           | Number                    | _(May be omitted)_ The [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#reference-transaction-cost) in "fee units". If the _[XRPFees amendment][]_ is enabled, this field is permanently omitted as it will no longer be relevant. |
| `ledger_hash`       | String - [Hash][]         | The identifying hash of the ledger version that was closed. |
| `ledger_index`      | Number - [Ledger Index][] | The ledger index of the ledger that was closed. |
| `ledger_time`       | Number                    | The time this ledger was closed, in [seconds since the Ripple Epoch][] |
| `reserve_base`      | Number                    | The minimum [reserve](../../../../concepts/accounts/reserves.md), in [drops of XRP][], that is required for an account. If this ledger version includes a [SetFee pseudo-transaction](../../../protocol/transactions/pseudo-transaction-types/setfee.md) the new base reserve applies starting with the following ledger version. |
| `reserve_inc`       | Number                    | The [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves) for each object an account owns in the ledger, in [drops of XRP][]. If the ledger includes a [SetFee pseudo-transaction](../../../protocol/transactions/pseudo-transaction-types/setfee.md) the new owner reserve applies after this ledger. |
| `txn_count`         | Number                    | Number of new transactions included in this ledger version. |
| `validated_ledgers` | String                    | _(May be omitted)_ Range of ledgers that the server has available. This may be a disjoint sequence such as `24900901-24900984,24901116-24901158`. This field is not returned if the server is not connected to the network, or if it is connected but has not yet obtained a ledger from the network. |


## Validations Stream

{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.29.0" %}New in: rippled 0.29.0{% /badge %}

The validations stream sends messages whenever it receives validation messages, also called validation votes, regardless of whether or not the validation message is from a trusted validator. The message looks like the following:

```json
{
    "type": "validationReceived",
    "amendments":[
        "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
        "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC",
        "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490",
        "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13"
    ],
    "base_fee":10,
    "flags":2147483649,
    "full":true,
    "ledger_hash":"EC02890710AAA2B71221B0D560CFB22D64317C07B7406B02959AD84BAD33E602",
    "ledger_index":"6",
    "load_fee":256000,
    "master_key": "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
    "reserve_base":20000000,
    "reserve_inc":5000000,
    "signature":"3045022100E199B55643F66BC6B37DBC5E185321CF952FD35D13D9E8001EB2564FFB94A07602201746C9A4F7A93647131A2DEB03B76F05E426EC67A5A27D77F4FF2603B9A528E6",
    "signing_time":515115322,
    "validation_public_key":"n94Gnc6svmaPPRHUAyyib1gQUov8sYbjLoEwUBYPH39qHZXuo8ZT"
}
```

The fields from a validations stream message are as follows:

| `Field`                 | Type             | Description                     |
|:------------------------|:-----------------|:--------------------------------|
| `type`                  | String           | The value `validationReceived` indicates this is from the validations stream. |
| `amendments`            | Array of Strings | _(May be omitted)_ The [amendments](../../../../concepts/networks-and-servers/amendments.md) this server wants to be added to the protocol. |
| `base_fee`              | Integer          | _(May be omitted)_ The unscaled transaction cost (`reference_fee` value) this server wants to set by [Fee Voting](../../../../concepts/consensus-protocol/fee-voting.md). |
| `cookie`                | String - Number  | _(May be omitted)_ An arbitrary value chosen by the server at startup. If the same validation key pair signs validations with different cookies concurrently, that usually indicates that multiple servers are incorrectly configured to use the same validation key pair. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}New in: rippled 1.8.1{% /badge %} |
| `flags`                 | Number           | Bit-mask of flags added to this validation message. The flag `0x80000000` indicates that the validation signature is fully-canonical. The flag `0x00000001` indicates that this is a full validation; otherwise it's a partial validation. Partial validations are not meant to vote for any particular ledger. A partial validation indicates that the validator is still online but not keeping up with consensus. |
| `full`                  | Boolean          | If `true`, this is a full validation. Otherwise, this is a partial validation. Partial validations are not meant to vote for any particular ledger. A partial validation indicates that the validator is still online but not keeping up with consensus. |
| `ledger_hash`           | String           | The identifying hash of the proposed ledger is being validated. |
| `ledger_index`          | String - Number  | The [Ledger Index][] of the proposed ledger. |
| `load_fee`              | Integer          | _(May be omitted)_ The local load-scaled transaction cost this validator is currently enforcing, in fee units. |
| `master_key`            | String           | _(May be omitted)_ The validator's master public key, if the validator is using a validator token, in the XRP Ledger's [base58][] format. (See also: [Enable Validation on your `rippled` Server](../../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-enable-validation-on-your-rippled-server).) |
| `reserve_base`          | Integer          | _(May be omitted)_ The minimum reserve requirement (`account_reserve` value) this validator wants to set by [Fee Voting](../../../../concepts/consensus-protocol/fee-voting.md). |
| `reserve_inc`           | Integer          | _(May be omitted)_ The increment in the reserve requirement (`owner_reserve` value) this validator wants to set by [Fee Voting](../../../../concepts/consensus-protocol/fee-voting.md). |
| `server_version`        | String - Number  | _(May be omitted)_ An 64-bit integer that encodes the version number of the validating server. For example, `"1745990410175512576"`. Only provided once every 256 ledgers. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}New in: rippled 1.8.1{% /badge %} |
| `signature`             | String           | The signature that the validator used to sign its vote for this ledger. |
| `signing_time`          | Number           | When this validation vote was signed, in [seconds since the Ripple Epoch][]. |
| `validated_hash`        | String           | The unique hash of the proposed ledger this validation applies to. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}New in: rippled 1.8.1{% /badge %} |
| `validation_public_key` | String           | The public key from the key-pair that the validator used to sign the message, in the XRP Ledger's [base58][] format. This identifies the validator sending the message and can also be used to verify the `signature`. If the validator is using a token, this is an ephemeral public key. |


## Transaction Streams

Many subscriptions result in messages about transactions, including the following:

* The `transactions` stream
* The `transactions_proposed` stream
* `accounts` subscriptions
* `accounts_proposed` subscriptions
* `book` (Order Book) subscriptions

The `transactions_proposed` stream, strictly speaking, is a superset of the `transactions` stream: it includes all validated transactions, as well as some suggested transactions that have not yet been included in a validated ledger and may never be. You can identify these "in-flight" transactions by their fields:

* The `validated` field is missing or has a value of `false`.
* There is no `meta` or `metadata` field.
* Instead of `ledger_hash` and `ledger_index` fields specifying in which ledger version the transactions were finalized, there is a `ledger_current_index` field specifying in which ledger version they are currently proposed.

Otherwise, the messages from the `transactions_proposed` stream are the same as ones from the `transactions` stream.

Since the only thing that can modify an account or an order book is a transaction, the messages that are sent as a result of subscribing to particular `accounts` or `books` also take the form of transaction messages, the same as the ones in the `transactions` stream. The only difference is that you only receive messages for transactions that affect the accounts or order books you're watching.

The `accounts_proposed` subscription works the same way, except it also includes unconfirmed transactions, like the `transactions_proposed` stream, for the accounts you're watching.

```json
{
  "status": "closed",
  "type": "transaction",
  "engine_result": "tesSUCCESS",
  "engine_result_code": 0,
  "engine_result_message": "The transaction was applied.",
  "ledger_hash": "989AFBFD65D820C6BD85301B740F5D592F060668A90EEF5EC1815EBA27D58FE8",
  "ledger_index": 7125442,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Flags": 0,
            "IndexPrevious": "0000000000000000",
            "Owner": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "RootIndex": "ABD8CE2D1205D0C062876E9E1F3CBDC902ED8EF4E8D3D071B962C7ED0E113E68"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "0BBDEE7D0BE120F7BF27640B5245EBFE0C5FD5281988BA823C44477A70262A4D"
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "BookDirectory": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
            "BookNode": "0000000000000000",
            "Flags": 0,
            "OwnerNode": "000000000000006E",
            "PreviousTxnID": "58A17D95770F8D07E08B81A85896F4032A328B6C2BDCDEC0A00F3EF3914DCF0A",
            "PreviousTxnLgrSeq": 7125330,
            "Sequence": 540691,
            "TakerGets": "4401967683",
            "TakerPays": {
              "currency": "BTC",
              "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
              "value": "0.04424"
            }
          },
          "LedgerEntryType": "Offer",
          "LedgerIndex": "386B7803A9210747941B0D079BB408F31ACB1CB98832184D0287A1CBF4FE6D00"
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "ExchangeRate": "4A03920BFC5E99BE",
            "Flags": 0,
            "RootIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
            "TakerGetsCurrency": "0000000000000000000000000000000000000000",
            "TakerGetsIssuer": "0000000000000000000000000000000000000000",
            "TakerPaysCurrency": "0000000000000000000000004254430000000000",
            "TakerPaysIssuer": "92D705968936C419CE614BF264B5EEB1CEA47FF4"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE"
        }
      },
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "Balance": "11133297300",
            "Flags": 0,
            "OwnerCount": 9,
            "Sequence": 540706
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "A6C2532E1008A513B3F822A92B8E5214BD0D413DC20AD3631C1A39AD6B36CD07",
          "PreviousFields": {
            "Balance": "11133297310",
            "OwnerCount": 10,
            "Sequence": 540705
          },
          "PreviousTxnID": "484D57DFC4E446DA83B4540305F0CE836D4E007361542EC12CC0FFB5F0A1BE3A",
          "PreviousTxnLgrSeq": 7125358
        }
      }
    ],
    "TransactionIndex": 1,
    "TransactionResult": "tesSUCCESS"
  },
  "transaction": {
    "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
    "Fee": "10",
    "Flags": 2147483648,
    "OfferSequence": 540691,
    "Sequence": 540705,
    "SigningPubKey": "030BB49C591C9CD65C945D4B78332F27633D7771E6CF4D4B942D26BA40748BB8B4",
    "TransactionType": "OfferCancel",
    "TxnSignature": "30450221008223604A383F3AED25D53CE7C874700619893A6EEE4336508312217850A9722302205E0614366E174F2DFF78B879F310DB0B3F6DA1967E52A32F65E25DCEC622CD68",
    "date": 455751680,
    "hash": "94CF924C774DFDBE474A2A7E40AEA70E7E15D130C8CBEF8AF1D2BE97A8269F14"
  },
  "validated": true
}
```

Transaction stream messages have the following fields:

| `Field`                 | Type                      | Description            |
|:------------------------|:--------------------------|:-----------------------|
| `type`                  | String                    | `transaction` indicates this is the notification of a transaction, which could come from several possible streams. |
| `engine_result`         | String                    | String [Transaction result code](../../../protocol/transactions/transaction-results/index.md) |
| `engine_result_code`    | Number                    | Numeric [transaction response code](../../../protocol/transactions/transaction-results/index.md), if applicable. |
| `engine_result_message` | String                    | Human-readable explanation for the transaction response |
| `ledger_current_index`  | Number - [Ledger Index][] | _(Unvalidated transactions only)_ The ledger index of the current in-progress [ledger version](../../../../concepts/ledgers/index.md) for which this transaction is currently proposed. |
| `ledger_hash`           | String - [Hash][]         | _(Validated transactions only)_ The identifying hash of the ledger version that includes this transaction |
| `ledger_index`          | Number - [Ledger Index][] | _(Validated transactions only)_ The ledger index of the ledger version that includes this transaction. |
| `meta`                  | Object                    | _(Validated transactions only)_ The [transaction metadata](../../../protocol/transactions/metadata.md), which shows the exact outcome of the transaction in detail. |
| `transaction`           | Object                    | The [definition of the transaction](../../../protocol/transactions/index.md) in JSON format |
| `validated`             | Boolean                   | If `true`, this transaction is included in a validated ledger and its outcome is final. Responses from the `transaction` stream should always be validated. |


## Peer Status Stream

The admin-only `peer_status` stream reports a large amount of information on the activities of other `rippled` servers to which this server is connected, in particular their status in the consensus process.

Example of a Peer Status stream message:

```json
{
    "action": "CLOSING_LEDGER",
    "date": 508546525,
    "ledger_hash": "4D4CD9CD543F0C1EF023CC457F5BEFEA59EEF73E4552542D40E7C4FA08D3C320",
    "ledger_index": 18853106,
    "ledger_index_max": 18853106,
    "ledger_index_min": 18852082,
    "type": "peerStatusChange"
}
```

Peer Status stream messages represent some event where the status of the peer `rippled` server changed. These messages are JSON objects with the following fields:

| `Field`            | Value  | Description                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `type`             | String | `peerStatusChange` indicates this comes from the Peer Status stream. |
| `action`           | String | The type of event that prompted this message. See [Peer Status Events](#peer-status-events) for possible values. |
| `date`             | Number | The time this event occurred, in [seconds since the Ripple Epoch][]. |
| `ledger_hash`      | String | (May be omitted) The identifying [Hash][] of a ledger version to which this message pertains. |
| `ledger_index`     | Number | (May be omitted) The [Ledger Index][] of a ledger version to which this message pertains. |
| `ledger_index_max` | Number | (May be omitted) The largest [Ledger Index][] the peer has currently available. |
| `ledger_index_min` | Number | (May be omitted) The smallest [Ledger Index][] the peer has currently available. |

### Peer Status Events

The `action` field of a Peer Status stream message can have the following values:

| `Value`           | Meaning                                                  |
|:------------------|:---------------------------------------------------------|
| `CLOSING_LEDGER`  | The peer closed a ledger version with this [Ledger Index][], which usually means it is about to start consensus. |
| `ACCEPTED_LEDGER` | The peer built this ledger version as the result of a consensus round. **Note:** This ledger is still not certain to become immutably validated. |
| `SWITCHED_LEDGER` | The peer concluded it was not following the rest of the network and switched to a different ledger version. |
| `LOST_SYNC`       | The peer fell behind the rest of the network in tracking which ledger versions are validated and which are undergoing consensus. |


## Order Book Streams

When you subscribe to one or more order books with the `books` field, you get back any transactions that affect those order books.

Example order book stream message:

```json
{
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "ledger_hash": "08547DD866F099CCB3666F113116B7AA2DF520FA2E3011DD1FF9C9C04A6C7C3E",
    "ledger_index": 18852105,
    "meta": {
        "AffectedNodes": [{
            "ModifiedNode": {
                "FinalFields": {
                    "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "AccountTxnID": "D295E2BE50E3B78AED24790D7B9096996DAF43F095BF17DB83EEACC283D14050",
                    "Balance": "3070332374272",
                    "Flags": 0,
                    "OwnerCount": 23,
                    "RegularKey": "r9S56zu6QeJD5d8A7QMfLAeYavgB9dhaX4",
                    "Sequence": 12142921
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "2880A9B4FB90A306B576C2D532BFE390AB3904642647DCF739492AA244EF46D1",
                "PreviousFields": {
                    "AccountTxnID": "3CA3422B0E42D76A7A677B0BA0BE72DFCD93676E0C80F8D2EB27C04BD8457A0F",
                    "Balance": "3070332385272",
                    "Sequence": 12142920
                },
                "PreviousTxnID": "3CA3422B0E42D76A7A677B0BA0BE72DFCD93676E0C80F8D2EB27C04BD8457A0F",
                "PreviousTxnLgrSeq": 18852102
            }
        }, {
            "ModifiedNode": {
                "FinalFields": {
                    "Flags": 0,
                    "IndexPrevious": "00000000000022D2",
                    "Owner": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "RootIndex": "F435FBBEC9654204D7151A01E686BAA8CB325A472D7B61C7916EA58B59355767"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "29A543B6681AD7FC8AFBD1386DAE7385F02F9B8C4756A467DF6834AB54BBC9DB"
            }
        }, {
            "ModifiedNode": {
                "FinalFields": {
                    "ExchangeRate": "4C1BA999A513EF78",
                    "Flags": 0,
                    "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                    "TakerGetsCurrency": "0000000000000000000000000000000000000000",
                    "TakerGetsIssuer": "0000000000000000000000000000000000000000",
                    "TakerPaysCurrency": "0000000000000000000000005553440000000000",
                    "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78"
            }
        }, {
            "CreatedNode": {
                "LedgerEntryType": "Offer",
                "LedgerIndex": "92E235EE80D2B28A89BEE2C905D4545C2A004FD5D4097679C8A3FB25507FD9EB",
                "NewFields": {
                    "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                    "Expiration": 508543674,
                    "OwnerNode": "00000000000022F4",
                    "Sequence": 12142920,
                    "TakerGets": "6537121438",
                    "TakerPays": {
                        "currency": "USD",
                        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                        "value": "50.9"
                    }
                }
            }
        }, {
            "DeletedNode": {
                "FinalFields": {
                    "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                    "BookNode": "0000000000000000",
                    "Expiration": 508543133,
                    "Flags": 0,
                    "OwnerNode": "00000000000022F4",
                    "PreviousTxnID": "58B3279C2D56AAC3D9B06106E637C01E3D911E9D31E2FE4EA0D886AC9F4DEE1E",
                    "PreviousTxnLgrSeq": 18851945,
                    "Sequence": 12142889,
                    "TakerGets": "6537121438",
                    "TakerPays": {
                        "currency": "USD",
                        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                        "value": "50.9"
                    }
                },
                "LedgerEntryType": "Offer",
                "LedgerIndex": "D3436CE21925E1CB12C5C444963B47D7EA0CD9A0E387926DC76B23FE5CD1C15F"
            }
        }],
        "TransactionIndex": 26,
        "TransactionResult": "tesSUCCESS"
    },
    "status": "closed",
    "transaction": {
        "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
        "Expiration": 508543674,
        "Fee": "11000",
        "Flags": 2147483648,
        "LastLedgerSequence": 18852106,
        "OfferSequence": 12142889,
        "Sequence": 12142920,
        "SigningPubKey": "034841BF24BD72C7CC371EBD87CCBF258D8ADB05C18DE207130364A97D8A3EA524",
        "TakerGets": "6537121438",
        "TakerPays": {
            "currency": "USD",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "50.9"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3045022100B9AD678A773FB61F8F9B565713C80CBF187A2F9EB8E9CE0DAC7B839CA6F4B04C02200613D173A0636CD9BE13F2E3EBD13A16932B5B7D8A96BB5F6D561CA5CDBC4AD3",
        "date": 508543090,
        "hash": "D295E2BE50E3B78AED24790D7B9096996DAF43F095BF17DB83EEACC283D14050",
        "owner_funds": "3070197374272"
    },
    "type": "transaction",
    "validated": true
}
```

The format of an order book stream message is the same as that of [transaction stream messages](#transaction-streams), except that `OfferCreate` transactions also contain the following field:

| Field                     | Value  | Description                             |
|:--------------------------|:-------|:----------------------------------------|
| `transaction.owner_funds` | String | Numeric amount of the `TakerGets` currency that the `Account` sending this OfferCreate transaction has after executing this transaction. This does not check whether the currency amount is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |


## Book Changes Stream

The `book_changes` stream sends `bookChanges` messages whenever a new ledger is validated. This message contains a summary of all changes to order books in the decentralized exchange that occurred in that ledger.

Example `bookChanges` message:

```json
{
  "type": "bookChanges",
  "ledger_index": 88530525,
  "ledger_hash": "E2F24290E1714C842D34A1057E6D6B7327C7DDD310263AFBC67CA8EFED7A331B",
  "ledger_time": 771099232,
  "changes": [
    {
      "currency_a": "XRP_drops",
      "currency_b": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/USD",
      "volume_a": "23020993",
      "volume_b": "11.51049687275246",
      "high": "1999999.935232603",
      "low": "1999999.935232603",
      "open": "1999999.935232603",
      "close": "1999999.935232603"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rRbiKwcueo6MchUpMFDce9XpDwHhRLPFo/43525950544F0000000000000000000000000000",
      "volume_a": "28062",
      "volume_b": "0.000643919229004",
      "high": "43580000.00000882",
      "low": "43580000.00000882",
      "open": "43580000.00000882",
      "close": "43580000.00000882"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rcEGREd8NmkKRE8GE424sksyt1tJVFZwu/5553444300000000000000000000000000000000",
      "volume_a": "147797392",
      "volume_b": "70.41143840513008",
      "high": "2099053.724049922",
      "low": "2099053.724049922",
      "open": "2099053.724049922",
      "close": "2099053.724049922"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rcRzGWq6Ng3jeYhqnmM4zcWcUh69hrQ8V/LTC",
      "volume_a": "350547165",
      "volume_b": "2.165759976556748",
      "high": "162573356.3100158",
      "low": "160134763.7403094",
      "open": "162573356.3100158",
      "close": "160134763.7403094"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL/BTC",
      "volume_a": "352373535",
      "volume_b": "0.00249291478138912",
      "high": "1413500174054660e-4",
      "low": "1413499999999996e-4",
      "open": "1413500174054660e-4",
      "close": "1413499999999996e-4"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rcvxE9PS9YBwxtGg1qNeewV6ZB3wGubZq/5553445400000000000000000000000000000000",
      "volume_a": "8768045",
      "volume_b": "4.193604075536",
      "high": "2090813.734932601",
      "low": "2090813.734932601",
      "open": "2090813.734932601",
      "close": "2090813.734932601"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/USD",
      "volume_a": "28113",
      "volume_b": "0.013405652999",
      "high": "2097100.380123005",
      "low": "2097100.380123005",
      "open": "2097100.380123005",
      "close": "2097100.380123005"
    },
    {
      "currency_a": "r3dVizzUAS3U29WKaaSALqkieytA2LCoRe/58434F5245000000000000000000000000000000",
      "currency_b": "rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D/434F524500000000000000000000000000000000",
      "volume_a": "75.626516003375",
      "volume_b": "63.022096669479",
      "high": "1.200000000000003",
      "low": "1.200000000000003",
      "open": "1.200000000000003",
      "close": "1.200000000000003"
    },
    {
      "currency_a": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/CNY",
      "currency_b": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/USD",
      "volume_a": "83.9115222024",
      "volume_b": "11.51049687275",
      "high": "7.290000000004561",
      "low": "7.290000000004561",
      "open": "7.290000000004561",
      "close": "7.290000000004561"
    },
    {
      "currency_a": "rcRzGWq6Ng3jeYhqnmM4zcWcUh69hrQ8V/LTC",
      "currency_b": "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL/BTC",
      "volume_a": "0.64167647147626",
      "volume_b": "0.00073047551165797",
      "high": "878.4366638381051",
      "low": "878.4366638381051",
      "open": "878.4366638381051",
      "close": "878.4366638381051"
    },
    {
      "currency_a": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/USD",
      "currency_b": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/USD",
      "volume_a": "0.013432464305",
      "volume_b": "0.013566788948",
      "high": "0.9900990099046391",
      "low": "0.9900990099046391",
      "open": "0.9900990099046391",
      "close": "0.9900990099046391"
    }
  ]
}
```

The fields from a Book Changes stream message are as follows:

| Field          | Value            | Description                             |
|:---------------|:-----------------|:----------------------------------------|
| `type`         | String           | The value `bookChanges` indicates this is from the Book Changes stream. |
| `ledger_index` | [Ledger Index][] | The ledger index of the ledger with these changes. |
| `ledger_hash`  | [Hash][]         | The identifying hash of the ledger with these changes. |
| `ledger_time`  | Number           | The official close time of the ledger with these changes, in [seconds since the Ripple Epoch][]. |
| `changes`      | Array            | List of [Book Update Objects](../path-and-order-book-methods/book_changes.md#book-update-objects), containing one entry for each order book that was updated in this ledger version. The array is empty if no order books were updated. |


## Consensus Stream

The `consensus` stream sends `consensusPhase` messages when [the consensus process](../../../../concepts/consensus-protocol/index.md) changes phase. The message contains the new phase of consensus the server is in.

```json
{
  "type": "consensusPhase",
  "consensus": "accepted"
}
```

The fields from a consensus stream message are as follows:

| Field       | Type   | Description                |
|:------------|:-------|:---------------------------|
| `type`      | String | The value `consensusPhase` indicates this is from the consensus stream |
| `consensus` | String | The new consensus phase the server is in. Possible values are `open`, `establish`, and `accepted`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
