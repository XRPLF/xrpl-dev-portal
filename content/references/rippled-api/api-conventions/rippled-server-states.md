# rippled Server States

Depending on how the `rippled` server is configured, how long it has been running, and other factors, a server may be participating in the global XRP Ledger peer-to-peer network to different degrees. This is represented as the `server_state` field in the responses to the [server_info method][] and [server_state method][]. The possible responses follow a range of ascending interaction, with each later value superseding the previous one. Their definitions are as follows (in order of increasing priority):

| `Value`        | Description                                                 |
|:---------------|:------------------------------------------------------------|
| `disconnected` | The server is not connected to the XRP Ledger peer-to-peer network whatsoever. It may be running in offline mode, or it may not be able to access the network for whatever reason. |
| `connected`    | The server believes it is connected to the network.         |
| `syncing`      | The server is currently behind on ledger versions. (It is normal for a server to spend a few minutes catching up after you start it.) |
| `tracking`     | The server is in agreement with the network                 |
| `full`         | The server is fully caught-up with the network and could participate in validation, but is not doing so (possibly because it has not been configured as a validator). |
| `validating`   | The server is currently participating in validation of the ledger |
| `proposing`    | The server is participating in validation of the ledger and currently proposing its own version. |

**Note:** The distinction between `full`, `validating`, and `proposing` is based on synchronization with the rest of the global network, and it is normal for a server to fluctuate between these states as a course of general operation.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
