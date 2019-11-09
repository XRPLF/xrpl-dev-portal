# rippledのパブリックメソッド

以下のパブリックAPIメソッドを使用して、`rippled`サーバーと直接通信します。パブリックメソッドは必ずしも一般大衆向けに設計されたのではありませんが、サーバーに接続されたあらゆるクライアントが使用します。パブリックメソッドは、サーバーを運用している組織のメンバーまたは顧客向けのものと考えてください。


## [アカウントメソッド](account-methods.html)

XRP Ledgerのアカウントとは、XRPの保有者と取引の送信者を意味ます。以下のメソッドを使用して、アカウント情報を処理します。

* **[`account_channels`](account_channels.html)** - アカウントがチャンネルのソースであるペイメントチャネルのリストを取得します。
* **[`account_currencies`](account_currencies.html)** - アカウントが送受信できる通貨のリストを取得します。
* **[`account_info`](account_info.html)** - アカウントについての基本データを取得します。
* **[`account_lines`](account_lines.html)** - アカウントのトラストラインについての情報を取得します。
* **[`account_objects`](account_objects.html)** - アカウントが保有しているすべてのレジャーオブジェクトを取得します。
* **[`account_offers`](account_offers.html)** - アカウントの通貨取引オファーについての情報を取得します。
* **[`account_tx`](account_tx.html)** - アカウントのトランザクションについての情報を取得します。
* **[`gateway_balances`](gateway_balances.html)** - アカウントによって発行された総額を計算します。
* **[`noripple_check`](noripple_check.html)** - アカウントのDefaultRippleおよびNoRipple設定への推奨される変更を取得します。


## [レジャーメソッド](ledger-methods.html)

レジャーバージョンには、ヘッダー、トランザクションツリー、状態ツリーが含まれ、さらにその中にアカウント設定、トラストライン、残高、トランザクション、その他のデータが含まれます。以下のメソッドを使用して、レジャー情報を取得します。

* **[`ledger`](ledger.html)** - レジャーバージョンについての情報を取得します。
* **[`ledger_closed`](ledger_closed.html)** - 最新の閉鎖済みレジャーバージョンを取得します。
* **[`ledger_current`](ledger_current.html)** - 現在処理中のレジャーバージョンを取得します。
* **[`ledger_data`](ledger_data.html)** - レジャーバージョンの生データコンテンツを取得します。
* **[`ledger_entry`](ledger_entry.html)** - レジャーバージョンから1つのエレメントを取得します。


## [トランザクションメソッド](transaction-methods.html)

トランザクションだけが、XRP Ledgerの共有されている状態を変更できます。XRP Ledgerに対するすべてのビジネスはトランザクションの形態をとります。以下のメソッドを使用して、トランザクションを処理します。

* **[`sign`](sign.html)** - トランザクションに暗号で署名します。
* **[`sign_for`](sign_for.html)** - マルチ署名に署名を提供します。
* **[`submit`](submit.html)** - トランザクションをネットワークに送信します。
* **[`submit_multisigned`](submit_multisigned.html)** - マルチ署名済みトランザクションをネットワークに送信します。
* **[`transaction_entry`](transaction_entry.html)** - レジャーの特定のバージョンからトランザクションについての情報を取得します。
* **[`tx`](tx.html)** - 手元にあるすべてのレジャーからトランザクションについての情報を取得します。
* **[`tx_history`](tx_history.html)** - 最新の全トランザクションについての情報を取得します。


## [パスおよびオーダーブックのメソッド](path-and-order-book-methods.html)

パスは、支払いが送信者から受信者に届くまでに中間ステップでたどる道筋を定義します。パスは、送信者と受信者をオーダーブックを介してつなぐことで、複数通貨間の支払いを可能にします。パスと他のオーダーブックに関しては、以下のメソッドを使用します。

* **[`book_offers`](book_offers.html)** - 2つの通貨を交換するオファーに関する情報を取得します。
* **[`deposit_authorized`](deposit_authorized.html)** - あるアカウントが別のアカウントへの支払いの直接送信について承認されているかどうかを調べます。
* **[`path_find`](path_find.html)** - 2つのアカウント間の支払いのパスを見つけて、更新を受け取ります。
* **[`ripple_path_find`](ripple_path_find.html)** - 2つのアカウント間の支払いのパスを1回だけ見つけます。


## [Payment Channel メソッド](payment-channel-methods.html)

Payment Channel は、2名の当事者間での一方向の繰り返しの支払い、またはそれに伴う一時的な貸付を容易に行えるようにするためのツールです。Payment Channelに関しては、以下のメソッドを使用します。

* **[`channel_authorize`](channel_authorize.html)** - ペイメントチャネルへのクレーム（支払請求）に署名します。
* **[`channel_verify`](channel_verify.html)** - payment channel クレームの署名をチェックします。


## [サブスクリプションメソッド](subscription-methods.html)

以下のメソッドにより、各種イベントの発生時にサーバーからクライアントに更新が通知されるように設定できます。これにより、イベントを即座に把握し、対処することができます。_WebSocket APIのみ。_

* **[`subscribe`](subscribe.html)** - 特定の対象について更新の通知を受けます。
* **[`unsubscribe`](unsubscribe.html)** - 特定の対象についての更新の通知を停止します。


## [サーバー情報メソッド](server-info-methods.html)

以下のメソッドを使用して、`rippled`サーバーの現在の状態についての情報を取得します。

* **[`fee`](fee.html)** - トランザクションコストについての情報を取得します。
* **[`server_info`](server_info.html)** - サーバーのステータスを人間が読めるフォーマットで取得します。
* **[`server_state`](server_state.html)** - サーバーのステータスを機械が読み取れるフォーマットで取得します。


## [ユーティリティメソッド](utility-methods.html)

以下のメソッドを使用して、pingや乱数生成などの便利なタスクを実行します。

* **[`json`](json.html)** - プロキシとして使用して、他のコマンドを実行します。コマンドのパラメーターをJSON値として受け入れます。_コマンドラインのみ。_
* **[`ping`](ping.html)** - サーバーとの接続を確認します。
* **[`random`](random.html)** - 乱数を生成します。


## 廃止予定のメソッド

`owner_info`コマンドは廃止される予定です。代わりに[`account_objects`](account_objects.html)を使用してください。