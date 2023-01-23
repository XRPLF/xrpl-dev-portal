---
html: server_state.html
parent: server-info-methods.html
blurb: Retrieve status of the server in machine-readable format.
labels:
  - Core Server
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
      "build_version": "1.7.2",
      "complete_ledgers": "64572720-65887201",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time": 3005,
        "proposers": 41
      },
      "load_base": 256,
      "load_factor": 256,
      "load_factor_fee_escalation": 256,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "365006",
      "peer_disconnects_resources": "336",
      "peers": 216,
      "pubkey_node": "n9MozjnGB3tpULewtTsVtuudg5JqYFyV3QFdAtVLzJaxHcBaxuXD",
      "server_state": "full",
      "server_state_duration_us": "3588969453592",
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
          "duration_us": "3589171798767",
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
      "time": "2021-Aug-24 20:44:43.466048 UTC",
      "uptime": 3589480,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 683153081,
        "hash": "B52AC3876412A152FE9C0442801E685D148D05448D0238587DBA256330A98FD3",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 65887201
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

Headers

{
  "result": {
    "state": {
      "build_version": "1.7.2",
      "complete_ledgers": "65844785-65887184",
      "io_latency_ms": 3,
      "jq_trans_overflow": "580",
      "last_close": {
        "converge_time": 3012,
        "proposers": 41
      },
      "load_base": 256,
      "load_factor": 134022,
      "load_factor_fee_escalation": 134022,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "792367",
      "peer_disconnects_resources": "7273",
      "peers": 72,
      "pubkey_node": "n9LNvsFiYfFf8va6pma2PHGJKVLSyZweN1iBAkJQSeHw4GjM8gvN",
      "server_state": "full",
      "server_state_duration_us": "422128665555",
      "state_accounting": {
        "connected": {
          "duration_us": "172799714",
          "transitions": 1
        },
        "disconnected": {
          "duration_us": "309059",
          "transitions": 1
        },
        "full": {
          "duration_us": "6020429212246",
          "transitions": 143
        },
        "syncing": {
          "duration_us": "413813232",
          "transitions": 152
        },
        "tracking": {
          "duration_us": "266553605",
          "transitions": 152
        }
      },
      "time": "2021-Aug-24 20:43:43.043406 UTC",
      "uptime": 6021282,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 683153020,
        "hash": "ABEF3D24015E8B6B7184B4ABCEDC0E0E3AA4F0677FAB91C40B1E500707C1F3E5",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 65887184
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
2020-Mar-24 01:30:08.646201720 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

Headers

{
  "result": {
    "state": {
      "build_version": "1.7.2",
      "complete_ledgers": "65844785-65887184",
      "io_latency_ms": 3,
      "jq_trans_overflow": "580",
      "last_close": {
        "converge_time": 3012,
        "proposers": 41
      },
      "load_base": 256,
      "load_factor": 134022,
      "load_factor_fee_escalation": 134022,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "792367",
      "peer_disconnects_resources": "7273",
      "peers": 72,
      "pubkey_node": "n9LNvsFiYfFf8va6pma2PHGJKVLSyZweN1iBAkJQSeHw4GjM8gvN",
      "server_state": "full",
      "server_state_duration_us": "422128665555",
      "state_accounting": {
        "connected": {
          "duration_us": "172799714",
          "transitions": 1
        },
        "disconnected": {
          "duration_us": "309059",
          "transitions": 1
        },
        "full": {
          "duration_us": "6020429212246",
          "transitions": 143
        },
        "syncing": {
          "duration_us": "413813232",
          "transitions": 152
        },
        "tracking": {
          "duration_us": "266553605",
          "transitions": 152
        }
      },
      "time": "2021-Aug-24 20:43:43.043406 UTC",
      "uptime": 6021282,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 683153020,
        "hash": "ABEF3D24015E8B6B7184B4ABCEDC0E0E3AA4F0677FAB91C40B1E500707C1F3E5",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 65887184
      },
      "validation_quorum": 33
    },
    "status": "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing a `state` object as its only field.

The `state` object may have some arrangement of the following fields:

| `Field`                          | Type            | Description             |
|:---------------------------------|:----------------|:------------------------|
| `amendment_blocked`              | Boolean         | _(May be omitted)_ If `true`, this server is [amendment blocked](amendments.html#amendment-blocked-servers). If the server is not amendment blocked, the response omits this field. [New in: rippled 0.80.0][] |
| `build_version`                  | String          | The version number of the running `rippled` version. |
| `complete_ledgers`               | String          | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. It is possible to be a disjoint sequence, e.g. "2500-5000,32570-7695432". If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string `empty`. |
| `closed_ledger`                  | Object          | _(May be omitted)_ Information on the most recently closed ledger that has not been validated by consensus. If the most recently validated ledger is available, the response omits this field and includes `validated_ledger` instead. The member fields are the same as the `validated_ledger` field. |
| `io_latency_ms`                  | Number          | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `jq_trans_overflow`              | String - Number | The number of times this server has had over 250 transactions waiting to be processed at once. A large number here may mean that your server is unable to handle the transaction load of the XRP Ledger network. For detailed recommendations of future-proof server specifications, see [Capacity Planning](capacity-planning.html). [New in: rippled 0.90.0][] |
| `last_close`                     | Object          | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| `last_close.converge_time`          | Number          | The amount of time it took to reach a consensus on the most recently validated ledger version, in milliseconds. |
| `last_close.proposers`              | Number          | How many trusted validators the server considered (including itself, if configured as a validator) in the consensus process for the most recently validated ledger version. |
| `load`                           | Object          | _(Admin only)_ Detailed information about the current load state of the server. |
| `load.job_types`                 | Array           | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                   | Number          | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_base`                      | Integer         | This is the baseline amount of server load used in [transaction cost](transaction-cost.html) calculations. If the `load_factor` is equal to the `load_base` then only the base transaction cost is enforced. If the `load_factor` is higher than the `load_base`, then transaction costs are multiplied by the ratio between them. For example, if the `load_factor` is double the `load_base`, then transaction costs are doubled. |
| `load_factor`                    | Number          | The load factor the server is currently enforcing. The ratio between this value and the `load_base` determines the multiplier for transaction costs. The load factor is determined by the highest of the individual server's load factor, cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost), and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `load_factor_fee_escalation`     | Number          | _(May be omitted)_ The current multiplier to the [transaction cost][] to get into the open ledger, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_fee_queue`          | Number          | _(May be omitted)_ The current multiplier to the [transaction cost][] to get into the queue, if the queue is full, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_fee_reference`      | Number          | _(May be omitted)_ The [transaction cost][] with no load scaling, in [fee levels][]. [New in: rippled 0.32.0][] |
| `load_factor_server`             | Number          | _(May be omitted)_ The load factor the server is enforcing, not including the [open ledger cost](transaction-cost.html#open-ledger-cost). [New in: rippled 0.33.0][] |
| `peers`                          | Number          | _(Omitted by [reporting mode][Reporting mode] servers)_ How many other `rippled` servers this one is currently connected to. |
| `pubkey_node`                    | String          | Public key used to verify this server for peer-to-peer communications. This _node key pair_ is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](clustering.html). |
| `pubkey_validator`               | String          | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `reporting`                         | Object          | _([Reporting mode][] servers only)_ Information about this server's reporting-mode specific configurations. |
| `reporting.etl_sources`             | Array           | _([Reporting mode][] servers only)_ A list of P2P-mode servers this reporting mode is retrieving data from. Each entry in this array is an [ETL Source object](#etl-source-object). |
| `reporting.is_writer`               | Boolean         | _([Reporting mode][] servers only)_ If `true`, this server is writing to the external database with ledger data. If `false`, it is not currently writing, possibly because another reporting mode server is currently populating a shared database, or because it's configured as read-only. |
| `reporting.last_publish_time`       | String          | _([Reporting mode][] servers only)_ An ISO 8601 timestamp indicating when this server last saw a new validated ledger from any of its P2P mode sources. |
| `server_state`                   | String          | A string indicating to what extent the server is participating in the network. See [Possible Server States](rippled-server-states.html) for more details. |
| `server_state_duration_us`       | Number          | The number of consecutive microseconds the server has been in the current state. [New in: rippled 1.2.0][] |
| `state_accounting`               | Object          | A map of various [server states](rippled-server-states.html) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. [New in: rippled 0.30.1][] |
| `state_accounting.*.duration_us` | String          | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) [New in: rippled 0.30.1][] |
| `state_accounting.*.transitions` | String          | The number of times the server has changed into this state. [New in: rippled 0.30.1][] |
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
| `validator_list_expires`         | Number          | _(Admin only)_ When the current validator list expires, in [seconds since the Ripple Epoch][], or 0 if the server has yet to load a published validator list. [New in: rippled 0.80.1][] |

[Reporting mode]: rippled-server-modes.html

{% include '_snippets/etl-source-object.md' %}


## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
