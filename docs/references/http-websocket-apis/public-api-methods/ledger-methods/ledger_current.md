---
html: ledger_current.html
parent: ledger-methods.html
seo:
    description: Get the current working ledger version.
labels:
  - Blockchain
---
# ledger_current
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerCurrent.cpp "Source")

The `ledger_current` method returns the unique identifiers of the current in-progress [ledger](../../../../concepts/ledgers/index.md). This command is mostly useful for testing, because the ledger returned is still in flux.

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 2,
   "command": "ledger_current"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_current",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: ledger_current
rippled ledger_current
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#ledger_current)

The request contains no parameters.


## Response Format
An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 6643240
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "ledger_current_index": 8696233,
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "ledger_current_index" : 56844050,
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following field:

| `Field`                | Type                                | Description   |
|:-----------------------|:------------------------------------|:--------------|
| `ledger_current_index` | Unsigned Integer - [Ledger Index][] | The ledger index of this ledger version. |

A `ledger_hash` field is not provided, because the hash of the current ledger is constantly changing along with its contents.

## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
