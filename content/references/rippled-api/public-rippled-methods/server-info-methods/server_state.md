---
html: server_state.html
parent: server-info-methods.html
blurb: Retrieve status of the server in machine-readable format.
---
# server_state
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerState.cpp "Source")

The `server_state` command asks the server for various machine-readable information about the `rippled` server's current state. The response is almost the same as the [server_info method][], but uses units that are easier to process instead of easier to read. (For example, XRP values are given in integer drops instead of scientific notation or decimal values, and time is given in milliseconds instead of seconds.)

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 2,
  "command": "server_state"
}
```

*JSON-RPC*

```json
{
    "method": "server_state",
    "params": [
        {}
    ]
}
```

*Commandline*

```sh
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

```json
{
  "id": 1,
  "result": {
    "state": {
      "build_version": "1.5.0-rc1",
      "complete_ledgers": "54300020-54300697",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time": 3001,
        "proposers": 34
      },
      "load": {
        "job_types": [
          {
            "avg_time": 5,
            "job_type": "untrustedValidation",
            "peak_time": 21
          },
          {
            "job_type": "ledgerRequest",
            "peak_time": 9,
            "per_second": 3
          },
          {
            "job_type": "untrustedProposal",
            "peak_time": 26,
            "per_second": 45
          },
          {
            "avg_time": 15,
            "job_type": "ledgerData",
            "peak_time": 105,
            "per_second": 1
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand",
            "peak_time": 50,
            "per_second": 8
          },
          {
            "avg_time": 1,
            "job_type": "transaction",
            "peak_time": 35,
            "per_second": 8
          },
          {
            "job_type": "batch",
            "peak_time": 5,
            "per_second": 6
          },
          {
            "avg_time": 4,
            "job_type": "advanceLedger",
            "peak_time": 65,
            "per_second": 2
          },
          {
            "job_type": "fetchTxnData",
            "per_second": 3
          },
          {
            "avg_time": 7,
            "job_type": "trustedValidation",
            "peak_time": 49,
            "per_second": 6
          },
          {
            "job_type": "trustedProposal",
            "peak_time": 20,
            "per_second": 14
          },
          {
            "job_type": "clusterReport",
            "peak_time": 2
          },
          {
            "job_type": "heartbeat",
            "peak_time": 1
          },
          {
            "job_type": "peerCommand",
            "per_second": 1334
          },
          {
            "job_type": "processTransaction",
            "per_second": 8
          },
          {
            "job_type": "SyncReadNode",
            "peak_time": 6,
            "per_second": 35
          },
          {
            "job_type": "AsyncReadNode",
            "peak_time": 13,
            "per_second": 1104
          },
          {
            "job_type": "WriteNode",
            "peak_time": 12,
            "per_second": 976
          }
        ],
        "threads": 6
      },
      "load_base": 256,
      "load_factor": 256,
      "load_factor_fee_escalation": 256,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "55",
      "peer_disconnects_resources": "1",
      "peers": 21,
      "pubkey_node": "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
      "pubkey_validator": "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "server_state": "proposing",
      "server_state_duration_us": "1727270915",
      "state_accounting": {
        "connected": {
          "duration_us": "128124609",
          "transitions": 1
        },
        "disconnected": {
          "duration_us": "2290325",
          "transitions": 1
        },
        "full": {
          "duration_us": "1727270915",
          "transitions": 1
        },
        "syncing": {
          "duration_us": "3083023",
          "transitions": 1
        },
        "tracking": {
          "duration_us": "0",
          "transitions": 1
        }
      },
      "time": "2020-Mar-24 01:25:38.448364 UTC",
      "uptime": 1860,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 638328331,
        "hash": "A63E850343B9F06CFE637648FF3D46DBAB7B1E41BA6B9A26FA72AA706D82233D",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 54300697
      },
      "validation_quorum": 29,
      "validator_list_expires": 639792000
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
200 OK

{
  "result": {
    "state": {
      "build_version": "1.5.0-rc1",
      "complete_ledgers": "54300020-54300761",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time": 3000,
        "proposers": 34
      },
      "load": {
        "job_types": [
          {
            "job_type": "ledgerRequest",
            "per_second": 2
          },
          {
            "job_type": "untrustedProposal",
            "peak_time": 1,
            "per_second": 41
          },
          {
            "avg_time": 5,
            "job_type": "ledgerData",
            "peak_time": 42,
            "per_second": 1
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand",
            "per_second": 7
          },
          {
            "job_type": "transaction",
            "per_second": 9
          },
          {
            "job_type": "batch",
            "peak_time": 8,
            "per_second": 7
          },
          {
            "job_type": "advanceLedger",
            "peak_time": 12,
            "per_second": 1
          },
          {
            "job_type": "fetchTxnData",
            "per_second": 5
          },
          {
            "job_type": "trustedValidation",
            "peak_time": 7,
            "per_second": 7
          },
          {
            "job_type": "trustedProposal",
            "per_second": 14
          },
          {
            "job_type": "peerCommand",
            "per_second": 1461
          },
          {
            "job_type": "processTransaction",
            "per_second": 9
          },
          {
            "job_type": "SyncReadNode",
            "per_second": 4
          },
          {
            "job_type": "AsyncReadNode",
            "peak_time": 21,
            "per_second": 124
          },
          {
            "job_type": "WriteNode",
            "peak_time": 7,
            "per_second": 278
          }
        ],
        "threads": 6
      },
      "load_base": 256,
      "load_factor": 256,
      "load_factor_fee_escalation": 256,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "61",
      "peer_disconnects_resources": "1",
      "peers": 20,
      "pubkey_node": "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
      "pubkey_validator": "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "server_state": "proposing",
      "server_state_duration_us": "1974824750",
      "state_accounting": {
        "connected": {
          "duration_us": "128124609",
          "transitions": 1
        },
        "disconnected": {
          "duration_us": "2290325",
          "transitions": 1
        },
        "full": {
          "duration_us": "1974824750",
          "transitions": 1
        },
        "syncing": {
          "duration_us": "3083023",
          "transitions": 1
        },
        "tracking": {
          "duration_us": "0",
          "transitions": 1
        }
      },
      "time": "2020-Mar-24 01:29:46.002417 UTC",
      "uptime": 2108,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 638328581,
        "hash": "E262523CB2579D3E1F66DEBBDCC3D7E9E7E3D88B0B45F9D5640C92766934C855",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 54300761
      },
      "validation_quorum": 29,
      "validator_list_expires": 639792000
    },
    "status": "success"
  }
}
```

