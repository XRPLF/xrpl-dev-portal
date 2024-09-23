---
html: public-servers.html
parent: get-started.html
seo:
    description: これらの公開サーバを利用して、自社のインフラを必要とせずにXRP Ledgerにアクセスします。
labels:
  - コアサーバ
---
# 公開サーバ

[自分で`rippled`サーバを運営しない](../infrastructure/installation/index.md)場合は、以下の公開サーバを利用して、トランザクションを送信したり、レジャーからデータを取得したりすることができます。

| 運営者  | [ネットワーク][] | JSON-RPC URL | WebSocket URL | 尾行                |
|:----------|:------------|:-------------|:--------------|:---------------------|
| XRP Ledger 財団 | **Mainnet** | `https://xrplcluster.com/` <br> `https://xrpl.ws/` [²][] | `wss://xrplcluster.com/` <br>  `wss://xrpl.ws/` [²][] | CORSをサポートする全履歴サーバクラスター |
| Ripple[¹][]   | **Mainnet** | `https://s1.ripple.com:51234/` | `wss://s1.ripple.com/` | 汎用サーバクラスター |
| Ripple[¹][]   | **Mainnet** | `https://s2.ripple.com:51234/` | `wss://s2.ripple.com/` | [全履歴サーバ](../concepts/networks-and-servers/ledger-history.md#すべての履歴) クラスター |
| Ripple[¹][]   | Testnet     | `https://s.altnet.rippletest.net:51234/` | `wss://s.altnet.rippletest.net:51233/` | Testnet 公開サーバ |
| XRPL Labs     | Testnet     | `https://testnet.xrpl-labs.com/` | `wss://testnet.xrpl-labs.com/` | CORSをサポートする Testnet 公開サーバ |
| Ripple[¹][]   | Devnet      | `https://s.devnet.rippletest.net:51234/` | `wss://s.devnet.rippletest.net:51233/` | Devnet 公開サーバ |
| Ripple[¹][]   | Sidechain-Devnet | `https://sidechain-net2.devnet.rippletest.net:51234/` | `wss://sidechain-net2.devnet.rippletest.net:51233/` | クロスチェーンブリッジ機能をテストするためのサイドチェーンDevnet。Devnetはロックチェーンとして機能し、このサイドチェーンは発行チェーンとして機能します。 |
| XRPL Labs     | Xahau Testnet | `https://xahau-test.net/` | `wss://xahau-test.net/` | [Hooksが有効な](https://hooks.xrpl.org/) Xahau Testnet |

[ネットワーク]: ../concepts/networks-and-servers/parallel-networks.md
[¹]: #footnote-1
[²]: #footnote-2

<a id="footnote-1"></a>¹ Ripple社の公開サーバは、持続的な利用やビジネスでの利用には適しておらず、いつでも利用できなくなる可能性があります。定期的に使用する場合は、ご自身で`rippled`サーバを運用するか、信頼できる人と契約してください。Ripple社の公開クラスターには[Reporting Mode][]サーバが含まれています。

<a id="footnote-2"></a>² `xrpl.ws`は`xrplcluster.com`のエイリアスです。しかし、`.ws` というトップレベルドメインの信頼性は、本番での使用には適さないかもしれません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
