---
html: get_counts.html
parent: status-and-debugging-methods.html
seo:
    description: Get statistics about the server's internals and memory usage.
labels:
  - Core Server
---
# get_counts
[[Source]](https://github.com/XRPLF/rippled/blob/c7118a183a660648aa88a3546a6b2c5bce858440/src/ripple/rpc/handlers/GetCounts.cpp "Source")

The `get_counts` command provides various stats about the health of the server, mostly the number of objects of different types that it currently holds in memory.

_The `get_counts` method is an [admin method](../index.md) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 90,
    "command": "get_counts",
    "min_count": 100
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "get_counts",
    "params": [
        {
            "min_count": 100
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: get_counts [min_count]
rippled get_counts 100
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`     | Type                      | Description                        |
|:------------|:--------------------------|:-----------------------------------|
| `min_count` | Number (Unsigned Integer) | Only return fields with a value at least this high. |

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
   "result" : {
      "AL_hit_rate" : 48.36725616455078,
      "HashRouterEntry" : 3048,
      "Ledger" : 46,
      "NodeObject" : 10417,
      "SLE_hit_rate" : 64.62035369873047,
      "STArray" : 1299,
      "STLedgerEntry" : 646,
      "STObject" : 6987,
      "STTx" : 4104,
      "STValidation" : 610,
      "Transaction" : 4069,
      "dbKBLedger" : 10733,
      "dbKBTotal" : 39069,
      "dbKBTransaction" : 26982,
      "fullbelow_size" : 0,
      "historical_perminute" : 0,
      "ledger_hit_rate" : 71.0565185546875,
      "node_hit_rate" : 3.808214902877808,
      "node_read_bytes" : 393611911,
      "node_reads_hit" : 1283098,
      "node_reads_total" : 679410,
      "node_writes" : 1744285,
      "node_written_bytes" : 794368909,
      "status" : "success",
      "treenode_cache_size" : 6650,
      "treenode_track_size" : 598631,
      "uptime" : "3 hours, 50 minutes, 27 seconds",
      "write_load" : 0
   }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "AL_hit_rate" : 48.36725616455078,
      "HashRouterEntry" : 3048,
      "Ledger" : 46,
      "NodeObject" : 10417,
      "SLE_hit_rate" : 64.62035369873047,
      "STArray" : 1299,
      "STLedgerEntry" : 646,
      "STObject" : 6987,
      "STTx" : 4104,
      "STValidation" : 610,
      "Transaction" : 4069,
      "dbKBLedger" : 10733,
      "dbKBTotal" : 39069,
      "dbKBTransaction" : 26982,
      "fullbelow_size" : 0,
      "historical_perminute" : 0,
      "ledger_hit_rate" : 71.0565185546875,
      "node_hit_rate" : 3.808214902877808,
      "node_read_bytes" : 393611911,
      "node_reads_hit" : 1283098,
      "node_reads_total" : 679410,
      "node_writes" : 1744285,
      "node_written_bytes" : 794368909,
      "status" : "success",
      "treenode_cache_size" : 6650,
      "treenode_track_size" : 598631,
      "uptime" : "3 hours, 50 minutes, 27 seconds",
      "write_load" : 0
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][]. The list of fields contained in the result is subject to change without notice, but it may contain any of the following (among others):

| `Field`       | Type   | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `Transaction` | Number | The number of `Transaction` objects in memory       |
| `Ledger`      | Number | The number of ledgers in memory                     |
| `uptime`      | String | The amount of time this server has been running uninterrupted. |

For most other entries, the value indicates the number of objects of that type currently in memory.

### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
