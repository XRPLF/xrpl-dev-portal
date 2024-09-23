---
html: parallel-networks.html
parent: networks-and-servers.html
seo:
    description: テストネットワークおよび代替レジャーチェーンと本番環境のXRP Ledgerとの関係について説明します。
labels:
  - ブロックチェーン
---
# 並列ネットワーク

XRP Ledgerにはピアツーピアの本番環境のネットワークが1つ存在し、XRP Ledger上で行われるすべての取引はその本番環境のネットワーク、すなわちMainnet内で発生します。

XRP Ledgerコミュニティのメンバーが、メインネットに影響を与えることなくXRP Ledgerとやり取りできるように、テストネットをはじめとするいくつかの代替ネットワークが用意されています。ここでは、いくつかのネットワークを紹介します。

| ネットワーク | アップグレード頻度 | 説明                                          |
|:-----------|:----------------|:---------------------------------------------|
| Mainnet    | 安定版リリース    | ピアツーピアサーバのネットワーク機能を備えた分散型の暗号台帳であり、[XRP](../../introduction/what-is-xrp.md)の土台となる[XRP Ledger](/about/)です。 |
| Testnet    | 安定版リリース    | XRP Ledger上に構築したソフトウェアのテスト環境として動作する「代替環境」のネットワークです。本番環境のXRP Ledgerユーザに影響を及ぼすことも、本物の通貨をリスクにさらすこともありません。Testnetの[Amendmentのステータス](/resources/known-amendments.md)は、Mainnetを厳密に反映するようになっていますが、分散型システムが持つ予測不可能な性質により、タイミングにわずかな違いが生じることがあります。 |
| Devnet     | ベータ版リリース  | 次期リリースのプレビューネットワークです。XRP Ledgerのコアソフトウェアへの不安定な変更がテストされます。このAltNetを使用すると、開発者はまだMainnetで有効になっていないXRPLの計画段階の新機能やAmendmentを操作したり学習したりすることができます。 |
| [Hooks V3 Testnet](https://hooks-testnet-v3.xrpl-labs.com/) | [Hooksサーバ](https://github.com/XRPL-Labs/xrpld-hooks) | [Hooks](https://xrpl-hooks.readme.io/)を使用したオンチェーン・スマートコントラクト機能のプレビューネットワークです。 |
| Sidechain-Devnet | ベータ版リリース | クロスチェーンブリッジ機能をテストするためのサイドチェーンです。<br>ライブラリのサポート:<br>- [xrpl.js 2.12.0](https://www.npmjs.com/package/xrpl/v/2.12.0)<br>- [xrpl-py 2.4.0](https://pypi.org/project/xrpl-py/2.4.0/)<br>**注記**: また、[`xbridge-cli`](https://github.com/XRPLF/xbridge-cli)コマンドラインツールを使用して、ローカルマシンにクロスチェーンブリッジをセットアップすることもできます。 |

テスト用XRPは、XRP Ledgerの実験やアプリケーションの開発、統合に興味のある人々に[無償で提供](/resources/dev-tools/xrp-faucets)されています。テスト用のXRPは実際には価値を持たず、ネットワークがリセットされると失われます。

**注意:** XRP Ledgerメインネットとは異なり、テストネットワークは通常「中央集権型」であり、これらのネットワークの安定性や可用性については保証されていません。これらのネットワークは、サーバ構成、ネットワークトポロジー、ネットワークパフォーマンスのさまざまな特性をテストする目的でこれまで使用され、またこれからも同様に使用されます。


## 並列ネットワークとコンセンサス

使用するネットワークを定義する`rippled`の設定はありません。その代わり、信頼するバリデータのコンセンサスに基づいてどのレジャーを正しいレジャーとして受け入れるかを把握します。`rippled`インスタンスからなる異なるコンセンサスグループが、同じグループの他のメンバーだけを信頼する場合、各グループは引き続き並列ネットワークとして機能します。悪意のあるコンピュータや不適切に動作するコンピュータが両方のネットワークに接続している場合でも、各ネットワークのメンバーが、定数設定を超えて別のネットワークのメンバーを信頼するように設定されていない限り、コンセンサスプロセスに混乱は生じません。

Ripple社は、TestnetとDevnetでメインサーバを運用しています。[独自の`rippled`サーバをTestnetに接続](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md)することも可能です。TestnetとDevnetでは、多様で検閲耐性のあるバリデータのセットは使用されていません。そのため、Ripple社はTestnetやDevnetを定期的にリセットできます。


## 関連項目

- **ツール:**
  - [XRP Testnet Faucet](/resources/dev-tools/xrp-faucets)
- **コンセプト:**
  - [コンセンサスについて](../consensus-protocol/index.md)
  - [Amendment](amendments.md)
- **チュートリアル:**
  - [XRP Testnetへの`rippled`の接続](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md)
  - [スタンドアロンモードでのrippledの使用](../../infrastructure/testing-and-auditing/index.md)
- **リファレンス:**
  - [Server_infoメソッド][]
  - [Consensus_infoメソッド][]
  - [Validator_list_sitesメソッド][]
  - [Validatorsメソッド][]
  - [デーモンモードのオプション](../../infrastructure/commandline-usage.md#デーモンモードのオプション)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
