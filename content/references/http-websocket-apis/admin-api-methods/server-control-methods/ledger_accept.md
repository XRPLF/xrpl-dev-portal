---
html: ledger_accept.html
parent: server-control-methods.html
seo:
    description: Close and advance the ledger in stand-alone mode.
labels:
  - Core Server
---
# ledger_accept
[[Source]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/LedgerAccept.cpp "Source")

The `ledger_accept` method forces the server to close the current-working ledger and move to the next ledger number. This method is intended for testing purposes only, and is only available when the `rippled` server is running stand-alone mode.

*The `ledger_accept` method is an [admin method](../index.md) that cannot be run by unprivileged users!*

### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": "Accept my ledger!",
   "command": "ledger_accept"
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: ledger_accept
rippled ledger_accept
```
{% /tab %}

{% /tabs %}

The request accepts no parameters.

### Response Format

An example of a successful response:
```js
{
  "id": "Accept my ledger!",
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 6643240
  }
}
```

The response follows the [standard format][], with a successful result containing the following field:

| `Field`                | Type             | Description                      |
|:-----------------------|:-----------------|:---------------------------------|
| `ledger_current_index` | Unsigned Integer - [Ledger Index][] | Ledger index of the newly created 'current' ledger |

**Note:** When you close a ledger, `rippled` determines the canonical order of transactions in that ledger and replays them. This can change the outcome of transactions that were provisionally applied to the current ledger.

### Possible Errors

* Any of the [universal error types][].
* `notStandAlone` - If the `rippled` server is not currently running in stand-alone mode.

{% raw-partial file="/_snippets/common-links.md" /%}
