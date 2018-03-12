## logrotate
[[Source]<br>](https://github.com/ripple/rippled/blob/743bd6c9175c472814448ea889413be79dfd1c07/src/ripple/rpc/handlers/LogRotate.cpp "Source")

The `logrotate` command closes and reopens the log file. This is intended to help with log rotation on Linux file systems.

_The `logrotate` method is an [admin command][] that cannot be run by unprivileged users._

#### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": "lr1",
    "command": "logrotate"
}
```

*Commandline*

```
rippled logrotate
```

<!-- MULTICODE_BLOCK_END -->

The request includes no parameters.

#### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
200 OK
{
   "result" : {
      "message" : "The log file was closed and reopened.",
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
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | String | On success, contains the message `The log file was closed and reopened.` |

#### Possible Errors

* Any of the [universal error types][].
