# Configure Peering

The XRP Ledger's peer-to-peer protocol automatically manages peer connections in most cases. In some cases, you may want to manually adjust which peers your server connects to, to maximize your server's availability and connectivity with the rest of the network.

If you run multiple servers in the same datacenter, you may want [to cluster them](cluster-rippled-servers.html) to improve efficiency. You can use reserved peer slots for servers you don't run but want to stay connected to, such as important hubs in the topology of the peer-to-peer network. For other peers, the server can automatically find peers and manage its connections, although you may occasionally want to intervene to block a peer that's behaving undesirably.
