---
seo:
    description: Find a path for a payment between two accounts and receive updates.
labels:
    - Cross-Currency
    - Tokens
---
# path_find
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/PathFind.cpp "Source")

*WebSocket API only!* The `path_find` method searches for a [path](../../../../concepts/tokens/fungible-tokens/paths.md) along which a transaction can possibly be made, and periodically sends updates when the path changes over time. For a simpler version that is supported by JSON-RPC, see the [ripple_path_find method][]. For payments occurring strictly in XRP, it is not necessary to find a path, because XRP can be sent directly to any account.

There are three different modes, or sub-commands, of the path_find command. Specify which one you want with the `subcommand` parameter:

* `create` - Start sending pathfinding information
* `close` - Stop sending pathfinding information
* `status` - Get the information of the currently-open pathfinding request

Although the `rippled` server tries to find the cheapest path or combination of paths for making a payment, it is not guaranteed that the paths returned by this method are, in fact, the best paths. Due to server load, pathfinding may not find the best results. Additionally, you should be careful with the pathfinding results from untrusted servers. A server could be modified to return less-than-optimal paths to earn money for its operators. If you do not have your own server that you can trust with pathfinding, you should compare the results of pathfinding from multiple servers run by different parties, to minimize the risk of a single server returning poor results. (**Note:** A server returning less-than-optimal results is not necessarily proof of malicious behavior; it could also be a symptom of heavy server load.)

## path_find create

The `create` sub-command of `path_find` creates an ongoing request to find possible paths along which a payment transaction could be made from one specified account such that another account receives a desired amount of some currency. The initial response contains a suggested path between the two addresses that would result in the desired amount being received. After that, the server sends additional messages, with `"type": "path_find"`, with updates to the potential paths. The frequency of updates is left to the discretion of the server, but it usually means once every few seconds when there is a new ledger version.

A client can only have one pathfinding request open at a time. If another pathfinding request is already open on the same connection, the old request is automatically closed and replaced with the new request.

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 8,
    "command": "path_find",
    "subcommand": "create",
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_amount": {
        "value": "0.001",
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
}
```
{% /tab %}

{% /tabs %}

{% try-it method="path_find" /%}

The request includes the following parameters:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|:------------|
| `subcommand`          | String               | Yes       | Use `"create"` to send the create sub-command |
| `source_account`      | String - [Address][] | Yes       | The account to find a path from. (In other words, the account that would be sending a payment.) |
| `destination_account` | String - [Address][] | Yes       | The account to find a path to. (In other words, the account that would receive a payment.) |
| `destination_amount`  | [Currency Amount][]  | Yes       | How much the destination account would receive. **Special case:** You can specify `"-1"` (for XRP) or provide -1 as the contents of the `value` field (for tokens). This requests a path to deliver as much as possible, while spending no more than the amount specified in `send_max` (if provided). |
| `domain`              | String - [Hash][]    | No        | The ledger entry ID of a permissioned domain. If provided, only return paths that use the corresponding [permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md). {% amendment-disclaimer name="PermissionedDEX" /%} |
| `paths`               | Array                | No        | Array of arrays of objects, representing [payment paths](../../../../concepts/tokens/fungible-tokens/paths.md) to check. You can use this to keep updated on changes to particular paths you already know about, or to check the overall cost to make a payment along a certain path. |
| `send_max`            | [Currency Amount][]  | No        | Maximum amount that would be spent. Not compatible with `source_currencies`.  |

The server also recognizes the following fields, but the results of using them are not guaranteed: `source_currencies`, `bridges`. These fields should be considered reserved for future use.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/path_find/create-response.json" /%}
{% /tab %}

{% /tabs %}

The initial response follows the [standard format](../../api-conventions/response-formatting.md), with a successful result containing the following fields:

| Field                 | Type                 | Description                       |
|:----------------------|:---------------------|:----------------------------------|
| `alternatives`        | Array                | Array of objects with suggested [paths](../../../../concepts/tokens/fungible-tokens/paths.md) to take, as described below. If empty, then no paths were found connecting the source and destination accounts. |
| `destination_account` | String - [Address][] | The account that would receive a transaction. |
| `destination_amount`  | [Currency Amount][]  | How much the destination would receive in a transaction. |
| `source_account`      | String - [Address][] | The account that would send a transaction. |
| `full_reply`          | Boolean              | If `false`, this is the result of an incomplete search. A later reply may have a better path. If `true`, then this is the best path found. (It is still theoretically possible that a better path could exist, but `rippled` won't find it.) Until you close the pathfinding request, `rippled` continues to send updates each time a new ledger closes. |

Each element in the `alternatives` array is an object that represents a path from one possible source currency (held by the initiating account) to the destination account and currency. This object has the following fields:

| Field                | Type                | Description                            |
|:---------------------|:--------------------|:---------------------------------------|
| `paths_computed`     | Array               | Array of arrays of objects defining [payment paths](../../../../concepts/tokens/fungible-tokens/paths.md) |
| `source_amount`      | [Currency Amount][] | How much the source would have to send along this path for the destination to receive the desired amount. |
| `destination_amount` | [Currency Amount][] | _(May be omitted)_ How much the destination would receive along this path. Only included if the `destination_amount` from the request was the "-1" special case. |

### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noEvents` - You are using a protocol that does not support asynchronous callbacks, for example JSON-RPC. (See the [ripple_path_find method][] for a pathfinding method that _is_ compatible with JSON-RPC.)

