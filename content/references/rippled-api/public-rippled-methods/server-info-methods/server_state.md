# server_state
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerState.cpp "Source")

The `server_state` command asks the server for various machine-readable information about the `rippled` server's current state. The response is almost the same as the [server_info method][], but uses units that are easier to process instead of easier to read. (For example, XRP values are given in integer drops instead of scientific notation or decimal values, and time is given in milliseconds instead of seconds.)

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "command": "server_state"
}
```

*JSON-RPC*

```
{
    "method": "server_state",
    "params": [
        {}
    ]
}
```

*Commandline*

```
#Syntax: server_state
rippled server_state
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#server_state)

The request does not takes any parameters.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "state": {
      "build_version": "0.30.1-rc3",
      "complete_ledgers": "18611104-18615049",
      "io_latency_ms": 1,
      "last_close": {
        "converge_time": 3003,
        "proposers": 5
      },
      "load": {
        "job_types": [
          {
            "job_type": "untrustedProposal",
            "peak_time": 1,
            "per_second": 3
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand"
          },
          {
            "avg_time": 12,
            "job_type": "writeObjects",
            "peak_time": 345,
            "per_second": 2
          },
          {
            "job_type": "trustedProposal",
            "per_second": 1
          },
          {
            "job_type": "peerCommand",
            "per_second": 64
          },
          {
            "avg_time": 33,
            "job_type": "diskAccess",
            "peak_time": 526
          },
          {
            "job_type": "WriteNode",
            "per_second": 55
          }
        ],
        "threads": 6
      },
      "load_base": 256,
      "load_factor": 256000,
      "peers": 10,
      "pubkey_node": "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa",
      "pubkey_validator": "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
      "server_state": "proposing",
      "server_state_duration_us": 92762334,
      "state_accounting": {
        "connected": {
          "duration_us": "150510079",
          "transitions": 1
        },
        "disconnected": {
          "duration_us": "1827731",
          "transitions": 1
        },
        "full": {
          "duration_us": "168295542987",
          "transitions": 1865
        },
        "syncing": {
          "duration_us": "6294237352",
          "transitions": 1866
        },
        "tracking": {
          "duration_us": "13035524",
          "transitions": 1866
        }
      },
      "uptime": 174748,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 507693650,
        "hash": "FEB17B15FB64E3AF8D371E6AAFCFD8B92775BB80AB953803BD73EA8EC75ECA34",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 18615049
      },
      "validation_quorum": 4,
      "validator_list_expires": 561139596
    }
  }
}
```

*JSON-RPC*

```
200 OK
{
   "result" : {
      "state" : {
         "build_version" : "0.30.1-rc3",
         "complete_ledgers" : "18611104-18615037",
         "io_latency_ms" : 1,
         "last_close" : {
            "converge_time" : 2001,
            "proposers" : 5
         },
         "load" : {
            "job_types" : [
               {
                  "job_type" : "untrustedProposal",
                  "per_second" : 2
               },
               {
                  "in_progress" : 1,
                  "job_type" : "clientCommand"
               },
               {
                  "job_type" : "writeObjects",
                  "per_second" : 2
               },
               {
                  "avg_time" : 2,
                  "job_type" : "acceptLedger",
                  "peak_time" : 6
               },
               {
                  "job_type" : "trustedProposal",
                  "per_second" : 1
               },
               {
                  "job_type" : "peerCommand",
                  "per_second" : 80
               },
               {
                  "job_type" : "diskAccess",
                  "per_second" : 1
               },
               {
                  "job_type" : "WriteNode",
                  "per_second" : 91
               }
            ],
            "threads" : 6
         },
         "load_base" : 256,
         "load_factor" : 256000,
         "peers" : 10,
         "pubkey_node" : "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa",
         "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
         "server_state" : "proposing",
         "server_state_duration_us": 708078257,
         "state_accounting" : {
            "connected" : {
               "duration_us" : "150510079",
               "transitions" : 1
            },
            "disconnected" : {
               "duration_us" : "1827731",
               "transitions" : 1
            },
            "full" : {
               "duration_us" : "168241260112",
               "transitions" : 1865
            },
            "syncing" : {
               "duration_us" : "6294237352",
               "transitions" : 1866
            },
            "tracking" : {
               "duration_us" : "13035524",
               "transitions" : 1866
            }
         },
         "uptime" : 174693,
         "validated_ledger" : {
            "base_fee" : 10,
            "close_time" : 507693592,
            "hash" : "1C26209AE593C7EB5123363B3152D86514845FBD42CC6B05111D57F62D02B113",
            "reserve_base" : 20000000,
            "reserve_inc" : 5000000,
            "seq" : 18615037
         },
         "validation_quorum" : 4,
         "validator_list_expires" : 561139596
      },
      "status" : "success"
   }
}