*Commandline*

```json
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Mar-24 01:30:08.646201720 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "state" : {
         "build_version" : "1.5.0-rc1",
         "complete_ledgers" : "54300020-54300767",
         "io_latency_ms" : 1,
         "jq_trans_overflow" : "0",
         "last_close" : {
            "converge_time" : 3143,
            "proposers" : 34
         },
         "load" : {
            "job_types" : [
               {
                  "job_type" : "untrustedProposal",
                  "peak_time" : 14,
                  "per_second" : 44
               },
               {
                  "avg_time" : 6,
                  "job_type" : "ledgerData",
                  "peak_time" : 252,
                  "per_second" : 3
               },
               {
                  "in_progress" : 1,
                  "job_type" : "clientCommand",
                  "peak_time" : 3,
                  "per_second" : 10
               },
               {
                  "avg_time" : 2,
                  "job_type" : "transaction",
                  "peak_time" : 61,
                  "per_second" : 10
               },
               {
                  "job_type" : "batch",
                  "peak_time" : 11,
                  "per_second" : 7
               },
               {
                  "avg_time" : 4,
                  "job_type" : "advanceLedger",
                  "peak_time" : 128,
                  "per_second" : 10
               },
               {
                  "job_type" : "fetchTxnData",
                  "per_second" : 4
               },
               {
                  "avg_time" : 11,
                  "job_type" : "writeAhead",
                  "peak_time" : 43
               },
               {
                  "avg_time" : 2,
                  "job_type" : "trustedValidation",
                  "peak_time" : 107,
                  "per_second" : 11
               },
               {
                  "avg_time" : 41,
                  "job_type" : "acceptLedger",
                  "peak_time" : 112
               },
               {
                  "job_type" : "trustedProposal",
                  "per_second" : 14
               },
               {
                  "avg_time" : 131,
                  "job_type" : "sweep",
                  "peak_time" : 523
               },
               {
                  "avg_time" : 36,
                  "job_type" : "heartbeat",
                  "peak_time" : 144
               },
               {
                  "job_type" : "peerCommand",
                  "per_second" : 1594
               },
               {
                  "job_type" : "processTransaction",
                  "per_second" : 10
               },
               {
                  "job_type" : "SyncReadNode",
                  "per_second" : 128
               },
               {
                  "job_type" : "AsyncReadNode",
                  "per_second" : 3346
               },
               {
                  "job_type" : "WriteNode",
                  "per_second" : 2275
               }
            ],
            "threads" : 6
         },
         "load_base" : 256,
         "load_factor" : 256,
         "load_factor_fee_escalation" : 256,
         "load_factor_fee_queue" : 256,
         "load_factor_fee_reference" : 256,
         "load_factor_server" : 256,
         "peer_disconnects" : "61",
         "peer_disconnects_resources" : "1",
         "peers" : 21,
         "pubkey_node" : "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
         "pubkey_validator" : "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
         "server_state" : "proposing",
         "server_state_duration_us" : "1997468900",
         "state_accounting" : {
            "connected" : {
               "duration_us" : "128124609",
               "transitions" : 1
            },
            "disconnected" : {
               "duration_us" : "2290325",
               "transitions" : 1
            },
            "full" : {
               "duration_us" : "1997468900",
               "transitions" : 1
            },
            "syncing" : {
               "duration_us" : "3083023",
               "transitions" : 1
            },
            "tracking" : {
               "duration_us" : "0",
               "transitions" : 1
            }
         },
         "time" : "2020-Mar-24 01:30:08.646564 UTC",
         "uptime" : 2130,
         "validated_ledger" : {
            "base_fee" : 10,
            "close_time" : 638328602,
            "hash" : "835B1EDFA0D4B7BDE1F5030D1B5FBE98C122ABB9C34FE8889B77CD635766C1B5",
            "reserve_base" : 20000000,
            "reserve_inc" : 5000000,
            "seq" : 54300767
         },
         "validation_quorum" : 29,
         "validator_list_expires" : 639792000
      },
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing a `state` object as its only field.

The `state` object may have some arrangement of the following fields:

| `Field`                          | Type            | Description             |
|:---------------------------------|:----------------|:------------------------|
| `amendment_blocked`              | Boolean         | _(May be omitted)_ If `true`, this server is [amendment blocked](amendments.html#amendment-blocked). If the server is not amendment blocked, the response omits this field. [New in: rippled 0.80.0][] |
| `build_version`                  | String          | The version number of the running `rippled` version. |
| `complete_ledgers`               | String          | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. It is possible to be a disjoint sequence, e.g. "2500-5000,32570-7695432". If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string `empty`. |
| `closed_ledger`                  | Object          | _(May be omitted)_ Information on the most recently closed ledger that has not been validated by consensus. If the most recently validated ledger is available, the response omits this field and includes `validated_ledger` instead. The member fields are the same as the `validated_ledger` field. |
| `io_latency_ms`                  | Number          | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `jq_trans_overflow`              | String - Number | The number of times this server has had over 250 transactions waiting to be processed at once. A large number here may mean that your server is unable to handle the transaction load of the XRP Ledger network. For detailed recommendations of future-proof server specifications, see [Capacity Planning](capacity-planning.html). [New in: rippled 0.90.0][] |
| `load`                           | Object          | _(Admin only)_ Detailed information about the current load state of the server. |
| `load.job_types`                 | Array           | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                   | Number          | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_base`                      | Integer         | This is the baseline amount of server load used in [transaction cost](transaction-cost.html) calculations. If the `load_factor` is equal to the `load_base` then only the base transaction cost is enforced. If the `load_factor` is higher than the `load_base`, then transaction costs are multiplied by the ratio between them. For example, if the `load_factor` is double the `load_base`, then transaction costs are doubled. |
| `load_factor`                    | Number          | The load factor the server is currently enforcing. The ratio between this value and the `load_base` determines the multiplier for transaction costs. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost), and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `load_factor_fee_escalation`     | Number          | _(May be omitted)_ The current multiplier to the [transaction cost][] to get into the open ledger, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_fee_queue`          | Number          | _(May be omitted)_ The current multiplier to the [transaction cost][] to get into the queue, if the queue is full, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_fee_reference`      | Number          | _(May be omitted)_ The [transaction cost][] with no load scaling, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_server`             | Number          | _(May be omitted)_ The load factor the server is enforcing, not including the [open ledger cost](transaction-cost.html#open-ledger-cost). [New in: rippled 0.33.0][] |
| `peers`                          | Number          | How many other `rippled` servers this one is currently connected to. |
| `pubkey_node`                    | String          | Public key used to verify this server for peer-to-peer communications. This _node key pair_ is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](clustering.html). |
| `pubkey_validator`               | String          | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `server_state`                   | String          | A string indicating to what extent the server is participating in the network. See [Possible Server States](rippled-server-states.html) for more details. |
| `server_state_duration_us`       | Number          | The number of consecutive microseconds the server has been in the current state. [New in: rippled 1.2.0][] |
| `state_accounting`               | Object          | A map of various [server states](rippled-server-states.html) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. [New in: rippled 0.30.1][] |
| `state_accounting.*.duration_us` | String          | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) [New in: rippled 0.30.1][] |
| `state_accounting.*.transitions` | Number          | The number of times the server has changed into this state. [New in: rippled 0.30.1][] |
| `time`                           | String          | The current time in UTC, according to the server's clock. [Updated in: rippled 1.5.0][] |
| `uptime`                         | Number          | Number of consecutive seconds that the server has been operational. [New in: rippled 0.30.1][] |
| `validated_ledger`               | Object          | _(May be omitted)_ Information about the most recent fully-validated ledger. If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validated_ledger.base_fee`      | Number          | Base fee, in drops of XRP, for propagating a transaction to the network. |
| `validated_ledger.close_time`    | Number          | Time this ledger was closed, in [seconds since the Ripple Epoch][]. |
| `validated_ledger.hash`          | String          | Unique hash of this ledger version, as hexadecimal. |
| `validated_ledger.reserve_base`  | Number          | The minimum [account reserve](reserves.html), as of the most recent validated ledger version. |
| `validated_ledger.reserve_inc`   | Number          | The [owner reserve](reserves.html) for each item an account owns, as of the most recent validated ledger version. |
| `validated_ledger.seq`           | Number          | The [ledger index][] of the most recently validated ledger version. |
| `validation_quorum`              | Number          | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires`         | Number          | _(Admin only)_ When the current validator list will expire, in [seconds since the Ripple Epoch][], or 0 if the server has yet to load a published validator list. [New in: rippled 0.80.1][] |


## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
