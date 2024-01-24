---
html: peer_reservations_add.html
parent: peer-management-methods.html
seo:
    description: Add a reserved slot for a specific peer server.
labels:
  - Core Server
---
# peer_reservations_add
[[Source]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L36 "Source")

The {% code-page-name /%} method adds or updates a reserved slot for a specific peer server in the XRP Ledger [peer-to-peer network](../../../../concepts/networks-and-servers/peer-protocol.md).

_The {% code-page-name /%} method is an [admin method](../index.md) that cannot be run by unprivileged users._


### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "peer_reservations_add_example_1",
    "command": "{% $frontmatter.seo.title %}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99",
    "description": "Ripple s1 server 'WOOL'"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99",
      "description": "Ripple s1 server 'WOOL'"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: {% $frontmatter.seo.title %} <public_key> [<description>]
rippled {% $frontmatter.seo.title %} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99 "Ripple s1 server 'WOOL'"
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`       | Type   | Description                                         |
|:--------------|:-------|:----------------------------------------------------|
| `public_key`  | String | The [node public key][] of the peer reservation to add a reservation for, in [base58][]. |
| `description` | String | _(Optional)_ A custom description for the peer reservation. The server truncates descriptions longer than 64 characters when it restarts. |



### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "peer_reservations_add_example_1",
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
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
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
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
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    },
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`    | Type   | Description                                            |
|:-----------|:-------|:-------------------------------------------------------|
| `previous` | Object | _(May be omitted)_ The previous entry for the same [node public key][], if there was already a reservation with the same node public key. This object is formatted as a **Peer Reservation Object**, as described below. |

If there was not a previous entry for the same [node public key][], the `result` object is empty.

#### Peer Reservation Object

If the `previous` field is provided, it shows the previous status of this peer reservation, with the following fields:

{% partial file="/_snippets/peer_reservation_object.md" /%}



### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `publicMalformed` - The `public_key` field of the request is not valid. It must be a valid node public key in [base58][] format.
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/_snippets/common-links.md" /%}
