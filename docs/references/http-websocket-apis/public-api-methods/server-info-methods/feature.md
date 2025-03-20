---
html: feature.html
parent: server-info-methods.html
seo:
    description: Get information about protocol amendments.
labels:
  - Blockchain
  - Core Server
---

# feature

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Feature1.cpp "Source")<br/>

The `feature` command returns information about [amendments](../../../../concepts/networks-and-servers/amendments.md) this server knows about, including whether they are enabled and if the server knows how to apply the amendments.

This is the non-admin version of the [`feature` admin command](../../admin-api-methods/status-and-debugging-methods/feature.md). It follows the same formatting as the _admin_ command, but hides potentially sensitive data.

{% badge href="https://github.com/XRPLF/rippled/releases/tag/2.2.0" %}New in: rippled 2.2.0{% /badge %}

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "list_all_features",
  "command": "feature"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "feature",
    "params": [
        {
            "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373"
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: feature [<feature_id>]
rippled feature 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373
```
{% /tab %}

{% /tabs %}

{% try-it method="feature" /%}

The request includes the following parameters:

| `Field`   | Type    | Description                                            |
|:----------|:--------|:-------------------------------------------------------|
| `feature` | String  | _(Optional)_ The unique ID of an amendment, as hexadecimal; or the short name of the amendment. If provided, limits the response to one amendment. Otherwise, the response lists all amendments. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "list_all_features",
  "result": {
    "features": {
      "00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC": {
        "enabled": true,
        "name": "RequireFullyCanonicalSig",
        "supported": true
      },
      "0285B7E5E08E1A8E4C15636F0591D87F73CB6A7B6452A932AD72BBC8E5D1CBE3": {
        "enabled": false,
        "name": "fixNFTokenDirV1",
        "supported": true
      },
      "03BDC0099C4E14163ADA272C1B6F6FABB448CC3E51F522F978041E4B57D9158C": {
        "enabled": true,
        "name": "fixNFTokenReserve",
        "supported": true
      },
      "07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104": {
        "enabled": false,
        "name": "Escrow",
        "supported": true
      },
      "08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647": {
        "enabled": false,
        "name": "PayChan",
        "supported": true
      }
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "MultiSign",
            "supported": true
        },
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "MultiSign",
            "supported": true
        },
        "status": "success"
    }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing **a map of amendments** as a JSON object. The keys of the object are amendment IDs. The values for each key are _amendment objects_ that describe the status of the amendment with that ID. If the request specified a `feature`, the map contains only the requested amendment object, after applying any changes from the request. Each amendment object has the following fields:

| `Field`     | Type    | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `enabled`   | Boolean | Whether this amendment is currently enabled in the latest ledger. |
| `name`      | String  | (May be omitted) The human-readable name for this amendment, if known. |
| `supported` | Boolean | Whether the server knows how to apply this amendment. If this field is set to `false` (the server does not know how to apply this amendment) and `enabled` is set to `true` (this amendment is enabled in the latest ledger), this amendment may cause your server to be [amendment blocked](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers). |

{% admonition type="warning" name="Caution" %}The `name` for an amendment does not strictly indicate what that amendment does. The name is not guaranteed to be unique or consistent across servers.{% /admonition %}

## Possible Errors

- Any of the [universal error types][].
- `badFeature` - The `feature` specified was invalidly formatted, or the server does not know an amendment with that name.
- `noPermission` - The user does not have permission to run the specified command (i.e., `vetoed`).
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
