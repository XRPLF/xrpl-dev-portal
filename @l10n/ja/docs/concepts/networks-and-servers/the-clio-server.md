---
html: the-clio-server.html
parent: networks-and-servers.html
seo:
    description: Clioは、API呼び出しに最適化されたXRP Ledgerサーバです。
---
# Clioサーバ

Clioは、検証済みの台帳データに対するWebSocketまたはHTTP API呼び出しに最適化されたXRP Ledger APIサーバです。

ClioサーバはP2Pネットワークに接続しません。代わりに、P2Pネットワークに接続されている指定された`rippled`サーバからデータを抽出します。APIコールを効率的に処理することで、ClioサーバはP2Pモードで動作する`rippled`サーバの負荷を軽減することができます。

Clioは、検証済みの過去の台帳とトランザクションデータをスペース効率の良いフォーマットで保存し、`rippled`に比べて最大4倍少ないスペースで保存できます。ClioはCassandraまたはScyllaDBを使用し、スケーラブルな読み取りスループットを可能にします。複数のClioサーバが同じデータセットへのアクセスを共有できるため、冗長なデータストレージや計算を必要とせず、Clioサーバの高可用性クラスタを構築することが可能です。

Clioは`rippled`サーバにアクセスする必要があり、このサーバはClioと同じマシン上で実行することも、別々に実行することも可能です。

Clioは完全な[HTTP / WebSocket API](../../references/http-websocket-apis/index.md)を提供していますが、デフォルトでは、検証済みのデータのみを返します。P2Pネットワークへのアクセスを必要とするリクエストに対しては、Clioは自動的にP2Pネットワーク上の`rippled`サーバにリクエストを転送し、レスポンスを返します。

## Clioサーバを運用する理由

独自のClioサーバを運用する理由には様々なものがありますが、その多くは、P2Pネットワークに接続している`rippled`サーバの負荷軽減、メモリ使用量とストレージのオーバーヘッドの低減、水平スケーリングの容易さ、APIリクエストのスループットの向上などに集約されるのではないでしょうか。

* `rippled`サーバの負荷軽減 - Clioサーバはピアツーピア・ネットワークに接続しません。P2Pネットワークに接続されている1つ以上の信頼できる`rippled`サーバから検証済みのデータを取得するためにgRPCを使用します。したがって、Clioサーバはリクエストをより効率的に処理し、P2Pモードで動作する`rippled`サーバの負荷を軽減することができます。

* メモリ使用量とストレージのオーバーヘッドの低減 - ClioはデータベースとしてCassandraを使用し、データをスペース効率の良いフォーマットで保存するため、`rippled`に比べて最大4倍少ないスペースで保存できます。

* 容易な水平スケーリング - 複数のClioサーバが同じデータセットへのアクセスを共有できるため、Clioサーバの高可用性クラスターを構築することが可能です。

* APIリクエストのスループットの向上 - Clioサーバは、1つまたは複数の信頼できる`rippled`サーバから検証済みのデータを抽出し、このデータを効率的に保存します。そのため、APIコールを効率的に処理することができ、結果としてスループットが向上し、場合によってはレイテンシーも低下します。


## Clioサーバの仕組み

[{% inline-svg file="/docs/img/clio-basic-architecture.svg" /%}](/docs/img/clio-basic-architecture.svg "図1: Clioサーバの仕組み")

Clioサーバは、トランザクションメタデータ、アカウントステート、台帳ヘッダーなどの有効な台帳データを永続的なデータストアに保存します。

ClioサーバはAPIリクエストを受信すると、これらのデータストアからデータを検索します。P2Pネットワークからのデータを必要とするリクエストについては、ClioサーバはリクエストをP2Pサーバに転送し、レスポンスをクライアントに返します。

以下のいずれかが当てはまる場合、Clioは**常に**`rippled`に転送します。

- `ledger_index`に`current`または`closed`を設定している場合
- `ledger`APIにおいて`accounts`、`queue`または`full`が`true`に設定されている場合
- `account_info`APIにおいて`queue`に`true`が設定されている場合
- リクエストAPIメソッド(`"command"`)において`submit`、`submit_multisigned`、`fee`、`ledger_closed`、`ledger_current`、`ripple_path_find`、`manifest`、`channel_authorize`または`channel_verify`が設定されている場合

## 関連項目

- [Clio ソースコード](https://github.com/XRPLF/clio)
- **チュートリアル:**
    - [UbuntuにClioサーバをインストールする](../../infrastructure/installation/install-clio-on-ubuntu.md)
