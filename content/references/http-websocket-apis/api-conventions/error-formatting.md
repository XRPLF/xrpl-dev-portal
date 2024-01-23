---
html: error-formatting.html
parent: api-conventions.html
blurb: Error formats and common error codes for WebSocket, JSON-RPC, and Commandline interfaces.
labels:
  - Development
---
# Error Formatting

It is impossible to list all the possible ways an error can occur. Some may occur in the transport layer (for example, loss of network connectivity), in which case the results vary depending on what client and transport you are using. However, if the `rippled` server successfully receives your request, it tries to respond in a standardized error format.

**Caution:** When your request results in an error, the entire request is copied back as part of the response, so that you can try to debug the error. However, this also includes any secrets that were passed as part of the request. When sharing error messages, be very careful not to accidentally expose important account secrets to others.


Some example errors:

{% tabs %}

{% tab label="WebSocket" %}
```json
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
{% /tab %}

{% tab label="JSON-RPC" %}
```json
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
{% /tab %}

{% tab label="Commandline" %}
```json
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
{% /tab %}

{% /tabs %}


## WebSocket Format

| `Field`   | Type     | Description                                           |
|:----------|:---------|:------------------------------------------------------|
| `id`      | (Varies) | ID provided in the Web Socket request that prompted this response |
| `status`  | String   | `"error"` if the request caused an error              |
| `type`    | String   | Typically `"response"`, which indicates a successful response to a command. |
| `error`   | String   | A unique code for the type of error that occurred     |
| `request` | Object   | A copy of the request that prompted this error, in JSON format. **Caution:** If the request contained any secrets, they are copied here! |
| `api_version` | Number | _(May be omitted)_ The `api_version` specified in the request, if any. |


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

- `amendmentBlocked` - The server is [amendment blocked](../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers) and needs to be updated to the latest version to stay synced with the XRP Ledger network.
- `failedToForward` - ([Reporting Mode][] servers only) The server tried to forward this request to a P2P Mode server, but the connection failed.
- `invalid_API_version` - The server does not support the [API version number](request-formatting.md#api-versioning) from the request.
- `jsonInvalid` - (WebSocket only) The request is not a proper JSON object.
    - JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
- `missingCommand` - (WebSocket only) The request did not specify a `command` field.
    - JSON-RPC returns a 400 Bad Request HTTP error in this case instead.
- `noClosed` - The server does not have a closed ledger, typically because it has not finished starting up.
- `noCurrent` - The server does not know what the current ledger is, due to high load, network problems, validator failures, incorrect configuration, or some other problem.
- `noNetwork` - The server is having trouble connecting to the rest of the XRP Ledger peer-to-peer network (and is not running in stand-alone mode).
- `tooBusy` - The server is under too much load to do this command right now. Generally not returned if you are connected as an admin.
- `unknownCmd` - The request does not contain a [command](../index.md) that the `rippled` server recognizes.
- `wsTextRequired` - (WebSocket only) The request's [opcode](https://tools.ietf.org/html/rfc6455#section-5.2) is not text. <!-- SPELLING_IGNORE: opcode -->

{% raw-partial file="/_snippets/common-links.md" /%}
