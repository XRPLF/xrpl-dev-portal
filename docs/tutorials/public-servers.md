---
html: public-servers.html
parent: tutorials.html
seo:
    description: Use these public servers to access the XRP Ledger without needing your own infrastructure.
labels:
  - Core Server
---
# Public Servers

If you don't [run your own `rippled` server](../infrastructure/installation/index.md), you can use the following public servers to submit transactions or read data from the ledger.

## Mainnet

| Operator  | [Network][] | JSON-RPC URL | WebSocket URL | Notes                |
|:----------|:------------|:-------------|:--------------|:---------------------|
| XRP Ledger Foundation | **Mainnet** | `https://xrplcluster.com/` <br> `https://xrpl.ws/` [²][] | `wss://xrplcluster.com/` <br>  `wss://xrpl.ws/` [²][] | Full history server cluster with CORS support. |
| Ripple[¹][]   | **Mainnet** | `https://s1.ripple.com:51234/` | `wss://s1.ripple.com/` | General purpose server cluster |
| Ripple[¹][]   | **Mainnet** | `https://s2.ripple.com:51234/` | `wss://s2.ripple.com/` | [Full-history server](../concepts/networks-and-servers/ledger-history.md#full-history) cluster |

## Test Networks

| Operator  | [Network][] | JSON-RPC URL | WebSocket URL | Notes                |
|:----------|:------------|:-------------|:--------------|:---------------------|
| Ripple[¹][]   | Testnet     | `https://s.altnet.rippletest.net:51234/` | `wss://s.altnet.rippletest.net:51233/` | Testnet public server |
| XRPL Labs     | Testnet     | `https://testnet.xrpl-labs.com/` | `wss://testnet.xrpl-labs.com/` | Testnet public server with CORS support |
| Ripple[¹][]   | Testnet (Clio) | `https://clio.altnet.rippletest.net:51234/`	| `wss://clio.altnet.rippletest.net:51233/` | Testnet public server with Clio |
| Ripple[¹][]   | Devnet      | `https://s.devnet.rippletest.net:51234/` | `wss://s.devnet.rippletest.net:51233/` | Devnet public server |
| Ripple[¹][]   | Devnet (Clio)  | `https://clio.devnet.rippletest.net:51234/`	| `wss://clio.devnet.rippletest.net:51233/` | Devnet public server with Clio |
| Ripple[¹][]   | Sidechain-Devnet | `https://sidechain-net2.devnet.rippletest.net:51234/` | `wss://sidechain-net2.devnet.rippletest.net:51233/` | Sidechain Devnet to test cross-chain bridge features. Devnet serves as the locking chain while this sidechain serves as the issuing chain. |
| XRPL Labs     | Xahau Testnet | `https://xahau-test.net/` | `wss://xahau-test.net/` | [Hooks-enabled](https://hooks.xrpl.org/) Xahau Testnet |


[Network]: ../concepts/networks-and-servers/parallel-networks.md
[¹]: #footnote-1
[²]: #footnote-2

<a id="footnote-1"></a>¹ Ripple's public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should [run your own `rippled` server](../concepts/networks-and-servers/index.md) or contract someone you trust to do so. Ripple includes [Clio servers](../concepts/networks-and-servers/the-clio-server.md) (the successor to [Reporting Mode][]) in its public clusters.

<a id="footnote-2"></a>² `xrpl.ws` is an alias for `xrplcluster.com`. However, the `.ws` top-level domain's reliability may be unsuitable for production uses.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
