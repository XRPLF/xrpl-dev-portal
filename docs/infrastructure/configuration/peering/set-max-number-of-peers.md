---
html: set-max-number-of-peers.html
parent: configure-peering.html
seo:
    description: Set the maximum number of peers your xrpld server connects to.
labels:
  - Core Server
---
# Set Maximum Number of Peers

The `xrpld` server has a configurable soft maximum number of [peers](../../../concepts/networks-and-servers/peer-protocol.md) to connect to. The default maximum number of peers is **21**.

{% admonition type="info" name="Note" %}Internally, the server generates approximate quotas of incoming and outgoing peers. You can go over the soft maximum with [fixed peers](../../../concepts/networks-and-servers/peer-protocol.md#fixed-peers-and-peer-reservations), cluster members, and inbound peers that hold a [peer reservation](../../../concepts/networks-and-servers/peer-protocol.md#fixed-peers-and-peer-reservations) on your server. A manual [connect method][] call to any other address takes an ordinary outbound slot and fails with `Outbound Full` when those slots are taken.{% /admonition %}

To change the maximum number of peers your server allows, complete the following steps:

1. Edit your `xrpld`'s config file.

    ```
    $ vim /etc/xrpld/xrpld.cfg
    ```

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

2. In the config file, uncomment and edit the `[peers_max]` stanza, or add one if you don't have one already:

    ```
    [peers_max]
    30
    ```

    The only content of the stanza should be an integer indicating the total number of peers to allow. By default, the server attempts to maintain a ratio of about 85% incoming and 15% outgoing peers, but with a minimum of 10 outgoing peers, so any value less than 70 won't increase the number of outgoing peer connections your server makes. The default of 21 is 10 outgoing plus up to 11 incoming.

    If the `[peers_max]` value is less than 10, the server still allows a hardcoded minimum of 10 outgoing peers so that it can maintain connectivity with the network. To stop the server from making automatic connections, [configure it as a private peer](../server-modes/validator.md#connect-using-proxies) instead. It then connects only to the servers in `[ips_fixed]`, and `[peers_max]` no longer limits those.

    {% admonition type="warning" name="Caution" %}The more peer servers you are connected to, the more network bandwidth your `xrpld` server uses. You should only configure large numbers of peer servers if your `xrpld` server has a good network connection and you can afford the costs you may incur for the bandwidth it uses. As a rough guide, plan 4 to 7 GB per peer per day for a server with a small, fixed set of peers (see [Validator System Requirements](../../prerequisites/system-requirements/validator.md) for how to measure yours).{% /admonition %}

3. Restart the `xrpld` server.

    ```
    $ sudo systemctl restart xrpld.service
    ```


## See Also

- **Concepts:**
    - [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)
    - [The `xrpld` Server](../../../concepts/networks-and-servers/index.md)
- **Tutorials:**
    - [Capacity Planning](../../prerequisites/capacity-planning.md)
    - [Troubleshoot the `xrpld` Server](../../troubleshooting/index.md)
- **References:**
    - [connect method][]
    - [peers method][]
    - [print method][]
    - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
