# Introduction to rippled APIs

To communicate directly with a [`rippled` server](concept-rippled.html), you can use either the WebSocket API or the JSON-RPC API. Both APIs use the same list of commands, with almost entirely the same parameters in each command. Alternatively, you can use [RippleAPI](reference-rippleapi.html), which is a simplified JavaScript client library, which communicates directly with a `rippled` server from [Node.js](http://nodejs.org/) or a web browser.

* The WebSocket API uses the [WebSocket protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), available in most browsers and Javascript implementations, to achieve persistent two-way communication. There is not a 1:1 correlation between requests and responses. Some requests prompt the server to send multiple messages back asynchronously; other times, responses may arrive in a different order than the requests that prompted them. The `rippled` server can be configured to accept secured (wss:), unsecured (ws:) WebSocket connections, or both.
* The JSON-RPC API relies on request-response communication via HTTP or HTTPS. (The `rippled` server can be configured to accept HTTP, HTTPS, or both.) For commands that prompt multiple responses, you can provide a callback URL.

In general, we recommend using WebSocket, because WebSocket's push paradigm has less latency and less network overhead. WebSocket is also more reliable; you can worry less about missing messages and establishing multiple connections. On the other hand, there is widespread support for JSON-RPC because you can use a standard HTTP library to connect to `rippled`'s JSON-RPC API.

**Note:** The `rippled` program can also be used as a quick commandline client to make JSON-RPC requests to a running `rippled` server. The commandline interface is intended for administrative purposes only and is _not a supported API_.

For more information on `rippled`'s APIs, see:

- [`rippled` API Conventions](reference-rippled-api-conventions.html)
- [Public `rippled` API Methods](reference-rippled-api-public.html)
- [Admin `rippled` API Methods](reference-rippled-api-admin.html)


## Changes to the APIs

The WebSocket and JSON-RPC APIs are still in development, and are subject to change. If you want to be notified of upcoming changes and future versions of `rippled`, subscribe to the Ripple Server mailing list:

[https://groups.google.com/forum/#!forum/ripple-server](https://groups.google.com/forum/#!forum/ripple-server)

## Connecting to rippled

Before you can run any commands against a `rippled` server, you must know which server you are connecting to. Most servers are configured not to accept API requests directly from the outside network.

Alternatively, you can [run your own local copy of `rippled`](tutorial-rippled-setup.html). This is required if you want to access any of the [admin methods](reference-rippled-api-admin.html). In this case, you should use whatever IP and port you configured the server to bind. (For example, `127.0.0.1:54321`)

### Admin Connections

To access `rippled`'s admin functionality, you must connect from a port/IP address marked as admin in the config file.

The [example config file](https://github.com/ripple/rippled/blob/master/doc/rippled-example.cfg#L907-L930) listens for connections on the local loopback network (127.0.0.1), with JSON-RPC (HTTP) on port 5005 and WebSocket (WS) on port 6006, and treats all connected clients as admin.



### WebSocket API

If you are looking to try out some methods on the XRP Ledger, you can skip writing your own WebSocket code and go straight to using the API at the [Ripple WebSocket API Tool](ripple-api-tool.html). Later on, when you want to connect to your own `rippled` server, you can [build your own client in the browser](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) or [in Node.js](https://www.npmjs.com/package/ws).

#### Request Formatting

After you open a WebSocket to the `rippled` server, you can send commands as a [JSON](https://en.wikipedia.org/wiki/JSON) object, with the following attributes:

* Put command name in top-level `"command"` field
* All the relevant parameters for the command are also in the top level
* Optionally include an `"id"` field with an arbitrary value. The response to this request uses the same `"id"` field. This way, even if responses arrive out of order, you know which request prompted which response.

The response comes as a JSON object.

#### Public Servers

Currently Ripple (the company) maintains a set of public WebSocket servers at:

| `Domain`        | Port | Notes                                 |
|:----------------|:-----|:--------------------------------------|
| `s1.ripple.com` | 443  | `wss://` only; general purpose server |
| `s2.ripple.com` | 443  | `wss://` only; full-history server    |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.


### JSON-RPC

You can use any HTTP client (like [Poster for Firefox](https://addons.mozilla.org/en-US/firefox/addon/poster/) or [Postman for Chrome](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)) to make JSON-RPC calls a `rippled` server. Most programming languages have a library for making HTTP requests built in.

#### Request Formatting

To make a JSON-RPC request, send an HTTP **POST** request to the root path (`/`) on the port and IP where the `rippled` server is listening for JSON-RPC connections. You can use HTTP/1.0 or HTTP/1.1. If you use HTTPS, you should use TLS v1.2. For security reasons, `rippled` _does not support_ SSL v3 or earlier.

Always include a `Content-Type` header with the value `application/json`.

If you plan on making multiple requests, use [Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3) so that you do not have to close and re-open the connection in between requests.

Send request body as a [JSON](https://en.wikipedia.org/wiki/JSON) object with the following attributes:

* Put the command in the top-level `"method"` field
* Include a top-level `"params"` field. The contents of this field should be **a one-item array** containing only a nested JSON object with all the parameters for the command.

The response is also a JSON object.

#### Public Servers

Currently, Ripple (the company) maintains a set of public JSON-RPC servers at:

| `Domain`        | Port  | Notes                  |
|:----------------|:------|:-----------------------|
| `s1.ripple.com` | 51234 | General purpose server |
| `s2.ripple.com` | 51234 | Full-history server    |

These public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so.


### Commandline

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. As a commandline client, `rippled` connects to the local instance. For example:

```
rippled --conf=/etc/rippled.cfg server_info
```

**Note:** The commandline interface is intended for administrative purposes only and is _not a supported API_.


#### Request Formatting

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

#### Example Successful Response

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
| `type`          | String   | (WebSocket only) The value `response` indicates a successful response to a command. [Subscription notifications](reference-rippled-api-public.html#subscriptions) use a different value such as `ledgerClosed` or `transaction`. |
| `result`        | Object   | The result of the query; contents vary depending on the command. |

#### Commandline
The response format for commandline methods is the same as JSON-RPC responses, because they use the same interface.

## Error Responses
It is impossible to list all the possible ways an error can occur. Some may occur in the transport layer (for example, loss of network connectivity), in which case the results vary depending on what client and transport you are using. However, if the `rippled` server successfully receives your request, it tries to respond in a standardized error format.

Some example errors:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 3,
  "status": "error",
  "type": "response",
  "error": "ledgerIndexMalformed",
  "request": {
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "command": "account_info",
    "id": 3,
    "ledger_index": "-",
    "strict": true
  }
}
```

*JSON-RPC*

```
HTTP Status: 200 OK
{
    "result": {
        "error": "ledgerIndexMalformed",
        "request": {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "command": "account_info",
            "ledger_index": "-",
            "strict": true
        },
        "status": "error"
    }
}
```

*Commandline*

```
{
    "result": {
        "error": "ledgerIndexMalformed",
        "request": {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "command": "account_info",
            "ledger_index": "-",
            "strict": true
        },
        "status": "error"
    }
}
```

<!-- MULTICODE_BLOCK_END -->

#### WebSocket API Error Response Format
| `Field`   | Type     | Description                                           |
|:----------|:---------|:------------------------------------------------------|
| `id`      | (Varies) | ID provided in the Web Socket request that prompted this response |
| `status`  | String   | `"error"` if the request caused an error              |
| `type`    | String   | Typically `"response"`, which indicates a successful response to a command. |
| `error`   | String   | A unique code for the type of error that occurred     |
| `request` | Object   | A copy of the request that prompted this error, in JSON format. **Caution:** If the request contained any account secrets, they are copied here! |

#### JSON-RPC API Error Response Format
Some JSON-RPC request respond with an error code on the HTTP layer. In these cases, the response is a plain-text explanation in the response body. For example, if you forgot to specify the command in the `method` parameter, the response is like this:

```
HTTP Status: 400 Bad Request
Null method
```

For other errors that returned with HTTP status code 200 OK, the responses are formatted in JSON, with the following fields:

| `Field`          | Type   | Description                                      |
|:-----------------|:-------|:-------------------------------------------------|
| `result`         | Object | Object containing the response to the query      |
| `result.error`   | String | A unique code for the type of error that occurred |
| `result.status`  | String | `"error"` if the request caused an error         |
| `result.request` | Object | A copy of the request that prompted this error, in JSON format. **Caution:** If the request contained any account secrets, they are copied here! **Note:** The request is re-formatted in WebSocket format, regardless of the request made. |

**Warning:** Error messages contain the entire request that prompted them, including any secrets that were passed as part of the request. When logging, debugging, and sharing error messages, be very careful not to accidentally expose important account secrets to others.


## Modifying the Ledger

All changes to the XRP Ledger happen as the result of transactions. The only API methods that can change the contents of the XRP Ledger are the commands that submit transactions. Even then, changes only apply permanently if the transactions are approved by the [consensus process](concept-consensus.html). Most other public methods represent different ways to view the data represented in the XRP Ledger, or request information about the state of the server.

Transaction submission commands:

- [`submit` command](reference-rippled-api-public.html#submit)
- [`submit_multisigned` command](reference-rippled-api-public.html#submit-multisigned)

For more information on the various transactions you can submit, see the [Transaction Reference](reference-transaction-format.html).


<!--{# Common link includes #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}
