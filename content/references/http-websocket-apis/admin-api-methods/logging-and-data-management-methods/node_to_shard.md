---
html: node_to_shard.html
parent: logging-and-data-management-methods.html
blurb: Copy data from the ledger store into the shard store.
labels:
  - Data Retention
---
# node_to_shard
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/rpc/handlers/NodeToShard.cpp "Source")

The `{{currentpage.name}}` method manages copying data from the ledger store to the [shard store](history-sharding.html). It can start, stop, or check the status of copying the data.

_The `{{currentpage.name}}` method is an [admin method](admin-api-methods.html) that cannot be run by unprivileged users._


### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "command": "{{currentpage.name}}",
    "action": "start"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
        "action": "start"
    }]
}
```

*Commandline*

```sh
#Syntax: {{currentpage.name}} start|stop|status
rippled {{currentpage.name}} start
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`  | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `action` | String | Either `start`, `stop` or `status` depending on what action to take. |


### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "message": "Database import initiated..."
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
   "result" : {
      "message" : "Database import initiated...",
      "status" : "success"
   }
}

```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "message" : "Database import initiated...",
      "status" : "success"
   }
}

```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | String | A human-readable message indicating the action taken in response to the command. |


### Possible Errors

- Any of the [universal error types][].
- `internal` - If you attempt an invalid operation like checking the status of a copy when one isn't running.
- `notEnabled` - If the server is not configured to store [history shards](history-sharding.html).
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
