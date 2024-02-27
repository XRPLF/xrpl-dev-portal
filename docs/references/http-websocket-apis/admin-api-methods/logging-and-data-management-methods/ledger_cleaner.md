---
html: ledger_cleaner.html
parent: logging-and-data-management-methods.html
seo:
    description: Configure the ledger cleaner service to check for corrupted data.
labels:
  - Data Retention
---
# ledger_cleaner
[[Source]](https://github.com/XRPLF/rippled/blob/df54b47cd0957a31837493cd69e4d9aade0b5055/src/ripple/rpc/handlers/LedgerCleaner.cpp "Source")

The `ledger_cleaner` command controls the [Ledger Cleaner](https://github.com/XRPLF/rippled/blob/f313caaa73b0ac89e793195dcc2a5001786f916f/src/ripple/app/ledger/README.md#the-ledger-cleaner), an asynchronous maintenance process that can find and repair corruption in `rippled`'s database of ledgers.

_The `ledger_cleaner` method is an [admin method](../index.md) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "ledger_cleaner",
    "max_ledger": 13818756,
    "min_ledger": 13818000,
    "stop": false
}
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`       | Type                      | Description                      |
|:--------------|:--------------------------|:---------------------------------|
| `ledger`      | Number - [Ledger Index][] | _(Optional)_ If provided, check and correct the specified ledger only. |
| `max_ledger`  | Number - [Ledger Index][] | _(Optional)_ Configure the ledger cleaner to check ledgers with ledger indexes equal or lower than this. |
| `min_ledger`  | Number - [Ledger Index][] | _(Optional)_ Configure the ledger cleaner to check ledgers with ledger indexes equal or higher than this. |
| `full`        | Boolean                   | _(Optional)_ If true, fix ledger state objects and transactions in the specified ledger(s). Defaults to false. Automatically set to `true` if `ledger` is provided. |
| `fix_txns`    | Boolean                   | _(Optional)_ If true, correct transaction in the specified ledger(s). Overrides `full` if provided. |
| `check_nodes` | Boolean                   | _(Optional)_ If true, correct ledger state objects in the specified ledger(s). Overrides `full` if provided. |
| `stop`        | Boolean                   | _(Optional)_ If true, disable the ledger cleaner. |

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result" : {
      "message" : "Cleaner configured",
      "status" : "success"
   }
}

```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                      |
|:----------|:-------|:---------------------------------|
| `message` | String | `Cleaner configured` on success. |

### Possible Errors

* Any of the [universal error types][].
* `internal` if one the parameters is specified incorrectly. (This is a bug; the intended error code is `invalidParams`.)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
