# can_delete
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/rpc/handlers/CanDelete.cpp "Source")

With `online_delete` and `advisory_delete` configuration options enabled, the `can_delete` method informs the rippled server of the latest ledger which may be deleted.

_The `can_delete` method is an [admin command](#connecting-to-rippled) that cannot be run by unprivileged users._

### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "command": "can_delete",
  "can_delete": 11320417
}
```

*JSON-RPC*

```
{
    "method": "can_delete",
    "params": [
        {
            "can_delete": 11320417
        }
    ]
}
```

*Commandline*

```
#Syntax can_delete [<ledger_index>|<ledger_hash>|now|always|never]
rippled can_delete 11320417
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following optional parameter:

| `Field`      | Type              | Description                               |
|:-------------|:------------------|:------------------------------------------|
| `can_delete` | String or Integer | The maximum ledger to allow to be deleted. For `ledger_index` or `ledger_hash`, see [Specifying a Ledger](#specifying-ledgers). `never` sets the value to 0, and effectively disables online deletion until another `can_delete` is appropriately called.  `always` sets the value to the maximum possible ledger (4294967295), and online deletion occurs as of each configured `online_delete` interval. `now` triggers online deletion at the next validated ledger that meets or exceeds the configured `online_delete` interval, but no further. |

If no parameter is specified, no change is made.

The response follows the [standard format](#response-formatting), with
a successful result containing the following fields:

| `Field`      | Type    | Description                                         |
|:-------------|:--------|:----------------------------------------------------|
| `can_delete` | Integer | The maximum ledger index that may be removed by the online deletion routine. |

Use this command with no parameter to query the existing `can_delete` setting.

### Possible Errors

* Any of the [universal error types][].
* `notEnabled` - Not enabled in configuration.
* `notReady` - Not ready to handle this request.
* `lgrNotFound` - Ledger not found.
* `invalidParams` - Invalid parameters.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
