---
html: rate-limiting.html
parent: api-conventions.html
blurb: Information on how public APIs limit clients from making too many requests.
---
# Rate Limiting

The `rippled` server limits the rate at which API clients can make requests on public APIs. Rate limiting is based on the IP address of the client, so clients behind [network address translation](https://en.wikipedia.org/wiki/Network_address_translation) share a limit based on their public IP address.

**Tip:** Rate limiting does not apply when the client is connected [as an admin](get-started-using-http-websocket-apis.html#admin-access).

When a client is approaching the rate limit, the server adds the field `"warning": "load"` at the top level of an [API response](response-formatting.html). This warning is not added to every response, but the server may send several such warnings before it disconnects a client.

If a client goes past the rate limit, the server disconnects that client and does not serve further requests from the client's API address for a while. The WebSocket and JSON-RPC APIs use different disconnect messages.

## WebSocket API Disconnect Message

For the WebSocket API, the server closes the connection and provides a close message and code. The way you access these messages depends on your WebSocket client implementation. For example, using the [Node.js ws library](https://github.com/websockets/ws), the following code prints the close reason when disconnected:

```js
const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:6007/')
ws.on('close', (code,reason) => {
  console.log("Disconnected. \ncode: ", code, "\nreason: ", reason)
})

// If rate limited, prints:
// Disconnected.
// code:  1008
// reason:  threshold exceeded
```

If the connection is closed because of rate limiting, the close code is `1008` and the close message is the string `threshold exceeded`.

## JSON-RPC Rate Limited Error

For a JSON-RPC API request, the server responds with the HTTP status code **503 Service Unavailable** when the client is over the rate limit. This response has a text (not JSON) body stating that the server is overloaded:

```text
503 Service Unavailable

Server is overloaded
```

## Rate Per Request
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/resource/Fees.h "Source")

The server calculates a client's usage rate based on the number of requests made over time, and weighs different types of requests based on approximately how much work the server must do to serve them. Follow-up messages from the server for the [subscribe method][] and [path_find method][] also count towards a client's usage rate.

The usage rate drops off exponentially over time, so a client that does not make requests automatically has its access restored after a period of seconds to minutes.

## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Software Ecosystem](software-ecosystem.html)
- **Tutorials:**
    - [Getting Started with XRP Ledger APIs](get-started-using-http-websocket-apis.html)
    - [Troubleshooting rippled](troubleshoot-the-rippled-server.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [Error Formatting](error-formatting.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
