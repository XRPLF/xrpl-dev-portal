# Peer Protocol

Servers in the XRP Ledger communicate to each other using the XRP Ledger peer protocol, also known as RTXP.

The peer protocol is the main mode of communication between servers in the XRP Ledger. All information about the behavior, progress, and connectivity of the XRP Ledger passes through the peer protocol. Examples of peer-to-peer communications include all of the following:

- Requesting a connection to other servers in the peer-to-peer network, or advertising that connection slots are available.
- Sharing candidate transactions with the rest of the network.
- Requesting ledger data from historical ledgers, or providing that data.
- Proposing a set of transactions for consensus, or sharing the calculated outcome of applying a consensus transaction set.

To establish a peer-to-peer connection, one server connects to another via HTTPS and requests an [HTTP upgrade](https://tools.ietf.org/html/rfc7230#section-6.7) to switch to RTXP. (For more information, see the [Overlay Network](https://github.com/ripple/rippled/blob/906ef761bab95f80b0a7e0cab3b4c594b226cf57/src/ripple/overlay/README.md#handshake) article in the [`rippled` repository](https://github.com/ripple/rippled).)

## Peer Protocol Port

To participate in the XRP Ledger, `rippled` servers connect to arbitrary peers using the peer protocol. (All peers are treated as untrusted, unless they are [clustered](clustering.html) with the current server.)

Ideally, the server should be able to send _and_ receive connections on the peer port. You should forward the port used for the peer protocol through your firewall to the `rippled` server. The [default `rippled` configuration file](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) listens for incoming peer protocol connections on port 51235 on all network interfaces. You can change the port used by editing the appropriate stanza in your `rippled.cfg` file.

Example:

```
[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer
```

The peer protocol port also serves the [special Peer Crawler API method](peer-crawler.html).

### Node Key Pair

When a server first starts up, it generates a _node key pair_ to use to identify itself in peer protocol communications. The server uses its key to sign all its peer protocol communications. This makes it possible to reliably identify and verify the integrity of messages from another server in the peer-to-peer network even if that server's messages are being relayed by untrusted peers.

The node key pair is saved in the database and reused when the server restarts. If you delete the server's databases, it creates a new node key pair, effectively coming online with a different identity. To reuse the same key pair even if the databases are deleted, you can configure the server with a `[node_seed]` stanza. To generate a value suitable for use in the `[node_seed]` stanza, use the [validation_create method][].

The node key pair also identifies other servers [clustered](clustering.html) with this one. If you have a cluster of servers, you should configure each server in the cluster with a unique `[node_seed]` setting. For more information on setting up a cluster, see [Cluster `rippled` Servers](cluster-rippled-servers.html).


## Private Peers

You can configure a `rippled` server to act as a "private" server to keep its IP address hidden from the general public. This can be a useful precaution against denial of service attacks and intrusion attempts on important `rippled` servers such as trusted validators. To participate in the peer-to-peer network, a private server must be configured to connect to at least one non-private server, which relays its messages to the rest of the network.

Configuring a server as a private server has several effects:

- The server does not make outgoing connections to other servers in the peer-to-peer network unless it has been explicitly configured to connect to those servers.
- The server does not accept incoming connections from other servers unless it has been explicitly configured to accept connections from those servers.
- The server asks its direct peers not to reveal its IP address in untrusted communications, including the [peer crawler API response](peer-crawler.html). This does not affect trusted communications such as the [peers admin method][peers method].

    Validators always ask their peers to hide the validators' IP addresses, regardless of the private server settings. This helps protect validators from being overloaded by denial of service attacks. [New in: rippled 1.2.1][]

    **Caution:** It is possible to modify a server's source code so that it ignores this request and shares its immediate peers' IP addresses anyway. You should configure your private server to connect only to servers that you know are not modified in this way.


### Configuring a Private Server

Use the `[peer_private]` stanza of the `rippled` config file to make your server act as a private peer. Use the `[ips_fixed]` to list servers you want your server to connect to. (If you enable `[peer_private]` without any addresses in `[ips_fixed]`, your server does not connect to the network.) As an additional precaution, use a firewall to block incoming connections from other servers.

Example configuration:

```
# Configuration on a private server that only connects through
# a second rippled server at IP address 10.1.10.55
[ips_fixed]
10.1.10.55

[peer_private]
1
```


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
