---
html: run-rippled-as-a-stock-server.html
parent: server-modes.html
blurb: XRPを統合する人のための汎用的な構成。
labels:
  - コアサーバー
---
# ウォレットサーバーとしてrippledを実行する

ウォレットサーバーは `rippled` のための汎用的な構成です。ウォレットサーバーを利用することで、XRP Ledger へのトランザクションの送信、レジャーの履歴へのアクセス、XRP と統合するための最新の [ツール](software-ecosystem.html) を利用することができます。


ウォレットサーバーは、次のすべてのことを行います。

- [ピアネットワーク](peer-protocol.html)に接続

- 暗号署名された[トランザクション](transactions.html)を中継

- 完全な共有グローバル[レジャー](ledgers.html)のローカルコピーを維持

- [コンセンサスプロセス](consensus.html)にバリデーターとして参加


## 1. `rippled` のインストール

詳しくは、[`rippled` のインストール](install-rippled.html) を参照してください。

## 2. ウォレットサーバーでのバリデーションを有効にする

詳しくは、[rippledサーバーで検証を有効化](run-rippled-as-a-validator.html#3-enable-validation-on-your-rippled-server) を参照してください。

**注意:** バリデーターは、一般にアクセスできないようにする必要があります。ウォレットサーバーへのWebSocketアクセスなど、一般からのアクセスを許可しないでください。

## 3. ドメイン検証の提供

詳しくは、[ドメイン検証の提供](run-rippled-as-a-validator.html#6-provide-domain-verification)をご覧ください。

## トラブルシューティング

詳しくは、[`rippled`のトラブルシューティング](troubleshoot-the-rippled-server.html) を参照してください。


## 関連項目

- **コンセプト:**
    - [XRP Ledgerの概要](xrp-ledger-overview.html)
    - [`rippled`サーバー](xrpl-servers.html)
- **チュートリアル:**
    - [rippledサーバーのクラスター化](cluster-rippled-servers.html)
    - [`rippled`のインストール](install-rippled.html)
    - [容量の計画](capacity-planning.html)
- **リファレンス:**
    - [Validator Keysツールガイド](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_infoメソッド][]
    - [validator_list_sitesメソッド][]
    - [validatorsメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
