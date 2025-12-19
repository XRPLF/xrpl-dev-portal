---
html: http-websocket-apis.html
parent: references.html
metadata:
  indexPage: true
---
# HTTP / WebSocket APIs

You can communicate directly with the XRP Ledger through HTTP-based APIs provided by the core `rippled` server as well as the Clio server. Both types of server provide JSON-RPC and WebSocket APIs with mostly the same functionality. JSON-RPC uses a strict request-response paradigm similar to a REST API, but WebSocket uses a single persistent connection where the server can push messages to the client asynchronously. For more information, see [Get Started Using HTTP / WebSocket APIs](../../tutorials/get-started/get-started-http-websocket-apis.md).

[{% inline-svg file="/docs/img/api-functionality-venn-diagram.svg" /%}](/docs/img/api-functionality-venn-diagram.svg "Diagram: Most API methods are provided by both rippled and Clio servers. The rippled server provides admin methods, provides pending/unvalidated data including transaction queue, and has a live view of consensus and peer-to-peer network. The Clio server scales efficiently, provides additional methods nft_history, nft_info, nfts_by_issuer, and mpt_holders, and serves rippled-exclusive API requests by forwarding.")

## API Versioning

Currently, there are two API versions: `1` and `2` {% badge href="https://github.com/XRPLF/rippled/releases/tag/2.0.0" %}New in: rippled 2.0.0{% /badge %}. The server reports the range of supported API versions in the [`version` API method](public-api-methods/server-info-methods/version.md); you can specify which version to use in your API requests.

- For a full list of the differences between API versions, see [API-CHANGELOG on GitHub](https://github.com/XRPLF/rippled/blob/develop/API-CHANGELOG.md).
- To stay up-to-date with API changes, join the [ripple server mailing list](https://groups.google.com/g/ripple-server).

### Specifying a Version

Use the `api_version` field of the request to specify which API version to use. See [Request Formatting](./api-conventions/request-formatting.md) for example requests.

Separate API requests can use different API versions even on the same persistent connection. For example, if you connect through WebSocket to a server that supports API versions 1 and 2, you can make an `account_tx` request using API version 2 and then make another `account_tx` request using API version 1 from the same connection.

### Default API Versions

If you do not specify an API version when making a request directly to the server, the server uses API v1. However, some [client libraries](../client-libraries.md) automatically use a different API version if you do not specify one. The following table shows which API version each library uses when you don't specify which API version to use:

| Client Library                                | API Version | Additional Notes |
|-----------------------------------------------|-------------|------------------|
| None - direct WebSocket / JSON-RPC connection | 1           | |
| None - `rippled` Commandline                  | 2           | The commandline only uses the latest API version. |
| [xrpl.js](https://github.com/XRPLF/xrpl.js)   | 2           | Versions 3.x and older use API v1 by default. |
| [xrpl-py](https://github.com/XRPLF/xrpl-py)   | 2           | Versions 2.x and older use API v1 by default. |


### Breaking Changes

New API versions can introduce breaking changes. The following types of changes are **breaking changes**:

- Removing or renaming a field of a request or response.
- Changing the type of a field of a request or response.
- Changing the meaning of a field of a request or a response.
- Changing the order of positional parameters, or adding a new field before other positional parameters.
- Removing or renaming an API method.
- Changing the behavior of an API function visible to existing clients.

Any time a full release introduces a breaking change, it introduces a new API version number.

API versions are subject to change until they are included in a stable release of the server. New API versions are expected to experience multiple breaking changes across development, beta, and pre-release software.

### Non-Breaking Changes

The following types of changes are **non-breaking changes** and may occur without a change of API version number:

- Adding a new field to a request or response, not including positional parameters.
- Adding a new API method.
- Fixing a bug so that the API matches prior documentation and behavior.

## API Method References

{% child-pages /%}


{% raw-partial file="/docs/_snippets/common-links.md" /%}
