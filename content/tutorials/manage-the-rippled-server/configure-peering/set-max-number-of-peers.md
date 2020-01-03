# Set Maximum Number of Peers

The `rippled` server has a configurable soft maximum number of [peers](peer-protocol.html) to connect to. The default maximum number of peers is **21**.

**Note:** Internally, the server generates approximate quotas of incoming and outgoing peers. You can potentially go over the soft maximum if you are using [fixed peers, peer reservations](peer-protocol.html#fixed-peers-and-peer-reservations), or if you manually connect to additional peers using the [connect method][].

To change the maximum number of peers your server allows, complete the following steps:

1. Edit your `rippled`'s config file.

        $ vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. In the config file, uncomment and edit the `[peers_max]` stanza, or add one if you don't have one already:

        [peers_max]
        30

    The only content of the stanza should be an integer indicating the total number of peers to allow. By default, the server attempts to maintain a ratio of about 85% incoming and 15% outgoing peers, but with a minimum of 10 outgoing peers, so any value less than 68 won't increase the number of outgoing peer connections your server makes.

    If the `[peers_max]` value is less than 10, the server still allows a hardcoded minimum of 10 outgoing peers so that it can maintain connectivity with the network. To block all outgoing peer connections, [configure the server as a private peer](run-rippled-as-a-validator.html#connect-using-proxies) instead.

    **Caution:** The more peer servers you are connected to, the more network bandwidth your `rippled` server uses. You should only configure large numbers of peer servers if your `rippled` server has a good network connection and you can afford the costs you may incur for the bandwidth it uses.

3. Restart the `rippled` server.

        $ sudo systemctl restart rippled.service


## See Also

- **Concepts:**
    - [Peer Protocol](peer-protocol.html)
    - [The `rippled` Server](the-rippled-server.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html)
    - [Troubleshoot the `rippled` Server](troubleshoot-the-rippled-server.html)
- **References:**
    - [connect method][]
    - [peers method][]
    - [print method][]
    - [server_info method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
