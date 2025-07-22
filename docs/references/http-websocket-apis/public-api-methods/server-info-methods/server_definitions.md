---
html: server_definitions.html
parent: server-info-methods.html
seo:
    description: Retrieve an SDK-compatible `definitions.json`, generated from the `rippled` instance currently running.
labels:
  - Core Server
---
# server_definitions

[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/rpc/handlers/ServerInfo.cpp#L41 "Source")

The `server_definitions` command returns an SDK-compatible `definitions.json`, generated from the `rippled` instance currently running. You can use this to query a node in a network, quickly receiving the definitions necessary to serialize/deserialize its binary data.


## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "server_definitions"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "server_definitions"
}
```
{% /tab %}

{% /tabs %}

{% try-it method="server_definitions" /%}

The request does not take any parameters.


## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "FIELDS": [
      [
        "Generic",
        {
          "isSerialized": false,
          "isSigningField": false,
          "isVLEncoded": false,
          "nth": 0,
          "type": "Unknown"
        }
      ],
      [
        "Invalid",
        {
          "isSerialized": false,
          "isSigningField": false,
          "isVLEncoded": false,
          "nth": -1,
          "type": "Unknown"
        }
      ],
      [
        "ObjectEndMarker",
        {
          "isSerialized": true,
          "isSigningField": true,
          "isVLEncoded": false,
          "nth": 1,
          "type": "STObject"
        }
      ],
      [
        "ArrayEndMarker",
        {
          "isSerialized": true,
          "isSigningField": true,
          "isVLEncoded": false,
          "nth": 1,
          "type": "STArray"
        }
      ]
      ...
    ]
  }
}
```
{% /tab %}

{% /tabs %}

To see a full `definitions.json` file and descriptions of the top-level fields, see: [Definitions File](../../../protocol/binary-format.md#definitions-file).


## Possible Errors

Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
