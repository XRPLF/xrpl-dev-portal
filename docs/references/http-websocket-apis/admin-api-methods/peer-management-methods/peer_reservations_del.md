---
html: peer_reservations_del.html
parent: peer-management-methods.html
seo:
    description: Remove a reserved slot for a specific peer server.
labels:
  - Core Server
---
# peer_reservations_del
[[Source]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L89 "Source")

The {% code-page-name /%} method removes a specific [peer reservation][], if one exists.

_The {% code-page-name /%} method is an [admin method](../index.md) that cannot be run by unprivileged users._

**Note:** Removing a peer reservation does not automatically disconnect the corresponding peer, if that peer is connected.

### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "peer_reservations_del_example_1",
    "command": "{% $frontmatter.seo.title %}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: {% $frontmatter.seo.title %} <public_key>
rippled {% $frontmatter.seo.title %} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99
```
{% /tab %}

{% /tabs %}

The request includes the following parameter:

| `Field`     | Type                      | Description                        |
|:------------|:--------------------------|:-----------------------------------|
| `public_key` | String | The [node public key][] of the [peer reservation][] to remove, in [base58][] format. |


### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% tab label="Commandline" %}
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
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `previous` | Object | _(May be omitted)_ A **peer reservation object** with the last state of the peer reservation before deleting it. This field is always provided if a peer reservation was successfully deleted. |

**Note:** If the specified reservation did not exist, this command returns success with an empty result object. In this case, the `previous` field is omitted.

#### Peer Reservation Object

If the `previous` field is provided, it shows the previous status of this peer reservation, with the following fields:

{% partial file="/docs/_snippets/peer_reservation_object.md" /%}


### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `publicMalformed` - The `public_key` field of the request is not valid. It must be a valid node public key in [base58][] format.
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
