# ping
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

The `ping` command returns an acknowledgement, so that clients can test the connection status and latency.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 1,
    "command": "ping"
}
```

*JSON-RPC*

```
{
    "method": "ping",
    "params": [
        {}
    ]
}
```

*Commandline*

```
#Syntax: ping
rippled ping
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#ping)

The request includes no parameters.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 1,
    "result": {},
    "status": "success",
    "type": "response"
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "status": "success"
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing no fields. The client can measure the round-trip time from request to response as latency.

## Possible Errors

* Any of the [universal error types][].

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
