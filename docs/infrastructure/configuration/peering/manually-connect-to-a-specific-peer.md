---
html: manually-connect-to-a-specific-peer.html
parent: configure-peering.html
seo:
    description: Connect your rippled server to a specific peer.
labels:
  - Core Server
---
# Manually Connect to a Specific Peer

Use these steps to manually connect your server to a specific [peer](../../../concepts/networks-and-servers/peer-protocol.md) in the XRP Ledger network.

**Tip:** If you want to make sure your server automatically connects to this server on startup and remains connected later, you may want to configure a [peer reservation](use-a-peer-reservation.md) for that peer.


## Prerequisites

- You must know the IP address of the peer you want to connect to.
- You must know what port the peer you want to connect to uses for the XRP Ledger [peer protocol](../../../concepts/networks-and-servers/peer-protocol.md). The default config file uses port 51235.
- You must have a network connection from your server to the peer. For example, the peer server must [forward the appropriate port through its firewall](forward-ports-for-peering.md).
- The peer server must have available peer slots. If the peer is already at its maximum number of peers, you can ask the peer server's operator to add a [peer reservation](use-a-peer-reservation.md) for your server.

## Steps

To connect, use the [connect method][]. For example:

{% tabs %}

{% tab label="WebSocket" %}
```
{
    "command": "connect",
    "ip": "169.54.2.151",
    "port": 51235
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```
{
    "method": "connect",
    "params": [
        {
            "ip": "169.54.2.151",
            "port": 51235
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```
rippled connect 169.54.2.151 51235
```
{% /tab %}

{% /tabs %}


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
