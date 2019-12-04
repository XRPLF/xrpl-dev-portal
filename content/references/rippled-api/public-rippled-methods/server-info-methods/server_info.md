# server_info
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp "Source")

The `server_info` command asks the server for a human-readable version of various information about the `rippled` server being queried.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 1,
  "command": "server_info"
}
```

*JSON-RPC*

```
{
    "method": "server_info",
    "params": [
        {}
    ]
}
```

*Commandline*

```
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

```
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "info": {
      "build_version": "0.30.1-rc3",
      "complete_ledgers": "18611104-18614732",
      "hostid": "trace",
      "io_latency_ms": 1,
      "last_close": {
        "converge_time_s": 4.003,
        "proposers": 5
      },
      "load": {
        "job_types": [
          {
            "job_type": "untrustedProposal",
            "per_second": 2
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand"
          },
          {
            "job_type": "transaction",
            "per_second": 4
          },
          {
            "job_type": "batch",
            "per_second": 3
          },
          {
            "job_type": "writeObjects",
            "per_second": 2
          },
          {
            "job_type": "trustedProposal",
            "per_second": 1
          },
          {
            "job_type": "peerCommand",
            "per_second": 108
          },
          {
            "job_type": "diskAccess",
            "per_second": 1
          },
          {
            "job_type": "processTransaction",
            "per_second": 4
          },
          {
            "job_type": "WriteNode",
            "per_second": 63
          }
        ],
        "threads": 6
      },
      "load_factor": 1000,
      "load_factor_net": 1000,
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
          "duration_us": "166972201508",
          "transitions": 1853
        },
        "syncing": {
          "duration_us": "6249156726",
          "transitions": 1854
        },
        "tracking": {
          "duration_us": "13035222",
          "transitions": 1854
        }
      },
      "uptime": 173379,
      "validated_ledger": {
        "age": 3,
        "base_fee_xrp": 0.00001,
        "hash": "04F7CF4EACC57140C8088F6BFDC8A824BB3ED5717C3DAA6642101F9FB446226C",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 18614732
      },
      "validation_quorum": 4,
      "validator_list_expires" : "2017-Oct-12 16:06:36"
    }
  }
}
```

*JSON-RPC*

