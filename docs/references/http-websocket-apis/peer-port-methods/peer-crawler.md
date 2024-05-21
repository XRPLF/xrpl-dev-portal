---
html: peer-crawler.html
parent: peer-port-methods.html
seo:
    description: Special API method for sharing network topology and status metrics.
labels:
  - Core Server
  - Blockchain
---
# Peer Crawler

The Peer Crawler is a special [peer port method](index.md) for reporting on the health and topology of the peer-to-peer network. This API method is available by default on a non-privileged basis through the [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md) port, which is also used for `rippled` servers' peer-to-peer communications about consensus, ledger history, and other necessary information.

The information reported by the peer crawler is effectively public, and can be used to report on the overall XRP Ledger network, its health, and topology.

## Request Format

To request the Peer Crawler information, make the following HTTP request:

- **Protocol:** https
- **HTTP Method:** GET
- **Host:** (any `rippled` server, by hostname or IP address)
- **Port:** (the port number where the `rippled` server uses the Peer Protocol, typically 51235)
- **Path:** `/crawl`
- **Security:** Most `rippled` servers use a self-signed certificate to respond to the request. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers.


## Response Format

The response has the status code **200 OK** and a JSON object in the message body.

The JSON object has the following fields:

| `Field`          | Value  | Description                                      |
|:-----------------|:-------|:-------------------------------------------------|
| `counts`         | Object | _(May be omitted)_ Stats about this server's health, similar to the response from the [get_counts method][]. The default configuration does not report this field. Information reported includes: how large the ledger and transaction databases are, the cache hit rate for the in-application caches, and how many objects of various types are cached in memory. Types of objects that may be stored in memory include ledgers (`Ledger`), transactions (`STTx`), validation messages (`STValidation`), and more. |
| `overlay` | Object  | _(May be omitted)_ Information about the peer servers currently connected to this one, similar to the response from the [peers method][]. Contains one field, `active`, which is an array of objects (see below). |
| `server`         | Object | _(May be omitted)_ Information about this server. Contains public fields from the [server_state method][], including what `rippled` version you are running (`build_version`), which [ledger versions](../../../concepts/networks-and-servers/ledger-history.md) your server has available (`complete_ledgers`), and the amount of load your server is experiencing. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}Updated in: rippled 1.2.1{% /badge %} |
| `unl`            | Object | _(May be omitted)_ Information about the validators and validator list sites this server is configured to trust, similar to the response from the [validators method][] and [validator_list_sites method][]. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}Updated in: rippled 1.2.1{% /badge %} |
| `version`        | Number | Indicates the version of this peer crawler response format. The current peer crawler version number is `2`. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}Updated in: rippled 1.2.1{% /badge %} |

Each member of the `overlay.active` array is an object with the following fields:

| `Field`      | Value                    | Description                        |
|:-------------|:-------------------------|:-----------------------------------|
| `complete_ledgers` | String | The range of [ledger versions](../../../concepts/networks-and-servers/ledger-history.md) this peer has available. |
| `complete_shards` | String | _(May be omitted)_ The range of [ledger history shards](../../../infrastructure/configuration/data-retention/history-sharding.md) this peer has available. |
| `ip`         | String (IPv4 Address)    | _(May be omitted)_ The IP address of this connected peer. Omitted if the peer is configured as a validator or a [private peer](../../../concepts/networks-and-servers/peer-protocol.md#private-peers). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}Updated in: rippled 1.2.1{% /badge %} |
| `port`       | String or Number          | _(May be omitted)_ The port number on the peer server that serves RTXP. This will be a string if outbound and a number otherwise. Typically `51235`. Omitted if the peer is configured as a validator or a [private peer](../../../concepts/networks-and-servers/peer-protocol.md#private-peers). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}Updated in: rippled 1.2.1{% /badge %} |
| `public_key` | String (Base-64 Encoded) | The public key of the ECDSA key pair used by this peer to sign RTXP messages. (This is the same data as the `pubkey_node` reported by the peer server's [server_info method][].) |
| `type`       | String                   | The value `in` or `out`, indicating whether the TCP connection to the peer is incoming or outgoing. |
| `uptime`     | Number                   | The number of seconds the server has been connected to this peer. |
| `version`    | String                   | The `rippled` version number the peer reports to be using. |

#### Example

Request:

{% tabs %}

{% tab label="HTTP" %}
```
GET https://localhost:51235/crawl
```
{% /tab %}

{% tab label="cURL" %}
```
curl --insecure https://localhost:51235/crawl
```
{% /tab %}

{% /tabs %}

Response:

{% code-snippet file="/_api-examples/peer-crawler/crawl.json" language="json" prefix="200 OK\n\n" /%}


## See Also

- [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)
- [Configure the Peer Crawler](../../../infrastructure/configuration/peering/configure-the-peer-crawler.md)
- [Validator History Service](https://github.com/ripple/validator-history-service) is an example of a service that uses the peer crawler for ingesting, aggregating, storing, and disbursing validation related data.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
