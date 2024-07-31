---
seo:
    description: Look up a ledger by its close time.
labels:
  - Blockchain
---
# ledger_index
[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/LedgerIndex.cpp "Source")

The `ledger_index` command looks up information about the last closed ledger at a given real-world time. This may be useful for correlating events that happened off-chain with historical data in the XRP Ledger. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.3.0" date="TBD" %}New in: Clio v2.3.0{% /badge %}

This method is only available from the Clio server, not `rippled`.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_ledger_index",
    "command": "ledger_index",
    "date": "2024-06-20T09:00:42.000Z"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger",
    "params": [
        {
            "date": "2024-06-20T09:00:42.000Z"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#ledger_index)

The request can contain the following parameters:

| `Field` | Type   | Required? | Description |
|:--------|:-------|:----------|-------------|
| `date`  | String | No        | An ISO 8601 timestamp of the time to look up. If omitted, use the current time. ***TODO: restrictions on the ISO format. Resolution? Time zones? etc.*** |

## Response Format

An example of a successful response:

***TODO: populate these example response files with real server responses***

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger_index/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger_index/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing information about the most recently closed ledger at the requested time, including the following fields:

| Field          | Type   | Description                         |
|:---------------|:-------|:------------------------------------|
| `ledger_index` | Number | The [Ledger Index][] of the most recently closed ledger at the specified time. |
| `ledger_hash`  | String | The identifying [Hash][] of the most recently closed ledger at the specified time. |
| `closed`       | String | ***TODO is this the official close time or the requested time?*** |

{% admonition type="info" name="Note" %}
Due to the rounding on ledger close times, there may be a difference of up to 10 seconds between the "official" close time of a ledger and the real-world clock time when the ledger was closed. For more details, see [Ledger Close Times](../../../../concepts/ledgers/ledger-close-times.md).
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
