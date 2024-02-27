---
html: node_to_shard.html
parent: logging-and-data-management-methods.html
seo:
    description: Copy data from the ledger store into the shard store.
labels:
  - Data Retention
---
# node_to_shard
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/rpc/handlers/NodeToShard.cpp "Source")

The {% code-page-name /%} method manages copying data from the ledger store to the [shard store](../../../../infrastructure/configuration/data-retention/history-sharding.md). It can start, stop, or check the status of copying the data.

_The {% code-page-name /%} method is an [admin method](../index.md) that cannot be run by unprivileged users._


### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "{% $frontmatter.seo.title %}",
    "action": "start"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
        "action": "start"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: {% $frontmatter.seo.title %} start|stop|status
rippled {% $frontmatter.seo.title %} start
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`  | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `action` | String | Either `start`, `stop` or `status` depending on what action to take. |


### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "message": "Database import initiated..."
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result" : {
      "message" : "Database import initiated...",
      "status" : "success"
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
      "message" : "Database import initiated...",
      "status" : "success"
   }
}

```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | String | A human-readable message indicating the action taken in response to the command. |


### Possible Errors

- Any of the [universal error types][].
- `internal` - If you attempt an invalid operation like checking the status of a copy when one isn't running.
- `notEnabled` - If the server is not configured to store [history shards](../../../../infrastructure/configuration/data-retention/history-sharding.md).
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
