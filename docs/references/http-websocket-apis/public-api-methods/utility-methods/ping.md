---
html: ping.html
parent: utility-methods.html
seo:
    description: Confirm connectivity with the server.
labels:
  - Core Server
---
# ping
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

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

[Try it! >](/resources/dev-tools/websocket-api-tool#ping)

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
