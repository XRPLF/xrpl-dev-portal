### State Accounting Object
<!-- This nested object definition is identical across server_state and server_info -->

Each field in the `state_accounting` object has a key that refers to a specific [server state](/docs/references/http-websocket-apis/api-conventions/rippled-server-states), and a value that is an object with the following fields:

| Field         | Value           | Description |
|---------------|-----------------|-------------|
| `duration_us` | String - Number | The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.) |
| `transitions` | String - Number | The number of times the server has changed into this state. |
