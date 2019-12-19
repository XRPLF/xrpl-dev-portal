# Configure Peer Connections

The XRP Ledger's peer-to-peer protocol automatically manages peer connections in most cases. In some cases, you may want to manually adjust which peers your server connects to, to maximize your server's availability and connectivity with the rest of the network.

If you run multiple servers in the same datacenter, you may want [to cluster them](cluster-rippled-servers.html) to improve efficiency. You can use reserved peer slots for servers you don't run but want to stay connected to, such as important hubs in the topology of the peer-to-peer network. For other peers, the server can automatically find peers and manage its connections, although you may occasionally want to intervene to block a peer that's behaving undesirably.

***TODO: steps for the tasks below***

## Configure Firewall

Having 10-11 peers probably means your firewall is blocking incoming connections. Open the peer protocol port (51235 by default) to allow incoming peer connections.


## Add a Reserved Peer Slot

[peer_reservations_add method][]


## Remove a Reserved Peer Slot

[peer_reservations_del method][]


## Check Reserved Peer Slots

[peer_reservations_list method][]


## Disconnect an Unwanted Peer

No API for this but you can use a software firewall to block peers making excessive requests or on the wrong network chain. (see RBH script for examples)


## Check Peer Bandwidth Usage

[peers method][]



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
