# Peer Protocol

Servers in the XRP Ledger communicate to each other using the XRP Ledger peer protocol, also known as RTXP.

The peer protocol is the main mode of communication between servers in the XRP Ledger. All information about the behavior, progress, and connectivity of the XRP Ledger passes through the peer protocol. Examples of peer-to-peer communications include all of the following:

- Requesting a connection to other servers in the peer-to-peer network, or advertising that connection slots are available.
- Sharing candidate transactions with the rest of the network.
- Requesting ledger data from historical ledgers, or providing that data.
- Proposing a set of transactions for consensus, or sharing the calculated outcome of applying a consensus transaction set.

To establish a peer-to-peer connection, one server connects to another via HTTPS and requests an [HTTP upgrade](https://tools.ietf.org/html/rfc7230#section-6.7) to switch to RTXP. (For more information, see the [Overlay Network](https://github.com/ripple/rippled/blob/906ef761bab95f80b0a7e0cab3b4c594b226cf57/src/ripple/overlay/README.md#handshake) article in the [`rippled` repository](https://github.com/ripple/rippled).)

## Peer Discovery

The XRP Ledger uses a "gossip" protocol to help find servers find others to connect to in the XRP Ledger network. Whenever a server starts up, it reconnects to any other peers it previously connected to. As a fallback, it uses the [hardcoded public hubs](https://github.com/ripple/rippled/blob/fa57859477441b60914e6239382c6fba286a0c26/src/ripple/overlay/impl/OverlayImpl.cpp#L518-L525). After a server successfully connects to a peer, it asks that peer for the contact information (generally, IP address and port) of other XRP Ledger servers that may also be seeking peers. The server can then connect to those servers, and ask them for the contact information of yet more XRP Ledger servers to peer with. Through this process, the server establishes enough peer connections that it can remain reliably connected to the rest of the network even if it loses a connection to any single peer.

Typically, a server needs to connect to a public hub only once, for a short amount of time, to find other peers. After doing so, the server may or may not remain connected to the hub, depending on how stable its network connection is, how busy the hub is, and how many other high-quality peers the server finds. The server saves the addresses of these other peers so it can try reconnecting directly to those peers later, after a network outage or a restart.

The [peers method][] shows a list of peers your server is currently connected to.

For certain high-value servers (such as important [validators](rippled-server-modes.html#rippled-server-modes)) you may prefer not to have your server connect to untrusted peers through the peer discovery process. In this case, you can configure your server to use [private peers](#private-peers) only.


## Peer Protocol Port

To participate in the XRP Ledger, `rippled` servers connect to arbitrary peers using the peer protocol. (All peers are treated as untrusted, unless they are [clustered](clustering.html) with the current server.)

Ideally, the server should be able to send _and_ receive connections on the peer port. You should [forward the port used for the peer protocol through your firewall](forward-ports-for-peering.html) to the `rippled` server.

The [default `rippled` config file](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) listens for incoming peer protocol connections on port 51235 on all network interfaces. You can change the port used by editing the appropriate stanza in your `rippled.cfg` file.

Example:

```
[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer
```

The peer protocol port also serves the [special Peer Crawler API method](peer-crawler.html).

## Node Key Pair

When a server first starts up, it generates a _node key pair_ to use to identify itself in peer protocol communications. The server uses its key to sign all its peer protocol communications. This makes it possible to reliably identify and verify the integrity of messages from another server in the peer-to-peer network even if that server's messages are being relayed by untrusted peers.

The node key pair is saved in the database and reused when the server restarts. If you delete the server's databases, it creates a new node key pair, effectively coming online with a different identity. To reuse the same key pair even if the databases are deleted, you can configure the server with a `[node_seed]` stanza. To generate a value suitable for use in the `[node_seed]` stanza, use the [validation_create method][].

The node key pair also identifies other servers for purposes of [clustering](clustering.html) or [reserving peer slots](#fixed-peers-and-peer-reservations). If you have a cluster of servers, you should configure each server in the cluster with a unique `[node_seed]` setting. For more information on setting up a cluster, see [Cluster `rippled` Servers](cluster-rippled-servers.html).


## Fixed Peers and Peer Reservations

Normally, a `rippled` server attempts to maintain a healthy number of peers, and automatically connects to untrusted peers up to a maximum number. You can configure a `rippled` server to remain connected to specific peer servers in several ways:

- Use **Fixed Peers** to remain always connected to specific other peers based on their IP addresses. This only works if the peers have fixed IP addresses. Use the `[ips_fixed]` config stanza to configure fixed peers. This is a necessary part of [clustering](clustering.html) or [private peers](#private-peers). Fixed peers are defined in the config file, so changes only apply after restarting the server. Fixed peers are most useful for keeping servers connected if those servers are run by the same person or organization.
- Use **Peer Reservations** to prioritize specific peers. If your server has a peer reservation for a specific peer, then your server always accepts connection requests from that peer even if your server is already at its maximum number of connected peers. (This can cause your server to go _over_ the maximum number of peers.) You identify a reserved peer by its [node key pair](#node-key-pair), so you can do this even for peers with variable IP addresses. Peer reservations are configured through admin commands and saved in the server databases, so they can be adjusted while the server is online and are saved across restarts. Peer reservations are most useful for connecting servers operated by different people or organizations. [New in: rippled 1.4.0][]

In the following cases, a `rippled` server does not connect to untrusted peers:

- If the server is configured as a [private peer](#private-peers), it connects _only_ to its fixed peers.
- If the server is running in [stand-alone mode](rippled-server-modes.html#reasons-to-run-a-rippled-server-in-stand-alone-mode) it does not connect to _any_ peers.


## Private Peers

You can configure a `rippled` server to act as a "private" server to keep its IP address hidden from the general public. This can be a useful precaution against denial of service attacks and intrusion attempts on important `rippled` servers such as trusted validators. To participate in the peer-to-peer network, a private server must be configured to connect to at least one non-private server, which relays its messages to the rest of the network.

**Caution:** If you configure a private server without any [fixed peers](#fixed-peers-and-peer-reservations), the server cannot connect to the network, so it cannot know network state, broadcast transactions, or participate in the consensus process.

Configuring a server as a private server has several effects:

- The server does not make outgoing connections to other servers in the peer-to-peer network unless it has been explicitly configured to connect to those servers.
- The server does not accept incoming connections from other servers unless it has been explicitly configured to accept connections from those servers.
- The server asks its direct peers not to reveal its IP address in untrusted communications, including the [peer crawler API response](peer-crawler.html). This does not affect trusted communications such as the [peers admin method][peers method].

    Validators always ask their peers to hide the validators' IP addresses, regardless of the private server settings. This helps protect validators from being overloaded by denial of service attacks. [New in: rippled 1.2.1][]

    **Caution:** It is possible to modify a server's source code so that it ignores this request and shares its immediate peers' IP addresses anyway. You should configure your private server to connect only to servers that you know are not modified in this way.

### Pros and Cons of Peering Configurations

To be part of the XRP Ledger, a `rippled` server must be connected to the rest of the open peer-to-peer network. Roughly speaking, there are three categories of configurations for how a `rippled` server connects to the network:

- Using **discovered peers**. The server connects to any untrusted servers it finds and stays connected as long as those servers behave appropriately. (For example, they don't request too much data, their network connections are stable, and they appear to be following the same [network](parallel-networks.html).) This is the default.
- As a **private server using proxies** run by the same person or organization. The proxies are stock `rippled` servers (also connected to discovered peers) that maintain a fixed peering connection with the private server.
- As a **private server using public hubs**. This is similar to using proxies, but it relies on specific third parties.

The pros and cons of each configuration are as follows:


<table>
<thead><tr>
<th>Configuration</th> <th>Pros</th> <th>Cons</th>
</tr></thead>
<tbody>
<tr><th>Discovered Peers</th>
  <td><ul>
    <li><p>Simplest configuration, with a low maintenance burden.</p></li>
    <li><p>Creates the opportunity for a lot of direct peer connections. Having more direct peers comes with several benefits. Your server can <a href="ledger-history.html#fetching-history">fetch history</a> from multiple peers in parallel, both when syncing and when backfilling history. Since not all peers maintain full history, having access to more peers can also provide access to a wider selection of historical data.</p></li>
    <li><p>Lowers the possibility of disconnecting from the network because your server can replace disconnected peers with new ones.</p></li>
  </ul></td>
  <td><ul>
    <li><p>Doesn't allow you to select your server's peers, which means that you have no idea whether your peers may decide to act maliciously. Although `rippled` servers are designed to protect against malicious peers, there is always a risk that malicious peers could exploit software flaws to affect your server.</p></li>
    <li><p>Your server's peers may disconnect or change frequently.</p></li>
  </ul></td>
</tr>
<tr><th>Private Server Using Proxies</th>
  <td><ul>
    <li><p>Most secure and reliable configuration when implemented effectively.</p></li>
    <li><p>As reliable and as redundant as you make it.</p></li>
    <li><p>Can optimize the private server's performance with <a href="clustering.html">clustering</a>.</p></li>
    <li><p>Enables you to create as many direct peer connections as you want. Your private server can <a href="ledger-history.html#fetching-history">fetch history</a> from multiple peers in parallel. Since you run the peers, you also control how much ledger history each peer keeps.</p></li>
  </ul></td>
  <td><ul>
    <li><p>Higher maintenance burden and cost from running multiple servers.</p></li>
    <li><p>Does not completely eliminate the possibility of peer connection outages. No matter how many proxies you run, if they all exist on the same server rack, then one network or power outage can affect all of them.</p></li>
  </ul></td>
</tr>
<tr><th>Private Server Using Public Hubs</th>
  <td><ul>
    <li><p>Low maintenance burden with a small amount of configuration.</p></li>
    <li><p>Provides easy access to safe connections to the network.</p></li>
    <li><p>Compared to connecting using proxies, may be less likely to cause your private server to disconnect from the network due to a simultaneous peer outage.</p></li>
  </ul></td>
  <td><ul>
    <li><p>Depends on high-reputation third parties to remain reliable.</p></li>
    <li>
      <p>May cause your server to become disconnected from the network if the public hubs you rely on are too busy. Due to the nature of public hubs, they are the most popular and may not be able to keep a steady connection open to everyone.</p>
      <p>To help avoid this issue, use more public hubs; the more the better. It can also help to use non-default hubs, which are less likely to be busy.</p>
    </li>
  </ul></td>
</tr>
</tbody>
</table>

### Configuring a Private Server

To configure your server as a private server, set the `[peer_private]` setting to `1` in the config file. For detailed instructions, see [Configure a Private Server](configure-a-private-server.html).


## See Also

- **Concepts:**
    - [Consensus](consensus.html)
    - [Parallel Networks](parallel-networks.html)
- **Tutorials:**
    - [Cluster rippled Servers](cluster-rippled-servers.html)
    - [Configure a Private Server](configure-a-private-server.html)
    - [Configure the Peer Crawler](configure-the-peer-crawler.html)
    - [Forward Ports for Peering](forward-ports-for-peering.html)
    - [Manually Connect to a Specific Peer](manually-connect-to-a-specific-peer.html)
    - [Set Maximum Number of Peers](set-max-number-of-peers.html)
    - [Use a Peer Reservation](use-a-peer-reservation.html)
- **References:**
    - [peers method][]
    - [peer_reservations_add method][]
    - [peer_reservations_del method][]
    - [peer_reservations_list method][]
    - [connect method][]
    - [fetch_info method][]
    - [Peer Crawler](peer-crawler.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
