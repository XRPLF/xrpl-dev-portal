---
html: connect.html
parent: peer-management-methods.html
blurb: Force the rippled server to connect to a specific peer.
labels:
  - Core Server
---
# connect
[[Source]](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/Connect.cpp "Source")

The `connect` command forces the `rippled` server to connect to a specific peer `rippled` server.

*The `connect` method is an [admin method](admin-api-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "command": "connect",
    "ip": "192.170.145.88",
    "port": 51235
}
```

*JSON-RPC*

```json
{
    "method": "connect",
    "params": [
        {
            "ip": "192.170.145.88",
            "port": 51235
        }
    ]
}
```


*Commandline*

```sh
#Syntax: connect ip [port]
rippled connect 192.170.145.88 51235
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `ip`    | String | IP address of the server to connect to                    |
| `port`  | Number | _(Optional)_ Port number to use when connecting. The default is **2459**. [Updated in: rippled 1.6.0][] |

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```json
{
   "result" : {
      "message" : "connecting",
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
      "message" : "connecting",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                            |
|:----------|:-------|:-------------------------------------------------------|
| `message` | String | The value `connecting`, if the command was successful. |

### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- Cannot connect in stand-alone mode - Network-related commands are disabled in stand-alone mode.
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
