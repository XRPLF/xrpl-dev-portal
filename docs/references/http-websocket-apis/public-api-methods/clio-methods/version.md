---
seo:
    description: Retrieve API version information.
labels:
  - Core Server
---
# version
[[Source]](https://github.com/XRPLF/clio/blob/master/src/ripple/beast/core/SemanticVersion.cpp "Source")

The `version` command asks the [Clio server](../../../../concepts/networks-and-servers/the-clio-server.md) for API version information. For `rippled` servers, see [`version` (`rippled`)](../server-info-methods/version.md) instead. {% badge href="https://github.com/XRPLF/clio/releases/tag/1.0.0" %}New in: Clio v2.0.0{% /badge %}


## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "version"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "version",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% /tabs %}

<!-- [Try it! >](websocket-api-tool.html#version) -->

The request does not take any parameters.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "version": {
      "first": 1,
      "last": 2,
      "good": 1
    }
  },
  "status": "success",
  "type": "response",
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
      "version": {
        "first": 1,
        "last": 2,
        "good": 1
      }
    },
    "status": "success",
    "type": "response",
    "warnings": [
        {
            "id":2001,
            "message":"This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing an `info` object as its only field.

The `version` object returns some arrangement of the following fields:

| `Field`  | Type    | Description                   |
|:---------|:--------|:------------------------------|
| `first`  | Integer | Lowest supported API release  |
| `last`   | Integer | Highest supported API release |
| `good`   | Integer | Default API if none specified |

## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
