---
html: stop.html
parent: server-control-methods.html
seo:
    description: Shut down the rippled server.
labels:
  - Core Server
---
# stop
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Stop.cpp "Source")

Gracefully shuts down the server.

*The `stop` method is an [admin method](../index.md) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 0,
    "command": "stop"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "stop",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: stop
rippled stop
```
{% /tab %}

{% /tabs %}

The request includes no parameters.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
   "result" : {
      "message" : "ripple server stopping",
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
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                          |
|:----------|:-------|:-------------------------------------|
| `message` | String | `ripple server stopping` on success. |

### Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
