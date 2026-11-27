---
seo:
    description: A multipurpose configuration for anyone integrating XRP.
labels:
  - Core Server
---
# Stock Node

A stock server is a multipurpose configuration for `xrpld` (formerly `rippled`). With a stock server, you can submit transactions to the XRP Ledger, access ledger history, and use the latest [tools](../../../introduction/software-ecosystem.md) to integrate with XRP and the XRP Ledger. You can connect client applications to the XRP Ledger using this server.


A stock server does all of the following:

- Connects to a [network of peers](../../../concepts/networks-and-servers/peer-protocol.md)

- Relays cryptographically signed [transactions](../../../concepts/transactions/index.md)

- Maintains a local copy of the complete shared global [ledger](../../../concepts/ledgers/index.md)


To participate in the [consensus process](../../../concepts/consensus-protocol/index.md) as a validator, [run xrpld as a validator](validator.md) instead.


## Install and run `xrpld`

The default package installation installs a stock server with a small amount of transaction history (`online_delete=512`, about half an hour of ledgers). A window that small rotates all day long, so [Minimal Configurations](../minimal-configurations.md) starts a stock server at 25,000 ledgers, about a day. For installation steps, see [Install `xrpld`](../../installation/index.md).

After installation, you can adjust how much history your server stores at a time.

## Submitting transactions

Submitting your own applications' transactions is the most common reason to run a stock server, and it is worth understanding what the server does with them:

- A submitted transaction goes into the server's open ledger or its transaction queue, and is relayed to peers. Submission success (`tesSUCCESS` on `submit`) means accepted for processing, **not** final - applications must confirm final results in a validated ledger.
- Under load, the queue applies and the open ledger fee rises; well-built applications read the queue state from [server_info][server_info method] and handle `telCAN_NOT_QUEUE`-class results rather than blind-retrying.
- A server you run yourself gives your application a trusted view of validated results and insulation from public endpoint limits - which is the point of running one.

## History for API traffic

The default retention keeps very recent ledgers only. That is enough to submit and confirm, but **real API traffic quickly asks for more history than the default keeps**: account histories, recent lookups, reconciliation jobs. One production operator serving applications sets roughly two weeks:

```
[ledger_history]
360000

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=380000
advisory_delete=0
```

Size retention to the oldest query your applications actually make, plus margin - and size the disk to match; see [Stock Node System Requirements](../../prerequisites/system-requirements/stock-node.md#disk-sizing-by-retention).

## Pathfinding is on by default here

Unlike validators (which disable it automatically), a stock server answers [path-finding](../../../concepts/tokens/fungible-tokens/paths.md) requests by default (`path_search_max` defaults to 3). Path queries are among the most expensive requests a server can serve. If your server exists to submit transactions and answer ordinary queries - and especially if its ports are open to others - consider turning pathfinding off:

```
[path_search_max]
0
```

Serious serving operators run exactly that. Leave it on only if your own applications use path finding and you accept the load, and read [Pathfinding](pathing.md) for what that load looks like and how to serve it deliberately.

## Serving clients beyond yourself

A stock server whose RPC/WebSocket ports serve more than localhost needs deliberate limits and a security posture: see [Stock Node Best Practices](../best-practices/stock-node.md) and [Stock Node Security](../security/stock-node.md). The short version: public ports get `limit` and queue caps, admin stays on loopback, and your front end - not the server - faces the internet.

## Troubleshooting

For more information, see [Troubleshooting `xrpld`](../../troubleshooting/index.md)


## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [The `xrpld` Server](../../../concepts/networks-and-servers/index.md)
- **Tutorials:**
    - [Stock Node Best Practices](../best-practices/stock-node.md)
    - [Cluster xrpld Servers](../peering/cluster-xrpld-servers.md)
    - [Install `xrpld`](../../installation/index.md)
    - [Capacity Planning](../../prerequisites/capacity-planning.md)
    - [Online Deletion](../data-retention/online-deletion.md)
- **References:**
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
