---
html: log_level.html
parent: logging-and-data-management-methods.html
blurb: Get or modify log verbosity.
labels:
  - Data Retention
---
# log_level
[[Source]](https://github.com/XRPLF/rippled/blob/155fcdbcd0b4927152892c8c8be01d9cf62bed68/src/ripple/rpc/handlers/LogLevel.cpp "Source")

The `log_level` command changes the `rippled` server's logging verbosity, or returns the current logging level for each category (called a _partition_) of log messages.

_The `log_level` method is an [admin method](../index.md) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "ll1",
    "command": "log_level",
    "severity": "debug",
    "partition": "PathRequest"
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: log_level [[partition] severity]
rippled log_level PathRequest debug
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`     | Type   | Description                                           |
|:------------|:-------|:------------------------------------------------------|
| `severity`  | String | _(Optional)_ What level of verbosity to set logging at. Valid values are, in order from least to most verbose: `fatal`, `error`, `warn`, `info`, `debug`, and `trace`. If omitted, return current log verbosity for all categories. |
| `partition` | String | _(Optional)_ Ignored unless `severity` is provided. Which logging category to modify. If omitted, or if provided with the value `base`, set logging level for all categories. |

### Response Format

Examples of successful responses:

{% tabs %}

{% tab label="Commandline (set log level)" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success"
   }
}
```
{% /tab %}

{% tab label="Commandline (check log levels)" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "levels" : {
         "AmendmentTable" : "Error",
         "Application" : "Error",
         "CancelOffer" : "Error",
         "Collector" : "Error",
         "CreateOffer" : "Error",
         "DeferredCredits" : "Error",
         "FeeVote" : "Error",
         "InboundLedger" : "Error",
         "JobQueue" : "Error",
         "Ledger" : "Error",
         "LedgerCleaner" : "Error",
         "LedgerConsensus" : "Error",
         "LedgerEntrySet" : "Error",
         "LedgerMaster" : "Error",
         "LedgerTiming" : "Error",
         "LoadManager" : "Error",
         "LoadMonitor" : "Error",
         "NetworkOPs" : "Error",
         "NodeObject" : "Error",
         "OrderBookDB" : "Error",
         "Overlay" : "Error",
         "PathRequest" : "Debug",
         "Payment" : "Error",
         "Peer" : "Error",
         "PeerFinder" : "Error",
         "Protocol" : "Error",
         "RPC" : "Error",
         "RPCErr" : "Error",
         "RPCHandler" : "Error",
         "RPCManager" : "Error",
         "Resolver" : "Error",
         "Resource" : "Error",
         "RippleCalc" : "Error",
         "SHAMap" : "Error",
         "SHAMapStore" : "Error",
         "SNTPClient" : "Error",
         "STAmount" : "Error",
         "SerializedLedger" : "Error",
         "Server" : "Error",
         "SetAccount" : "Error",
         "SetTrust" : "Error",
         "TaggedCache" : "Error",
         "TransactionAcquire" : "Error",
         "TransactionEngine" : "Error",
         "UVL" : "Error",
         "UniqueNodeList" : "Error",
         "Validations" : "Error",
         "WALCheckpointer" : "Error",
         "WebSocket" : "Trace",
         "base" : "Error"
      },
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][]. The response format depends on whether the request specified a `severity`. If it did, the log level is changed and a successful result contains no additional fields.

Otherwise, the response contains the following field:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `level` | Object | The current log levels of each category. This list of categories is subject to change without notice in future releases. You can use the field names as values to `partition` in requests to this command. |

### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

{% raw-partial file="/_snippets/common-links.md" /%}
