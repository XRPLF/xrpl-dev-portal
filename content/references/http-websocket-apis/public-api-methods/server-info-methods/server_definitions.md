---
html: server_definitions.html
parent: server-info-methods.html
blurb: Retrieve an SDK-compatible `definitions.json`, generated from the `rippled` instance currently running.
labels:
  - Core Server
---
# server_definitions

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp#L43 "Source")

The `server_definitions` command returns an SDK-compatible `definitions.json`, generated from the `rippled` instance currently running. You can use this to query a node in a network, quickly receiving the definitions necessary to serialize/deserialize its binary data.


## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 2,
  "command": "server_definitions"
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#server_definitions)

The request does not take any parameters.


## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

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

<!-- MULTICODE_BLOCK_END -->

To see a full `definitions.json` file and descriptions of the top-level fields, see: [Definitions File](serialization.html#definitions-file).


## Possible Errors

Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
