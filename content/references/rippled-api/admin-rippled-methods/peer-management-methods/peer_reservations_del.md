# peer_reservations_del
[[Source]](https://github.com/ripple/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L89 "Source")

The `{{currentpage.name}}` method removes a specific [peer reservation][], if one exists. [New in: rippled 1.4.0][]

_The `{{currentpage.name}}` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._

**Note:** Removing a peer reservation does not automatically disconnect the corresponding peer, if that peer is connected.

### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "id": "peer_reservations_del_example_1",
    "command": "{{currentpage.name}}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }]
}
```

*Commandline*

```sh
#Syntax: {{currentpage.name}} <public_key>
rippled {{currentpage.name}} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameter:

| `Field`     | Type                      | Description                        |
|:------------|:--------------------------|:-----------------------------------|
| `public_key` | String | The [node public key][] of the [peer reservation][] to remove, in [base58][] format. |


### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "peer_reservations_del_example_1",
  "result": {
    "previous": {
      "description": "Ripple s1 server 'WOOL'",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
   "result" : {
      "previous" : {
         "description" : "Ripple s1 server 'WOOL'",
         "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      "status" : "success"
   }
}
```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "previous" : {
         "description" : "Ripple s1 server 'WOOL'",
         "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `previous` | Object | _(May be omitted)_ A **peer reservation object** with the last state of the peer reservation before deleting it. This field is always provided if a peer reservation was successfully deleted. |

**Note:** If the specified reservation did not exist, this command returns success with an empty result object. In this case, the `previous` field is omitted.

#### Peer Reservation Object

If the `previous` field is provided, it shows the previous status of this peer reservation, with the following fields:

{% include '_snippets/peer_reservation_object.md' %}
<!--_ -->

### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `publicMalformed` - The `public_key` field of the request is not valid. It must be a valid node public key in [base58][] format.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
