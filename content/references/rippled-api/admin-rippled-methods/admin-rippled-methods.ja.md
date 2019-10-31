# 管理rippledメソッド

`rippled`サーバーと直接通信する際には管理APIメソッドを使用します。管理メソッドは、信頼できるサーバー運用担当者のみを対象としています。管理メソッドには、サーバーの管理、監視、デバッグのためのコマンドが含まれています。

管理コマンドを使用できるのは、管理者として、`rippled.cfg`ファイルに指定されているホストとポートで`rippled`サーバーに接続している場合に限られます。デフォルトでは、コマンドラインクライアントが管理接続を使用します。`rippled`への接続についての詳細は、[rippled API入門](get-started-with-the-rippled-api.html)を参照してください。


## [キー生成メソッド](key-generation-methods.html)

キーを生成および管理するには、以下のメソッドを使用します。

* **[`validation_create`](validation_create.html)** - 新しいrippledバリデータのキーを生成します。
* **[`wallet_propose`](wallet_propose.html)** - 新規アカウントのキーを生成します。


## [ロギングおよびデータ管理のメソッド](logging-and-data-management-methods.html)

ログレベルとその他のデータ（レジャーなど）の管理には、以下のメソッドを使用します。

* **[`can_delete`](can_delete.html)** - 特定レジャーまでのレジャーのオンライン削除を許可します。
* **[`download_shard`](download_shard.html)** - レジャー履歴の特定のシャードをダウンロードします。
* **[`ledger_cleaner`](ledger_cleaner.html)** - レジャークリーナーサービスが破損データを確認するように設定します。
* **[`ledger_request`](ledger_request.html)** - ピアサーバーに対し特定のレジャーバージョンを照会します。
* **[`log_level`](log_level.html)** - ログの詳細レベルを取得または変更します。
* **[`logrotate`](logrotate.html)** - ログファイルを再度開きます。


## [サーバー制御メソッド](server-control-methods.html)

rippledサーバーの管理には、以下のメソッドを使用します。

* **[`connect`](connect.html)** - rippledサーバーを特定のピアに強制的に接続します。
* **[`ledger_accept`](ledger_accept.html)** - スタンドアロンモードでレジャーを閉鎖し、次のレジャーに進みます。
* **[`stop`](stop.html)** - rippledサーバーをシャットダウンします。
* **[`validation_seed`](validation_seed.html)** - 検証に使用するキーを一時的に設定します。


## [ステータスおよびデバッグメソッド](status-and-debugging-methods.html)

ネットワークとサーバーのステータスを確認するには、以下のメソッドを使用します。

* **[`consensus_info`](consensus_info.html)** - 発生したコンセンサスの状態に関する情報を取得します。
* **[`feature`](feature.html)** - プロトコルAmendmentに関する情報を取得します。
* **[`fetch_info`](fetch_info.html)** - サーバーとネットワークの同期に関する情報を取得します。
* **[`get_counts`](get_counts.html)** - サーバー内部とメモリー使用状況に関する統計情報を取得します。
* **[`peers`](peers.html)** - 接続しているピアサーバーに関する情報を取得します。
* **[`print`](print.html)** - 内部サブシステムに関する情報を取得します。
* **[`validators`](validators.html)** - 現在のバリデータに関する情報を取得します。
* **[`validator_list_sites`](validator_list_sites.html)** - バリデータリストを公開するサイトに関する情報を取得します。


## 廃止予定のメソッド

以下の管理コマンドは廃止予定であり、今後予告なしに削除される可能性があります。

* `ledger_header` - 代わりに[ledgerメソッド][]を使用してください。
* `unl_add`、`unl_delete`、`unl_list`、`unl_load`、`unl_network`、`unl_reset`、`unl_score` - 代わりに UNL管理用構成ファイルを使用してください。
* `wallet_seed` - 代わりに[wallet_proposeメソッド][]を使用してください。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}