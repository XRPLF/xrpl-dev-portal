---
seo:
    description: Get past transactions associated with a given MPT issuance.
labels:
  - Multi Purpose Tokens, MPTs
---
# mptoken_issuance_history
[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/MPTokenIssuanceHistory.cpp "Source")

The `mptoken_issuance_history` method returns past transactions associated with a given [MPT](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance, optionally filtered by an affected account or a transaction type. This API is only available using Clio, not `xrpld`. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.8.1" %}New in: Clio v2.8.1{% /badge %}

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_mptoken_issuance_history",
  "command": "mptoken_issuance_history",
  "mpt_issuance_id": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
  "tx_type": "MPTokenIssuanceCreate",
  "limit": 5,
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "mptoken_issuance_history",
  "params": [
    {
      "mpt_issuance_id": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
      "tx_type": "MPTokenIssuanceCreate",
      "limit": 5,
      "api_version": 2
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="mptoken_issuance_history" /%}

The request contains the following parameters:

| Field              | Type                       | Required? | Description |
|:-------------------|:---------------------------|:----------|-------------|
| `mpt_issuance_id`  | String                     | Yes       | The 192-bit hexadecimal `MPTokenIssuanceID` of the [MPTokenIssuance entry][] to query. |
| `account`          | String                     | No        | Return only transactions that affect this [address][Address]. |
| `tx_type`          | String                     | No        | Return only transactions of a specific type, such as `MPTokenIssuanceCreate` or `MPTokenAuthorize`. Case-insensitive. See [Transaction Types](../../../protocol/transactions/types/index.md#transaction-types). |
| `ledger_index_min` | Integer                    | No        | The earliest ledger to include transactions from. A value of `-1` instructs the server to use the earliest validated ledger version available. |
| `ledger_index_max` | Integer                    | No        | The most recent ledger to include transactions from. A value of `-1` instructs the server to use the most recent validated ledger version available. |
| `ledger_hash`      | String                     | No        | Look for transactions from a single ledger only, identified by its 32-byte hex hash. See [Specifying Ledgers][]. |
| `ledger_index`     | String or Unsigned Integer | No        | Look for transactions from a single ledger only, identified by its [ledger index][] or a shortcut string. Do not specify `closed` or `current`; doing so forwards the request to the `xrpld` server, which does not provide this method. |
| `binary`           | Boolean                    | No        | Defaults to `false`. If `true`, returns transactions as hex strings instead of JSON. |
| `forward`          | Boolean                    | No        | Defaults to `false`. If `true`, returns values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results might not be internally ordered, but the pages are ordered overall.) |
| `limit`            | Number (positive integer)  | No        | Limit the number of transactions to retrieve, from 1 to 100. Defaults to 50. |
| `marker`           | [Marker][]                 | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |

## Response Format

An example of a successful response:

{% code-snippet file="/_api-examples/mptoken_issuance_history/ws-response.json" language="json" /%}

### Response Fields

The response follows the [standard format][], with a successful result containing the following fields:

| Field              | Type                       | Description |
|:-------------------|:---------------------------|:------------|
| `mpt_issuance_id`  | String                     | The `MPTokenIssuanceID` that was queried. |
| `ledger_index_min` | Integer - [Ledger Index][] | The ledger index of the earliest ledger actually searched for transactions. |
| `ledger_index_max` | Integer - [Ledger Index][] | The ledger index of the most recent ledger actually searched for transactions. |
| `transactions`     | Array                      | Array of transactions matching the request's criteria. See [Transaction Object](#transaction-object). |
| `limit`            | Number                     | _(May be omitted)_ The `limit` value used in the request. This can differ from the limit the server actually enforced. |
| `marker`           | [Marker][]                 | _(May be omitted)_ Use this value in a follow-up request to resume where the response left off. Omitted if there are no more transactions to return. |
| `validated`        | Boolean                    | If `true`, the transactions come from validated ledger versions. In Clio, this is always `true` because Clio only serves validated data. |

{% admonition type="info" name="Note" %}The server can respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand.{% /admonition %}

#### Transaction Object

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary": true`) format.

| Field                     | Type                             | Description |
|:--------------------------|:---------------------------------|:------------|
| `close_time_iso` (API v2) | String                           | The close time of the ledger that included this transaction, in ISO 8601 time format. |
| `hash` (API v2)           | String                           | The identifying hash of the transaction. |
| `ledger_hash` (API v2)    | String                           | The identifying hash of the ledger version that included this transaction. |
| `ledger_index`            | Integer                          | The [ledger index][] of the ledger version that included this transaction. |
| `meta` (API v1)           | Object (JSON) or String (Binary) | If `binary` is `true`, this is a hex string of the transaction metadata. Otherwise, the transaction metadata is included in JSON format. |
| `meta_blob` (API v2)      | String                           | (Binary mode only) A hex string of the transaction metadata. |
| `tx` (API v1)             | Object                           | (JSON mode only) JSON object defining the transaction. |
| `tx_json` (API v2)        | Object                           | (JSON mode only) JSON object defining the transaction. |
| `tx_blob`                 | String                           | (Binary mode only) A hex string of the transaction. |
| `validated`               | Boolean                          | Whether or not the transaction is included in a validated ledger. |

For definitions of the fields returned in the transaction metadata, see [Transaction Metadata](../../../protocol/transactions/metadata.md).

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `actMalformed` - The [Address][] specified in the `account` field of the request is not formatted properly.
- `lgrIdxMalformed` - The ledger specified by `ledger_index_min` or `ledger_index_max` is outside the range of ledgers the server has available.
- `lgrIdxsInvalid` - The request specifies a `ledger_index_max` that is before the `ledger_index_min`.
- `notReady` - The server has not finished backfilling the transaction history that this method requires. Try again later, or use a different server.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
