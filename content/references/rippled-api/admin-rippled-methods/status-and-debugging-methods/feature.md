# feature
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Feature1.cpp "Source")

The `feature` command returns information about [amendments](amendments.html) this server knows about, including whether they are enabled and whether the server is voting in favor of those amendments in the [amendment process](amendments.html#amendment-process). [New in: rippled 0.31.0][]

You can use the `feature` command to temporarily configure the server to vote against or in favor of an amendment. This change does not persist if you restart the server. To make lasting changes in amendment voting, use the `rippled.cfg` file. See [Configuring Amendment Voting](amendments.html#configuring-amendment-voting) for more information.

_The `feature` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket - list all*

```
{
  "id": "list_all_features",
  "command": "feature"
}
```

*WebSocket - reject*

```
{
  "id": "reject_multi_sign",
  "command": "feature",
  "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
  "vetoed": true
}
```

*JSON-RPC*

```
{
    "method": "feature",
    "params": [
        {
            "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
            "vetoed": false
        }
    ]
}
```

*Commandline*

```
#Syntax: feature [<feature_id> [accept|reject]]
rippled feature 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 accept
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`   | Type    | Description                                            |
|:----------|:--------|:-------------------------------------------------------|
| `feature` | String  | _(Optional)_ The unique ID of an amendment, as hexadecimal; or the short name of the amendment. If provided, limits the response to one amendment. Otherwise, the response lists all amendments. |
| `vetoed`  | Boolean | (Optional; ignored unless `feature` also specified) If true, instructs the server to vote against the amendment specified by `feature`. If false, instructs the server to vote in favor of the amendment. |

**Note:** You can configure your server to vote in favor of a new amendment, even if the server does not currently know how to apply that amendment, by specifying the amendment ID in the `feature` field. For example, you might want to do this if you plan to upgrade soon to a new `rippled` version that _does_ support the amendment.

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket - list all*

```
{
  "id": "list_all_features",
  "status": "success",
  "type": "response",
  "result": {
    "features": {
      "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE": {
        "enabled": false,
        "name": "FeeEscalation",
        "supported": true,
        "vetoed": false
      },
      "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
        "enabled": false,
        "name": "MultiSign",
        "supported": true,
        "vetoed": false
      },
      "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC": {
        "enabled": false,
        "name": "TrustSetAuth",
        "supported": true,
        "vetoed": false
      },
      "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490": {
        "enabled": false,
        "name": "Tickets",
        "supported": true,
        "vetoed": false
      },
      "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13": {
        "enabled": false,
        "name": "SusPay",
        "supported": true,
        "vetoed": false
      }
    }
  }
}
```

*WebSocket - reject*

```
{
    "id": "reject_multi_sign",
    "status": "success",
    "type": "response",
    "result": {
        "features": {
            "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
                "enabled": false,
                "name": "MultiSign",
                "supported": true,
                "vetoed": true
            }
        }
    }
}
```

*JSON-RPC*

```
200 OK
{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "MultiSign",
            "supported": true,
            "vetoed": false
        },
        "status": "success"
    }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "MultiSign",
            "supported": true,
            "vetoed": false
        },
        "status": "success"
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing **a map of amendments** as a JSON object. The keys of the object are amendment IDs. The values for each key are _amendment objects_ that describe the status of the amendment with that ID. If the request specified a `feature`, the map contains only the requested amendment object, after applying any changes from the request. Each amendment object has the following fields:

| `Field`     | Type    | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `enabled`   | Boolean | Whether this amendment is currently enabled in the latest ledger. |
| `name`      | String  | (May be omitted) The human-readable name for this amendment, if known. |
| `supported` | Boolean | Whether the server knows how to apply this amendment. If this field is set to `false` (the server does not know how to apply this amendment) and `enabled` is set to `true` (this amendment is enabled in the latest ledger), this amendment may cause your server to be [amendment blocked](amendments.html#amendment-blocked). |
| `vetoed`    | Boolean | Whether the server has been instructed to vote against this amendment. |

**Caution:** The `name` for an amendment does not strictly indicate what that amendment does. The name is not guaranteed to be unique or consistent across servers.

### Possible Errors

* Any of the [universal error types][].
* `badFeature` - The `feature` specified was invalidly formatted, or the server does not know an amendment with that name.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
