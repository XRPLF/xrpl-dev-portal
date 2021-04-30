---
html: server_info.html
parent: server-info-methods.html
blurb: Retrieve status of the server in human-readable format.
---
# server_info
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp "Source")

The `server_info` command asks the server for a human-readable version of various information about the `rippled` server being queried.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "command": "server_info"
}
```

*JSON-RPC*

```json
{
    "method": "server_info",
    "params": [
        {}
    ]
}
```

*Commandline*

```sh
#Syntax: server_info
rippled server_info
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#server_info)

The request does not take any parameters.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "result": {
    "info": {
      "build_version": "1.5.0-rc1",
      "complete_ledgers": "54300020-54300717",
      "hostid": "trace",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time_s": 2.001,
        "proposers": 34
      },
      "load": {
        "job_types": [
          {
            "job_type": "untrustedProposal",
            "peak_time": 9,
            "per_second": 46
          },
          {
            "avg_time": 14,
            "job_type": "ledgerData",
            "peak_time": 273,
            "per_second": 1
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand",
            "per_second": 8
          },
          {
            "job_type": "transaction",
            "per_second": 8
          },
          {
            "job_type": "batch",
            "peak_time": 2,
            "per_second": 7
          },
          {
            "avg_time": 9,
            "job_type": "advanceLedger",
            "peak_time": 134,
            "per_second": 2
          },
          {
            "job_type": "fetchTxnData",
            "per_second": 3
          },
          {
            "avg_time": 9,
            "job_type": "trustedValidation",
            "peak_time": 95,
            "per_second": 4
          },
          {
            "job_type": "trustedProposal",
            "peak_time": 8,
            "per_second": 15
          },
          {
            "job_type": "peerCommand",
            "per_second": 1490
          },
          {
            "job_type": "processTransaction",
            "per_second": 8
          },
          {
            "job_type": "SyncReadNode",
            "peak_time": 8,
            "per_second": 11
          },
          {
            "job_type": "AsyncReadNode",
            "peak_time": 18,
            "per_second": 478
          },
          {
            "job_type": "WriteNode",
            "peak_time": 16,
            "per_second": 416
          }
        ],
        "threads": 6
      },
      "load_factor": 1,
      "peer_disconnects": "57",
      "peer_disconnects_resources": "1",
      "peers": 20,
      "pubkey_node": "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
      "pubkey_validator": "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "server_state": "proposing",
      "server_state_duration_us": "1807072679",
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
          "duration_us": "1807072679",
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
      "time": "2020-Mar-24 01:26:58.250104 UTC",
      "uptime": 1940,
      "validated_ledger": {
        "age": 7,
        "base_fee_xrp": 0.00001,
        "hash": "2BA01CA6291E30CE9610EEE2E0A6E9CF12B8914B389509940E9D3B48E0DF008C",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 54300717
      },
      "validation_quorum": 29,
      "validator_list": {
        "count": 1,
        "expiration": "2020-Apr-10 00:00:00.000000000 UTC",
        "status": "active"
      }
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
    "info": {
      "build_version": "1.5.0-rc1",
      "complete_ledgers": "54300020-54300729",
      "hostid": "trace",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time_s": 2,
        "proposers": 34
      },
      "load": {
        "job_types": [
          {
            "job_type": "ledgerRequest",
            "peak_time": 4,
            "per_second": 4
          },
          {
            "job_type": "untrustedProposal",
            "peak_time": 5,
            "per_second": 43
          },
          {
            "avg_time": 14,
            "job_type": "ledgerData",
            "peak_time": 337
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand",
            "per_second": 9
          },
          {
            "job_type": "transaction",
            "peak_time": 8,
            "per_second": 8
          },
          {
            "job_type": "batch",
            "peak_time": 5,
            "per_second": 6
          },
          {
            "avg_time": 6,
            "job_type": "advanceLedger",
            "peak_time": 96
          },
          {
            "job_type": "fetchTxnData",
            "per_second": 14
          },
          {
            "job_type": "trustedValidation",
            "peak_time": 5,
            "per_second": 8
          },
          {
            "job_type": "trustedProposal",
            "per_second": 13
          },
          {
            "avg_time": 2,
            "job_type": "heartbeat",
            "peak_time": 9
          },
          {
            "job_type": "peerCommand",
            "per_second": 1522
          },
          {
            "job_type": "processTransaction",
            "per_second": 8
          },
          {
            "job_type": "SyncReadNode",
            "peak_time": 9,
            "per_second": 9
          },
          {
            "job_type": "AsyncReadNode",
            "peak_time": 24,
            "per_second": 106
          },
          {
            "job_type": "WriteNode",
            "peak_time": 8,
            "per_second": 282
          }
        ],
        "threads": 6
      },
      "load_factor": 1,
      "peer_disconnects": "58",
      "peer_disconnects_resources": "1",
      "peers": 21,
      "pubkey_node": "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
      "pubkey_validator": "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "server_state": "proposing",
      "server_state_duration_us": "1850969666",
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
          "duration_us": "1850969666",
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
      "time": "2020-Mar-24 01:27:42.147330 UTC",
      "uptime": 1984,
      "validated_ledger": {
        "age": 2,
        "base_fee_xrp": 0.00001,
        "hash": "0D2D30837E05995AAAAA117294BB45AB0699AB1219605FFD23318E050C7166E9",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 54300729
      },
      "validation_quorum": 29,
      "validator_list": {
        "count": 1,
        "expiration": "2020-Apr-10 00:00:00.000000000 UTC",
        "status": "active"
      }
    },
    "status": "success"
  }
}
```

*Commandline*

```json
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Mar-24 01:28:22.288484766 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "info" : {
         "build_version" : "1.5.0-rc1",
         "complete_ledgers" : "54300020-54300739",
         "hostid" : "trace",
         "io_latency_ms" : 1,
         "jq_trans_overflow" : "0",
         "last_close" : {
            "converge_time_s" : 3,
            "proposers" : 34
         },
         "load" : {
            "job_types" : [
               {
                  "job_type" : "untrustedProposal",
                  "per_second" : 36
               },
               {
                  "avg_time" : 2,
                  "job_type" : "ledgerData",
                  "peak_time" : 50
               },
               {
                  "in_progress" : 1,
                  "job_type" : "clientCommand",
                  "per_second" : 8
               },
               {
                  "job_type" : "transaction",
                  "peak_time" : 1,
                  "per_second" : 8
               },
               {
                  "job_type" : "batch",
                  "peak_time" : 14,
                  "per_second" : 6
               },
               {
                  "avg_time" : 3,
                  "job_type" : "advanceLedger",
                  "peak_time" : 48,
                  "per_second" : 1
               },
               {
                  "job_type" : "fetchTxnData",
                  "per_second" : 4
               },
               {
                  "job_type" : "trustedValidation",
                  "peak_time" : 3,
                  "per_second" : 5
               },
               {
                  "job_type" : "trustedProposal",
                  "per_second" : 12
               },
               {
                  "job_type" : "peerCommand",
                  "per_second" : 1312
               },
               {
                  "job_type" : "processTransaction",
                  "per_second" : 8
               },
               {
                  "job_type" : "SyncReadNode",
                  "per_second" : 5
               },
               {
                  "job_type" : "AsyncReadNode",
                  "peak_time" : 20,
                  "per_second" : 56
               },
               {
                  "job_type" : "WriteNode",
                  "peak_time" : 3,
                  "per_second" : 183
               }
            ],
            "threads" : 6
         },
         "load_factor" : 1,
         "peer_disconnects" : "60",
         "peer_disconnects_resources" : "1",
         "peers" : 21,
         "pubkey_node" : "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
         "pubkey_validator" : "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
         "server_state" : "proposing",
         "server_state_duration_us" : "1891111442",
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
               "duration_us" : "1891111442",
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
         "time" : "2020-Mar-24 01:28:22.289087 UTC",
         "uptime" : 2024,
         "validated_ledger" : {
            "age" : 2,
            "base_fee_xrp" : 1e-05,
            "hash" : "8BE6E2792A1D27437ABAF25B42CD367474F1EC74F6E2F576A318270A825298E4",
            "reserve_base_xrp" : 20,
            "reserve_inc_xrp" : 5,
            "seq" : 54300739
         },
         "validation_quorum" : 29,
         "validator_list" : {
            "count" : 1,
            "expiration" : "2020-Apr-10 00:00:00.000000000 UTC",
            "status" : "active"
         }
      },
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing an `info` object as its only field.

