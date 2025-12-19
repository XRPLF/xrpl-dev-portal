---
seo:
    description: Retrieve info about a transaction from all the ledgers on hand.
labels:
   - Transaction Sending
   - Payments
---
# tx

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/Tx.cpp "Source")

The `tx` method retrieves information on a single [transaction](../../../protocol/transactions/index.md), by its [identifying hash][] or its [CTID](../../api-conventions/ctid.md).

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket (Hash)" %}
```json
{
  "id": "example_tx_hash",
  "command": "tx",
  "transaction": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "binary": false,
  "api_version": 2
}
```
{% /tab %}

{% tab label="WebSocket (CTID)" %}
```json
{
  "id": "example_tx_ctid",
  "command": "tx",
  "ctid": "C363B1DD00000000",
  "binary": false,
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC (Hash)" %}
```json
{
    "method": "tx",
    "params": [
        {
            "transaction": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
            "binary": false,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="JSON-RPC (CTID)" %}
```json
{
    "method": "tx",
    "params": [
        {
            "ctid": "C363B1DD00000000",
            "binary": false,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: tx transaction [binary]
rippled tx C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9 false
```
{% /tab %}

{% /tabs %}

{% try-it method="tx" /%}

The request includes the following parameters:

| Field         | Type    | Required? | Description                            |
|:--------------|:--------|:----------|----------------------------------------|
| `ctid`        | String  | No        | The [compact transaction identifier](../../api-conventions/ctid.md) of the transaction to look up. Must use uppercase hexadecimal only. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}New in: rippled 1.12.0{% /badge %} _(Not supported in Clio v2.0 and earlier)_ |
| `transaction` | String  | No        | The 256-bit hash of the transaction to look up, as hexadecimal. |
| `binary`      | Boolean | No        | If `true`, return transaction data and metadata as binary [serialized](../../../protocol/binary-format.md) to hexadecimal strings. If `false`, return transaction data and metadata as JSON. The default is `false`. |
| `min_ledger`  | Number  | No        | Use this with `max_ledger` to specify a range of up to 1000 [ledger indexes][ledger index], starting with this ledger (inclusive). If the server [cannot find the transaction](#not-found-response), it confirms whether it was able to search all the ledgers in this range. |
| `max_ledger`  | Number  | No        | Use this with `min_ledger` to specify a range of up to 1000 [ledger indexes][ledger index], ending with this ledger (inclusive). If the server [cannot find the transaction](#not-found-response), it confirms whether it was able to search all the ledgers in the requested range. |

You must provide _either_ `ctid` or `transaction`, but not both.

{% admonition type="warning" name="Caution" %}This command may successfully find the transaction even if it is included in a ledger _outside_ the range of `min_ledger` to `max_ledger`.{% /admonition %}

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/tx/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2025-Dec-19 03:16:00.638871262 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

{% tabs %}

{% tab label="API v2" %}

The response follows the [standard format][], with a successful result containing the fields of the [Transaction object](../../../protocol/transactions/index.md) as well as the following additional fields:

| `Field`          | Type            | Description              |
|:-----------------|:----------------|:-------------------------|
| `ctid`           | String          | The transaction's [compact transaction identifier](../../api-conventions/ctid.md). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}New in: rippled 1.12.0{% /badge %} _(Not supported in Clio v2.0 and earlier.)_ |
| `close_time_iso` | String          | The time the ledger containing this transaction was closed, in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. |
| `date`           | Number          | The [close time](../../../../concepts/ledgers/ledger-close-times.md) of the ledger in which the transaction was applied, in [seconds since the Ripple Epoch][].   |
| `hash`           | String          | The unique [identifying hash][] of the transaction |
| `inLedger`       | Number          | _(Deprecated)_ Alias for `ledger_index`. |
| `ledger_index`   | Number          | The [ledger index][] of the ledger that includes this transaction. |
| `meta`           | Object (JSON)   | (JSON mode) [Transaction metadata](../../../protocol/transactions/metadata.md), which describes the results of the transaction. |
| `meta_blob`      | String (binary) | (Binary mode) [Transaction metadata](../../../protocol/transactions/metadata.md), which describes the results of the transaction, represented as a hex string. |
| `tx_blob`        | String (binary) | (Binary mode) The transaction data represented as a hex string. |
| `tx_json`        | Object (JSON)   | The transaction data represented in JSON. |
| `validated`      | Boolean         | If `true`, this data comes from a validated ledger version; if omitted or set to `false`, this data is not final. |

{% /tab %}

{% tab label="API v1" %}

The response follows the [standard format][], with a successful result containing the fields of the [Transaction object](../../../protocol/transactions/index.md) as well as the following additional fields:

| `Field`        | Type                             | Description              |
|:---------------|:---------------------------------|:-------------------------|
| `ctid`         | String                           | The transaction's [compact transaction identifier](../../api-conventions/ctid.md). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}New in: rippled 1.12.0{% /badge %} _(Not supported in Clio v2.0 and earlier.)_ |
| `date`         | Number                           | The [close time](../../../../concepts/ledgers/ledger-close-times.md) of the ledger in which the transaction was applied, in [seconds since the Ripple Epoch][]. |
| `hash`         | String                           | The unique [identifying hash][] of the transaction |
| `inLedger`     | Number                           | _(Deprecated)_ Alias for `ledger_index`. |
| `ledger_index` | Number                           | The [ledger index][] of the ledger that includes this transaction. |
| `meta`         | Object (JSON) or String (binary) | [Transaction metadata](../../../protocol/transactions/metadata.md), which describes the results of the transaction. |
| `tx`           | String (binary)                  | (Binary mode) The transaction data represented as a hex string. |
| `validated`    | Boolean                          | If `true`, this data comes from a validated ledger version; if omitted or set to `false`, this data is not final. |
| (Various)      | (Various)                        | Other fields from the [Transaction object](../../../protocol/transactions/index.md) |

{% /tab %}

{% /tabs %}


### Not Found Response

If the server does not find the transaction, it returns a `txnNotFound` error, which could mean two things:

- The transaction has not been included in any ledger version, and has not been executed.
- The transaction was included in a ledger version that the server does not have available.

This means that a `txnNotFound` on its own is not enough to know the [final outcome of a transaction](../../../../concepts/transactions/finality-of-results/index.md).

To further narrow down the possibilities, you can provide a range of ledgers to search using the `min_ledger` and `max_ledger` fields in the request. If you provide **both** of those fields, the `txnNotFound` response includes the following field:

| Field          | Type      | Description                              |
|:---------------|:----------|:-----------------------------------------|
| `searched_all` | Boolean   | _(Omitted unless the request provided `min_ledger` and `max_ledger`)_ If `true`, the server was able to search all of the specified ledger versions, and the transaction was in none of them. If `false`, the server did not have all of the specified ledger versions available, so it is not sure if one of them might contain the transaction. |

An example of a `txnNotFound` response that fully searched a requested range of ledgers:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "error": "txnNotFound",
  "error_code": 29,
  "error_message": "Transaction not found.",
  "id": 1,
  "request": {
    "binary": false,
    "command": "tx",
    "id": 1,
    "max_ledger": 54368673,
    "min_ledger": 54368573,
    "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
  },
  "searched_all": true,
  "status": "error",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "error": "txnNotFound",
    "error_code": 29,
    "error_message": "Transaction not found.",
    "request": {
      "binary": false,
      "command": "tx",
      "max_ledger": 54368673,
      "min_ledger": 54368573,
      "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
    },
    "searched_all": true,
    "status": "error"
  }
}
```
{% /tab %}

{% /tabs %}

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `txnNotFound` - Either the transaction does not exist, or it was part of an ledger version that `rippled` does not have available.
* `excessiveLgrRange` - The `min_ledger` and `max_ledger` fields of the request are more than 1000 apart.
* `invalidLgrRange` - The specified `min_ledger` is larger than the `max_ledger`, or one of those parameters is not a valid ledger index.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