```
200 OK
{
   "result" : {
      "info" : {
         "build_version" : "0.33.0-hf1",
         "complete_ledgers" : "24900901-24900984,24901116-24901158",
         "hostid" : "trace",
         "io_latency_ms" : 1,
         "last_close" : {
            "converge_time_s" : 2.001,
            "proposers" : 5
         },
         "load" : {
            "job_types" : [
               {
                  "in_progress" : 1,
                  "job_type" : "clientCommand"
               },
               {
                  "job_type" : "transaction",
                  "per_second" : 6
               },
               {
                  "job_type" : "batch",
                  "per_second" : 6
               },
               {
                  "in_progress" : 1,
                  "job_type" : "advanceLedger"
               },
               {
                  "job_type" : "trustedValidation",
                  "per_second" : 1
               },
               {
                  "avg_time" : 77,
                  "job_type" : "writeObjects",
                  "over_target" : true,
                  "peak_time" : 2990,
                  "per_second" : 2
               },
               {
                  "job_type" : "trustedProposal",
                  "per_second" : 2
               },
               {
                  "job_type" : "peerCommand",
                  "per_second" : 205
               },
               {
                  "avg_time" : 771,
                  "job_type" : "diskAccess",
                  "over_target" : true,
                  "peak_time" : 1934
               },
               {
                  "job_type" : "processTransaction",
                  "per_second" : 6
               },
               {
                  "job_type" : "SyncReadNode",
                  "per_second" : 4
               },
               {
                  "job_type" : "WriteNode",
                  "per_second" : 235
               }
            ],
            "threads" : 6
         },
         "load_factor" : 4.765625,
         "load_factor_local" : 4.765625,
         "peers" : 10,
         "pubkey_node" : "n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar",
         "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
         "published_ledger" : 24901158,
         "server_state" : "proposing",
         "server_state_duration_us": 708078257,
         "state_accounting" : {
            "connected" : {
               "duration_us" : "854824665",
               "transitions" : 2
            },
            "disconnected" : {
               "duration_us" : "2183055",
               "transitions" : 1
            },
            "full" : {
               "duration_us" : "944104343",
               "transitions" : 2
            },
            "syncing" : {
               "duration_us" : "9233178",
               "transitions" : 1
            },
            "tracking" : {
               "duration_us" : "0",
               "transitions" : 2
            }
         },
         "uptime" : 1792,
         "validated_ledger" : {
            "age" : 1,
            "base_fee_xrp" : 1e-05,
            "hash" : "D2C122281EB72E64D19B9654A8D3D0FC4207373D3FE5D91AE516685A58874621",
            "reserve_base_xrp" : 20,
            "reserve_inc_xrp" : 5,
            "seq" : 24901185
         },
         "validation_quorum" : 4,
         "validator_list_expires" : "2017-Oct-12 16:06:36"
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
| `complete_ledgers`                  | String                    | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. This may be a disjoint sequence, for example `24900901-24900984,24901116-24901158`. If the server does not have any complete ledgers (for example, it just started syncing with the network), this is the string `empty`. |
| `hostid`                            | String                    | On an admin request, returns the hostname of the server running the `rippled` instance; otherwise, returns a unique four letter word. |
| `io_latency_ms`                     | Number                    | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `last_close`                        | Object                    | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| `load`                              | Object                    | _(Admin only)_ Detailed information about the current load state of the server |
| `load.job_types`                    | Array                     | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                      | Number                    | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_factor`                       | Number                    | The load-scaled open ledger transaction cost the server is currently enforcing, as a multiplier on the base transaction cost. For example, at `1000` load factor and a reference transaction cost of 10 drops of XRP, the load-scaled transaction cost is 10,000 drops (0.01 XRP). The load factor is determined by the highest of the [individual server's load factor](transaction-cost.html#local-load-cost), the cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost) and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `load_factor_local`                 | Number                    | (May be omitted) Current multiplier to the [transaction cost][] based on load to this server. |
| `load_factor_net`                   | Number                    | (May be omitted) Current multiplier to the [transaction cost][] being used by the rest of the network (estimated from other servers' reported load values). |
| `load_factor_cluster`               | Number                    | (May be omitted) Current multiplier to the [transaction cost][] based on load to servers in [this cluster](clustering.html). |
| `load_factor_fee_escalation`        | Number                    | (May be omitted) The current multiplier to the [transaction cost][] that a transaction must pay to get into the open ledger. [New in: rippled 0.32.0][] |
| `load_factor_fee_queue`             | Number                    | (May be omitted) The current multiplier to the [transaction cost][] that a transaction must pay to get into the queue, if the queue is full. [New in: rippled 0.32.0][] |
| `load_factor_server`                | Number                    | (May be omitted) The load factor the server is enforcing, not including the [open ledger cost](transaction-cost.html#open-ledger-cost). [New in: rippled 0.33.0][] |
| `peers`                             | Number                    | How many other `rippled` servers this one is currently connected to. |
| `pubkey_node`                       | String                    | Public key used to verify this server for peer-to-peer communications. This _node key pair_ is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](clustering.html). |
| `pubkey_validator`                  | String                    | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `server_state`                      | String                    | A string indicating to what extent the server is participating in the network. See [Possible Server States](rippled-server-states.html) for more details. |
| `server_state_duration_us` | Number | The number of consecutive microseconds the server has been in the current state. [New in: rippled 1.2.0][] |
| `state_accounting`                  | Object                    | A map of various [server states](rippled-server-states.html) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. [New in: rippled 0.30.1][] |
| `state_accounting.*.duration_us`    | String                    | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) [New in: rippled 0.30.1][] |
| `state_accounting.*.transitions`    | Number                    | The number of times the server has transitioned into this state. [New in: rippled 0.30.1][] |
| `uptime`                            | Number                    | Number of consecutive seconds that the server has been operational. [New in: rippled 0.30.1][] |
| `validated_ledger`                  | Object                    | (May be omitted) Information about the most recent fully-validated ledger. If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validated_ledger.age`              | Number                    | The time since the ledger was closed, in seconds. |
| `validated_ledger.base_fee_xrp`     | Number                    | Base fee, in XRP. This may be represented in scientific notation such as `1e-05` for 0.00005. |
| `validated_ledger.hash`             | String                    | Unique hash for the ledger, as hex |
| `validated_ledger.reserve_base_xrp` | Unsigned Integer          | Minimum amount of XRP (not drops) necessary for every account to keep in reserve |
| `validated_ledger.reserve_inc_xrp`  | Unsigned Integer          | Amount of XRP (not drops) added to the account reserve for each object an account owns in the ledger |
| `validated_ledger.seq`              | Number - [Ledger Index][] | The ledger index of the latest validate ledger |
| `validation_quorum`                 | Number                    | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires`            | String                    | _(Admin only)_ Either the human readable time when the current validator list will expire, the string `unknown` if the server has yet to load a published validator list or the string `never` if the server uses a static validator list. [New in: rippled 0.80.1][] |

**Note:** If the `closed_ledger` field is present and has a small `seq` value (less than 8 digits), that indicates `rippled` does not currently have a copy of the validated ledger from the peer-to-peer network. This could mean your server is still syncing. Typically, it takes about 5 minutes to sync with the network, depending on your connection speed and hardware specs.

## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
