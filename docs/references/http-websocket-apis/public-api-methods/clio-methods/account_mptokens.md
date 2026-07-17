---
seo:
    description: Get the MPTokens held by a given account as of a given ledger.
labels:
  - Accounts
  - Multi Purpose Tokens, MPTs
---

# account_mptokens

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/AccountMPTokens.cpp "Source")

The `account_mptokens` method returns information about the [MPToken entries][MPToken entry] ledger entries held by a given account, including their balance. This method may return large data sets, so you should expect to implement paging via the `marker` field. This API is only available using Clio, not `xrpld`. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.7.0" %}New in: Clio v2.7.0{% /badge %}

## Request Format

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_mptokens",
  "account": "rLEw4taUYTNLs3ZCv3vyXGmct8PagQ9GcF",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_mptokens",
  "params": [
    {
      "account": "rLEw4taUYTNLs3ZCv3vyXGmct8PagQ9GcF",
      "ledger_index": "validated"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="account_mptokens" /%}

The request contains the following parameters:

| Field          | Type                      | Required? | Description |
|:---------------|:--------------------------|:----------|-------------|
| `account`      | String                    | Yes       | The unique identifier of an account, typically the account's address. |
| `ledger_index` | [Ledger Index][]          | No        | The [Ledger Index][] of the max ledger to use, or a shortcut string to choose a ledger automatically. See [Specifying Ledgers][]. |
| `ledger_hash`  | String                    | No        | A 32-byte hex string for the ledger version to use. See [Specifying Ledgers][]. |
| `marker`       | [Marker][]                | No        | Used to continue your query where it left off in paginating. |
| `limit`        | Number (positive integer) | No        | Specify a limit to the number of `MPTokens` returned. |

## Response Format

{% tabs %}
{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_mptokens/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_mptokens/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with the result containing the following fields:

| Field          | Type             | Description |
|:---------------|:-----------------|:------------|
| `account`      | String           | The address of the account whose MPTokens were queried. |
| `mptokens`     | Array            | An array of [MPToken](#mptoken) objects held by the account. |
| `marker`       | [Marker][]       | Used to continue querying where we left off when paginating. Omitted if there are no more entries after this result. |
| `limit`        | Number           | The limit, as specified in the request. |
| `ledger_hash`  | String           | The hash of the ledger version used to generate this response. |
| `ledger_index` | [Ledger Index][] | The index of the ledger version used to generate this response. |
| `validated`    | Boolean          | If `true`, the ledger has been validated by the consensus process and is immutable. Otherwise, the contents of the ledger are not final and may change. In Clio, this is _always_ true as Clio stores and returns validated ledger data. |

#### MPToken

Each `MPToken` object has the following fields:

| Field             | Type             | Description |
|:------------------|:-----------------|:------------|
| `mpt_id`          | String           | The ledger index (key) of the `MPToken` object. |
| `account`         | String           | The account address of the holder who owns this `MPToken`. |
| `mpt_issuance_id` | String           | The `MPTokenIssuanceID` of the [MPTokenIssuance entry][] that this `MPToken` is associated with. |
| `mpt_amount`      | Number           | The amount of tokens currently held by the account for this issuance. |
| `locked_amount`   | Number           | _(May be omitted)_ The amount of tokens currently held in escrow or otherwise locked. Omitted if the `MPToken` has no locked balance. |
| `mpt_locked`      | Boolean          | _(May be omitted)_ If `true`, the holder's balance of this token is locked. Omitted if not locked. |
| `mpt_authorized`  | Boolean          | _(May be omitted)_ If `true`, the holder is authorized to hold this token. Omitted if not authorized. |

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `actMalformed` - The [Address][] specified in the `account` field of the request is not a valid account address.
- `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
- `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
