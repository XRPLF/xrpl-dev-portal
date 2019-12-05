# fee
[[Source]](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/Fee1.cpp "Source")

The `fee` command reports the current state of the open-ledger requirements for the [transaction cost](transaction-cost.html). This requires the [FeeEscalation amendment][] to be enabled. [New in: rippled 0.31.0][]

This is a public command available to unprivileged users. [Updated in: rippled 0.32.0][]

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": "fee_websocket_example",
  "command": "fee"
}
```

*JSON-RPC*

```
{
    "method": "fee",
    "params": [{}]
}
```

*Commandline*

```
#Syntax: fee
rippled fee
```

<!-- MULTICODE_BLOCK_END -->

The request does not include any parameters.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": "fee_websocket_example",
  "status": "success",
  "type": "response",
  "result": {
    "current_ledger_size": "14",
    "current_queue_size": "0",
    "drops": {
      "base_fee": "10",
      "median_fee": "11000",
      "minimum_fee": "10",
      "open_ledger_fee": "10"
    },
    "expected_ledger_size": "24",
    "ledger_current_index": 26575101,
    "levels": {
      "median_level": "281600",
      "minimum_level": "256",
      "open_ledger_level": "256",
      "reference_level": "256"
    },
    "max_queue_size": "480"
  }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "current_ledger_size": "56",
        "current_queue_size": "11",
        "drops": {
            "base_fee": "10",
            "median_fee": "10000",
            "minimum_fee": "10",
            "open_ledger_fee": "2653937"
        },
        "expected_ledger_size": "55",
        "ledger_current_index": 26575101,
        "levels": {
            "median_level": "256000",
            "minimum_level": "256",
            "open_ledger_level": "67940792",
            "reference_level": "256"
        },
        "max_queue_size": "1100",
        "status": "success"
    }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "current_ledger_size" : "16",
      "current_queue_size" : "2",
      "drops" : {
         "base_fee" : "10",
         "median_fee" : "11000",
         "minimum_fee" : "10",
         "open_ledger_fee" : "3203982"
      },
      "expected_ledger_size" : "15",
      "ledger_current_index": 26575101,
      "levels" : {
         "median_level" : "281600",
         "minimum_level" : "256",
         "open_ledger_level" : "82021944",
         "reference_level" : "256"
      },
      "max_queue_size" : "300",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                    | Type             | Description                  |
|:---------------------------|:-----------------|:-----------------------------|
| `current_ledger_size`      | String (Integer) | Number of transactions provisionally included in the in-progress ledger. |
| `current_queue_size`       | String (Integer) | Number of transactions currently queued for the next ledger. |
| `drops`                    | Object           | Various information about the transaction cost (the `Fee` field of a transaction), in [drops of XRP][]. |
| `drops.base_fee`           | String (Integer) | The transaction cost required for a [reference transaction](transaction-cost.html#reference-transaction-cost) to be included in a ledger under minimum load, represented in drops of XRP. |
| `drops.median_fee`         | String (Integer) | An approximation of the median transaction cost among transactions included in the previous validated ledger, represented in drops of XRP. |
| `drops.minimum_fee`        | String (Integer) | The minimum transaction cost for a [reference transaction](transaction-cost.html#reference-transaction-cost) to be queued for a later ledger, represented in drops of XRP. If greater than `base_fee`, the transaction queue is full. |
| `drops.open_ledger_fee`    | String (Integer) | The minimum transaction cost that a [reference transaction](transaction-cost.html#reference-transaction-cost) must pay to be included in the current open ledger, represented in drops of XRP. |
| `expected_ledger_size`     | String (Integer) | The approximate number of transactions expected to be included in the current ledger. This is based on the number of transactions in the previous ledger. |
| `ledger_current_index`     | Number           | The [Ledger Index][] of the current open ledger these stats describe. [New in: rippled 0.50.0][] |
| `levels`                   | Object           | Various information about the transaction cost, in [fee levels][]. The ratio in fee levels applies to any transaction relative to the minimum cost of that particular transaction. |
| `levels.median_level`      | String (Integer) | The median transaction cost among transactions in the previous validated ledger, represented in [fee levels][]. |
| `levels.minimum_level`     | String (Integer) | The minimum transaction cost required to be queued for a future ledger, represented in [fee levels][]. |
| `levels.open_ledger_level` | String (Integer) | The minimum transaction cost required to be included in the current open ledger, represented in [fee levels][]. |
| `levels.reference_level`   | String (Integer) | The equivalent of the minimum transaction cost, represented in [fee levels][]. |
| `max_queue_size`           | String (Integer) | The maximum number of transactions that the [transaction queue](transaction-cost.html#queued-transactions) can currently hold. |

## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
