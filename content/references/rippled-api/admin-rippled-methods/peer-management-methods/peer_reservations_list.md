# peer_reservations_list
[[Source]](https://github.com/ripple/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L116 "Source")

The `{{currentpage.name}}` method lists [peer reservations][]. [New in: rippled 1.4.0][]

_The `{{currentpage.name}}` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._


### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "peer_reservations_list_example_1",
  "command": "{{currentpage.name}}"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}"
}
```

*Commandline*

```sh
#Syntax: {{currentpage.name}}
rippled {{currentpage.name}}
```

<!-- MULTICODE_BLOCK_END -->

This request does not take any parameters.


### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "peer_reservations_list_example_1",
  "result": {
    "reservations": [
      {
        "description": "Ripple s1 server 'WOOL'",
        "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      {
        "node": "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
      }
    ]
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
  "result" : {
    "reservations" : [
       {
          "description" : "Ripple s1 server 'WOOL'",
          "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
       },
       {
          "node" : "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
       }
    ],
    "status" : "success"
  }
}
```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
2019-Dec-27 21:56:07.253260422 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
  "result" : {
    "reservations" : [
       {
          "description" : "Ripple s1 server 'WOOL'",
          "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
       },
       {
          "node" : "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
       }
    ],
    "status" : "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type  | Description                                         |
|:---------------|:------|:----------------------------------------------------|
| `reservations` | Array | List of existing [peer reservations][]. Each member is a peer reservation object, as described below. |

#### Peer Reservation Object

Each member of the `reservations` array is a JSON object describing one [peer reservation][]. This object has the following fields:

{% include '_snippets/peer_reservation_object.md' %}
<!--_ -->

### Possible Errors

- Any of the [universal error types][].

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
