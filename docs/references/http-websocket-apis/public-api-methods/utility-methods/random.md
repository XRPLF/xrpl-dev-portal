---
html: random.html
parent: utility-methods.html
seo:
    description: Generate a random number.
labels:
  - Core Server
---
# random

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Random.cpp "Source")

The `random` command provides a random number to be used as a source of entropy for random number generation by clients.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "command": "random"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "random",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: random
rippled random
```
{% /tab %}

{% /tabs %}

The request includes no parameters.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "result": {
        "random": "8ED765AEBBD6767603C2C9375B2679AEC76E6A8133EF59F04F9FC1AAA70E41AF"
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
        "random": "4E57146AA47BC6E88FDFE8BAA235B900126C916B6CC521550996F590487B837A",
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "random" : "DB7C23C7F224CD410912E68A997BE0FD0FA7175A4C74B829BE5A80ED0DBAA0C5",
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following field:

| `Field`  | Type   | Description               |
|:---------|:-------|:--------------------------|
| `random` | String | Random 256-bit hex value. |

## Possible Errors

* Any of the [universal error types][].
* `internal` - Some internal error occurred, possibly relating to the random number generator.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
