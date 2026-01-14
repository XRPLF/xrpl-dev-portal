---
seo:
    description: Retrieve status of the server in human-readable format.
labels:
    - Core Server
---
# server_info (rippled)
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/ServerInfo.cpp "Source")

The `server_info` command asks the server for a human-readable version of various information about [the `rippled` server](../../../../concepts/networks-and-servers/index.md) being queried. For [Clio servers](../../../../concepts/networks-and-servers/the-clio-server.md), see [`server_info` (Clio)](../clio-methods/server_info-clio.md) instead.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "server_info",
  "counters": false
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "server_info",
    "params": [
        {"counters" : false}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: server_info [counters]
# counters is an optional boolean value, it is used to display performance metrics
rippled server_info
```
{% /tab %}

{% /tabs %}

{% try-it method="server_info" server="xrplcluster" /%}

The request includes the following parameters:

| Field                 | Type    | Required? | Description |
|:----------------------|:--------|:----------|-------------|
| `counters`            | Boolean | No        | If `true`, return metrics about the job queue, ledger store, and API method activity. The default is `false`. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/server_info/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/server_info/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/server_info/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2023-Sep-13 22:19:39.404596100 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing an `info` object as its only field.

The `info` object may have some arrangement of the following fields:

| `Field`                             | Type            | Description          |
|:------------------------------------|:----------------|:---------------------|
| `amendment_blocked`                 | Boolean         | _(May be omitted)_ If `true`, this server is [amendment blocked](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers). If the server is not amendment blocked, the response omits this field. |
| `build_version`                     | String          | The version number of the running `rippled` server. |
| `closed_ledger`                     | Object          | _(May be omitted)_ Information on the most recently closed ledger that has not been validated by consensus, as a [Server Ledger Object](#server-ledger-object). If the most recently validated ledger is available, the response omits this field and includes `validated_ledger` instead. |
| `complete_ledgers`                  | String          | Range expression indicating the sequence numbers of the ledger versions the local `rippled` has in its database. This may be a disjoint sequence such as `24900901-24900984,24901116-24901158`. If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string `empty`. |
| `git`                               | Object          | _(Admin only)_ The Git details of your `rippled` build. |
| `git.branch`                        | String          | _(Admin only)_ The Git branch used to build your version of `rippled`. |
| `git.hash`                          | String          | _(Admin only)_ The Git hash of the commit used to build your version of `rippled`. |
| `hostid`                            | String          | On an admin request, returns the hostname of the server running the `rippled` instance; otherwise, returns a single [RFC-1751][] word based on the [node public key](../../../../concepts/networks-and-servers/peer-protocol.md#node-key-pair). |
| `io_latency_ms`                     | Number          | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the `rippled` server is probably having serious load issues. |
| `jq_trans_overflow`                 | String - Number | The number of times (since starting up) that this server has had over 250 transactions waiting to be processed at once. A large number here may mean that your server is unable to handle the transaction load of the XRP Ledger network. For detailed recommendations of future-proof server specifications, see [Capacity Planning](../../../../infrastructure/installation/capacity-planning.md). |
| `last_close`                        | Object          | Information about the last time the server closed a ledger, including the amount of time it took to reach a consensus and the number of trusted validators participating. |
| `last_close.converge_time_s`          | Number          | The amount of time it took to reach a consensus on the most recently validated ledger version, in seconds. |
| `last_close.proposers`              | Number          | How many trusted validators the server considered (including itself, if configured as a validator) in the consensus process for the most recently validated ledger version. |
| `load`                              | Object          | _(Admin only)_ Detailed information about the current load state of the server. |
| `load.job_types`                    | Array           | _(Admin only)_ Information about the rate of different types of jobs the server is doing and how much time it spends on each. |
| `load.threads`                      | Number          | _(Admin only)_ The number of threads in the server's main job pool. |
| `load_factor`                       | Number          | The multiplier to the [transaction cost][] the server is currently enforcing. For example, at `1000` load factor and a reference transaction cost of 10 drops of XRP, the load-scaled transaction cost is 10,000 drops (0.01 XRP). The load factor is determined by the highest of the individual server's load factor, the cluster's load factor, the open ledger cost, and the overall network's load factor. |
| `load_factor_local`                 | Number          | _(May be omitted)_ The current multiplier to the transaction cost based on load to this server. |
| `load_factor_net`                   | Number          | _(May be omitted)_ The current multiplier to the transaction cost being used by the rest of the network (estimated from other servers' reported load values). |
| `load_factor_cluster`               | Number          | _(May be omitted)_ The current multiplier to the transaction cost based on load to servers in this [cluster](../../../../concepts/networks-and-servers/clustering.md). |
| `load_factor_fee_escalation`        | Number          | _(May be omitted)_ The current multiplier to the transaction cost that a transaction must pay to get into the open ledger. |
| `load_factor_fee_queue`             | Number          | _(May be omitted)_ The current multiplier to the transaction cost that a transaction must pay to get into the queue, if the queue is full. |
| `load_factor_server`                | Number          | _(May be omitted)_ The current multiplier to the transaction cost based on load to the server, cluster, and network, but not factoring in the open ledger cost. |
| `network_ledger`                    | String          | _(May be omitted)_ When [starting the server with the `--net` parameter](../../../../infrastructure/commandline-usage.md), this field contains the string `waiting` while the server is syncing to the network. The field is omitted otherwise. |
| `peers`                             | Number          | How many other `rippled` servers this one is currently connected to. |
| `ports`                             | Array           | A list of ports where the server is listening for API commands. Each entry in the array is a [Port Descriptor object](#port-descriptor-object). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}New in: rippled 1.12.0{% /badge %} |
| `pubkey_node`                       | String          | Public key used to verify this server for peer-to-peer communications. This [_node key pair_](../../../../concepts/networks-and-servers/peer-protocol.md#node-key-pair) is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the `[node_seed]` config option, which is useful for [clustering](../../../../concepts/networks-and-servers/clustering.md). |
| `pubkey_validator`                  | String          | _(Admin only)_ Public key used by this node to sign ledger validations. This _validation key pair_ is derived from the `[validator_token]` or `[validation_seed]` config field. |
| `server_state`                      | String          | A string indicating to what extent the server is participating in the network. See [Possible Server States](../../api-conventions/rippled-server-states.md) for more details. |
| `server_state_duration_us`          | Number          | The number of consecutive microseconds the server has been in the current state. |
| `state_accounting`                  | Object          | A map of various [server states](../../api-conventions/rippled-server-states.md) with information about the time the server spends in each. This can be useful for tracking the long-term health of your server's connectivity to the network. The contents of this field are formatted as [State Accounting Objects](#state-accounting-object). || `time`                              | String          | The current time in UTC, according to the server's clock. |
| `uptime`                            | Number          | Number of consecutive seconds that the server has been operational. |
| `validated_ledger`                  | Object          | _(May be omitted)_ Information about the most recent fully-validated ledger, as a [Server Ledger Object](#server-ledger-object). If the most recent validated ledger is not available, the response omits this field and includes `closed_ledger` instead. |
| `validation_quorum`                 | Number          | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires`            | String          | _(Admin only)_ Either the human readable time, in UTC, when the current validator list expires, the string `unknown` if the server has yet to load a published validator list or the string `never` if the server uses a static validator list. |
| `counters`            | Object          | This object contains performance metrics pertaining to the RPC calls (currently executing calls and completed calls) and the JobQueue. It also contains details of the nodestore like `node_writes`, `node_reads_total`, `node_reads_hit`, etc|
| `current_activity`            | Object          | This field lists the items currently being run in the job queue and contains two arrays for `jobs` and `methods`. |

{% partial file="/docs/_snippets/port-descriptor-object.md" /%}

{% partial file="/docs/_snippets/state-accounting-object.md" /%}

### Server Ledger Object

The response provides either a `validated_ledger` field or a `closed_ledger` field. Either field contains an object with the following fields:

| Field              | Value             | Description |
|--------------------|-------------------|-------------|
| `age`              | Number            | The time since the ledger was closed, in seconds. |
| `base_fee_xrp`     | Number            | Base fee, in XRP (not drops). This may be represented in scientific notation such as `1e-05` for 0.00001. |
| `hash`             | String - [Hash][] | Unique hash for the ledger, as hexadecimal. |
| `reserve_base_xrp` | Number            | Minimum amount of XRP (not drops) necessary for every account to keep in reserve |
| `reserve_inc_xrp`  | Number            | Amount of XRP (not drops) added to the account reserve for each object an account owns in the ledger. |
| `seq`              | Number            | The [ledger index][] of the latest validated ledger. |

Note that the [server_state method][] provides a similar object with slightly different formatting (using drops of XRP instead of decimal XRP, for example).

{% admonition type="info" name="Note" %}If the `closed_ledger` field is present and has a small `seq` value (less than 8 digits), that indicates `rippled` does not currently have a copy of the validated ledger from the peer-to-peer network. This could mean your server is still syncing. Typically, it takes up to 15 minutes to sync with the network, depending on your connection speed and hardware specs. See [Server Doesn't Sync](/docs/infrastructure/troubleshooting/server-doesnt-sync.md) for troubleshooting information.{% /admonition %}

## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