```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing a `state` object as its only field.

The `state` object may have some arrangement of the following fields:

| `Field`                          | Type             | Description            |
|:---------------------------------|:-----------------|:-----------------------|
| `amendment_blocked`              | Boolean          | _(May be omitted)_ If `true`, this server is [amendment blocked](amendments.html#amendment-blocked). If the server is not amendment blocked, the response omits this field. [New in: rippled 0.80.0][] |
| `build_version`                  | String           | The version number of the running `rippled` version. |
| `complete_ledgers`               | String           | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. It is possible to be a disjoint sequence, e.g. "2500-5000,32570-7695432". If the server does not have any complete ledgers (for example, it just started syncing with the network), this is the string `empty`. |
| `closed_ledger`                  | Object           | (May be omitted) Information on the most recently closed ledger that has not been validated by consensus. If the most recently validated ledger is available, the response omits this field and includes `validated_ledger` instead. The member fields are the same as the `validated_ledger` field. |
| `io_latency_ms`                  | Number           | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `load`                           | Object           | _(Admin only)_ Detailed information about the current load state of the server |
| `load.job_types`                 | Array            | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                   | Number           | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_base`                      | Integer          | This is the baseline amount of server load used in [transaction cost](transaction-cost.html) calculations. If the `load_factor` is equal to the `load_base` then only the base transaction cost is enforced. If the `load_factor` is higher than the `load_base`, then transaction costs are multiplied by the ratio between them. For example, if the `load_factor` is double the `load_base`, then transaction costs are doubled. |
| `load_factor`                    | Number           | The load factor the server is currently enforcing. The ratio between this value and the `load_base` determines the multiplier for transaction costs. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost), and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `load_factor_fee_escalation`     | Integer          | (May be omitted) The current multiplier to the [transaction cost][] to get into the open ledger, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_fee_queue`          | Integer          | (May be omitted) The current multiplier to the [transaction cost][] to get into the queue, if the queue is full, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_fee_reference`      | Integer          | (May be omitted) The [transaction cost][] with no load scaling, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_server`             | Number           | (May be omitted) The load factor the server is enforcing, not including the [open ledger cost](transaction-cost.html#open-ledger-cost). [New in: rippled 0.33.0][] |
| `peers`                          | Number           | How many other `rippled` servers this one is currently connected to. |
| `pubkey_node`                    | String           | Public key used to verify this server for peer-to-peer communications. This _node key pair_ is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](clustering.html). |
| `pubkey_validator`               | String           | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `server_state`                   | String           | A string indicating to what extent the server is participating in the network. See [Possible Server States](rippled-server-states.html) for more details. |
| `server_state_duration_us` | Number | The number of consecutive microseconds the server has been in the current state. [New in: rippled 1.2.0][] |
| `state_accounting`               | Object           | A map of various [server states](rippled-server-states.html) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. [New in: rippled 0.30.1][] |
| `state_accounting.*.duration_us` | String           | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) [New in: rippled 0.30.1][] |
| `state_accounting.*.transitions` | Number           | The number of times the server has transitioned into this state. [New in: rippled 0.30.1][] |
| `uptime`                         | Number           | Number of consecutive seconds that the server has been operational. [New in: rippled 0.30.1][] |
| `validated_ledger`               | Object           | _(May be omitted)_ Information about the most recent fully-validated ledger. If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validated_ledger.base_fee`      | Unsigned Integer | Base fee, in drops of XRP, for propagating a transaction to the network. |
| `validated_ledger.close_time`    | Number           | Time this ledger was closed, in [seconds since the Ripple Epoch][] |
| `validated_ledger.hash`          | String           | Unique hash of this ledger version, as hex |
| `validated_ledger.reserve_base`  | Unsigned Integer | The minimum [account reserve](reserves.html), as of the most recent validated ledger version. |
| `validated_ledger.reserve_inc`   | Unsigned Integer | The [owner reserve](reserves.html) for each item an account owns, as of the most recent validated ledger version. |
| `validated_ledger.seq`           | Unsigned Integer | The [ledger index][] of the most recently validated ledger version. |
| `validation_quorum`              | Number           | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires`         | Number           | _(Admin only)_ When the current validator list will expire, in [seconds since the Ripple Epoch][], or 0 if the server has yet to load a published validator list. [New in: rippled 0.80.1][] |


## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
