---
html: admin-api-methods.html
parent: http-websocket-apis.html
seo:
    description: これらの管理APIメソッドを使用してrippledサーバを管理します。
labels:
  - コアサーバ
---
# 管理APIメソッド

`rippled`サーバと直接通信する際には管理APIメソッドを使用します。管理メソッドは、信頼できるサーバ運用担当者のみを対象としています。管理メソッドには、サーバの管理、監視、デバッグのためのコマンドが含まれています。

管理コマンドを使用できるのは、管理者として、`rippled.cfg`ファイルに指定されているホストとポートで`rippled`サーバに接続している場合に限られます。デフォルトでは、コマンドラインクライアントが管理接続を使用します。`rippled`への接続についての詳細は、[rippled API入門](../../../tutorials/http-websocket-apis/build-apps/get-started.md)をご覧ください。


## [キー生成メソッド](key-generation-methods/index.md)

キーを生成および管理するには、以下のメソッドを使用します。

* **[`validation_create`](key-generation-methods/validation_create.md)** - 新しいrippledバリデータのキーを生成します。
* **[`wallet_propose`](key-generation-methods/wallet_propose.md)** - 新規アカウントのキーを生成します。


## [ロギングおよびデータ管理のメソッド](logging-and-data-management-methods/index.md)

ログレベルとその他のデータ（レジャーなど）の管理には、以下のメソッドを使用します。

* **[`can_delete`](logging-and-data-management-methods/can_delete.md)** - 特定レジャーまでのレジャーのオンライン削除を許可します。
* **[`download_shard`](logging-and-data-management-methods/download_shard.md)** - レジャー履歴の特定のシャードをダウンロードします。
* **[`ledger_cleaner`](logging-and-data-management-methods/ledger_cleaner.md)** - レジャークリーナーサービスが破損データを確認するように設定します。
* **[`ledger_request`](logging-and-data-management-methods/ledger_request.md)** - ピアサーバに対し特定のレジャーバージョンを照会します。
* **[`log_level`](logging-and-data-management-methods/log_level.md)** - ログの詳細レベルを取得または変更します。
* **[`logrotate`](logging-and-data-management-methods/logrotate.md)** - ログファイルを再度開きます。


## [サーバ制御メソッド](server-control-methods/index.md)

rippledサーバの管理には、以下のメソッドを使用します。

* **[`connect`](peer-management-methods/connect.md)** - rippledサーバを特定のピアに強制的に接続します。
* **[`ledger_accept`](server-control-methods/ledger_accept.md)** - スタンドアロンモードでレジャーを閉鎖し、次のレジャーに進みます。
* **[`stop`](server-control-methods/stop.md)** - rippledサーバをシャットダウンします。
* **[`validation_seed`](server-control-methods/validation_seed.md)** - 検証に使用するキーを一時的に設定します。


## [ステータスおよびデバッグメソッド](status-and-debugging-methods/index.md)

ネットワークとサーバのステータスを確認するには、以下のメソッドを使用します。

* **[`consensus_info`](status-and-debugging-methods/consensus_info.md)** - 発生したコンセンサスの状態に関する情報を取得します。
* **[`feature`](status-and-debugging-methods/feature.md)** - プロトコルAmendmentに関する情報を取得します。
* **[`fetch_info`](status-and-debugging-methods/fetch_info.md)** - サーバとネットワークの同期に関する情報を取得します。
* **[`get_counts`](status-and-debugging-methods/get_counts.md)** - サーバ内部とメモリー使用状況に関する統計情報を取得します。
* **[`peers`](peer-management-methods/peers.md)** - 接続しているピアサーバに関する情報を取得します。
* **[`print`](status-and-debugging-methods/print.md)** - 内部サブシステムに関する情報を取得します。
* **[`validators`](status-and-debugging-methods/validators.md)** - 現在のバリデータに関する情報を取得します。
* **[`validator_list_sites`](status-and-debugging-methods/validator_list_sites.md)** - バリデータリストを公開するサイトに関する情報を取得します。


## 廃止予定のメソッド

以下の管理コマンドは廃止予定であり、今後予告なしに削除される可能性があります。

* `ledger_header` - 代わりに[ledgerメソッド][]を使用してください。
* `unl_add`、`unl_delete`、`unl_list`、`unl_load`、`unl_network`、`unl_reset`、`unl_score` - 代わりに UNL管理用構成ファイルを使用してください。
* `wallet_seed` - 代わりに[wallet_proposeメソッド][]を使用してください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
