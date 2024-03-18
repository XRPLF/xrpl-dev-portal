---
html: get-started-using-http-websocket-apis.html
parent: http-websocket-apis-tutorials.html
seo:
    description: Unleash the full power of the XRP Ledger's native APIs.
cta_text: Get Started
top_nav_name: HTTP / WebSocket
top_nav_grouping: Get Started
labels:
  - Development
showcase_icon: assets/img/logos/globe.svg
---
# Get Started Using HTTP / WebSocket APIs

If you don't have or don't want to use a [client library](../../../references/client-libraries.md) in your preferred programming language, you can access the XRP Ledger directly through the APIs of its core server software, [`rippled`](../../../concepts/networks-and-servers/index.md). The server provides APIs over JSON-RPC and WebSocket protocols. If you don't [run your own instance of `rippled`](../../../infrastructure/installation/index.md) you can still use a [public server][public servers].

**Tip:** You can dive right into the API with the [**WebSocket API Tool**](/resources/dev-tools/websocket-api-tool), or use the [XRP Ledger Explorer](https://livenet.xrpl.org/) to watch the progress of the ledger live.

## Differences Between JSON-RPC and WebSocket

Both JSON-RPC and WebSocket are HTTP-based protocols, and for the most part the data provided over both protocols is the same. The major differences are as follows:

- JSON-RPC uses individual HTTP requests and responses for each call, similar to a RESTful API. You can use any common HTTP client such as [curl](https://curl.se/), [Postman](https://www.postman.com/downloads/), or [Requests](https://requests.readthedocs.io/) to access this API.
- WebSocket uses a persistent connection that allows the server to push data to the client. Functions that require push messages, like [event subscriptions](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md), are only available using WebSocket.

Both APIs can be served unencrypted (`http://` and `ws://`) or encrypted using TLS (`https://` and `wss://`). Unencrypted connections should not be served over open networks, but can be used when the client is on the same machine as the server.


## Admin Access

The API methods are divided into [Public Methods](../../../references/http-websocket-apis/public-api-methods/index.md) and [Admin Methods](../../../references/http-websocket-apis/admin-api-methods/index.md) so that organizations can offer public servers for the benefit of the community. To access admin methods, or admin functionality of public methods, you must connect to the API on a **port and IP address marked as admin** in the server's config file.

The [example config file](https://github.com/XRPLF/rippled/blob/f00f263852c472938bf8e993e26c7f96f435935c/cfg/rippled-example.cfg#L1154-L1179) listens for connections on the local loopback network (127.0.0.1), with JSON-RPC (HTTP) on port 5005 and WebSocket (WS) on port 6006, and treats all connected clients as admin.


## WebSocket API

If you are looking to try out some methods on the XRP Ledger, you can skip writing your own WebSocket code and go straight to using the API at the [WebSocket API Tool](/resources/dev-tools/websocket-api-tool). Later on, when you want to connect to your own `rippled` server, you can [build your own client](monitor-incoming-payments-with-websocket.md) or use a [client library](../../../references/client-libraries.md) with WebSocket support.

Example WebSocket API request:

```json
{
  "id": "my_first_request",
  "command": "server_info",
  "api_version": 1
}
```

The response shows you the current status of the server.

Read more: [Request Formatting >](../../../references/http-websocket-apis/api-conventions/request-formatting.md) [Response Formatting >](../../../references/http-websocket-apis/api-conventions/response-formatting.md) [About the server_info method >][server_info method]

## JSON-RPC

You can use any HTTP client (like [RESTED for Firefox](https://addons.mozilla.org/en-US/firefox/addon/rested/), [Postman for Chrome](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) or [Online HTTP client ExtendsClass](https://extendsclass.com/rest-client-online.html)) to make JSON-RPC calls a `rippled` server. Most programming languages have a library for making HTTP requests built in. <!-- SPELLING_IGNORE: extendsclass -->

Example JSON-RPC request:

```json
POST http://s1.ripple.com:51234/
Content-Type: application/json

{
    "method": "server_info",
    "params": [
        {
            "api_version": 1
        }
    ]
}
```

The response shows you the current status of the server.

Read more: [Request Formatting >](../../../references/http-websocket-apis/api-conventions/request-formatting.md#json-rpc-format) [Response Formatting >](../../../references/http-websocket-apis/api-conventions/response-formatting.md) [About the server_info method >][server_info method]

## Commandline

The commandline interface connects to the same service as the JSON-RPC one, so the public servers and server configuration are the same. By default, the commandline connects to a `rippled` server running on the same machine.

Example commandline request:

```
rippled --conf=/etc/opt/ripple/rippled.cfg server_info
```

Read more: [Commandline Usage Reference >](../../../infrastructure/commandline-usage.md)

**Caution:** The commandline interface is intended for administrative purposes only and is _not a supported API_.  New versions of `rippled` may introduce breaking changes to the commandline API without warning!

## Available Methods

For a full list of API methods, see:

- [Public `rippled` Methods](../../../references/http-websocket-apis/public-api-methods/index.md): Methods available on public servers, including looking up data from the ledger and submitting transactions.
- [Admin `rippled` Methods](../../../references/http-websocket-apis/admin-api-methods/index.md): Methods for [managing](../../../infrastructure/installation/install-rippled-on-ubuntu.md) the `rippled` server.


## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [Client Libraries](../../../references/client-libraries.md)
    - [Parallel Networks](../../../concepts/networks-and-servers/parallel-networks.md)
- **Tutorials:**
    - [Get Started Using JavaScript](get-started.md)
    - [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md)
    - [Manage the rippled Server](../../../infrastructure/installation/install-rippled-on-ubuntu.md)
- **References:**
    - [rippled API Reference](../../../references/http-websocket-apis/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
