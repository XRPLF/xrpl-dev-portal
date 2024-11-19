---
html: public-api-methods.html
parent: http-websocket-apis.html
seo:
    description: パブリックAPIメソッドを使用して、rippledサーバと直接通信します。
labels:
  - コアサーバ
top_nav_grouping: 人気ページ
top_nav_name: APIのメソッド
---
# rippledのパブリックメソッド

以下のパブリックAPIメソッドを使用して、[XRP Ledgerサーバ](../../../concepts/networks-and-servers/index.md)と直接通信します。パブリックメソッドは必ずしも一般大衆向けに設計されたのではありませんが、サーバに接続されたあらゆるクライアントが使用します。パブリックメソッドは、サーバを運用している組織のメンバーまたは顧客向けのものと考えてください。


## [アカウントメソッド](account-methods/index.md)

XRP Ledgerのアカウントとは、XRPの保有者と取引の送信者を意味ます。以下のメソッドを使用して、アカウント情報を処理します。

* **[`account_channels`](account-methods/account_channels.md)** - アカウントがチャンネルのソースであるペイメントチャネルのリストを取得します。
* **[`account_currencies`](account-methods/account_currencies.md)** - アカウントが送受信できる通貨のリストを取得します。
* **[`account_info`](account-methods/account_info.md)** - アカウントについての基本データを取得します。
* **[`account_lines`](account-methods/account_lines.md)** - アカウントのトラストラインについての情報を取得します。
* **[`account_objects`](account-methods/account_objects.md)** - アカウントが保有しているすべてのレジャーオブジェクトを取得します。
* **[`account_offers`](account-methods/account_offers.md)** - アカウントの通貨取引オファーについての情報を取得します。
* **[`account_tx`](account-methods/account_tx.md)** - アカウントのトランザクションについての情報を取得します。
* **[`gateway_balances`](account-methods/gateway_balances.md)** - アカウントによって発行された総額を計算します。
* **[`noripple_check`](account-methods/noripple_check.md)** - アカウントのDefaultRippleおよびNoRipple設定への推奨される変更を取得します。


## [レジャーメソッド](ledger-methods/index.md)

レジャーバージョンには、ヘッダー、トランザクションツリー、状態ツリーが含まれ、さらにその中にアカウント設定、トラストライン、残高、トランザクション、その他のデータが含まれます。以下のメソッドを使用して、レジャー情報を取得します。

* **[`ledger`](ledger-methods/ledger.md)** - レジャーバージョンについての情報を取得します。
* **[`ledger_closed`](ledger-methods/ledger_closed.md)** - 最新の閉鎖済みレジャーバージョンを取得します。
* **[`ledger_current`](ledger-methods/ledger_current.md)** - 現在処理中のレジャーバージョンを取得します。
* **[`ledger_data`](ledger-methods/ledger_data.md)** - レジャーバージョンの生データコンテンツを取得します。
* **[`ledger_entry`](ledger-methods/ledger_entry.md)** - レジャーバージョンから1つのエレメントを取得します。


## [トランザクションメソッド](transaction-methods/index.md)

トランザクションだけが、XRP Ledgerの共有されている状態を変更できます。XRP Ledgerに対するすべてのビジネスはトランザクションの形態をとります。以下のメソッドを使用して、トランザクションを処理します。

* **[`sign`](../admin-api-methods/signing-methods/sign.md)** - トランザクションに暗号で署名します。
* **[`sign_for`](../admin-api-methods/signing-methods/sign_for.md)** - マルチ署名に署名を提供します。
* **[`submit`](transaction-methods/submit.md)** - トランザクションをネットワークに送信します。
* **[`submit_multisigned`](transaction-methods/submit_multisigned.md)** - マルチ署名済みトランザクションをネットワークに送信します。
* **[`transaction_entry`](transaction-methods/transaction_entry.md)** - レジャーの特定のバージョンからトランザクションについての情報を取得します。
* **[`tx`](transaction-methods/tx.md)** - 手元にあるすべてのレジャーからトランザクションについての情報を取得します。
* **[`tx_history`](transaction-methods/tx_history.md)** - 最新の全トランザクションについての情報を取得します。


