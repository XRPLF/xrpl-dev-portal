---
html: admin-api-methods.html
parent: http-websocket-apis.html
seo:
    description: これらの管理APIメソッドを使用してxrpldサーバを管理します。
labels:
  - コアサーバ
---
# 管理APIメソッド

`xrpld`サーバと直接通信する際には管理APIメソッドを使用します。管理メソッドは、信頼できるサーバ運用担当者のみを対象としています。管理メソッドには、サーバの管理、監視、デバッグのためのコマンドが含まれています。

管理コマンドを使用できるのは、管理者として、`xrpld.cfg`ファイルに指定されているホストとポートで`xrpld`サーバに接続している場合に限られます。デフォルトでは、コマンドラインクライアントが管理接続を使用します。`xrpld`への接続についての詳細は、[xrpld API入門](../../../tutorials/get-started/get-started-http-websocket-apis.md)を参照してください。


## [キー生成メソッド](key-generation-methods/index.md)

キーを生成および管理するには、以下のメソッドを使用します。

* **[`validation_create`](key-generation-methods/validation_create.md)** - `xrpld`のノードキーペアを生成します。（バリデータは、このメソッドで生成したキーではなく[トークン](../../../infrastructure/configuration/server-modes/run-xrpld-as-a-validator.md)を使用してください。）
* **[`wallet_propose`](key-generation-methods/wallet_propose.md)** - 新規アカウントのキーを生成します。


## [ロギングおよびデータ管理のメソッド](logging-and-data-management-methods/index.md)

ログレベルとその他のデータ（レジャーなど）の管理には、以下のメソッドを使用します。

* **[`can_delete`](logging-and-data-management-methods/can_delete.md)** - 特定レジャーまでのレジャーのオンライン削除を許可します。
* **[`ledger_cleaner`](logging-and-data-management-methods/ledger_cleaner.md)** - レジャークリーナーサービスが破損データを確認するように設定します。
* **[`ledger_request`](logging-and-data-management-methods/ledger_request.md)** - ピアサーバに対し特定のレジャーバージョンを照会します。
* **[`log_level`](logging-and-data-management-methods/log_level.md)** - ログの詳細レベルを取得または変更します。
* **[`logrotate`](logging-and-data-management-methods/logrotate.md)** - ログファイルを再度開きます。


## [サーバ制御メソッド](server-control-methods/index.md)

xrpldサーバの管理には、以下のメソッドを使用します。

* **[`ledger_accept`](server-control-methods/ledger_accept.md)** - スタンドアロンモードでレジャーを閉鎖し、次のレジャーに進みます。
* **[`stop`](server-control-methods/stop.md)** - xrpldサーバをシャットダウンします。


## [署名メソッド](signing-methods/index.md)

トランザクションへの署名には、以下のメソッドを使用します。

* **[`sign`](signing-methods/sign.md)** - トランザクションに暗号で署名します。
* **[`sign_for`](signing-methods/sign_for.md)** - マルチ署名に署名を提供します。
* **[`channel_authorize`](signing-methods/channel_authorize.md)** - ペイメントチャネルへのクレーム（支払請求）に署名します。

デフォルトでは、これらのメソッドは[管理者専用](../../../tutorials/get-started/get-started-http-websocket-apis.md#admin-access)です。サーバ管理者が[パブリック署名を有効にしている](../../../infrastructure/configuration/enable-public-signing.md)場合は、パブリックメソッドとして使用できます。


## [ピア管理メソッド](peer-management-methods/index.md)

ピアツーピアのXRP Ledgerネットワークにおけるサーバの接続を管理するには、以下のメソッドを使用します。

* **[`connect`](peer-management-methods/connect.md)** - xrpldサーバを特定のピアに強制的に接続します。
* **[`peer_reservations_add`](peer-management-methods/peer_reservations_add.md)** - 特定のピア用の予約スロットを追加または更新します。
* **[`peer_reservations_del`](peer-management-methods/peer_reservations_del.md)** - 特定のピア用の予約スロットを削除します。
* **[`peer_reservations_list`](peer-management-methods/peer_reservations_list.md)** - 特定のピア用の予約スロットを一覧表示します。
* **[`peers`](peer-management-methods/peers.md)** - 接続しているピアサーバに関する情報を取得します。


## [ステータスおよびデバッグメソッド](status-and-debugging-methods/index.md)

ネットワークとサーバのステータスを確認するには、以下のメソッドを使用します。

* **[`consensus_info`](status-and-debugging-methods/consensus_info.md)** - 発生したコンセンサスの状態に関する情報を取得します。
* **[`feature`](status-and-debugging-methods/feature.md)** - プロトコルAmendmentに関する情報を取得します。
* **[`fetch_info`](status-and-debugging-methods/fetch_info.md)** - サーバとネットワークの同期に関する情報を取得します。
* **[`get_counts`](status-and-debugging-methods/get_counts.md)** - サーバ内部とメモリー使用状況に関する統計情報を取得します。
* **[`manifest`](../public-api-methods/server-info-methods/manifest.md)** - 既知のバリデータに関する最新の公開鍵の情報を取得します。
* **[`print`](status-and-debugging-methods/print.md)** - 内部サブシステムに関する情報を取得します。
* **[`validator_info`](status-and-debugging-methods/validator_info.md)** - サーバがバリデータとして設定されている場合、そのバリデータ設定に関する情報を取得します。
* **[`validator_list_sites`](status-and-debugging-methods/validator_list_sites.md)** - バリデータリストを公開するサイトに関する情報を取得します。
* **[`validators`](status-and-debugging-methods/validators.md)** - 現在のバリデータに関する情報を取得します。


## 廃止予定のメソッド

以下の管理コマンドは廃止予定であり、すでに削除されているか、今後予告なしに削除される可能性があります。

* `ledger_header` - 代わりに[ledgerメソッド][]を使用してください。
* `unl_add`、`unl_delete`、`unl_list`、`unl_load`、`unl_network`、`unl_reset`、`unl_score` - 代わりにUNL管理用の`validators.txt`設定ファイルを使用してください。
* `wallet_seed` - 代わりに[wallet_proposeメソッド][]を使用してください。
* `validation_seed` - 代わりに設定ファイルと`validator-keys-tool`を使用してシードを管理してください。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
