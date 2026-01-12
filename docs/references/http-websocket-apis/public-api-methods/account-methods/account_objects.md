---
seo:
  description: Get all ledger objects owned by an account.
labels:
  - Accounts
  - Data Retention
---

# account_objects

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/AccountObjects.cpp "Source")

The `account_objects` command returns _all_ ledger entries owned by an account, in their raw [ledger format][].

There are other API methods that are specialized for getting certain types of ledger entry, such as the [account_lines method][] for trust lines, or [account_offers method][] for offers. These methods provide a processed view of the data that is more suitable for typical use cases. Use `account_objects` if you want to get ledger entries of types that don't have a specialized method, or if you want to get the entries in their canonical format.

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}

```json
{
  "id": "example_account_objects",
  "command": "account_objects",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated",
  "type": "state",
  "deletion_blockers_only": false,
  "limit": 10
}
```

{% /tab %}

{% tab label="JSON-RPC" %}

```json
{
  "method": "account_objects",
  "params": [
    {
      "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "ledger_index": "validated",
      "type": "state",
      "deletion_blockers_only": false,
      "limit": 10
    }
  ]
}
```

{% /tab %}

{% tab label="Commandline" %}

```sh
#Syntax: account_objects <account> [<ledger>]
rippled account_objects r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated
```

{% /tab %}

{% /tabs %}

{% try-it method="account_objects" /%}

The request includes the following parameters:

| `Field`                  | Type                 | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------------- | :------------------- | :-------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`                | String - [Address][] | Yes       | Get ledger entries associated with this account.                                                                                                                                                                                                                                                                                                                                             |
| `deletion_blockers_only` | Boolean              | No        | If `true`, only return ledger entries that would block this account from [being deleted](../../../../concepts/accounts/deleting-accounts.md). The default is `false`.                                                                                                                                                                                                                        |
| `ledger_hash`            | [Hash][]             | No        | The unique hash of the ledger version to use. (See [Specifying Ledgers][])                                                                                                                                                                                                                                                                                                                   |
| `ledger_index`           | [Ledger Index][]     | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][])                                                                                                                                                                                                                                                               |
| `limit`                  | Number               | No        | The maximum number of ledger entries to include in the results. Must be within the inclusive range `10` to `400` on non-admin connections. The default is `200`.                                                                                                                                                                                                                             |
| `marker`                 | [Marker][]           | No        | Value from a previous paginated response. Resume retrieving data where that response left off.                                                                                                                                                                                                                                                                                               |
| `type`                   | String               | No        | Filter results to a specific type of ledger entry. This field accepts canonical names of [ledger entry types](../../../protocol/ledger-data/ledger-entry-types/index.md) (case insensitive) or [short names](../../api-conventions/ledger-entry-short-names.md). Ledger entry types that can't appear in an owner directory are not allowed. If omitted, return ledger entries of all types. |

{% admonition type="info" name="Note" %}The commandline interface to the `account_objects` command doesn't accept the `type` field. Use the [json method][] to send the JSON-RPC format request on the commandline instead.{% /admonition %}

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_objects/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_objects/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/account_objects/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2025-Aug-14 19:51:30.882061715 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type                      | Description                                                                                                                                                                                                                                                                                                                                                                               |
| :--------------------- | :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`              | String - [Address][]      | The account this request corresponds to.                                                                                                                                                                                                                                                                                                                                                  |
| `account_objects`      | Array                     | Array of ledger entries in this account's owner directory. This includes entries that are owned by this account and entries that are linked to this account but owned by someone else, such as escrows where this account is the destination. Each member is a ledger entry in its raw [ledger format][]. This may contain fewer entries than the maximum specified in the `limit` field. |
| `ledger_hash`          | String                    | _(May be omitted)_ The identifying hash of the ledger that was used to generate this response.                                                                                                                                                                                                                                                                                            |
| `ledger_index`         | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the ledger that was used to generate this response.                                                                                                                                                                                                                                                                                                |
| `ledger_current_index` | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the open ledger that was used to generate this response.                                                                                                                                                                                                                                                                                           |
| `limit`                | Number                    | _(May be omitted)_ The limit that was used in this request, if any.                                                                                                                                                                                                                                                                                                                       |
| `marker`               | [Marker][]                | _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no additional pages after this one.                                                                                                                                                                                   |
| `validated`            | Boolean                   | _(May be omitted)_ If `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change.                                                                                                                                                                                                                                    |

{% admonition type="warning" name="Caution" %}
The `account_objects` array may be empty even if there are additional ledger entries to retrieve. This is especially likely when using `type` to filter ledger entry types. If the response includes a `marker` field, there are additional pages of data; if the response does not include a `marker`, then this is the end of the data. This behavior is a consequence of how the API method iterates through the account's owner directory, and a precaution against requests putting excessive load on the server.
{% /admonition %}

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
- `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
