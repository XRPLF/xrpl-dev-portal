---
html: ledger_closed.html
parent: ledger-methods.html
seo:
    description: Get the latest closed ledger version.
labels:
  - Blockchain
---
# ledger_closed
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerClosed.cpp "Source")

The `ledger_closed` method returns the unique identifiers of the most recently closed ledger. (This ledger is not necessarily validated and immutable yet.)

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 2,
   "command": "ledger_closed"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_closed",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: ledger_closed
rippled ledger_closed
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#ledger_closed)

This method accepts no parameters.

## Response Format
An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_hash": "17ACB57A0F73B5160713E81FE72B2AC9F6064541004E272BD09F257D57C30C02",
    "ledger_index": 6643099
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "ledger_hash": "8B5A0C5F6B198254A6E411AF55C29EE40AA86251D2E78DD0BB17647047FA9C24",
        "ledger_index": 8696231,
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "ledger_hash" : "6F5D3B97F1CAA8440AFCED3CA10FB9DC6472F64DEBC2EFAE7CAE7FC0123F32DA",
      "ledger_index" : 56843991,
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `ledger_hash`  | String           | The unique [Hash][] of this ledger version, in hexadecimal. |
| `ledger_index` | Unsigned Integer | The [ledger index][] of this ledger version.           |

## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
