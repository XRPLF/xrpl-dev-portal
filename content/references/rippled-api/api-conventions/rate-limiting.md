# Rate Limiting

The `rippled` server limits the rate at which API clients can make requests on public APIs. Rate limiting is based on the IP address of the client, so clients behind [network address translation](https://en.wikipedia.org/wiki/Network_address_translation) share a limit based on their public IP address.

**Tip:** Rate limiting does not apply when the client is connected [as an admin](get-started-with-the-rippled-api.html#admin-access).

When a client is approaching the rate limit, the server adds the field `"warning": "load"` at the top level of an [API response](response-formatting.html). This warning is not added to every response, but the server may send several such warnings before it disconnects a client.

If a client goes past the rate limit, the server disconnects that client and does not serve further requests from the client's API address for a while. The disconnect message is different for the WebSocket and JSON-RPC APIs.

## WebSocket API Disconnect Message

For a WebSocket API connection, the server closes the connection and provides a close message and code with the close message. The way you access these messages depends on your WebSocket client implementation. For example, using the [Node.js ws library](https://github.com/websockets/ws), the following code prints the close reason when disconnected:

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

If the connection is closed because of rate limiting, the close code is `1008` and the reason is the string `threshold exceeded`.

## JSON-RPC Rate Limited Error

For a JSON-RPC API request, the server rejects a request with a ***TODO*** error when the client is over the rate limit. For example:

```json
TODO
```

## Rate Per Request
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/resource/Fees.h "Source")

The server calculates a client's usage rate based on the number of requests made over time, and weighs different types of requests differently based on approximately how much work the server must do to serve them. Follow-up messages from the server for the [subscribe method][] and [path_find method][] also count towards a client's usage rate.

The usage rate drops off exponentially over time, so a client that does not make requests automatically has its access restored after a period of seconds to minutes.
