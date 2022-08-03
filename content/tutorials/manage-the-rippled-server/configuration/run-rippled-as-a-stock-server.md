---
html: run-rippled-as-a-stock-server.html
parent: configure-rippled.html
blurb: A multipurpose configuration for anyone integrating XRP.
labels:
  - Core Server
---
# Run rippled as a Stock Server

A stock server is a multipurpose configuration for `rippled`. With a stock server, you can submit transactions to the XRP Ledger, access ledger history, and use the latest [tools](software-ecosystem.html) to integrate with XRP. It is also a server that you can use to connect a wallet with the XRPL.


A stock server does all of the following:

- Connects to a [network of peers](consensus-network.html)

- Relays cryptographically signed [transactions](transaction-basics.html)

- Maintains a local copy of the complete shared global [ledger](ledgers.html)


To participate in the [consensus process](consensus.html) as a validator, [run rippled as a validator](run-rippled-as-a-validator.html) instead.


## Install and run `rippled`

For more information, see [Install `rippled`](install-rippled.html).

## Troubleshooting

For more information, see [Troubleshooting `rippled`](troubleshoot-the-rippled-server.html)


## See Also

- **Concepts:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Consensus Network](consensus-network.html)
    - [The `rippled` Server](xrpl-servers.html)
- **Tutorials:**
    - [Cluster rippled Servers](cluster-rippled-servers.html)
    - [Install `rippled`](install-rippled.html)
    - [Capacity Planning](capacity-planning.html)
    - [XRP Ledger Businesses](xrp-ledger-businesses.html)
- **References:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
