---
html: server_info-clio.html
parent: clio-methods.html
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

<!-- MULTICODE_BLOCK_END -->

<!-- [Try it! >](websocket-api-tool.html#server_info) -->

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
            "complete_ledgers": "19499132-19977628",
            "counters": {
                "rpc": {
                    "account_objects": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "991"
                    },
                    "account_tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "91633"
                    },
                    "account_lines": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "4915159"
                    },
                    "submit_multisigned": {
                        "started": "2",
                        "finished": "2",
                        "errored": "0",
                        "forwarded": "2",
                        "duration_us": "4823"
                    },
                    "ledger_entry": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "17806"
                    },
                    "server_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "2375580"
                    },
                    "account_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "5",
                        "duration_us": "9256"
                    },
                    "account_currencies": {
                        "started": "4",
                        "finished": "4",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "517302"
                    },
                    "noripple_check": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2218"
                    },
                    "tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "562"
                    },
                    "gateway_balances": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1395156"
                    },
                    "channel_authorize": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2017"
                    },
                    "manifest": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1707"
                    },
                    "subscribe": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "116"
                    },
                    "random": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "111"
                    },
                    "ledger_data": {
                        "started": "14",
                        "finished": "3",
                        "errored": "11",
                        "forwarded": "0",
                        "duration_us": "6179145"
                    },
                    "ripple_path_find": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1409563"
                    },
                    "account_channels": {
                        "started": "14",
                        "finished": "14",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1062692"
                    },
                    "submit": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "6",
                        "duration_us": "11383"
                    },
                    "transaction_entry": {
                        "started": "8",
                        "finished": "5",
                        "errored": "3",
                        "forwarded": "0",
                        "duration_us": "494131"
                    }
                },
                "subscriptions": {
                    "ledger": 0,
                    "transactions": 0,
                    "transactions_proposed": 0,
                    "manifests": 2,
                    "validations": 2,
                    "account": 0,
                    "accounts_proposed": 0,
                    "books": 0
                }
            },
            "load_factor": 1,
            "clio_version": "0.3.0-b2",
            "validation_quorum": 8,
            "rippled_version": "1.9.1-rc1",
            "validated_ledger": {
                "age": 4,
                "hash": "4CD25FB70D45646EE5822E76E58B66D39D5AE6BA0F70491FA803DA0DA218F434",
                "seq": 19977628,
                "base_fee_xrp": 1E-5,
                "reserve_base_xrp": 1E1,
                "reserve_inc_xrp": 2E0
            }
        },
        "cache": {
            "size": 8812733,
            "is_full": true,
            "latest_ledger_seq": 19977629
        },
        "etl": {
            "etl_sources": [
                {
                    "validated_range": "19405538-19977629",
                    "is_connected": "1",
                    "ip": "52.36.182.38",
                    "ws_port": "6005",
                    "grpc_port": "50051",
                    "last_msg_age_seconds": "0"
                }
            ],
            "is_writer": true,
            "read_only": false,
            "last_publish_age_seconds": "2"
        },
        "validated": true
    },
    "status": "success",
    "type": "response",
    "warnings": [
        {
            "id": 2001,
            "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include ledger_index:current in your request"
        },
        {
            "id": 2002,
            "message": "This server may be out of date"
        }
    ]
}
```

*JSON-RPC*

```json
200 OK

