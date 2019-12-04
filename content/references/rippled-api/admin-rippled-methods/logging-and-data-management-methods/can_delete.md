# can_delete
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/CanDelete.cpp "Source")

The `can_delete` method informs the `rippled` server of the latest ledger version which may be deleted when using [online deletion with advisory deletion enabled](online-deletion.html#advisory-deletion). If advisory deletion is not enabled, this method does nothing.

_The `can_delete` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._

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

The request accepts the following parameter:

| `Field`      | Type              | Description                               |
|:-------------|:------------------|:------------------------------------------|
| `can_delete` | String or Integer | _(Optional)_ The [Ledger Index][] of the maximum ledger version to allow to be deleted. The special case `never` disables online deletion. The special case `always` enables automatic online deletion as if advisory deletion was disabled. The special case `now` allows online deletion one time at the next validated ledger that meets or exceeds the configured `online_delete` value. If omitted, the server makes no changes (but still replies with the current `can_delete` value). |

### Response Format

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`      | Type    | Description                                         |
|:-------------|:--------|:----------------------------------------------------|
| `can_delete` | Integer | The maximum ledger index that may be removed by the online deletion routine. |

Use this command with no parameter to query the existing `can_delete` setting.

### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `lgrNotFound` - The ledger specified by the `can_delete` field of the request does not exist, or it does exist but the server does not have it.
- `notEnabled` - If either online deletion or advisory deletion are not enabled in the server's configuration.
- `notReady` - The server is not ready to run online deletion at the moment. This usually means the server has just started up and has not yet acquired a validated ledger.

## See Also

- [Online Deletion](online-deletion.html)
- [Configure Advisory Deletion](configure-advisory-deletion.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
