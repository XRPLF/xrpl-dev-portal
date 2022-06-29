---
html: server_info-clio.html
parent: server-info-methods.html
blurb: Retrieve status of the Clio server in human-readable format.
labels:
  - Core Server
---
# server_info (Clio)
[[Source]](https://github.com/XRPLF/clio/blob/master/src/rpc/handlers/ServerInfo.cpp "Source")

The `server_info` command asks the [Clio server](the-clio-server.html) for a human-readable version of various information about the Clio server being queried. For `rippled` servers, see [`server_info` (`rippled`)](server_info.html) instead.

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
      "build_version": "1.7.2",
      "complete_ledgers": "64572720-65887227",
      "hostid": "LARD",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time_s": 3.004,
        "proposers": 41
      },
      "load_factor": 512.578125,
      "load_factor_server": 1,
      "peer_disconnects": "365016",
      "peer_disconnects_resources": "336",
      "peers": 211,
      "pubkey_node": "n9MozjnGB3tpULewtTsVtuudg5JqYFyV3QFdAtVLzJaxHcBaxuXD",
      "server_state": "full",
      "server_state_duration_us": "3589068181859",
      "state_accounting": {
        "connected": {
          "duration_us": "301410595",
          "transitions": 2
        },
        "disconnected": {
          "duration_us": "1207534",
          "transitions": 2
        },
        "full": {
          "duration_us": "3589270527034",
          "transitions": 2
        },
        "syncing": {
          "duration_us": "6182323",
          "transitions": 2
        },
        "tracking": {
          "duration_us": "43",
          "transitions": 2
        }
      },
      "time": "2021-Aug-24 20:46:22.194299 UTC",
      "uptime": 3589579,
      "validated_ledger": {
        "age": 3,
        "base_fee_xrp": 0.00001,
        "hash": "F00F0E590242702B895BE378B6A6D365C094A047CFC8B11DD323D16F81CC67A5",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 65887227
      },
      "validation_quorum": 33
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
      "build_version": "1.7.2",
      "complete_ledgers": "64735538-65886965",
      "hostid": "TOLL",
      "io_latency_ms": 1,
      "jq_trans_overflow": "3",
      "last_close": {
        "converge_time_s": 3,
        "proposers": 41
      },
      "load_factor": 1,
      "peer_disconnects": "467400",
      "peer_disconnects_resources": "16316",
      "peers": 85,
      "pubkey_node": "n9Mdk7abYaVvded5zic9oDEY3NULv9RmeJ9Z5hgjXX1ycZqAGhTn",
      "server_state": "full",
      "server_state_duration_us": "627203282776",
      "state_accounting": {
        "connected": {
          "duration_us": "600242389",
          "transitions": 40
        },
        "disconnected": {
          "duration_us": "112927",
          "transitions": 1
        },
        "full": {
          "duration_us": "3591757226163",
          "transitions": 46
        },
        "syncing": {
          "duration_us": "5304456",
          "transitions": 7
        },
        "tracking": {
          "duration_us": "13989631",
          "transitions": 46
        }
      },
      "time": "2021-Aug-24 20:29:53.291350 UTC",
      "uptime": 3592376,
      "validated_ledger": {
        "age": 2,
        "base_fee_xrp": 0.00001,
        "hash": "B79D223A27F4EC214C9BA85665B12EE76C1EE2CB887BBCBAFB6484355C43FEFA",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 65886965
      },
      "validation_quorum": 33
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
  "result": {
    "info": {
      "build_version": "1.7.2",
      "complete_ledgers": "64735538-65886965",
      "hostid": "TOLL",
      "io_latency_ms": 1,
      "jq_trans_overflow": "3",
      "last_close": {
        "converge_time_s": 3,
        "proposers": 41
      },
      "load_factor": 1,
      "peer_disconnects": "467400",
      "peer_disconnects_resources": "16316",
      "peers": 85,
      "pubkey_node": "n9Mdk7abYaVvded5zic9oDEY3NULv9RmeJ9Z5hgjXX1ycZqAGhTn",
      "server_state": "full",
      "server_state_duration_us": "627203282776",
      "state_accounting": {
        "connected": {
          "duration_us": "600242389",
          "transitions": 40
        },
        "disconnected": {
          "duration_us": "112927",
          "transitions": 1
        },
        "full": {
          "duration_us": "3591757226163",
          "transitions": 46
        },
        "syncing": {
          "duration_us": "5304456",
          "transitions": 7
        },
        "tracking": {
          "duration_us": "13989631",
          "transitions": 46
        }
      },
      "time": "2021-Aug-24 20:29:53.291350 UTC",
      "uptime": 3592376,
      "validated_ledger": {
        "age": 2,
        "base_fee_xrp": 0.00001,
        "hash": "B79D223A27F4EC214C9BA85665B12EE76C1EE2CB887BBCBAFB6484355C43FEFA",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 65886965
      },
      "validation_quorum": 33
    },
    "status": "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing an `info` object as its only field.

The `info` object may have some arrangement of the following fields:

| `Field`                             | Type            | Description          |
|:------------------------------------|:----------------|:---------------------|
| `amendment_blocked`                 | Boolean         | _(May be omitted)_ If `true`, this server is [amendment blocked](amendments.html#amendment-blocked). If the server is not amendment blocked, the response omits this field. [New in: rippled 0.80.0][] |
| `build_version`                     | String          | The version number of the running `rippled` version. |
| `closed_ledger`                     | Object          | _(May be omitted)_ Information on the most recently closed ledger that has not been validated by consensus. If the most recently validated ledger is available, the response omits this field and includes `validated_ledger` instead. The member fields are the same as the `validated_ledger` field. |
| `complete_ledgers`                  | String          | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. This may be a disjoint sequence such as `24900901-24900984,24901116-24901158`. If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string `empty`. |
| `hostid`                            | String          | On an admin request, returns the hostname of the server running the `rippled` instance; otherwise, returns a single [RFC-1751][] word based on the [node public key](peer-protocol.html#node-key-pair). |
| `io_latency_ms`                     | Number          | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `jq_trans_overflow`                 | String - Number | The number of times (since starting up) that this server has had over 250 transactions waiting to be processed at once. A large number here may mean that your server is unable to handle the transaction load of the XRP Ledger network. For detailed recommendations of future-proof server specifications, see [Capacity Planning](capacity-planning.html). [New in: rippled 0.90.0][] |
| `last_close`                        | Object          | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| `last_close.converge_time_s`          | Number          | The amount of time it took to reach a consensus on the most recently validated ledger version, in seconds. |
| `last_close.proposers`              | Number          | How many trusted validators the server considered (including itself, if configured as a validator) in the consensus process for the most recently validated ledger version. |
| `load`                              | Object          | _(Admin only)_ Detailed information about the current load state of the server. |
| `load.job_types`                    | Array           | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                      | Number          | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_factor`                       | Number          | The load-scaled open ledger transaction cost the server is currently enforcing, as a multiplier on the base transaction cost. For example, at `1000` load factor and a reference transaction cost of 10 drops of XRP, the load-scaled transaction cost is 10,000 drops (0.01 XRP). The load factor is determined by the highest of the [individual server's load factor](transaction-cost.html#local-load-cost), the cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost) and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `load_factor_local`                 | Number          | _(May be omitted)_ Current multiplier to the [transaction cost][] based on load to this server. |
| `load_factor_net`                   | Number          | _(May be omitted)_ Current multiplier to the [transaction cost][] being used by the rest of the network (estimated from other servers' reported load values). |
| `load_factor_cluster`               | Number          | _(May be omitted)_ Current multiplier to the [transaction cost][] based on load to servers in [this cluster](clustering.html). |
| `load_factor_fee_escalation`        | Number          | _(May be omitted)_ The current multiplier to the [transaction cost][] that a transaction must pay to get into the open ledger. [New in: rippled 0.32.0][] |
| `load_factor_fee_queue`             | Number          | _(May be omitted)_ The current multiplier to the [transaction cost][] that a transaction must pay to get into the queue, if the queue is full. [New in: rippled 0.32.0][] |
| `load_factor_server`                | Number          | _(May be omitted)_ The load factor the server is enforcing, not including the [open ledger cost](transaction-cost.html#open-ledger-cost). [New in: rippled 0.33.0][] |
| `peers`                             | Number          | How many other `rippled` servers this one is currently connected to. |
| `pubkey_node`                       | String          | Public key used to verify this server for peer-to-peer communications. This [_node key pair_](peer-protocol.html#node-key-pair) is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](clustering.html). |
| `pubkey_validator`                  | String          | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `server_state`                      | String          | A string indicating to what extent the server is participating in the network. See [Possible Server States](rippled-server-states.html) for more details. |
| `server_state_duration_us`          | Number          | The number of consecutive microseconds the server has been in the current state. [New in: rippled 1.2.0][] |
| `state_accounting`                  | Object          | A map of various [server states](rippled-server-states.html) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. [New in: rippled 0.30.1][] |
| `state_accounting.*.duration_us`    | String          | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) [New in: rippled 0.30.1][] |
| `state_accounting.*.transitions`    | Number          | The number of times the server has changed into this state. [New in: rippled 0.30.1][] |
| `time`                              | String          | The current time in UTC, according to the server's clock. [Updated in: rippled 1.5.0][] |
| `uptime`                            | Number          | Number of consecutive seconds that the server has been operational. [New in: rippled 0.30.1][] |
| `validated_ledger`                  | Object          | _(May be omitted)_ Information about the most recent fully-validated ledger. If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validated_ledger.age`              | Number          | The time since the ledger was closed, in seconds. |
| `validated_ledger.base_fee_xrp`     | Number          | Base fee, in XRP. This may be represented in scientific notation such as `1e-05` for 0.00001. |
| `validated_ledger.hash`             | String          | Unique hash for the ledger, as hexadecimal. |
| `validated_ledger.reserve_base_xrp` | Number          | Minimum amount of XRP (not drops) necessary for every account to keep in reserve |
| `validated_ledger.reserve_inc_xrp`  | Number          | Amount of XRP (not drops) added to the account reserve for each object an account owns in the ledger. |
| `validated_ledger.seq`              | Number          | The [ledger index][] of the latest validated ledger. |
| `validation_quorum`                 | Number          | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires`            | String          | _(Admin only)_ Either the human readable time, in UTC, when the current validator list will expire, the string `unknown` if the server has yet to load a published validator list or the string `never` if the server uses a static validator list. [Updated in: rippled 1.5.0][] |

**Note:** If the `closed_ledger` field is present and has a small `seq` value (less than 8 digits), that indicates `rippled` does not currently have a copy of the validated ledger from the peer-to-peer network. This could mean your server is still syncing. Typically, it takes about 5 minutes to sync with the network, depending on your connection speed and hardware specs.

## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
