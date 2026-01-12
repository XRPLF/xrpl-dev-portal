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
  "date": "2024-08-28T22:59:00Z"
}
```

{% /tab %}

{% tab label="JSON-RPC" %}

```json
{
  "method": "ledger_index",
  "params": [
    {
      "date": "2024-08-28T22:59:00Z"
    }
  ]
}
```

{% /tab %}

{% /tabs %}

{% try-it method="ledger_index" /%}

The request can contain the following parameters:

| `Field` | Type   | Required? | Description                                                                                                                                                                                         |
| :------ | :----- | :-------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`  | String | No        | An ISO 8601 timestamp of the time to look up. Must be formatted without microseconds, and using `Z` as the time zone marker. For example, `2024-08-28T22:59:00Z`. If omitted, use the current time. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger_index/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger_index/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing information about the most recently closed ledger at the requested time, including the following fields:

| Field          | Type    | Description                                                                                                                                             |
| :------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ledger_index` | Number  | The [Ledger Index][] of the most recently closed ledger at the specified time.                                                                          |
| `ledger_hash`  | String  | The identifying [Hash][] of the most recently closed ledger at the specified time.                                                                      |
| `closed`       | String  | The official close time of the most recently closed ledger at the specified time.                                                                       |
| `validated`    | Boolean | If `true`, the ledger has been validated by the consensus process and is immutable. Otherwise, the contents of the ledger are not final and may change. |

{% admonition type="info" name="Note" %}
Due to the rounding on ledger close times, there may be a difference of up to 10 seconds between the "official" close time of a ledger and the real-world clock time when the ledger was closed. For more details, see [Ledger Close Times](../../../../concepts/ledgers/ledger-close-times.md).
{% /admonition %}

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
  - For example, this can occur if the specified `date` included a microseconds component.
- `lgrNotFound` - The server does not have ledger history for the specified point in time.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
