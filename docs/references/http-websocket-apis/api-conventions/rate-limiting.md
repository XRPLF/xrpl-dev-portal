---
html: rate-limiting.html
parent: api-conventions.html
seo:
    description: Information on how public APIs limit clients from making too many requests.
labels:
  - Core Server
---
# Rate Limiting

The `xrpld` server limits the rate at which API clients can make requests on public APIs. Rate limiting is based on the IP address of the client, so clients behind [network address translation](https://en.wikipedia.org/wiki/Network_address_translation) share a limit based on their public IP address.

When a client is approaching the rate limit, the server adds the field `"warning": "load"` at the top level of an [API response](response-formatting.md). This warning is not added to every response, but the server may send several such warnings before it disconnects a client.

If a client exceeds the rate limit, the server disconnects that client and does not serve further requests from the client's IP address for a while. The WebSocket and JSON-RPC APIs use different disconnect messages.

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
{% source-link path="src/libxrpl/resource/Fees.cpp" /%}

The server calculates a client's usage rate based on the number of requests made over time, and weighs different types of requests based on approximately how much work the server must do to serve them. Follow-up messages from the server for the [subscribe method][] and [path_find method][] also count towards a client's usage rate.

The usage rate drops off exponentially over time, so a client that does not make requests automatically has its access restored after a period of seconds to minutes.

## Bypassing Rate Limits for Trusted Clients

### Admin Access

To bypass rate limits for testing purposes, you can grant an IP address or CIDR range access to unlimited resources using the `admin` field in the port stanza. Admin access also allows stopping the server, so use it only with fully trusted hosts. The following example grants admin access to the local machine:

```text
[port_ws_admin_local]
port = 6006
ip = 127.0.0.1
admin = 127.0.0.1
protocol = ws
send_queue_limit = 500
```

For more information about admin access, see [Admin Access](../../../tutorials/get-started/get-started-http-websocket-apis.md#admin-access).

### `secure_gateway`

Alternatively, you can use the `secure_gateway` field in the port stanza to grant unlimited resources without admin access. Set it to the IP addresses or subnets of trusted proxies. When a proxy sends a non-empty `X-User` HTTP header with a request, the server lifts the rate limit for that session. Requests that have no `X-User` header, or an empty one, stay rate limited.

## See Also

- **Concepts:**
    - [The `xrpld` Server](../../../concepts/networks-and-servers/index.md)
    - [Software Ecosystem](../../../introduction/software-ecosystem.md)
- **Tutorials:**
    - [Getting Started with XRP Ledger APIs](../../../tutorials/get-started/get-started-http-websocket-apis.md)
    - [Troubleshooting xrpld](../../../infrastructure/troubleshooting/index.md)
- **References:**
    - [xrpld API Reference](../index.md)
        - [Error Formatting](error-formatting.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
