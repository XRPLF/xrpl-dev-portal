# Error Formatting

It is impossible to list all the possible ways an error can occur. Some may occur in the transport layer (for example, loss of network connectivity), in which case the results vary depending on what client and transport you are using. However, if the `rippled` server successfully receives your request, it tries to respond in a standardized error format.

**Caution:** When your request results in an error, the entire request is copied back as part of the response, so that you can try to debug the error. However, this also includes any secrets that were passed as part of the request. When sharing error messages, be very careful not to accidentally expose important account secrets to others.


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


## WebSocket Format

| `Field`   | Type     | Description                                           |
|:----------|:---------|:------------------------------------------------------|
| `id`      | (Varies) | ID provided in the Web Socket request that prompted this response |
| `status`  | String   | `"error"` if the request caused an error              |
| `type`    | String   | Typically `"response"`, which indicates a successful response to a command. |
| `error`   | String   | A unique code for the type of error that occurred     |
| `request` | Object   | A copy of the request that prompted this error, in JSON format. **Caution:** If the request contained any account secrets, they are copied here! |


## JSON-RPC Format

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


## Universal Errors

All methods can potentially return any of the following values for the `error` code:

* `unknownCmd` - The request does not contain a [command](rippled-api.html) that the `rippled` server recognizes.
* `jsonInvalid` - (WebSocket only) The request is not a proper JSON object.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `missingCommand` - (WebSocket only) The request did not specify a `command` field.
    * JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
* `tooBusy` - The server is under too much load to do this command right now. Generally not returned if you are connected as an admin.
* `noNetwork` - The server is having trouble connecting to the rest of the XRP Ledger peer-to-peer network (and is not running in stand-alone mode).
* `noCurrent` - The server does not know what the current ledger is, due to high load, network problems, validator failures, incorrect configuration, or some other problem.
* `noClosed` - The server does not have a closed ledger, typically because it has not finished starting up.
* `wsTextRequired` - (WebSocket only) The request's [opcode](https://tools.ietf.org/html/rfc6455#section-5.2) is not text.
* `amendmentBlocked` - The server is [amendment blocked](amendments.html#amendment-blocked) and needs to be updated to the latest version to stay synced with the XRP Ledger network.
