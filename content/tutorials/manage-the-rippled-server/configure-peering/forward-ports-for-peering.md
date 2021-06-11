---
html: forward-ports-for-peering.html
parent: configure-peering.html
blurb: Configure your firewall to allow incoming peers to your rippled server.
labels:
  - Core Server
---
# Forward Ports for Peering

Servers in the XRP Ledger peer-to-peer network communicate over the [peer protocol](peer-protocol.html). For the best combination of security and connectivity to the rest of the network, you should use a firewall to protect your server from most ports, but open or forward the peer protocol port.

While your `rippled` server is running, you can check to see how many peers you have by running the [server_info method][]. The `peers` field of the `info` object shows how many peers are currently connected to your server. If this number is exactly 10 or 11, that usually means your firewall is blocking incoming connections.

Example of a `server_info` result (trimmed) showing only 10 peers, likely because a firewall is blocking incoming peer connections:

```json
$ ./rippled server_info
Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-23 22:15:09.343961928 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "info" : {
         ... (trimmed) ...
         "load_factor" : 1,
         "peer_disconnects" : "0",
         "peer_disconnects_resources" : "0",
         "peers" : 10,
         "pubkey_node" : "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
         "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
         "published_ledger" : "none",
         "server_state" : "connected",
         ... (trimmed) ...
      },
      "status" : "success"
   }
}
```

To allow incoming connections, configure your firewall to forward the peer protocol port, which is served on **port 51235** in the default config file. The instructions to forward a port depend on your firewall. For example, if you use the `firewalld` software firewall on Red Hat Enterprise Linux, you can [use the `firewall-cmd` tool](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-port_forwarding) to forward TCP traffic as follows:

```sh
$ sudo firewall-cmd --add-forward-port=port=51235:proto=tcp:toport=51235
```

For other software and hardware firewalls, see the manufacturer's official documentation.


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
