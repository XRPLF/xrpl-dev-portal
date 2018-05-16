# Peer Protocol

Servers in the XRP Ledger communicate to each other using the XRP Ledger peer protocol, also known as RTXP. Peer servers connect via HTTPS and then do an [HTTP upgrade](https://tools.ietf.org/html/rfc7230#section-6.7) to switch to RTXP. (For more information, see the [Overlay Network](https://github.com/ripple/rippled/blob/906ef761bab95f80b0a7e0cab3b4c594b226cf57/src/ripple/overlay/README.md#handshake) article in the [`rippled` repository](https://github.com/ripple/rippled).)

## Configuring the Peer Protocol

To participate in the XRP Ledger, `rippled` servers connects to arbitrary peers using the peer protocol. (All such peers are treated as untrusted, unless they are [clustered](clustering.html) with the current server.)

Ideally, the server should be able to send _and_ receive connections on the peer port. You should forward the port used for the peer protocol through your firewall to the `rippled` server. The [default `rippled` configuration file](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) listens for incoming peer protocol connections on port 51235 on all network interfaces. You can change the port used by editing the appropriate stanza in your `rippled.cfg` file.

Example:

```
[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer
```

## Peer Crawler

The Peer Crawler asks a `rippled` server to report information about the other `rippled` servers it is connected to as peers. The [`peers` command](peers.html) in the [WebSocket and JSON-RPC APIs](get-started-with-the-rippled-api.html) also returns a similar, more comprehensive set of information, but requires [administrative access](admin-rippled-methods.html) to the server. The Peer Crawler response is available to other servers on a non-privileged basis through the Peer Protocol (RTXP) port.

#### Request Format

To request the Peer Crawler information, make the following HTTP request:

* **Protocol:** https
* **HTTP Method:** GET
* **Host:** (any `rippled` server, by hostname or IP address)
* **Port:** (port number where the `rippled` server uses the Peer Protocol, typically 51235)
* **Path:** `/crawl`
* **Notes:** Most `rippled` servers use a self-signed certificate to respond to the request. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers.

#### Response Format

The response has the status code **200 OK** and a JSON object in the message body.

The JSON object has the following fields:

| `Field`          | Value | Description                                       |
|:-----------------|:------|:--------------------------------------------------|
| `overlay.active` | Array | Array of Peer Objects, where each member is a peer that is connected to this server. |

Each member of the `active` array is a Peer Object with the following fields:

| `Field`      | Value                    | Description                        |
|:-------------|:-------------------------|:-----------------------------------|
| `ip`         | String (IPv4 Address)    | The IP address of this connected peer. |
| `port`       | String (Number)          | The port number on the peer server that serves RTXP. Typically 51235. |
| `public_key` | String (Base-64 Encoded) | The public key of the ECDSA key pair used by this peer to sign RTXP messages. (This is the same data as the `pubkey_node` reported in the peer server's [`server_info` command](server_info.html).) |
| `type`       | String                   | The value `in` or `out`, indicating whether the TCP connection to the peer is incoming or outgoing. |
| `uptime`     | Number                   | The number of seconds the server has been has been connected to this peer. |
| `version`    | String                   | The `rippled` version number the peer reports to be using. |

#### Example

Request:

<!-- MULTICODE_BLOCK_START -->

*HTTP*

```
GET https://s1.ripple.com:51235/crawl
```

*cURL*

```
curl -k https://s1.ripple.com:51235/crawl
```

<!-- MULTICODE_BLOCK_END -->

Response:

```json
200 OK
{
    "overlay": {
        "active": [{
            "ip": "208.43.252.243",
            "port": "51235",
            "public_key": "A2GayQNaj7qbqLFiCFW2UXtAnEPghP/KWVqix2gUa6dM",
            "type": "out",
            "uptime": 107926,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "184.172.237.226",
            "port": "51235",
            "public_key": "Asv/wKq/dqMWbP2M4eR+QvkuojYMLRXhKhIPnW40bsaF",
            "type": "out",
            "uptime": 247376,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "54.186.73.52",
            "port": "51235",
            "public_key": "AjikFnq0P2XybCyREr2KPiqXqJteqwPwVRVbVK+93+3o",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "169.53.155.59",
            "port": "51235",
            "public_key": "AyIcVhAhOGnP0vtfCt+HKUrx9B2fDvP/4XUkOtVQ37g/",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.1"
        }, {
            "ip": "169.53.155.44",
            "port": "51235",
            "public_key": "AuVZszWXgMgM8YuTVhQsGE9OciEeBD8aMVe1mFid3n63",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.32.0-b12"
        }, {
            "ip": "184.173.45.39",
            "port": "51235",
            "public_key": "Ao2GbGbp2QYQ2B4S9ckCtON7CsZdXqdK5Yon4x7qmWFm",
            "type": "out",
            "uptime": 63336,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "169.53.155.34",
            "port": "51235",
            "public_key": "A3inNJsIQzO7z7SS7uB9DyvN0wsiS9it/RGY/kNx6KEG",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "169.53.155.45",
            "port": "51235",
            "public_key": "AglUUjwXTC2kUlK41WjDs2eAVN0SnlMpzYA9lEgB0UGP",
            "type": "out",
            "uptime": 65443,
            "version": "rippled-0.31.0-rc1"
        }, {
            "ip": "99.110.49.91",
            "port": "51301",
            "public_key": "AuQDH0o+4fpl2n+pR5U0Y4FTj0oGr4iEKe0MObPcSYj9",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.32.0-b9"
        }, {
            "ip": "169.53.155.36",
            "port": "51235",
            "public_key": "AsR4xub7MLg2Zl5Fwd/n7dTz7mhbBoSyCc/v9bnubrVy",
            "type": "out",
            "uptime": 328776,
            "version": "rippled-0.31.0-rc1"
        }]
    }
}
```

## Private Peers

<!--{# TODO: unify with the very similar "Public-Facing Server" section of rippled-setup and probably move to a tutorial #}-->

You can use the `[peer_private]` stanza of the `rippled` config file to request that peer servers do not report your IP address in the Peer Crawler response. Servers you do not control can be modified not to respect this setting. However, you can use this to hide the IP addresses of `rippled` servers you control that _only_ connect to peers you control (using `[ips_fixed]` and a firewall). In this way, you can use public rippled servers you control as proxies for your private rippled servers.

To protect an important [validating server](rippled-server-modes.html), Ripple recommends configuring one or more public tracking servers to act as proxies, while the validating server is protected by a firewall and only connects to the public tracking servers.

<!--{# TODO: network diagram of private peers #}-->

Example configuration:

```
# Configuration on a private server that only connects through
# a second rippled server at IP address 10.1.10.55
[ips_fixed]
10.1.10.55

[peer_private]
1
```