{
    "result": {
        "info": {
            "complete_ledgers": "19499132-19977628",
            "counters": {
                "rpc": {
                    "account_objects": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "991"
                    },
                    "account_tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "91633"
                    },
                    "account_lines": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "4915159"
                    },
                    "submit_multisigned": {
                        "started": "2",
                        "finished": "2",
                        "errored": "0",
                        "forwarded": "2",
                        "duration_us": "4823"
                    },
                    "ledger_entry": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "17806"
                    },
                    "server_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "2375580"
                    },
                    "account_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "5",
                        "duration_us": "9256"
                    },
                    "account_currencies": {
                        "started": "4",
                        "finished": "4",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "517302"
                    },
                    "noripple_check": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2218"
                    },
                    "tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "562"
                    },
                    "gateway_balances": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1395156"
                    },
                    "channel_authorize": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2017"
                    },
                    "manifest": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1707"
                    },
                    "subscribe": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "116"
                    },
                    "random": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "111"
                    },
                    "ledger_data": {
                        "started": "14",
                        "finished": "3",
                        "errored": "11",
                        "forwarded": "0",
                        "duration_us": "6179145"
                    },
                    "ripple_path_find": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1409563"
                    },
                    "account_channels": {
                        "started": "14",
                        "finished": "14",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1062692"
                    },
                    "submit": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "6",
                        "duration_us": "11383"
                    },
                    "transaction_entry": {
                        "started": "8",
                        "finished": "5",
                        "errored": "3",
                        "forwarded": "0",
                        "duration_us": "494131"
                    }
                },
                "subscriptions": {
                    "ledger": 0,
                    "transactions": 0,
                    "transactions_proposed": 0,
                    "manifests": 2,
                    "validations": 2,
                    "account": 0,
                    "accounts_proposed": 0,
                    "books": 0
                }
            },
            "load_factor": 1,
            "clio_version": "0.3.0-b2",
            "validation_quorum": 8,
            "rippled_version": "1.9.1-rc1",
            "validated_ledger": {
                "age": 4,
                "hash": "4CD25FB70D45646EE5822E76E58B66D39D5AE6BA0F70491FA803DA0DA218F434",
                "seq": 19977628,
                "base_fee_xrp": 1E-5,
                "reserve_base_xrp": 1E1,
                "reserve_inc_xrp": 2E0
            }
        },
        "cache": {
            "size": 8812733,
            "is_full": true,
            "latest_ledger_seq": 19977629
        },
        "etl": {
            "etl_sources": [
                {
                    "validated_range": "19405538-19977629",
                    "is_connected": "1",
                    "ip": "52.36.182.38",
                    "ws_port": "6005",
                    "grpc_port": "50051",
                    "last_msg_age_seconds": "0"
                }
            ],
            "is_writer": true,
            "read_only": false,
            "last_publish_age_seconds": "2"
        },
        "validated": true,
    },
    "status": "success",
    "type": "response",
    "warnings": [
        {
            "id": 2001,
            "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include ledger_index:current in your request"
        },
        {
            "id": 2002,
            "message": "This server may be out of date"
        }
    ]
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing an `info` object as its only field.

The `info` object may have some arrangement of the following fields:

