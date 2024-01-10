---
html: public-servers.html
parent: get-started.html
blurb: これらの公開サーバーを利用して、自社のインフラを必要とせずにXRP Ledgerにアクセスします。
labels:
  - コアサーバー
---
# 公開サーバー

[自分で`rippled`サーバーを運営しない](install-rippled.html)場合は、以下の公開サーバーを利用して、トランザクションを送信したり、レジャーからデータを取得したりすることができます。

| 運営者  | [ネットワーク][] | JSON-RPC URL | WebSocket URL | 尾行                |
|:----------|:------------|:-------------|:--------------|:---------------------|
| XRP Ledger 財団 | **Mainnet** | `https://xrplcluster.com/` <br> `https://xrpl.ws/` [²][] | `wss://xrplcluster.com/` <br>  `wss://xrpl.ws/` [²][] | CORSをサポートする全履歴サーバークラスター |
| Ripple[¹][]   | **Mainnet** | `https://s1.ripple.com:51234/` | `wss://s1.ripple.com/` | 汎用サーバークラスター |
| Ripple[¹][]   | **Mainnet** | `https://s2.ripple.com:51234/` | `wss://s2.ripple.com/` | [全履歴サーバ](ledger-history.html#すべての履歴) クラスター |
| Ripple[¹][]   | Testnet     | `https://s.altnet.rippletest.net:51234/` | `wss://s.altnet.rippletest.net:51233/` | Testnet 公開サーバー |
| XRPL Labs     | Testnet     | `https://testnet.xrpl-labs.com/` | `wss://testnet.xrpl-labs.com/` | CORSをサポートする Testnet 公開サーバー |
| Ripple[¹][]   | Devnet      | `https://s.devnet.rippletest.net:51234/` | `wss://s.devnet.rippletest.net:51233/` | Devnet 公開サーバー |
| Ripple[¹][]   | Sidechain-Devnet | `https://sidechain-net2.devnet.rippletest.net:51234/` | `wss://sidechain-net2.devnet.rippletest.net:51233/` | クロスチェーンブリッジ機能をテストするためのサイドチェーンDevnet。Devnetはロックチェーンとして機能し、このサイドチェーンは発行チェーンとして機能します。 |
| XRPL Labs     | Xahau Testnet | `https://xahau-test.net/` | `wss://xahau-test.net/` | [Hooksが有効な](https://hooks.xrpl.org/) Xahau Testnet |

[ネットワーク]: parallel-networks.html
[¹]: #footnote-1
[²]: #footnote-2

<a id="footnote-1"></a>¹ Ripple社の公開サーバーは、持続的な利用やビジネスでの利用には適しておらず、いつでも利用できなくなる可能性があります。定期的に使用する場合は、ご自身で`rippled`サーバーを運用するか、信頼できる人と契約してください。Ripple社の公開クラスターには[Reporting Mode][]サーバが含まれています。

<a id="footnote-2"></a>² `xrpl.ws`は`xrplcluster.com`のエイリアスです。しかし、`.ws` というトップレベルドメインの信頼性は、本番での使用には適さないかもしれません。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
