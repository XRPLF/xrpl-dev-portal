# Clustering

If you are running multiple `rippled` servers in a single datacenter, you can configure those servers into a cluster to maximize efficiency. Running your `rippled` servers in a cluster provides the following benefits:

- Clustered `rippled` servers share the work of cryptography. If one server has verified the authenticity of a message, the other servers in the cluster trust it and do not re-verify.
- Clustered servers share information about peers and API clients that are misbehaving or abusing the network. This makes it harder to attack all servers of the cluster at once.
- Clustered servers always propagate transactions throughout the cluster, even if the transaction does not meet the current load-based transaction fee on some of them.

If you are running a validator as a [private peer](peer-protocol.html#private-peers), Ripple recommends using a cluster of `rippled` servers as proxy servers.

## Configuring Clustering

To enable clustering, change the following sections of your [config file](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) for each server:

1. List the IP address and port of each other server under the `[ips_fixed]` section. The port should be the one from the other servers' `protocol = peer` setting in their `rippled.cfg`. Example:

        [ips_fixed]
        192.168.0.1 51235
        192.168.0.2 51235

2. Generate a unique seed (using the [validation_create method][]) for each of your servers, and configure it under the `[node_seed]` section. The `rippled` server uses this key to sign its messages to other servers in the peer-to-peer network.

3. Add each node's peer-communication public key (generated in step 2) to the `[cluster_nodes]` section of each of your other servers' config files.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
