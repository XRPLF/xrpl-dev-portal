### ETL Source Object
<!-- This nested object definition is identical across server_state and server_info -->

On a reporting mode server, each member of the `etl_sources` field is an object with the following fields:

| Field                       | Type    | Description |
|-----------------------------|---------|-------------|
| `connected`                 | Boolean | If `true`, the reporting mode server is connected to this P2P mode server. If `false`, the server is not connected. This could be due to misconfiguration, a network outage, or it could mean that the P2P mode server is down. |
| `grpc_port`                 | String  | The port number on the P2P mode server where this reporting mode server is configured to connect and retrieve ledger data via gRPC. |
| `ip`                        | String  | The IP address (IPv4 or IPv6) of the P2P mode server. |
| `last_message_arrival_time` | String  | An ISO 8601 timestamp indicating the most recent time the reporting mode server received a message from this P2P server. |
| `validated_ledgers_range`   | String  | The range of validated ledger versions this P2P mode server reports that it has available, in the same format as `complete_ledgers`. |
| `websocket_port`            | String  | The port number on the P2P server where this reporting mode server is configured to forward WebSocket requests that cannot be served directly from reporting mode. |