The `info` object may have some arrangement of the following fields:

| `Field`                             | Type                      | Description |
|:------------------------------------|:--------------------------|:-----------|
| `amendment_blocked`                 | Boolean                   | _(May be omitted)_ If `true`, this server is [amendment blocked](amendments.html#amendment-blocked). If the server is not amendment blocked, the response omits this field. [New in: rippled 0.80.0][] |
| `build_version`                     | String                    | The version number of the running `rippled` version. |
| `closed_ledger`                     | Object                    | (May be omitted) Information on the most recently closed ledger that has not been validated by consensus. If the most recently validated ledger is available, the response omits this field and includes `validated_ledger` instead. The member fields are the same as the `validated_ledger` field. |
| `complete_ledgers`                  | String                    | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. This may be a disjoint sequence such as `24900901-24900984,24901116-24901158`. If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string `empty`. |
| `hostid`                            | String                    | On an admin request, returns the hostname of the server running the `rippled` instance; otherwise, returns a single [RFC-1751][] word based on the node public key. |
| `io_latency_ms`                     | Number                    | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `jq_trans_overflow`                 | String - Number           | The number of times (since starting up) that this server has had over 250 transactions waiting to be processed at once. A large number here may mean that your server is unable to handle the transaction load of the XRP Ledger network. For detailed recommendations of future-proof server specifications, see [Capacity Planning](capacity-planning.html). [New in: rippled 0.90.0][]  |
| `last_close`                        | Object                    | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| `load`                              | Object                    | _(Admin only)_ Detailed information about the current load state of the server. |
| `load.job_types`                    | Array                     | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                      | Number                    | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_factor`                       | Number                    | The load-scaled open ledger transaction cost the server is currently enforcing, as a multiplier on the base transaction cost. For example, at `1000` load factor and a reference transaction cost of 10 drops of XRP, the load-scaled transaction cost is 10,000 drops (0.01 XRP). The load factor is determined by the highest of the [individual server's load factor](transaction-cost.html#local-load-cost), the cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost) and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `load_factor_local`                 | Number                    | _(May be omitted)_ Current multiplier to the [transaction cost][] based on load to this server. |
| `load_factor_net`                   | Number                    | _(May be omitted)_ Current multiplier to the [transaction cost][] being used by the rest of the network (estimated from other servers' reported load values). |
| `load_factor_cluster`               | Number                    | _(May be omitted)_ Current multiplier to the [transaction cost][] based on load to servers in [this cluster](clustering.html). |
| `load_factor_fee_escalation`        | Number                    | _(May be omitted)_ The current multiplier to the [transaction cost][] that a transaction must pay to get into the open ledger. [New in: rippled 0.32.0][] |
| `load_factor_fee_queue`             | Number                    | _(May be omitted)_ The current multiplier to the [transaction cost][] that a transaction must pay to get into the queue, if the queue is full. [New in: rippled 0.32.0][] |
| `load_factor_server`                | Number                    | _(May be omitted)_ The load factor the server is enforcing, not including the [open ledger cost](transaction-cost.html#open-ledger-cost). [New in: rippled 0.33.0][] |
| `peers`                             | Number                    | How many other `rippled` servers this one is currently connected to. |
| `pubkey_node`                       | String                    | Public key used to verify this server for peer-to-peer communications. This _node key pair_ is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](clustering.html). |
| `pubkey_validator`                  | String                    | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `server_state`                      | String                    | A string indicating to what extent the server is participating in the network. See [Possible Server States](rippled-server-states.html) for more details. |
| `server_state_duration_us` | Number | The number of consecutive microseconds the server has been in the current state. [New in: rippled 1.2.0][] |
| `state_accounting`                  | Object                    | A map of various [server states](rippled-server-states.html) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. [New in: rippled 0.30.1][] |
| `state_accounting.*.duration_us`    | String                    | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) [New in: rippled 0.30.1][] |
| `state_accounting.*.transitions`    | Number                    | The number of times the server has changed into this state. [New in: rippled 0.30.1][] |
| `time`                              | String                    | The current time in UTC, according to the server's clock. [Updated in: rippled 1.5.0][] |
| `uptime`                            | Number                    | Number of consecutive seconds that the server has been operational. [New in: rippled 0.30.1][] |
| `validated_ledger`                  | Object                    | _(May be omitted)_ Information about the most recent fully-validated ledger. If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validated_ledger.age`              | Number                    | The time since the ledger was closed, in seconds. |
| `validated_ledger.base_fee_xrp`     | Number                    | Base fee, in XRP. This may be represented in scientific notation such as `1e-05` for 0.00005. |
| `validated_ledger.hash`             | String                    | Unique hash for the ledger, as hexadecimal. |
| `validated_ledger.reserve_base_xrp` | Unsigned Integer          | Minimum amount of XRP (not drops) necessary for every account to keep in reserve |
| `validated_ledger.reserve_inc_xrp`  | Unsigned Integer          | Amount of XRP (not drops) added to the account reserve for each object an account owns in the ledger. |
| `validated_ledger.seq`              | Number - [Ledger Index][] | The [ledger index][] of the latest validate ledger. |
| `validation_quorum`                 | Number                    | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires`            | String                    | _(Admin only)_ Either the human readable time, in UTC, when the current validator list will expire, the string `unknown` if the server has yet to load a published validator list or the string `never` if the server uses a static validator list. [Updated in: rippled 1.5.0][] |

**Note:** If the `closed_ledger` field is present and has a small `seq` value (less than 8 digits), that indicates `rippled` does not currently have a copy of the validated ledger from the peer-to-peer network. This could mean your server is still syncing. Typically, it takes about 5 minutes to sync with the network, depending on your connection speed and hardware specs.

## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
