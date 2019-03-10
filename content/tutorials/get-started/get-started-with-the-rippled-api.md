# Get Started with the rippled API

Before you can run any commands against a `rippled` server, you must know which server you are connecting to. Most servers are configured not to accept API requests directly from the outside network.

Alternatively, you can [run your own local copy of `rippled`](install-rippled.html). This is required if you want to access any of the [Admin Methods](admin-rippled-methods.html). In this case, you should use whatever IP and port you configured the server to bind. (For example, `127.0.0.1:54321`) Additionally, to access admin functionality, you must connect from a port/IP address marked as admin in the config file.

The [example config file](https://github.com/ripple/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1050-L1073) listens for connections on the local loopback network (127.0.0.1), with JSON-RPC (HTTP) on port 5005 and WebSocket (WS) on port 6006, and treats all connected clients as admin.

## WebSocket API

If you are looking to try out some methods on the XRP Ledger, you can skip writing your own WebSocket code and go straight to using the API at the [Ripple WebSocket API Tool](websocket-api-tool.html). Later on, when you want to connect to your own `rippled` server, you can [build your own client in the browser](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) or [in Node.js](https://www.npmjs.com/package/ws).

### Request Formatting

After you open a WebSocket to the `rippled` server, you can send commands as a [JSON](https://en.wikipedia.org/wiki/JSON) object, with the following attributes:

* Put command name in top-level `"command"` field
* All the relevant parameters for the command are also in the top level
* Optionally include an `"id"` field with an arbitrary value. The response to this request uses the same `"id"` field. This way, even if responses arrive out of order, you know which request prompted which response.

The response comes as a JSON object.

### Public Servers

Currently Ripple (the company) maintains a set of public WebSocket servers at:

| `Domain`        | Port | Notes                                 |
|:----------------|:-----|:--------------------------------------|
| `s1.ripple.com` | 443  | `wss://` only; general purpose server |
| `s2.ripple.com` | 443  | `wss://` only; full-history server    |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.


## JSON-RPC

You can use any HTTP client (like [RESTED for Firefox](https://addons.mozilla.org/en-US/firefox/addon/rested/) or [Postman for Chrome](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)) to make JSON-RPC calls a `rippled` server. Most programming languages have a library for making HTTP requests built in.

### Request Formatting

To make a JSON-RPC request, send an HTTP **POST** request to the root path (`/`) on the port and IP where the `rippled` server is listening for JSON-RPC connections. You can use HTTP/1.0 or HTTP/1.1. If you use HTTPS, you should use TLS v1.2. For security reasons, `rippled` _does not support_ SSL v3 or earlier.

Always include a `Content-Type` header with the value `application/json`.

If you plan on making multiple requests, use [Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3) so that you do not have to close and re-open the connection in between requests.

Send request body as a [JSON](https://en.wikipedia.org/wiki/JSON) object with the following attributes:

* Put the command in the top-level `"method"` field
* Include a top-level `"params"` field. The contents of this field should be **a one-item array** containing only a nested JSON object with all the parameters for the command.

The response is also a JSON object.

## Commandline

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. As a commandline client, `rippled` connects to the local instance. For example:

```
rippled --conf=/etc/rippled.cfg server_info
```

**Note:** The commandline interface is intended for administrative purposes only and is _not a supported API_.


### Request Formatting

The commandline puts the command after any normal (dash-prefaced) commandline options, followed by a limited set of parameters, separated by spaces. For any parameter values that might contain spaces or other unusual characters, use single-quotes to encapsulate them.

## Example Request

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": true,
  "ledger_index": "validated"
}
```

*JSON-RPC*

```
POST http://s1.ripple.com:51234/
{
    "method": "account_info",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "strict": true,
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated true
```

<!-- MULTICODE_BLOCK_END -->

## Response Formatting

### Example Successful Response

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "27389517749",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 18,
      "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
      "PreviousTxnLgrSeq": 6592159,
      "Sequence": 1400,
      "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
    },
    "ledger_index": 6760970
  }
}
```

*JSON-RPC*

```
HTTP Status: 200 OK
{
    "result": {
        "account_data": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "ledger_index": 6761012,
        "status": "success"
    }
}
```
*Commandline*

```
{
    "result": {
        "account_data": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "ledger_index": 6761012,
        "status": "success"
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The fields of a successful response include:

| `Field`         | Type     | Description                                     |
|:----------------|:---------|:------------------------------------------------|
| `id`            | (Varies) | (WebSocket only) ID provided in the request that prompted this response |
| `status`        | String   | (WebSocket only) The value `success` indicates the request was successfully received and understood by the server. |
| `result.status` | String   | (JSON-RPC and Commandline) The value `success` indicates the request was successfully received and understood by the server. |
| `type`          | String   | (WebSocket only) The value `response` indicates a successful response to a command. [Asynchronous notifications](subscribe.html) use a different value such as `ledgerClosed` or `transaction`. |
| `result`        | Object   | The result of the query; contents vary depending on the command. |

### Commandline
The response format for commandline methods is the same as JSON-RPC responses, because they use the same interface.
