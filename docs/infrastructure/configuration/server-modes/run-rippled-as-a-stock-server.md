---
html: run-rippled-as-a-stock-server.html
parent: server-modes.html
seo:
    description: A multipurpose configuration for anyone integrating XRP.
labels:
  - Core Server
---
# Run rippled as a Stock Server

A stock server is a multipurpose configuration for `rippled`. With a stock server, you can submit transactions to the XRP Ledger, access ledger history, and use the latest [tools](../../../introduction/software-ecosystem.md) to integrate with XRP and the XRP Ledger. You can connect client applications to the XRP Ledger using this server.


A stock server does all of the following:

- Connects to a [network of peers](../../../concepts/networks-and-servers/peer-protocol.md)

- Relays cryptographically signed [transactions](../../../concepts/transactions/index.md)

- Maintains a local copy of the complete shared global [ledger](../../../concepts/ledgers/index.md)


To participate in the [consensus process](../../../concepts/consensus-protocol/index.md) as a validator, [run rippled as a validator](run-rippled-as-a-validator.md) instead.


## Install and run `rippled`

The default package installation installs a stock server with a small amount of transaction history. For installation steps, see [Install `rippled`](../../installation/index.md).

After installation, you can adjust how much history your server stores at a time. For steps on how to do this, see [Configure Online Deletion](../data-retention/configure-online-deletion.md).

## Troubleshooting

For more information, see [Troubleshooting `rippled`](../../troubleshooting/index.md)


## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [The `rippled` Server](../../../concepts/networks-and-servers/index.md)
- **Tutorials:**
    - [Cluster rippled Servers](../peering/cluster-rippled-servers.md)
    - [Install `rippled`](../../installation/index.md)
    - [Capacity Planning](../../installation/capacity-planning.md)
- **References:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
