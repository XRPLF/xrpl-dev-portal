---
seo:
    description: Retrieve API version information.
labels:
  - Core Server
---
# version

[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/libxrpl/beast/core/SemanticVersion.cpp "Source")

The `version` command retrieves the API version information for the rippled server. For `Clio` servers, see [`version` (`clio`)](../clio-methods/version.md) instead.


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

{% tab label="Commandline" %}
```sh
#Syntax: version
rippled version
```
{% /tab %}

{% /tabs %}

{% try-it method="version" /%}

The request does not takes any parameters.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "version": {
      "first": "1.0.0",
      "good": "1.0.0",
      "last": "1.0.0"
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
    "version": {
      "first": "1.0.0",
      "good": "1.0.0",
      "last": "1.0.0"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
  "result": {
    "version": {
      "first": "1.0.0",
      "good": "1.0.0",
      "last": "1.0.0"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing a `version` object as its only field.

The `version` object returns some arrangement of the following fields:

| `Field`  | Type   | Description                   |
|:---------|:-------|:------------------------------|
| `first`  | String | Lowest supported API release  |
| `last`   | String | Highest supported API release |
| `good`   | String | Default API if none specified |

## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
