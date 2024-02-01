### Port Descriptor Object
<!-- This nested object definition is identical across server_state and server_info -->

Each member of the `ports` array is an object with the following fields:

| Field      | Value           | Description |
|------------|-----------------|-------------|
| `port`     | String - Number | A port number where the server is listening. |
| `protocol` | Array of String | A list of protocols being served on this port. Valid protocols include `http` or `https` for JSON-RPC, `ws`, `ws2`, `wss`, `wss2` for WebSocket, `grpc` for [gRPC](../infrastructure/configuration/configure-grpc.md), and `peer` for the [XRP Ledger Peer Protocol](../concepts/networks-and-servers/peer-protocol.md). |

**Note:** Depending on network infrastructure, the ports and protocols reported here may not match how the server can be reached from the outside network. For example, if TLS terminates at a load balancer or proxy, the server may report `http` on one port, but might only be reachable through `https` on port 443 from outside.
