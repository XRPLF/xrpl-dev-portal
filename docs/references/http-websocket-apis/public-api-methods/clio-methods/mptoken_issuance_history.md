---
seo:
    description: Retrieve past transactions for a specified MPT issuance using Clio server's `mptoken_issuance_history` API.
labels:
  - Multi Purpose Tokens, MPTs
---
# mptoken_issuance_history

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/MPTokenIssuanceHistory.cpp "Source")

The `mptoken_issuance_history` command asks the Clio server for past transactions associated with the [MPT](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance being queried. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.8.0" %}New in: Clio v2.8.0{% /badge %}

This API is only available using Clio, not `xrpld`.

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "mptoken_issuance_history",
  "mpt_issuance_id": "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "mptoken_issuance_history",
  "params": [
    {
      "mpt_issuance_id": "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="mptoken_issuance_history" /%}

The request contains the following parameters:

| Field              | Type                       | Required? | Description |
|:-------------------|:---------------------------|:----------|:------------|
| `mpt_issuance_id`  | String                     | Yes       | The 192-bit hexadecimal `MPTokenIssuanceID` of the [MPTokenIssuance entry][] to return transactions for. |
| `account`          | String                     | No        | Return only transactions that affect this account's holding of the issuance. |
| `tx_type`          | String                     | No        | Return only transactions of a specific type, such as `MPTokenIssuanceSet` or `Payment`. Case-insensitive. See [Transaction Types](../../../protocol/transactions/types/index.md#transaction-types). |
| `ledger_index_min` | Integer                    | No        | Use to specify the earliest ledger to include transactions from. A value of `-1` instructs the server to use the earliest validated ledger version available. |
| `ledger_index_max` | Integer                    | No        | Use to specify the most recent ledger to include transactions from. A value of `-1` instructs the server to use the most recent validated ledger version available. |
| `ledger_hash`      | String                     | No        | Use to look for transactions from a single ledger only. (See [Specifying Ledgers][].) |
| `ledger_index`     | String or Unsigned Integer | No        | Use to look for transactions from a single ledger only. Do not specify `closed` or `current`; doing so forwards the request to a P2P `xrpld` server, which does not provide this method. (See [Specifying Ledgers][].) |
| `binary`           | Boolean                    | No        | Defaults to `false`. If set to `true`, returns transactions as hex strings instead of JSON. |
| `forward`          | Boolean                    | No        | Defaults to `false`. If set to `true`, returns values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results might not be internally ordered, but the pages are ordered overall.) |
| `limit`            | UInt32                     | No        | Limit the number of transactions to retrieve. Values are clamped to the range 1 through 100. Defaults to 50. |
| `marker`           | [Marker][]                 | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |

You cannot combine `ledger_hash` or `ledger_index` with `ledger_index_min` or `ledger_index_max`. Doing so returns an `invalidParams` error. If you specify no ledger at all, Clio searches its full range of available ledgers.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/mptoken_issuance_history/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/mptoken_issuance_history/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field              | Type                       | Description |
|:-------------------|:---------------------------|:------------|
| `mpt_issuance_id`  | String                     | The `MPTokenIssuanceID` queried, normalized to uppercase hexadecimal. |
| `ledger_index_min` | Integer - [Ledger Index][] | The ledger index of the earliest ledger actually searched for transactions. |
| `ledger_index_max` | Integer - [Ledger Index][] | The ledger index of the most recent ledger actually searched for transactions. |
| `limit`            | Integer                    | The `limit` value used in the request, after clamping. Omitted if the request did not specify one. |
| `marker`           | [Marker][]                 | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `transactions`     | Array                      | Array of transactions matching the request's criteria, as explained below. |
| `validated`        | Boolean                    | If `true`, the information comes from a validated ledger version. In Clio, this is _always_ true, as Clio stores and returns validated ledger data. |

The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided, for example if it does not have the versions you specified on hand.

Because Clio applies the `tx_type` filter after fetching each page, a page can come back with an empty or short `transactions` array and still include a `marker`. Keep paginating until the response omits the `marker`.

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary": true`) format.

| Field                | Type                             | Description |
|:---------------------|:---------------------------------|:------------|
| `ledger_index`       | Integer                          | The [ledger index][] of the ledger version that included this transaction. |
| `date`               | Integer                          | The close time of the ledger that included this transaction, in [seconds since the Ripple Epoch][]. |
| `meta` (API v1)      | Object (JSON) or String (Binary) | If `binary` is true, this is a hex string of the transaction metadata. Otherwise, the metadata is included in JSON format. |
| `meta_blob` (API v2) | String (Binary)                  | If `binary` is true, this is a hex string of the transaction metadata. Otherwise, the metadata is included as `meta` in JSON format. |
| `tx` (API v1)        | Object                           | (JSON mode only) JSON object defining the transaction. |
| `tx_json` (API v2)   | Object                           | (JSON mode only) JSON object defining the transaction. |
| `tx_blob`            | String                           | (Binary mode only) The transaction, serialized as a hex string. |
| `validated`          | Boolean                          | Whether the transaction is included in a validated ledger. |

For definitions of the fields returned in the `tx` object, see [Transaction Metadata](../../../protocol/transactions/metadata.md).

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing. This includes combining a `ledger_hash` or `ledger_index` with `ledger_index_min` or `ledger_index_max`.
* `actMalformed` - The [Address][] specified in the `account` field of the request is not formatted properly.
* `lgrIdxMalformed` - The ledger specified by `ledger_index_min` or `ledger_index_max` is outside the range of ledgers the server has.
* `lgrIdxsInvalid` - The request specifies a `ledger_index_max` that is before the `ledger_index_min`.
* `lgrNotFound` - The ledger specified by `ledger_hash` or `ledger_index` does not exist, or the server does not have it.
* `notReady` - The server has not finished the transaction-history backfill that this method depends on. Retry later, or use a server that has completed it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
