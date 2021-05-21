---
html: public-servers.html
parent: get-started.html
blurb: Use these public servers to access the XRP Ledger without needing your own infrastructure.
---
# Public Servers

If you don't [run your own `rippled` server](install-rippled.html), you can use the following public servers to submit transactions or read data from the ledger.

| Operator  | [Network][] | JSON-RPC URL | WebSocket URL | Notes                |
|:----------|:------------|:-------------|:--------------|:---------------------|
| XRP Ledger Foundation | **Mainnet** | `https://xrplcluster.com/` <br> `https://xrpl.ws/` [²][] | `wss://xrplcluster.com/` <br>  `wss://xrpl.ws/` [²][] | Full history server cluster. |
| Ripple[¹][]   | **Mainnet** | `https://s1.ripple.com:51234/` | `wss://s1.ripple.com/` | General purpose server cluster |
| Ripple[¹][]   | **Mainnet** | `https://s2.ripple.com:51234/` | `wss://s2.ripple.com/` | [Full-history server](ledger-history.html#full-history) cluster |
| Ripple[¹][]   | Testnet     | `https://s.altnet.rippletest.net:51234/` | `wss://s.altnet.rippletest.net/` | Testnet public server |
| Ripple[¹][]   | Devnet      | `https://s.devnet.rippletest.net:51234/` | `wss://s.devnet.rippletest.net/` | Devnet public server |

[Network]: parallel-networks.html
[¹]: #footnote-1
[²]: #footnote-2

<a id="footnote-1"></a>¹ Ripple's public servers are not for sustained or business use, and they may become unavailable at any time. For regular use, you should run your own `rippled` server or contract someone you trust to do so. Ripple includes [Reporting Mode][] servers in its public clusters.

<a id="footnote-2"></a>² `xrpl.ws` is an alias for `xrplcluster.com`. However, the `.ws` top-level domain's reliability may be unsuitable for production uses.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
