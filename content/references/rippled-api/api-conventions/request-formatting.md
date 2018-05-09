# Request Formatting

## WebSocket Format  

After you open a WebSocket to the `rippled` server, you can send commands as a [JSON](https://en.wikipedia.org/wiki/JSON) object, with the following attributes:

* Put command name in top-level `"command"` field
* All the relevant parameters for the command are also in the top level
* Optionally include an `"id"` field with an arbitrary value. The response to this request uses the same `"id"` field. This way, even if responses arrive out of order, you know which request prompted which response.

The response comes as a JSON object.

## JSON-RPC Format

To make a JSON-RPC request, send an HTTP **POST** request to the root path (`/`) on the port and IP where the `rippled` server is listening for JSON-RPC connections. You can use HTTP/1.0 or HTTP/1.1. If you use HTTPS, you should use TLS v1.2. For security reasons, `rippled` _does not support_ SSL v3 or earlier.

Always include a `Content-Type` header with the value `application/json`.

If you plan on making multiple requests, use [Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3) so that you do not have to close and re-open the connection in between requests.

Send request body as a [JSON](https://en.wikipedia.org/wiki/JSON) object with the following attributes:

* Put the command in the top-level `"method"` field
* Include a top-level `"params"` field. The contents of this field should be **a one-item array** containing only a nested JSON object with all the parameters for the command.

The response is also a JSON object.

## Commandline Format

The commandline puts the command after any normal (dash-prefaced) commandline options, followed by a limited set of parameters, separated by spaces. For any parameter values that might contain spaces or other unusual characters, use single-quotes to encapsulate them.

### Example Request

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
