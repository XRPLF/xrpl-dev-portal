## stop
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/rpc/handlers/Stop.cpp "Source")

Gracefully shuts down the server.

*The `stop` request is an [admin command][] that cannot be run by unprivileged users!*

#### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 0,
    "command": "stop"
}
```

*JSON-RPC*

```
{
    "method": "stop",
    "params": [
        {}
    ]
}
```

*Commandline*

```
rippled stop
```

<!-- MULTICODE_BLOCK_END -->

The request includes no parameters.

#### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                          |
|:----------|:-------|:-------------------------------------|
| `message` | String | `ripple server stopping` on success. |

#### Possible Errors

* Any of the [universal error types][].
