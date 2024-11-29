---
html: http-websocket-apis.html
parent: references.html
metadata:
  indexPage: true
---
# HTTP / WebSocket APIs

You can communicate with the XRP Ledger through the `rippled` servers' publicly available APIs.

Currently, there are two API versions: `1` and `2` {% badge href="https://github.com/XRPLF/rippled/releases/tag/2.0.0" %}New in: rippled 2.0.0{% /badge %}. The server reports the range of supported API versions in the [`version` API method](public-api-methods/server-info-methods/version.md); you can specify which version to use in your API requests.

Separate API requests can use different API versions even on the same persistent connection. For example, if you connect through WebSocket to a server that supports API versions 1 and 2, you can make an `account_tx` request using API version 2 and then make another `account_tx` request using API version 1 from the same connection.


## Default API Versions

The table below shows which version of the `rippled` API is used if you don't specify it in the request:

| Request Method | API Version | Additional Notes |
|----------------|-------------|------------------|
| Websocket      | 1           | |
| JSON-RPC       | 1           | |
| Commandline    | 2           | The commandline only uses the latest API version. |
| [xrpl.js](https://github.com/XRPLF/xrpl.js) | 2 | Defaults to [API v2][] starting in v4.0.0. |
| [xrpl-py](https://github.com/XRPLF/xrpl-py) | 2 | Defaults to [API v2][] starting in v3.0.0. |

{% admonition type="info" name="Note" %}
Clio responses use [API v1][] by default, but support [API v2][] requests.
{% /admonition %}

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

{% child-pages /%}
