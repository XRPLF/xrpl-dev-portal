### ETL Source Object
<!-- This nested object definition is identical across server_state and server_info -->

On a reporting mode server, each member of the `etl_sources` field is an object with the following fields:

| Field                       | Type    | Description |
|-----------------------------|---------|-------------|
| `connected`                 | Boolean | If `true`, the reporting mode server is connected to this p2p mode server. If `false`, that may indicate a network outage or that the p2p mode server is down. |
| `grpc_port`                 | String  | The port number on the p2p mode server where this reporting mode server is configured to connect and retrieve ledger data via gRPC. |
| `ip`                        | String  | The IP address (IPv4 or IPv6) of the p2p mode server. |
| `last_message_arrival_time` | String  | An ISO 8601 timestamp indicating the most recent time the reporting mode server received a message from this p2p server. |
| `validated_ledgers_range`   | String  | The range of validated ledger versions this p2p mode server reports that it has available, in the same format as `complete_ledgers`. |
| `websocket_port`            | String  | The port number on the p2p server where this reporting mode server is configured to forward WebSocket requests that cannot be served directly from reporting mode. |