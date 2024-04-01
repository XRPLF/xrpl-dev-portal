---
html: ledger.html # Watch carefully for clashes w/ this filename
parent: ledger-methods.html
seo:
    description: Get info about a ledger version.
labels:
  - Blockchain
---
# ledger
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerHandler.cpp "Source")

Retrieve information about the public [ledger](../../../../concepts/ledgers/index.md).

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_ledger_req",
    "command": "ledger",
    "ledger_index": "validated",
    "transactions": false,
    "expand": false,
    "owner_funds": false
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger",
    "params": [
        {
            "ledger_index": "validated",
            "transactions": false,
            "expand": false,
            "owner_funds": false
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: ledger ledger_index|ledger_hash [full|tx]
# "full" is equivalent to "full": true
# "tx" is equivalent to "transactions": true
rippled ledger validated
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#ledger)

The request can contain the following parameters:

| `Field`        | Type             | Required? | Description |
|:---------------|:-----------------|:----------|-------------|
| `ledger_hash`  | [Hash][]         | No        | A 32-byte hex string for the ledger version to use. (See [Specifying Ledgers][]). |
| `ledger_index` | [Ledger Index][] | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `transactions` | Boolean          | No        | If `true`, return information on transactions in the specified ledger version. The default is `false`. Ignored if you did not specify a ledger version. |
| `expand`       | Boolean          | No        | Provide full JSON-formatted information for transaction/account information instead of only hashes. The default is `false`. Ignored unless you request transactions, accounts, or both. |
| `owner_funds`  | Boolean          | No        | If `true`, include `owner_funds` field in the metadata of OfferCreate transactions in the response. The default is `false`. Ignored unless transactions are included and `expand` is true. |
| `binary`       | Boolean          | No        | If `true`, and `transactions` and `expand` are both also `true`, return transaction information in binary format (hexadecimal string) instead of JSON format. |
| `queue`        | Boolean          | No        | If `true`, and the command is requesting the `current` ledger, includes an array of [queued transactions](../../../../concepts/transactions/transaction-cost.md#queued-transactions) in the results. |


The `ledger` field is deprecated and may be removed without further notice. The `full`, `accounts`, and `type` fields (admin-only) are also deprecated; the Clio server does not implement these parameters.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/ledger/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2023-Nov-01 21:38:14.638871262 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing information about the ledger, including the following fields:

| `Field`                        | Type    | Description                       |
|:-------------------------------|:--------|:----------------------------------|
| `ledger`                       | Object  | The complete [ledger header data](../../../protocol/ledger-data/ledger-header.md) of this ledger, with some additional fields added for convenience. |
| `ledger.account_hash`          | String  | [Hash](../../../protocol/data-types/basic-data-types.md#hashes) of all account state information in this ledger, as hexadecimal. |
| `ledger.close_flags`           | Number  | A bit-map of [flags relating to the closing of this ledger](../../../protocol/ledger-data/ledger-header.md#close-flags). |
| `ledger.close_time`            | Number  | The time this ledger was closed, in [seconds since the Ripple Epoch][]. |
| `ledger.close_time_human`      | String  | The time this ledger was closed, in human-readable format. Always uses the UTC time zone. |
| `ledger.close_time_resolution` | Number  | Ledger close times are rounded to within this many seconds. |
| `ledger.closed`                | Boolean | Whether or not this ledger has been closed. |
| `ledger.ledger_hash`           | String  | Unique identifying hash of the entire ledger. |
| `ledger.ledger_index`          | String  | The [Ledger Index][] of this ledger, as a quoted integer. |
| `ledger.parent_close_time`     | Number  | The time at which the previous ledger was closed. |
| `ledger.parent_hash`           | String  | The unique identifying hash of the ledger that came immediately before this one, as hexadecimal. |
| `ledger.total_coins`           | String  | Total number of XRP drops in the network, as a quoted integer. (This decreases as transaction costs destroy XRP.) |
| `ledger.transaction_hash`      | String  | [Hash](../../../protocol/data-types/basic-data-types.md#hashes) of the transaction information included in this ledger. |
| `ledger.transactions`          | Array   | _(Omitted unless requested)_ Transactions applied in this ledger version. By default, members are the transactions' identifying [Hash][] strings. If the request specified `expand` as true, members are full representations of the transactions instead, in either JSON or binary depending on whether the request specified `binary` as true. |
| `ledger_hash`                  | String  | The unique identifying hash of the entire ledger, as hexadecimal. |
| `ledger_index`                 | Number  | The [Ledger Index][] of this ledger. |
| `validated`                    | Boolean | _(May be omitted)_ If `true`, this is a validated ledger version. If omitted or set to `false`, this ledger's data is not final. |
| `queue_data`                   | Array   | _(Omitted unless requested with the `queue` parameter)_ Array of objects describing queued transactions, in the same order as the queue. If the request specified `expand` as true, members contain full representations of the transactions, in either JSON or binary depending on whether the request specified `binary` as true. |

The `ledger.accountState` field (omitted unless requested with `"full": true` or `"accounts": true`) is deprecated.

The following deprecated fields have been removed: `accepted`, `hash` (use `ledger_hash` instead), `seqNum` (use `ledger_index` instead), `totalCoins` (use `total_coins` instead). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}Updated in: rippled 1.12.0{% /badge %}

Each member of the `queue_data` array represents one transaction in the queue. Some fields of this object may be omitted because they have not yet been calculated. The fields of this object are as follows:

| Field               | Value            | Description                         |
|:--------------------|:-----------------|:------------------------------------|
| `account`           | String           | The [Address][] of the sender for this queued transaction. |
| `tx`                | String or Object | By default, this is a String containing the [identifying hash](../../../protocol/data-types/basic-data-types.md#hashes) of the transaction. If transactions are expanded in binary format, this is an object whose only field is `tx_blob`, containing the binary form of the transaction as a decimal string. If transactions are expanded in JSON format, this is an object containing the [transaction object](../../../protocol/transactions/index.md) including the transaction's identifying hash in the `hash` field. |
| `retries_remaining` | Number           | How many times this transaction can be retried before being dropped. |
| `preflight_result`  | String           | The tentative result from preliminary transaction checking. This is always `tesSUCCESS`. |
| `last_result`       | String           | _(May be omitted)_ If this transaction was left in the queue after getting a [retriable (`ter`) result](../../../protocol/transactions/transaction-results/ter-codes.md), this is the exact `ter` result code it got. |
| `auth_change`       | Boolean          | _(May be omitted)_ Whether this transaction changes this address's [ways of authorizing transactions](../../../../concepts/transactions/index.md#authorizing-transactions). |
| `fee`               | String           | _(May be omitted)_ The [Transaction Cost](../../../../concepts/transactions/transaction-cost.md) of this transaction, in [drops of XRP][]. |
| `fee_level`         | String           | _(May be omitted)_ The transaction cost of this transaction, relative to the minimum cost for this type of transaction, in [fee levels][]. |
| `max_spend_drops`   | String           | _(May be omitted)_ The maximum amount of [XRP, in drops][], this transaction could potentially send or destroy. |

If the request specified `"owner_funds": true` and expanded transactions, the response has a field `owner_funds` in the `metaData` object of each [OfferCreate transaction][]. The purpose of this field is to make it easier to track the [funding status of offers](../../../../concepts/tokens/decentralized-exchange/offers.md#lifecycle-of-an-offer) with each new validated ledger. This field is defined slightly differently than the version of this field in [Order Book subscription streams](../subscription-methods/subscribe.md#order-book-streams):

| `Field`       | Value  | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `owner_funds` | String | Numeric amount of the `TakerGets` currency that the `Account` sending this OfferCreate transaction has after the execution of all transactions in this ledger. This does not check whether the currency amount is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `noPermission` - If you specified `full` or `accounts` as true, but are not connected to the server as an admin (usually, admin requires connecting on localhost).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
