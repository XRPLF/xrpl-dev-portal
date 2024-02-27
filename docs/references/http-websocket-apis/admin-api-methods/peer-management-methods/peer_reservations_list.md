---
html: peer_reservations_list.html
parent: peer-management-methods.html
seo:
    description: List reserved slots for specific peer servers.
labels:
  - Core Server
---
# peer_reservations_list
[[Source]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L116 "Source")

The {% code-page-name /%} method lists [peer reservations][].

_The {% code-page-name /%} method is an [admin method](../index.md) that cannot be run by unprivileged users._


### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "peer_reservations_list_example_1",
  "command": "{% $frontmatter.seo.title %}"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}"
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: {% $frontmatter.seo.title %}
rippled {% $frontmatter.seo.title %}
```
{% /tab %}

{% /tabs %}

This request does not take any parameters.


### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% tab label="Commandline" %}
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
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type  | Description                                         |
|:---------------|:------|:----------------------------------------------------|
| `reservations` | Array | List of existing [peer reservations][]. Each member is a peer reservation object, as described below. |

#### Peer Reservation Object

Each member of the `reservations` array is a JSON object describing one [peer reservation][]. This object has the following fields:

{% partial file="/docs/_snippets/peer_reservation_object.md" /%}


### Possible Errors

- Any of the [universal error types][].
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
