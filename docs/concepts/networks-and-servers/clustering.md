---
html: clustering.html
parent: networks-and-servers.html
seo:
    description: Run rippled servers in a cluster to share the load of cryptography between them.
labels:
  - Core Server
---
# Clustering

If you are running multiple `rippled` servers in a single datacenter, you can configure those servers into a cluster to maximize efficiency. Running your `rippled` servers in a cluster provides the following benefits:

- Clustered `rippled` servers share the work of cryptography. If one server has verified the authenticity of a message, the other servers in the cluster trust it and do not re-verify.
- Clustered servers share information about peers and API clients that are misbehaving or abusing the network. This makes it harder to attack all servers of the cluster at once.
- Clustered servers always propagate transactions throughout the cluster, even if the transaction does not meet the current load-based transaction fee on some of them.

If you are running a validator as a [private peer](peer-protocol.md#private-peers), Ripple recommends using a cluster of `rippled` servers as proxy servers.

## See Also

- **Tutorials:**
    - [Cluster `rippled` Servers](../../infrastructure/configuration/peering/cluster-rippled-servers.md)
    - [Run rippled as a Validator](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md)
- **References:**
    - [peers method][]
    - [connect method][]
    - [Peer Crawler](../../references/http-websocket-apis/peer-port-methods/peer-crawler.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