| `Field`                             | Type            | Description          |
|:------------------------------------|:----------------|:---------------------|
| `complete_ledgers`                  | String          | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. This may be a disjoint sequence such as `24900901-24900984,24901116-24901158`. If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string `empty`. |
| `rpc`                               | Object array    | Stats on each RPC handled by the Clip server since startup. |
| `rpc.*.started`                     | Number          | Number of RPCs of this type that the Clio server has started processing since startup. |
| `rpc.*.finished`                    | Number          | Number of RPCs of this type that the Clio server has finished processing since startup. |
| `rpc.*.errored`                     | Number          | Number of RPCs of this type that have resulted in some sort of error since startup.  |
| `rpc.*.forwarded`                   | Number          | Number of RPCs of this type that the Clio server has forwarded to a `rippled` P2P server since startup. |
| `rpc.*.duration_us`                 | Number          | The total number of microseconds spent processing RPCs of this type since startup. | 
| `subscriptions`                     | Object          | Number of current subscribers for each stream type.  |
| `subscriptions.ledger`              |                 |   |
| `subscriptions.transactions`        |                 |   |
| `subscriptions.transactions_proposed` |               |   |
| `subscriptions.manifests`           |                 |   |
| `subscriptions.validations`         |                 |   |
| `subscriptions.account`             |                 |   |
| `subscriptions.accounts_proposed`   |                 |   |
| `subscriptions.books`               |                 |   |
| `load_factor`                       | Number          | The load-scaled open ledger transaction cost the server is currently enforcing, as a multiplier on the base transaction cost. For example, at `1000` load factor and a reference transaction cost of 10 drops of XRP, the load-scaled transaction cost is 10,000 drops (0.01 XRP). The load factor is determined by the highest of the [individual server's load factor](transaction-cost.html#local-load-cost), the cluster's load factor, the [open ledger cost](transaction-cost.html#open-ledger-cost) and the overall network's load factor. [Updated in: rippled 0.33.0][] |
| `clio_version`                      | String          |  The version number of the running `Clio` server.  |
| `validation_quorum`                 | Number          | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. This value is obtained from `rippled`. |
| `rippled_version`                   | String          |  The version number of the running `rippled` server that the `Clio` server is connected to. |
| `validated_ledger`                  | Object          | _(May be omitted)_ Information about the most recent fully-validated ledger. If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validated_ledger.age`              | Number          | The time since the ledger was closed, in seconds. |
| `validated_ledger.base_fee_xrp`     | Number          | Base fee, in XRP. This may be represented in scientific notation such as `1e-05` for 0.00001. |
| `validated_ledger.hash`             | String          | Unique hash for the ledger, as hexadecimal. |
| `validated_ledger.reserve_base_xrp` | Number          | Minimum amount of XRP (not drops) necessary for every account to keep in reserve |
| `validated_ledger.reserve_inc_xrp`  | Number          | Amount of XRP (not drops) added to the account reserve for each object an account owns in the ledger. |
| `validated_ledger.seq`              | Number          | The [ledger index][] of the latest validated ledger. |
| `validator_list_expires`            | String          | _(Admin only)_ Either the human readable time, in UTC, when the current validator list will expire, the string `unknown` if the server has yet to load a published validator list or the string `never` if the server uses a static validator list. [Updated in: rippled 1.5.0][] |
| `cache`                             | Object          | Information on Clio's state data cache. |
| `cache.size`                        | Number          | Number of state data objects currently in the cache. |
| `cache.is_full`                     | Boolean         | True if cache contains all state data for a specific ledger, false otherwise. Some RPCs, such as book_offers, process much faster when the cache is full. |
| `cache.latest_ledger_seq`           | Number          | The [ledger index][] of the latest validated ledger stored in the cache. |
| `etl`                               | Object          | The `rippled` sources (ETL sources) that the Clio server is connected to. |
| `etl.etl_sources`                   | Object Array    | List the `rippled` sources (ETL sources) that the Clio server is connected to and extracts data from. |
| `etl.etl_sources.validated_range`   | String          | The validated ledger range retrieved by the P2P `rippled` server. |
| `etl.etl_sources.is_connected`      | Boolean         | True if Clio is connected to this source via websocket, false otherwise. A value of false here could indicate a networking issue, or that `rippled` is not running, amongst other things. |
| `etl.etl_sources.ip`                | Number          | IP of the `rippled` server. |
| `etl.etl_sources.ws_port`           | Number          | Websocket port of the `rippled` server. |
| `etl.etl_sources.grpc_port`         | Number          | The gRPC connection port of the P2P `rippled` server that the Clio server is connected to. |
| `etl.etl_sources.last_msg_age_seconds` | Number       | Total seconds that have elapsed since Clio last heard anything from `rippled`. This should not be higher than 8. |
| `etl.is_writer`                     | Boolean         | True if this Clio server is currently writing data to the database, false otherwise. |
| `etl.read_only`                     | Boolean         | True if this Clio server is configured in read-only mode, false otherwise. |
| `etl.last_publish_age_seconds`      | Number          | Time in seconds that have elapsed since this Clio server last published a ledger. This should not be more than 8. |
| `validated`                         | Boolean         |  When true, this indicates that the response uses a ledger version that has been validated by consensus. In Clio, this is always true as Clio stores and returns validated ledger data. If a request was forwarded to `rippled` and the server returns current data, a missing or false value indicates that this ledger's data is not final. |
| `status`                            | String          |  Returns the status of the API request: `success` when the request completes successfully. |


## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
