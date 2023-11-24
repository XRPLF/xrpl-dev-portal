---
html: parallel-networks.html
parent: networks-and-servers.html
blurb: テストネットワークおよび代替レジャーチェーンと本番環境のXRP Ledgerとの関係について説明します。
labels:
  - ブロックチェーン
---
# 並列ネットワーク

XRP Ledgerにはピアツーピアの本番環境のネットワークが1つ存在し、XRP Ledger上で行われるすべての取引はその本番環境のネットワーク、すなわちMainnet内で発生します。

XRP Ledgerコミュニティのメンバーが、メインネットに影響を与えることなくXRP Ledgerとやり取りできるように、テストネットをはじめとするいくつかの代替ネットワークが用意されています。ここでは、いくつかのネットワークを紹介します。

| ネットワーク | アップグレード頻度 | 説明                                          |
|:-----------|:----------------|:---------------------------------------------|
| Mainnet    | 安定版リリース    | ピアツーピアサーバーのネットワーク機能を備えた分散型の暗号台帳であり、[XRP](what-is-xrp.html)の土台となる[XRP Ledger](xrp-ledger-overview.html)です。。 |
| Testnet    | 安定版リリース    | XRP Ledger上に構築したソフトウェアのテスト環境として動作する「代替環境」のネットワークです。。本番環境のXRP Ledgerユーザーに影響を及ぼすことも、本物の通貨をリスクにさらすこともありません。Testnetの[Amendmentのステータス](known-amendments.html)は、Mainnetを厳密に反映するようになっていますが、分散型システムが持つ予測不可能な性質により、タイミングにわずかな違いが生じることがあります。 |
| Devnet     | ベータ版リリース  | 次期リリースのプレビューネットワークです。XRP Ledgerのコアソフトウェアへの不安定な変更がテストされます。このAltNetを使用すると、開発者はまだMainnetで有効になっていないXRPLの計画段階の新機能やAmendmentを操作したり学習したりすることができます。 |
| [Hooks V3 Testnet](https://hooks-testnet-v3.xrpl-labs.com/) | [Hooksサーバ](https://github.com/XRPL-Labs/xrpld-hooks) | [Hooks](https://xrpl-hooks.readme.io/)を使用したオンチェーン・スマートコントラクト機能のプレビューネットワークです。 |

テスト用XRPは、XRP Ledgerの実験やアプリケーションの開発、統合に興味のある人々に[無償で提供](xrp-testnet-faucet.html)されています。テスト用のXRPは実際には価値を持たず、ネットワークがリセットされると失われます。

**注意:** XRP Ledgerメインネットとは異なり、テストネットワークは通常「中央集権型」であり、これらのネットワークの安定性や可用性については保証されていません。これらのネットワークは、サーバ構成、ネットワークトポロジー、ネットワークパフォーマンスのさまざまな特性をテストする目的でこれまで使用され、またこれからも同様に使用されます。


## 並列ネットワークとコンセンサス

使用するネットワークを定義する`rippled`の設定はありません。その代わり、信頼するバリデータのコンセンサスに基づいてどのレジャーを正しいレジャーとして受け入れるかを把握します。`rippled`インスタンスからなる異なるコンセンサスグループが、同じグループの他のメンバーだけを信頼する場合、各グループは引き続き並列ネットワークとして機能します。悪意のあるコンピューターや不適切に動作するコンピューターが両方のネットワークに接続している場合でも、各ネットワークのメンバーが、定数設定を超えて別のネットワークのメンバーを信頼するように設定されていない限り、コンセンサスプロセスに混乱は生じません。

Ripple社は、TestnetとDevnetでメインサーバーを運用しています。[独自の`rippled`サーバーをTestnetに接続](connect-your-rippled-to-the-xrp-test-net.html)していただくことも可能です。TestnetとDevnetでは、多様で検閲耐性のあるバリデータのセットは使用されていません。そのため、Ripple社はTestnetやDevnetを定期的にリセットできます。


## 関連項目

- **ツール:**
  - [XRP Testnet Faucet](xrp-test-net-faucet.html)
- **コンセプト:**
  - [コンセンサスについて](consensus.html)
  - [Amendment](amendments.html)
- **チュートリアル:**
  - [XRP Testnetへの`rippled`の接続](connect-your-rippled-to-the-xrp-test-net.html)
  - [スタンドアロンモードでのrippledの使用](use-stand-alone-mode.html)
- **リファレンス:**
  - [Server_infoメソッド][]
  - [Consensus_infoメソッド][]
  - [Validator_list_sitesメソッド][]
  - [Validatorsメソッド][]
  - [デーモンモードのオプション](commandline-usage.html#デーモンモードのオプション)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
