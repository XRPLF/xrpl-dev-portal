---
seo:
    description: rippledおよびClioサーバの全種類に共通するシステム要件。
labels:
  - コアサーバ
---
# システム要件

具体的なハードウェアおよびソフトウェアの要件は、サーバの種類によって異なります。本番環境向けの導入については、各種類のページをご覧ください: [ストックノード](stock-node.md)、[バリデータ](validator.md)、[Full History](full-history.md)、[Hub](hub.md)、[Pathing](pathing.md)、[Clio](clio.md)。開発またはテストでの使用については、[Development and Testing](development-and-testing.md)をご覧ください。このページの要件はすべての種類に共通して適用されます。


## システム時刻

`rippled`サーバは、正確な時刻が維持されていることを前提としています。`ntpd`や`chrony`などのデーモンで、ネットワークタイムプロトコル（NTP）を使用してシステムの時刻を同期することを推奨します。


## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [容量の計画](../capacity-planning.md)
    - [`rippled`のインストール](../../installation/index.md)
    - [rippledのトラブルシューティング](../../troubleshooting/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