## [パスおよびオーダーブックのメソッド](path-and-order-book-methods/index.md)

パスは、支払いが送信者から受信者に届くまでに中間ステップでたどる道筋を定義します。パスは、送信者と受信者をオーダーブックを介してつなぐことで、クロスカレンシー支払いを可能にします。パスと他のオーダーブックに関しては、以下のメソッドを使用します。

* **[`amm_info`](path-and-order-book-methods/amm_info.md)** - 自動マーケットメイカー(AMM)についての情報を取得します。
* **[`book_offers`](path-and-order-book-methods/book_offers.md)** - 2つの通貨を交換するオファーに関する情報を取得します。
* **[`deposit_authorized`](path-and-order-book-methods/deposit_authorized.md)** - あるアカウントが別のアカウントへの支払いの直接送信について承認されているかどうかを調べます。
* **[`nft_buy_offers`](path-and-order-book-methods/nft_buy_offers.md)** - Retrieve a list of buy offers for a specified NFToken object.
* **[`nft_sell_offers`](path-and-order-book-methods/nft_sell_offers.md)** - Retrieve a list of sell offers for a specified NFToken object.
* **[`path_find`](path-and-order-book-methods/path_find.md)** - 2つのアカウント間の支払いのパスを見つけて、更新を受け取ります。
* **[`ripple_path_find`](path-and-order-book-methods/ripple_path_find.md)** - 2つのアカウント間の支払いのパスを1回だけ見つけます。


## [Payment Channel メソッド](payment-channel-methods/index.md)

Payment Channel は、2名の当事者間での一方向の繰り返しの支払い、またはそれに伴う一時的な貸付を容易に行えるようにするためのツールです。Payment Channelに関しては、以下のメソッドを使用します。

* **[`channel_authorize`](payment-channel-methods/channel_authorize.md)** - ペイメントチャネルへのクレーム（支払請求）に署名します。
* **[`channel_verify`](payment-channel-methods/channel_verify.md)** - payment channel クレームの署名をチェックします。


## [サブスクリプションメソッド](subscription-methods/index.md)

以下のメソッドにより、各種イベントの発生時にサーバからクライアントに更新が通知されるように設定できます。これにより、イベントを即座に把握し、対処することができます。_WebSocket APIのみ。_

* **[`subscribe`](subscription-methods/subscribe.md)** - 特定の対象について更新の通知を受けます。
* **[`unsubscribe`](subscription-methods/unsubscribe.md)** - 特定の対象についての更新の通知を停止します。


## [サーバ情報メソッド](server-info-methods/index.md)

以下のメソッドを使用して、`rippled`サーバの現在の状態についての情報を取得します。

* **[`fee`](server-info-methods/fee.md)** - トランザクションコストについての情報を取得します。
* **[`server_info`](server-info-methods/server_info.md)** - サーバのステータスを人間が読めるフォーマットで取得します。
* **[`server_state`](server-info-methods/server_state.md)** - サーバのステータスを機械が読み取れるフォーマットで取得します。


## [ユーティリティメソッド](utility-methods/index.md)

以下のメソッドを使用して、pingや乱数生成などの便利なタスクを実行します。

* **[`json`](utility-methods/json.md)** - プロキシとして使用して、他のコマンドを実行します。コマンドのパラメーターをJSON値として受け入れます。_コマンドラインのみ。_
* **[`ping`](utility-methods/ping.md)** - サーバとの接続を確認します。
* **[`random`](utility-methods/random.md)** - 乱数を生成します。


## 廃止予定のメソッド

`owner_info`コマンドは廃止される予定です。代わりに[`account_objects`](account-methods/account_objects.md)を使用してください。
