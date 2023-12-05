---
html: run-rippled-as-a-stock-server.html
parent: server-modes.html
blurb: XRPを統合する人のための汎用的な構成。
labels:
  - コアサーバー
---
# ウォレットサーバーとしてのrippledの実行

ストックサーバは`rippled`用の汎用的な設定です。ストックサーバを利用することで、XRP Ledgerにトランザクションを送信したり、レジャーの履歴にアクセスしたり、XRPやXRP Ledgerと統合するための最新の[ツール](software-ecosystem.html)を利用したりすることができます。このサーバを使って、クライアントアプリケーションをXRP Ledgerに接続することができます。


ウォレットサーバーは、次のすべてのことを行います。

- [ピアネットワーク](peer-protocol.html)に接続

- 暗号署名された[トランザクション](transactions.html)を中継

- 完全な共有グローバル[レジャー](ledgers.html)のローカルコピーを維持


バリデータとして[コンセンサスプロセス](consensus.html)に参加するには、代わりに[バリデータとしてrippledを実行](run-rippled-as-a-validator.html)してください。


## `rippled`のインストールと実行

デフォルトのパッケージインストールでは、取引履歴の少ないストックサーバーがインストールされます。インストール手順については、[`rippled`のインストール](install-rippled.html)をご覧ください。

インストール後、サーバーが一度に保存する履歴の量を調整することができます。この方法については、[オンライン削除の設定](configure-online-deletion.html)をご覧ください。

## トラブルシューティング

詳しくは、[`rippled`のトラブルシューティング](troubleshoot-the-rippled-server.html)をご覧ください。


## 関連項目

- **コンセプト:**
    - [XRP Ledgerの概要](xrp-ledger-overview.html)
    - [`rippled`サーバ](xrpl-servers.html)
- **チュートリアル:**
    - [rippledサーバのクラスター化](cluster-rippled-servers.html)
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