### Asynchronous Follow-ups

In addition to the initial response, the server sends more messages in a similar format to update on the status of [payment paths](../../../../concepts/tokens/fungible-tokens/paths.md) over time. These messages include the `id` of the original WebSocket request so you can tell which request prompted them, and the field `"type": "path_find"` at the top level to indicate that they are additional responses. The other fields are defined in the same way as the initial response.

If the follow-up includes `"full_reply": true`, then this is the best path that rippled can find as of the current ledger.

Here is an example of an asynchronous follow-up from a path_find create request:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/path_find/create-followup.json" /%}
{% /tab %}

{% /tabs %}

## path_find close

The `close` sub-command of `path_find` instructs the server to stop sending information about the current open pathfinding request.

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 57,
  "command": "path_find",
  "subcommand": "close"
}
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| Field        | Type   | Description                                |
|:-------------|:-------|:-------------------------------------------|
| `subcommand` | String | Use `"close"` to send the close sub-command |

### Response Format

If a pathfinding request was successfully closed, the response follows the same format as the initial response to [`path_find create`](#path_find-create), plus the following field:

| Field    | Type    | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `closed` | Boolean | The value `true` indicates this reply is in response to a `path_find close` command. |

If there was no outstanding pathfinding request, an error is returned instead.

### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - If any fields are specified incorrectly, or any required fields are missing.
* `noEvents` - If you tried to use this method on a protocol that does not support asynchronous callbacks, for example JSON-RPC. (See the [ripple_path_find method][] for a pathfinding method that _is_ compatible with JSON-RPC.)
* `noPathRequest` - You tried to close a pathfinding request when there is not an open one.

## path_find status

The `status` sub-command of `path_find` requests an immediate update about the client's currently-open pathfinding request.

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 58,
  "command": "path_find",
  "subcommand": "status"
}
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| Field        | Type   | Description                                  |
|:-------------|:-------|:---------------------------------------------|
| `subcommand` | String | Use `"status"` to send the status sub-command |

### Response Format

If a pathfinding request is open, the response follows the same format as the initial response to [`path_find create`](#path_find-create), plus the following field:

| Field    | Type    | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `status` | Boolean | The value `true` indicates this reply is in response to a `path_find status` command. |

If there was no outstanding pathfinding request, an error is returned instead.

### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noEvents` - You are using a protocol that does not support asynchronous callbacks, for example JSON-RPC. (See the [ripple_path_find method][] for a pathfinding method that _is_ compatible with JSON-RPC.)
* `noPathRequest` - You tried to check the status of a pathfinding request when there is not an open one.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
