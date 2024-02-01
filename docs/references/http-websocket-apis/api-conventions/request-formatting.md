---
html: request-formatting.html
parent: api-conventions.html
seo:
    description: Standard request format, with examples, for the WebSocket, JSON-RPC, and Commandline interfaces.
---
# Request Formatting

## Example Request

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": true,
  "ledger_index": "validated",
  "api_version": 1
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
POST http://s1.ripple.com:51234/
Content-Type: application/json

{
    "method": "account_info",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "strict": true,
            "ledger_index": "validated",
            "api_version": 1
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated strict
```
{% /tab %}

{% /tabs %}


## WebSocket Format  

After you open a WebSocket to the `rippled` server, you can send commands as a [JSON](https://en.wikipedia.org/wiki/JSON) object with the following fields:

| Field               | Type      | Description                                |
|:--------------------|:----------|:-------------------------------------------|
| `command`           | String    | The name of the [API method](../public-api-methods/index.md). |
| `id`                | (Various) | _(Optional)_ A unique value to identify this request. The response to this request uses the same `id` field. This way, even if responses arrive out of order, you know which request prompted which response. |
| `api_version`       | Number    | _(Optional)_ The API version to use. If omitted, use version 1. For details, see [API Versioning](#api-versioning). |
| (Method Parameters) | (Various) | Provide any parameters to the method at the top level. |

See [Response Formatting](response-formatting.md) for the response from the server.

## JSON-RPC Format

To make a JSON-RPC request, send an HTTP **POST** request to the root path (`/`) on the port and IP where the `rippled` server is listening for JSON-RPC connections. You can use HTTP/1.0 or HTTP/1.1. If you use HTTPS, you should use TLS version 1.2. For security reasons, `rippled` _does not support_ SSL version 3 or earlier.

Always include a `Content-Type` header with the value `application/json`.

If you plan on making multiple requests, use [Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3) so that you do not have to close and re-open the connection in between requests. <!-- SPELLING_IGNORE: alives -->

Send request body as a [JSON](https://en.wikipedia.org/wiki/JSON) object with the following fields:


| Field               | Type      | Description                                |
|:--------------------|:----------|:-------------------------------------------|
| `method`            | String    | The name of the [API method](../public-api-methods/index.md). |
| `params`            | Array     | _(Optional)_ A **one-item array** containing a nested JSON object with the parameters to this method. You may omit this field if the method does not require any parameters. |

The object inside the `params` array can contain the following fields:

| Field               | Type      | Description                                |
|:--------------------|:----------|:-------------------------------------------|
| `api_version`       | Number    | _(Optional)_ The API version to use. If omitted, uses version `1`. For details, see [API Versioning](#api-versioning). |
| (Method Parameters) | (Various) | Provide any parameters to the method here. |

See [Response Formatting](response-formatting.md) for the response from the server.

## Commandline Format

Put the API method name after any normal (dash-prefaced) commandline options, followed by a limited set of parameters, separated by spaces. For any parameter values that might contain spaces or other unusual characters, use single-quotes to encapsulate them. Not all methods have commandline API syntax. For more information, see [Commandline Usage](../../../infrastructure/commandline-usage.md#client-mode-options).

The commandline calls JSON-RPC, so its responses always match the JSON-RPC [response format](response-formatting.md).

The commandline always uses the latest [API version](#api-versioning).

**Caution:** The commandline interface is intended for administrative purposes only and is _not a supported API_. New versions of `rippled` may introduce breaking changes to the commandline API without warning!


## API Versioning

The `rippled` server uses a single integer to identify the API version to use. Currently, there are two API versions: `1` and `2` {% badge href="https://github.com/XRPLF/rippled/releases/tag/2.0.0" %}New in: rippled 2.0.0{% /badge %}. The server reports the range of supported API versions in the `version` API method. <!-- STYLE_OVERRIDE: will --> <!-- TODO: add a link when `version` method is documented. -->

Separate API requests can use different API versions even on the same persistent connection. For example, if you connect WebSocket to a server that supports API versions 1 and 2, you can make an `account_tx` request using API version 2 and then make another `account_tx` request using API version 1 from the same connection.

Future versions of `rippled` that introduce breaking changes will introduce a new API version 3.


### Breaking Changes

The following types of changes are **breaking changes**:

- Removing or renaming a field of a request or response.
- Changing the type of a field of a request or response.
- Changing the meaning of a field of a request or a response.
- Changing the order of positional parameters, or adding a new field before other positional parameters.
- Removing or renaming an API method.
- Changing the behavior of an API function visible to existing clients.
- The following types of breaking changes only apply to the gRPC API:
    - Changing a `proto` field number.
    - Removing or renaming an enum or enum value.
    - Adding or removing fields from a `oneof`.
    - Splitting or merging a `oneof`.
    - Changing whether a message field is `optional`, `repeated`, or `required`.
    - Changing the stream value of a request or response.
    - Deleting or renaming a package or service.

Any time a full release introduces a breaking change, it introduces a new API version number. Pre-release, beta, and development versions may introduce breaking changes to the same API version number.

### Non-Breaking Changes

The following types of changes are **non-breaking changes** and may occur without a change of API version number:

- Adding a new field to a request or response, not including positional parameters.
- Adding a new API method.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
