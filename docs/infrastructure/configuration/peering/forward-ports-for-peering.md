---
html: forward-ports-for-peering.html
parent: configure-peering.html
seo:
    description: Configure your firewall to allow incoming peers to your rippled server.
labels:
  - Core Server
---
# Forward Ports for Peering

Servers in the XRP Ledger peer-to-peer network communicate over the [peer protocol](../../../concepts/networks-and-servers/peer-protocol.md). For the best combination of security and connectivity to the rest of the network, you should use a firewall to protect your server from most ports, but open or forward the peer protocol port.

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

To allow incoming connections, configure your firewall to allow incoming traffic on the peer protocol port, which is served on **port 51235** in the default config file. The instructions to open a port depend on your firewall. If your server is behind a router that performs Network Address Translation (NAT), you must configure your router to forward the port to your server.

If you use the `firewalld` software firewall on Red Hat Enterprise Linux, you can [use the `firewall-cmd` tool](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-using_zones_to_manage_incoming_traffic_depending_on_source) to open **port 51235** to all incoming traffic.

_Assuming `--zone=public` is your public [zone](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-working_with_zones#sec-Listing_Zones)._

```sh
$ sudo firewall-cmd --zone=public --add-port=51235/tcp
```

Then, restart the `rippled` server:

```sh
$ sudo systemctl restart rippled.service
```

To make it permanent:

```sh
$ sudo firewall-cmd --zone=public --permanent --add-port=51235/tcp
```

For other software and hardware firewalls, see the manufacturer's official documentation.

If you are using a hosting service with a virtual firewall (for example, [AWS Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)), you do not need to use `firewalld`, but you still need to allow inbound traffic from the open internet on the peer port. Make sure you apply the relevant rules to your host or virtual machine.


## See Also

- **Concepts:**
    - [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)
    - [The `rippled` Server](../../../concepts/networks-and-servers/index.md)
- **Tutorials:**
    - [Capacity Planning](../../installation/capacity-planning.md)
    - [Troubleshoot the `rippled` Server](../../troubleshooting/index.md)
- **References:**
    - [connect method][]
    - [peers method][]
    - [print method][]
    - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
