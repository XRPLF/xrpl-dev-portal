---
html: ping.html
parent: utility-methods.html
seo:
    description: Confirm connectivity with the server.
labels:
  - Core Server
---
# ping
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/rpc/handlers/Ping.cpp "Source")

The `ping` command returns an acknowledgement, so that clients can test the connection status and latency.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "command": "ping"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ping",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: ping
rippled ping
```
{% /tab %}

{% /tabs %}

{% try-it method="ping" /%}

The request includes no parameters.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "result": {},
    "status": "success",
    "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "status": "success"
    }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing no fields. The client can measure the round-trip time from request to response as latency.

## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
