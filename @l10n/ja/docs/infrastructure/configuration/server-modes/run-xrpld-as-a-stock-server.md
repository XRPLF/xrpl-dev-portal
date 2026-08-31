---
html: run-xrpld-as-a-stock-server.html
parent: server-modes.html
seo:
    description: XRPを統合する人のための汎用的な構成。
labels:
  - コアサーバ
---
# ウォレットサーバとしてのxrpldの実行

ストックサーバは`xrpld`用の汎用的な設定です。ストックサーバを利用することで、XRP Ledgerにトランザクションを送信したり、レジャーの履歴にアクセスしたり、XRPやXRP Ledgerと統合するための最新の[ツール](../../../introduction/software-ecosystem.md)を利用したりすることができます。このサーバを使って、クライアントアプリケーションをXRP Ledgerに接続することができます。


ウォレットサーバは、次のすべてのことを行います。

- [ピアネットワーク](../../../concepts/networks-and-servers/peer-protocol.md)に接続

- 暗号署名された[トランザクション](../../../concepts/transactions/index.md)を中継

- 完全な共有グローバル[レジャー](../../../concepts/ledgers/index.md)のローカルコピーを維持


バリデータとして[コンセンサスプロセス](../../../concepts/consensus-protocol/index.md)に参加するには、代わりに[バリデータとしてxrpldを実行](run-xrpld-as-a-validator.md)してください。


## `xrpld`のインストールと実行

デフォルトのパッケージインストールでは、取引履歴の少ないストックサーバがインストールされます。インストール手順については、[`xrpld`のインストール](../../installation/index.md)をご覧ください。

インストール後、サーバが一度に保存する履歴の量を調整することができます。この方法については、[オンライン削除の設定](../data-retention/configure-online-deletion.md)をご覧ください。

## トラブルシューティング

詳しくは、[`xrpld`のトラブルシューティング](../../troubleshooting/index.md)をご覧ください。


## 関連項目

- **コンセプト:**
    - [XRP Ledgerの概要](/about/)
    - [`xrpld`サーバ](../../../concepts/networks-and-servers/index.md)
- **チュートリアル:**
    - [xrpldサーバのクラスター化](../peering/cluster-xrpld-servers.md)
    - [`xrpld`のインストール](../../installation/index.md)
    - [容量の計画](../../installation/capacity-planning.md)
- **リファレンス:**
    - [Validator Keysツールガイド](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_infoメソッド][]
    - [validator_list_sitesメソッド][]
    - [validatorsメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
