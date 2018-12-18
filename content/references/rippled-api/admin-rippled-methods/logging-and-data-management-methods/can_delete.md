# can_delete
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/CanDelete.cpp "Source")

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

The request includes the following optional parameter:

| `Field`      | Type              | Description                               |
|:-------------|:------------------|:------------------------------------------|
| `can_delete` | String or Integer | The [Ledger Index][] of the maximum ledger version to allow to be deleted. The special case `never` disables online deletion. The special case `always` enables automatic online deletion as if advisory deletion was disabled. The special case `now` allows online deletion one time at the next validated ledger that meets or exceeds the configured `online_delete` value. |

If no parameter is specified, no change is made.

The response follows the [standard format][], with
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

## See Also

- [Online Deletion](online-deletion.html)
- [Configure Advisory Deletion](configure-advisory-deletion.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
