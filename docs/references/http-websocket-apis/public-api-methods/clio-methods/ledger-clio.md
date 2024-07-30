---
html: ledger-clio.html # Watch carefully for clashes w/ this filename
parent: clio-methods.html
seo:
    description: Get info about a ledger version.
labels:
  - Blockchain
---
# ledger
[[Source]](https://github.com/XRPLF/clio/blob/master/src/rpc/handlers/Ledger.cpp "Source")

The `ledger` command retrieves information about the public [ledger](../../../../concepts/ledgers/index.md). {% badge href="https://github.com/XRPLF/clio/releases/tag/1.0.0" %}New in: Clio v1.0.0{% /badge %}

Note that the Clio server returns validated ledger data by default.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger-clio/wsrpc-request.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger-clio/jsonrpc-request.json" language="json" /%}
{% /tab %}

{% /tabs %}

<!-- [Try it! >](websocket-api-tool.html#ledger) -->

The request can contain the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `ledger_hash`  | [Hash][]                   | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]). |
| `ledger_index` | [Ledger Index][]           | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `transactions` | Boolean                    | _(Optional)_ If `true`, return information on transactions in the specified ledger version. Defaults to `false`. Ignored if you did not specify a ledger version. |
| `expand`       | Boolean                    | _(Optional)_ Provide full JSON-formatted information for transaction/account information instead of only hashes. Defaults to `false`. Ignored unless you request transactions. |
| `owner_funds`  | Boolean                    | _(Optional)_ If `true`, include `owner_funds` field in the metadata of OfferCreate transactions in the response. Defaults to `false`. Ignored unless transactions are included and `expand` is true. |
| `binary`       | Boolean                    | _(Optional)_ If `true`, and `transactions` and `expand` are both also `true`, return transaction information in binary format (hexadecimal string) instead of JSON format. |
| `diff`         | Boolean                    | _(Optional)_ If `true`, returns all objects that were added, modified, or deleted as part of applying transactions in the specified ledger. |

The `ledger` field is deprecated and may be removed without further notice.

{% admonition type="info" name="Note" %}
The `ledger` command in Clio does not support the following fields:

* `accounts`
* `full`
* `queue`

Clio returns an error when any of the above fields is set to `true`. (It is OK to include the fields in the request as long as the provided value is `false`.) {% badge href="https://github.com/XRPLF/clio/releases/tag/2.2.2" %}Updated in: Clio 2.2.2{% /badge %}
{% /admonition %}

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger-clio/wsrpc-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger-clio/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="JSON-RPC (with diff)" %}
{% code-snippet file="/_api-examples/ledger-clio/jsonrpc-diff-response.json" language="json" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing information about the ledger, including the following fields:

| `Field`                        | Type    | Description                       |
|:-------------------------------|:--------|:----------------------------------|
| `ledger`                       | Object  | The complete header data of this ledger. |
| `ledger.account_hash`          | String  | Hash of all account state information in this ledger, as hex |
| `ledger.accountState`          | Array   | (Omitted unless requested) All the [account-state information](../../../protocol/ledger-data/index.md) in this ledger. |
| `ledger.close_flags`           | Integer | A bit-map of [flags relating to the closing of this ledger](../../../protocol/ledger-data/ledger-header.md#close-flags). |
| `ledger.close_time`            | Integer | The time this ledger was closed, in [seconds since the Ripple Epoch][]. |
| `ledger.close_time_human`      | String  | The time this ledger was closed, in human-readable format. Always uses the UTC time zone. |
| `ledger.close_time_resolution` | Integer | Ledger close times are rounded to within this many seconds. |
| `ledger.closed`                | Boolean | Whether or not this ledger has been closed. |
| `ledger.ledger_hash`           | String  | Unique identifying hash of the entire ledger. |
| `ledger.ledger_index`          | String  | The [Ledger Index][] of this ledger, as a quoted integer. |
| `ledger.parent_close_time`     | Integer | The time at which the previous ledger was closed. |
| `ledger.parent_hash`           | String  | Unique identifying hash of the ledger that came immediately before this one. |
| `ledger.total_coins`           | String  | Total number of XRP drops in the network, as a quoted integer. (This decreases as transaction costs destroy XRP.) |
| `ledger.transaction_hash`      | String  | Hash of the transaction information included in this ledger, as hex. |
| `ledger.transactions`          | Array   | (Omitted unless requested) Transactions applied in this ledger version. By default, members are the transactions' identifying [Hash][] strings. If the request specified `expand` as true, members are full representations of the transactions instead, in either JSON or binary depending on whether the request specified `binary` as true. |
| `ledger_hash`                  | String  | Unique identifying hash of the entire ledger. |
| `ledger_index`                 | Number  | The [Ledger Index][] of this ledger. |
| `validated`                    | Boolean | _(May be omitted)_ If `true`, this is a validated ledger version. If omitted or set to `false`, this ledger's data is not final. |
| `diff`                         | Object  | _(Omitted unless requested with the `diff` parameter)_ Object containing an array of hashes that were added, modified, or deleted as part of applying transactions for the ledger. |

If the request specified `"owner_funds": true` and expanded transactions, the response has a field `owner_funds` in the `metaData` object of each [OfferCreate transaction][]. The purpose of this field is to make it easier to track the [funding status of offers](../../../../concepts/tokens/decentralized-exchange/offers.md#lifecycle-of-an-offer) with each new validated ledger. This field is defined slightly differently than the version of this field in [Order Book subscription streams](../subscription-methods/subscribe.md#order-book-streams):

| `Field`       | Value  | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `owner_funds` | String | Numeric amount of the `TakerGets` currency that the `Account` sending this OfferCreate transaction has after the execution of all transactions in this ledger. This does not check whether the currency amount is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |

If the request specified `"diff": true`, the response has an object `diff`. The fields of this object are as follows:

| `Field`       | Value  | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `object_id` | String | The object identifier. |
| `Hashes` | Object or Hex String | Depending on whether the request set `binary` to true or false, this field returns the contents of the object that was created, the new value of an object that was modified, or an empty string if the object was deleted. |


## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
