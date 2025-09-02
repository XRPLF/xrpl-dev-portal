---
html: subscribe.html
parent: subscription-methods.html
seo:
    description: 特定のイベントが発生した場合に、定期的に通知するようサーバにリクエストします。
labels:
  - 支払い
  - アカウント
  - ブロックチェーン
  - スマートコントラクト
---
# subscribe
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/Subscribe.cpp "Source")

`subscribe`メソッドは、特定のイベントが発生した場合に、定期的に通知するようサーバにリクエストします。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="アカウントのサブスクライブ" %}
```json
{
  "id": "Example watch Bitstamp's hot wallet",
  "command": "subscribe",
  "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
}
```
{% /tab %}

{% tab label="オーダーブックのサブスクライブ" %}
```json
{
    "id": "Example subscribe to XRP/GateHub USD order book",
    "command": "subscribe",
    "books": [
        {
            "taker_pays": {
                "currency": "XRP"
            },
            "taker_gets": {
                "currency": "USD",
                "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
            },
            "snapshot": true
        }
    ]
}
```
{% /tab %}

{% tab label="レジャーストリームのサブスクライブ" %}
```json
{
  "id": "Example watch for new validated ledgers",
  "command": "subscribe",
  "streams": ["ledger"]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="subscribe" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド          | 型     | 必須?  | 説明 |
|:--------------------|:-------|:-------|:-----|
| `streams`           | 配列   | いいえ | 以下で説明するストリームにサブスクライブします。配列の各要素は、ストリームの文字列名でなければなりません。 |
| `accounts`          | 配列   | いいえ | 検証済みトランザクションを監視するアカウントの一意の[アドレス][]を持つ配列。サーバは、少なくともこれらのアカウントのいずれかに影響を与えるトランザクションが発生するたびに、`transaction`タイプのメッセージを送信します。 |
| `accounts_proposed` | 配列   | いいえ | `accounts`と同様ですが、まだファイナライズされていないトランザクションを含みます。 |
| `books`             | 配列   | いいえ | 更新を監視するオーダーブック。配列の各要素は、以下で定義される[book object](#book-objects)でなければなりません。サーバは、トランザクションがこのアカウントに影響を与えるたびに、`transaction`タイプのメッセージを送信します。 |
| `url`               | 文字列 | いいえ | （Websocketでは省略可、それ以外では必須）サーバが各イベントのJSON-RPCコールバックを送信するURL。*管理者専用。* |
| `url_username`      | 文字列 | いいえ | コールバックURLで基本認証を行うためのユーザ名。 |
| `url_password`      | 文字列 | いいえ | コールバックURLで基本認証を行うためのパスワード。 |

以下のパラメータは廃止予定で、今後予告なしに削除される可能性があります。`user`、`password`、`rt_accounts`。

`streams`パラメータは、以下のデフォルトの情報ストリームへのアクセスを可能にします。

| ストリーム名             | メッセージタイプ         | 説明 |
|:------------------------|:---------------------|:------------|
| `book_changes`          | `bookChanges`        | コンセンサスプロセスが新しい検証済みレジャーを宣言するたびに、オーダーブックの変更をメッセージで送信します。 |
| `consensus`             | `consensusPhase`     | サーバがコンセンサスサイクルのフェーズを変更するたびにメッセージを送信します。 |
| `ledger`                | `ledgerClosed`       | コンセンサスプロセスで新しい検証済みレジャーが宣言されるたびにメッセージを送信します。 |
| `manifests`             | `manifestReceived`   | バリデータのephemeral署名鍵の更新を受け取るたびにメッセージを送信します。 |
| `peer_status`           | `peerStatusChange`   | **(管理者専用)** 接続している`rippled`のピアサーバに関する情報（特にコンセンサスプロセスに関する情報）。 |
| `transactions`          | `transaction`        | 閉鎖済みレジャーにトランザクションが追加されるたびにメッセージを送信します。 |
| `transactions_proposed` | `transaction`        | 閉鎖済みレジャーにトランザクションが追加される場合や、検証済みレジャーにまだ追加されておらず、今後も追加される見込みのない一部のトランザクションが検証済みレジャーに追加される場合に、メッセージを送信します。提案されたすべてのトランザクションが検証前に表示されるわけではありません。 {% admonition type="info" name="注記" %}[成功しなかったトランザクション](../../../protocol/transactions/transaction-results/index.md) 成功しなかったトランザクションも、スパム対策取引手数料を取るため、検証済みレジャーに含まれます。{% /admonition %} |
| `server`                | `serverStatus`       | `rippled`サーバのステータス（ネットワーク接続など）が変更されるたびにメッセージを送信します。 |
| `validations`           | `validationReceived` | サーバがバリデータを信頼しているか否かにかかわらず、サーバが検証メッセージを受信するたびに、メッセージを送信します。（個々の`rippled`は、サーバが少なくとも定数の信頼できるバリデータから検証メッセージを受信した時点で、レジャーが検証済みであると宣言します。） |

{% admonition type="info" name="注記" %}以下のストリームは Clioおよび[レポートモード][]の`rippled`サーバからは利用できません: `server`、`peer_status`、`consensus`。これらのストリームを要求すると、どちらも`reportingUnsupported`エラーを返します。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}更新: rippled 1.8.1{% /badge %} {% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}新規: Clio v2.0{% /badge %}{% /admonition %}

### Bookオブジェクト

`books`配列が指定されている場合、この配列の各要素は、以下のフィールドを持つオブジェクトです。

| フィールド   | 型                    | 必須?  | 説明 |
| :----------- | :-------------------- | :----- | ---- |
| `taker_gets` | オブジェクト          | はい   | オファーを受諾するアカウントが受け取る通貨を[金額なしの通貨オブジェクト](../../../protocol/data-types/currency-formats.md#金額なしでの通貨の指定)として指定します。 |
| `taker_pays` | オブジェクト          | はい   | オファーを受諾するアカウントが支払う通貨を[金額なしの通貨オブジェクト](../../../protocol/data-types/currency-formats.md#金額なしでの通貨の指定)として指定します。 |
| `both`       | ブール値              | いいえ | `true`の場合は、オーダーブックの両サイドを返します。デフォルトは`false` |
| `domain`     | 文字列 - [ハッシュ][] | いいえ | 許可型DEXのレジャーエントリID。指定された場合、対応する[許可型DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md)のみを使用するパスを返します。（[PermissionedDEX amendment][] {% not-enabled /%}が必要です） |
| `snapshot`   | ブール値              | いいえ   | `true`の場合は、更新の送信前にサブスクライブした時点でオーダーブックの現在の状態を一度返します。デフォルトは`false` |
| `taker`      | 文字列                | いいえ   | オファーを表示するパースペクティブとして使用する一意のアカウントアドレス（XRP Ledgerの[base58][]フォーマット）。（これはオファーの資金提供ステータスと手数料に影響します。） |


## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "Example watch Bitstamp's hot wallet",
  "status": "success",
  "type": "response",
  "result": {}
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っています。レスポンスに含まれるフィールドは、リクエストに指定されたサブスクリプションに応じて異なります。

* `accounts`および`accounts_proposed` - フィールドが返されません。
* *Stream: `server`* - `load_base`（サーバの現在の読み込みレベル）、`random`（ランダムに生成された値）などのサーバのステータスに関する情報。これらの情報は変更される可能性があります。
* *Stream: `transactions`*、*Stream: `transactions_proposed`*、*Stream: `validations`*、および*Stream: `consensus`* - フィールドは返されません。
* *Stream: `ledger`* - 手元にあるレジャーと現在の料金に関する情報。これは、[ledgerストリームメッセージ](#レジャーストリーム)と同じフィールドを含みますが、`type`と`txn_count`フィールドは省略されています。
* `books` - フィールドはデフォルトで返されません。リクエストが`"snapshot": true`に設定されている場合、`offers`（オーダーブックを定義するオファー定義オブジェクトの配列）を返します。

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `noPermission` - リクエストに`url`フィールドが指定されていますが、管理者として接続していません。
* `unknownStream` - リクエストの`streams`フィールドの1つ以上の要素が有効なストリーム名ではありません。
* `malformedStream` - リクエストの`streams`フィールドのフォーマットが適切ではありません。
* `malformedAccount` - リクエストの`accounts`または`accounts_proposed`フィールドのアドレスのいずれか1つが、適切なフォーマットのXRP Ledgerアドレスではありません。（**注記:** グローバルレジャーにまだエントリのないアドレスのストリームをサブスクライブして、そのアドレスに資金が供給されたらメッセージを受け取るように _できます_ 。）
* `srcCurMalformed` - リクエストの`books`フィールドの1つ以上の`taker_pays`サブフィールドのフォーマットが適切ではありません。
* `dstAmtMalformed` - リクエストの`books`フィールドの1つ以上の`taker_gets`サブフィールドのフォーマットが適切ではありません。
* `srcIsrMalformed` - リクエストの`books`フィールドの1つ以上の`taker_pays`サブフィールドの`issuer`フィールドが無効です。
* `dstIsrMalformed` - リクエストの`books`フィールドの1つ以上の`taker_gets`サブフィールドの`issuer`フィールドが無効です。
* `badMarket` - `books`フィールドに指定されている1つ以上のオーダーブックが存在していません（ある通貨とその通貨自体の交換オファーなど）。

特定のストリームをサブスクライブすると、サブスクライブを解除するか、WebSocket接続を閉じるまで、そのストリームに関するレスポンスを定期的に受信します。これらのレスポンスの内容は、サブスクライブしている内容に応じて異なります。以下に、いくつかの例を紹介します。

## レジャーストリーム

`ledger`ストリームは、[コンセンサスプロセス](../../../../concepts/consensus-protocol/index.md)で新しい検証済みレジャーが宣言されたときにのみ`ledgerClosed`メッセージを送信します。このメッセージはレジャーを識別し、そのレジャーの内容について何らかの情報を伝えます。

```json
{
  "type": "ledgerClosed",
  "fee_base": 10,
  "fee_ref": 10,
  "ledger_hash": "687F604EF6B2F67319E8DCC8C66EF49D84D18A1E18F948421FC24D2C7C3DB464",
  "ledger_index": 7125358,
  "ledger_time": 455751310,
  "reserve_base": 20000000,
  "reserve_inc": 5000000,
  "txn_count": 7,
  "validated_ledgers": "32570-7125358"
}
```

レジャーストリームメッセージのフィールドは次のとおりです。

| フィールド          | 型                              | 説明 |
| :------------------ | :------------------------------ | ---- |
| `type`              | 文字列                          | `ledgerClosed`は、このメッセージがレジャーストリームからのものであることを示します。 |
| `fee_base`          | 数値                            | このレジャーバージョン時点の[Referenceトランザクションコスト](../../../../concepts/transactions/transaction-cost.md#referenceトランザクションコスト)（[XRPのdrop数][]）。このレジャーバージョンに[SetFee疑似トランザクション](../../../protocol/transactions/pseudo-transaction-types/setfee.md)が含まれている場合は、次のレジャーバージョンから新しいトランザクションコストが適用されます。 |
| `fee_ref`           | 数値                            | (省略される場合があります)「手数料単位」の[Referenceトランザクションコスト](../../../../concepts/transactions/transaction-cost.md#referenceトランザクションコスト)。 _[XRPFees amendment][]_ が有効である場合, このフィールドは永久に省略されます。 |
| `ledger_hash`       | 文字列 - [ハッシュ][]           | 閉鎖されたレジャーバージョンの識別用ハッシュ。 |
| `ledger_index`      | 数値 - [レジャーインデックス][] | 閉鎖されたレジャーのレジャーインデックス。 |
| `ledger_time`       | 数値                            | レジャーが閉鎖された時刻（[Rippleエポック以降の経過秒数][]） |
| `reserve_base`      | 数値                            | アカウントの最低必要[準備金](../../../../concepts/accounts/reserves.md)（[XRPのdrop数][]）。このレジャーバージョンに[SetFee疑似トランザクション](../../../protocol/transactions/pseudo-transaction-types/setfee.md)が含まれる場合は、次のレジャーバージョンから新しい基本準備金が適用されます。 |
| `reserve_inc`       | 数値                            | アカウントがレジャーに所有しているオブジェクトごとの[所有者準備金](../../../../concepts/accounts/reserves.md#所有者準備金)（[XRPのdrop数][]）。レジャーに[SetFee疑似トランザクション](../../../protocol/transactions/pseudo-transaction-types/setfee.md)が記録されている場合、このレジャー以降は新しい所有者準備金が適用されます。 |
| `txn_count`         | 数値                            | このレジャーバージョンに含まれる新規トランザクションの数。 |
| `validated_ledgers` | 文字列                          | _（省略される場合があります）_ サーバが利用可能なレジャーの範囲。これは、`24900901-24900984,24901116-24901158`のような不連続なシーケンスである可能性があります。サーバがネットワークに接続されていない場合、または接続されているがまだネットワークからレジャーを取得していない場合は、このフィールドは返されません。 |


## 検証ストリーム

検証ストリームは、検証メッセージ（検証投票とも呼ばれる）を受信するたびにメッセージを送信します。検証メッセージが信頼できるバリデータからのものであるかどうかは関係ありません。次のようなメッセージを送信します。

```json
{
    "type": "validationReceived",
    "amendments":[
        "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
        "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC",
        "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490",
        "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13"
    ],
    "base_fee":10,
    "flags":2147483649,
    "full":true,
    "ledger_hash":"EC02890710AAA2B71221B0D560CFB22D64317C07B7406B02959AD84BAD33E602",
    "ledger_index":"6",
    "load_fee":256000,
    "master_key": "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
    "reserve_base":20000000,
    "reserve_inc":5000000,
    "signature":"3045022100E199B55643F66BC6B37DBC5E185321CF952FD35D13D9E8001EB2564FFB94A07602201746C9A4F7A93647131A2DEB03B76F05E426EC67A5A27D77F4FF2603B9A528E6",
    "signing_time":515115322,
    "validation_public_key":"n94Gnc6svmaPPRHUAyyib1gQUov8sYbjLoEwUBYPH39qHZXuo8ZT"
}
```

検証ストリームメッセージのフィールドは次のとおりです。

| フィールド              | 型            | 説明 |
| :---------------------- | :------------ | ---- |
| `type`                  | 文字列        | 値`validationReceived`は、このメッセージが検証ストリームからであることを示します。 |
| `amendments`            | 文字列の配列  | （省略される場合があります）このサーバがプロトコルへの追加を求める[Amendment](../../../../concepts/networks-and-servers/amendments.md)。 |
| `base_fee`              | 整数          | （省略される場合があります）サーバが[手数料投票](../../../../concepts/consensus-protocol/fee-voting.md)による設定を希望するスケーリングされていないトランザクションコスト（`reference_fee`値）。 |
| `cookie`                | 文字列 - 数値 | _（省略される場合があります）_ サーバが起動時に選択した任意の値。同じ検証キーペアで異なるクッキーを使用して同時に有効な検証を送信する場合、通常は複数のサーバが同じ検証キーペアを使用していることを示します。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}新規: rippled 1.8.1{% /badge %} |
| `flags`                 | 数値          | この検証メッセージに追加されるフラグのビットマスク。フラグ`0x80000000`は、検証の署名が完全に正規であることを示します。フラグ`0x00000001`は、完全な検証であることを示します。それ以外の場合は部分検証です。部分検証とは、特定のレジャーに対する投票ではありません。部分検証は、バリデータがオンラインであるがコンセンサスにまだ同意していないことを示します。 |
| `full`                  | ブール値      | `true`の場合は、完全な検証です。それ以外の場合は部分検証です。部分検証とは、特定のレジャーに対する投票ではありません。部分検証は、バリデータがオンラインであるがコンセンサスにまだ同意していないことを示します。 |
| `ledger_hash`           | 文字列        | 提案されたレジャーの識別ハッシュを検証中です。 |
| `ledger_index`          | 文字列 - 整数 | 提案されたレジャーの[レジャーインデックス][]。 |
| `load_fee`              | 整数          | （省略される場合があります）このバリデータにより現在施行されているローカルの負荷スケーリングされたトランザクションコスト（手数料単位）。 |
| `master_key`            | 文字列        | _（省略される場合があります）_ バリデータのマスター公開鍵（バリデータがXRP Ledgerの[base58][]フォーマットのバリデータトークンを使用している場合）。（関連項目: [`rippled`サーバで検証を有効化](../../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-rippledサーバで検証を有効化)。） |
| `reserve_base`          | 整数          | （省略される場合があります）このバリデータが[手数料投票](../../../../concepts/consensus-protocol/fee-voting.md)による設定を希望する最低必要準備金（`account_reserve`値）。 |
| `reserve_inc`           | 整数          | （省略される場合があります）このバリデータが[手数料投票](../../../../concepts/consensus-protocol/fee-voting.md)による設定を希望する必要準備金（`owner_reserve`値）の増分。 |
| `server_version`        | 文字列 - 数値 | _(省略される場合があります)_ バリデータサーバのバージョン番号を表す 64 ビットの整数。例えば`「1745990410175512576」`。256レジャーに一度だけ提供されます。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}新規: rippled 1.8.1{% /badge %} |
| `signature`             | 文字列        | バリデータがこのレジャーへの投票に署名するときに使用する署名。 |
| `signing_time`          | 数値          | この検証投票が署名された時刻（[Rippleエポック以降の経過秒数][]）。 |
| `validated_hash`        | 文字列        | この検証が適用される提案レジャーの一意のハッシュ。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}新規: rippled 1.8.1{% /badge %} |
| `validation_public_key` | 文字列        | バリデータがメッセージの署名に使用したキーペアの公開鍵（XRP Ledgerの[base58][]形式）。このフィールドは、メッセージを送信するバリデータを特定します。また`signature`の検証にも使用できます。バリデータがトークンを使用している場合は一時的な公開鍵です。 |


## トランザクションストリーム

サブスクリプションの多くは、次のようなトランザクションに関するメッセージをもたらします。

* `transactions`ストリーム
* `transactions_proposed`ストリーム
* `accounts`サブスクリプション
* `accounts_proposed`サブスクリプション
* `book`（オーダーブック）サブスクリプション

`transactions_proposed`ストリームは、厳密には`transactions`ストリームのスーパーセットです。このストリームにはすべての検証済みトランザクションと、検証済みレジャーにまだ記録されておらず、今後も記録される見込みのない提案されたトランザクションがいくつか記録されます。このような「処理中」のトランザクションはそのフィールドから判断できます。

* `validated`フィールドがないか、または値`false`が指定されている。
* `meta`フィールドまたは`metadata`フィールドがない。
* トランザクションがファイナライズされたレジャーバージョンを指定する`ledger_index`フィールドと`ledger_hash`フィールドの代わりに、現在これらのトランザクションに提案されているレジャーバージョンを指定する`ledger_current_index`フィールドが存在する。

上記に該当しない場合、`transactions_proposed`ストリームからのメッセージは`transactions`ストリームからのメッセージと同じです。

アカウントまたはオーダーブックを変更できるのはトランザクションだけであるため、特定の`accounts`または`books`をサブスクライブすることにより送信されるメッセージも、トランザクションメッセージの形式（`transactions`ストリームのメッセージと同じ形式）となります。唯一の異なる点は、監視中のアカウントまたはオーダーブックに影響するトランザクションに対するメッセージだけを受信することです。

`accounts_proposed`サブスクリプションも同様に機能しますが、このサブスクリプションには、`transactions_proposed`ストリームと同様、監視中のアカウントの未確定トランザクションも記録される点が異なります。

```json
{
  "close_time_iso": "2024-11-01T23:59:01Z",
  "engine_result": "tesSUCCESS",
  "engine_result_code": 0,
  "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
  "hash": "6489E52A909208E371ACE82E19CAE59896C7F8BA40E7C36C5B8AA3C451914BED",
  "ledger_hash": "0B6F44849E6D702D0CFB447FDBD7B603C269E9EEECE9176882EF376E0C9DFF6A",
  "ledger_index": 1969852,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rH3PxjJPrrkvsATddBXkayjAyWR8xigaE8",
            "Balance": "39999964",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 1969812
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "EDE60B24659BCC06CCE1EA2804A4A202F1C88155CEAED9C140833C0C39100617",
          "PreviousFields": {
            "Balance": "59999976",
            "Sequence": 1969811
          },
          "PreviousTxnID": "1DBC93373D47794A684A5013178D0EBE10E6641D7C262BF20151B0E19156FF79",
          "PreviousTxnLgrSeq": 1969843
        }
      },
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rfdGuuVnq9juqWDV4W3LoLiNcW8g2hAXhN",
            "Balance": "160000000",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 1969810
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "F7D350FB54C5BBA734AE574EE6BF7A9294E11F9B75413972F98846AFC587C62C",
          "PreviousFields": {
            "Balance": "140000000"
          },
          "PreviousTxnID": "1DBC93373D47794A684A5013178D0EBE10E6641D7C262BF20151B0E19156FF79",
          "PreviousTxnLgrSeq": 1969843
        }
      }
    ],
    "TransactionIndex": 4,
    "TransactionResult": "tesSUCCESS",
    "delivered_amount": "20000000"
  },
  "status": "closed",
  "tx_json": {
    "Account": "rH3PxjJPrrkvsATddBXkayjAyWR8xigaE8",
    "DeliverMax": "20000000",
    "Destination": "rfdGuuVnq9juqWDV4W3LoLiNcW8g2hAXhN",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 1969870,
    "Sequence": 1969811,
    "SigningPubKey": "ED0761CDA5507784F6CEB445DE2343F861DD5EC7A869F75B08C7E8F29A947AD9FC",
    "TransactionType": "Payment",
    "TxnSignature": "20D5447ED7095BCCC3D42EA1955600D97D791811072E93D2A358AD9FB258C3A7F004974039D25708F5AE598C78F85B688DD586158F7E9C13AE0F30CC18E3390D",
    "date": 783820741
  },
  "type": "transaction",
  "validated": true
}
```

トランザクションストリームメッセージには次のフィールドがあります。

{% tabs %}

{% tab label="API v2" %}

| フィールド              | 型                        | 説明 |
|:------------------------|:--------------------------|:-----|
| `close_time_iso`        | 文字列                    | レジャーの終了時刻をISO 8601の時刻形式で表します。 |
| `type`                  | 文字列                    | `transaction`は、複数の可能なストリームからのトランザクションの通知であることを示します。 |
| `engine_result`         | 文字列                    | 文字列での[取引結果コード](../../../protocol/transactions/transaction-results/index.md) |
| `engine_result_code`    | 数値                      | 数値での[取引結果コード](../../../protocol/transactions/transaction-results/index.md) (該当する場合) |
| `engine_result_message` | 文字列                    | 人間が読み取れる形式のトランザクションレスポンスの説明 |
| `hash`                  | 文字列                    | トランザクションの一意のハッシュ識別子。 |
| `ledger_current_index`  | 数値 - [レジャーインデックス][]   | _(未検証のトランザクションのみ)_ このトランザクションが現在提案されている現在進行中の[レジャーバージョン](../../../../concepts/ledgers/index.md)のレジャーインデックス。 |
| `ledger_hash`           | 文字列 - [ハッシュ][]     | _(検証済みのトランザクションのみ)_ このトランザクションを含むレジャーバージョンの識別用ハッシュ。 |
| `ledger_index`          | 数値 - [レジャーインデックス][]   | _(検証済みのトランザクションのみ)_ このトランザクションを含むレジャーバージョンのレジャーインデックス。 |
| `meta`                  | オブジェクト              | _(検証済みのトランザクションのみ)_ [トランザクションメタデータ](../../../protocol/transactions/metadata.md)。トランザクションの正確な結果を詳細に表示します。 |
| `tx_json`               | オブジェクト              | JSONフォーマットの[トランザクションの定義](../../../protocol/transactions/index.md)。 |
| `validated`             | ブール値                  | `true`の場合、このトランザクションは検証済みのレジャーに含まれており、その結果は最終的であることを意味します。`transaction`ストリームからのレスポンスは常に検証される必要があります。 |

{% /tab %}

{% tab label="API v1" %}

| フィールド              | 型                              | 説明 |
| :---------------------- | :------------------------------ | ---- |
| `type`                  | 文字列                          | `transaction`は、トランザクションの通知であることを示します。この通知はさまざまなストリームから送信される可能性があります。 |
| `engine_result`         | 文字列                          | 文字列の[トランザクション結果コード](../../../protocol/transactions/transaction-results/index.md) |
| `engine_result_code`    | 数値                            | 数値の[トランザクションレスポンスコード](../../../protocol/transactions/transaction-results/index.md)（該当する場合） |
| `engine_result_message` | 文字列                          | 人間が読み取れる形式のトランザクションレスポンスの説明 |
| `ledger_current_index`  | 数値 - [レジャーインデックス][] | _（未検証のトランザクションのみ）_ このトランザクションが現在提案されている現在進行中の[レジャーバージョン](../../../../concepts/ledgers/index.md)のレジャーインデックス。        |
| `ledger_hash`           | 文字列 - [ハッシュ][]           | _（検証済みのトランザクションのみ）_ このトランザクションを含む レジャーバージョンの識別用ハッシュ。 |
| `ledger_index`          | 数値 - [レジャーインデックス][] | _（検証済みのトランザクションのみ）_ このトランザクションを含むレジャーバージョンのレジャーインデックス。 |
| `meta`                  | オブジェクト                    | _（検証済みのトランザクションのみ）_ [トランザクションのメタデータ](../../../protocol/transactions/metadata.md)。トランザクションの正確な結果を詳細に表示します。 |
| `transaction`           | オブジェクト                    | JSONフォーマットの[トランザクションの定義](../../../protocol/transactions/index.md)。 |
| `validated`             | ブール値                        | `true`の場合、このトランザクションは検証済みのレジャーに含まれており、最終的な結果であることを意味します。`transaction`ストリームからのレスポンスは常に検証される必要があります。 |

{% /tab %}

{% /tabs %}

## ピアステータスストリーム

管理者専用の`peer_status`ストリームは、このサーバが接続している他の`rippled`サーバの活動に関する大量の情報、特にコンセンサスプロセスでのサーバのステータスを報告します。

ピアステータスストリームメッセージの例:

```json
{
    "action": "CLOSING_LEDGER",
    "date": 508546525,
    "ledger_hash": "4D4CD9CD543F0C1EF023CC457F5BEFEA59EEF73E4552542D40E7C4FA08D3C320",
    "ledger_index": 18853106,
    "ledger_index_max": 18853106,
    "ledger_index_min": 18852082,
    "type": "peerStatusChange"
}
```

ピアステータスストリームメッセージは、`rippled`ピアサーバのステータスが変化したイベントを表します。これらのメッセージは、次のフィールドを持つJSONオブジェクトです。

| フィールド         | 値     | 説明 |
| :----------------- | :----- | ---- |
| `type`             | 文字列 | `peerStatusChange`は、ピアステータスストリームからのメッセージであることを示します。 |
| `action`           | 文字列 | このメッセージが送信される原因となったイベントのタイプ。有効な値については、[ピアステータスイベント](#ピアステータスイベント)をご覧ください。 |
| `date`             | 数値   | このイベントが発生した時刻（[Rippleエポック以降の経過秒数][]） |
| `ledger_hash`      | 文字列 | （省略される場合があります）このメッセージに関連するレジャーバージョンの識別用[ハッシュ][]。 |
| `ledger_index`     | 数値   | （省略される場合があります）このメッセージに関連するレジャーバージョンの[レジャーインデックス][]。 |
| `ledger_index_max` | 数値   | （省略される場合があります）ピアで現在使用可能な最大[レジャーインデックス][]。 |
| `ledger_index_min` | 数値   | （省略される場合があります）ピアで現在使用可能な最小[レジャーインデックス][]。 |

### ピアステータスイベント

ピアステータスストリームメッセージの`action`フィールドには次のいずれかの値が含まれます。

| `Value`           | 意味 |
| :---------------- | ---- |
| `CLOSING_LEDGER`  | ピアがこの[レジャーインデックス][]のレジャーバージョンを閉鎖しました。 |
| `ACCEPTED_LEDGER` | ピアがコンセンサスラウンドの結果としてこのレジャーバージョンを作成しました。**注記:** このレジャーが不変的に検証済みになるかどうかはまだ確実ではありません。 |
| `SWITCHED_LEDGER` | ピアは、ネットワークの他の部分に従っていないと結論付け、異なるレジャーバージョンに切り替えました。 |
| `LOST_SYNC`       | ピアは検証済みのレジャーバージョンとコンセンサス処理中のレジャーバージョンの追跡でネットワークの他の部分に遅れをとりました。 |


## オーダーブックストリーム

`books`フィールドを使用して1つ以上のオーダーブックをサブスクライブすると、これらのオーダーブックに影響するすべてのトランザクションを取得します。

オーダーブックストリームメッセージの例:

```json
{
  "tx_json": {
    "Account": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
    "Fee": "20",
    "Flags": 0,
    "LastLedgerSequence": 91826205,
    "OfferSequence": 156917168,
    "Sequence": 156917177,
    "SigningPubKey": "0253C1DFDCF898FE85F16B71CCE80A5739F7223D54CC9EBA4749616593470298C5",
    "TakerGets": "35992000000",
    "TakerPays": {
      "currency": "USD",
      "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
      "value": "18570.025718376"
    },
    "TransactionType": "OfferCreate",
    "TxnSignature": "30440220520439D8DDB6B6D0E4EA1504873D780ADE524E3961E02A5DD84B8B4C456BA3240220533CF99250737C13FD376C18F6D64149332BA1FE6EA04895442247BD29952193",
    "date": 783819060,
    "owner_funds": "36054185999"
  },
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Flags": 0,
            "IndexNext": "0",
            "IndexPrevious": "0",
            "Owner": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
            "RootIndex": "0A2600D85F8309FE7F75A490C19613F1CE0C37483B856DB69B8140154C2335F3"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "0A2600D85F8309FE7F75A490C19613F1CE0C37483B856DB69B8140154C2335F3",
          "PreviousTxnID": "73BBE254DDC97EAD6ECB2D9F7A7EB13DBA1A5B816C2727548FCFBC41B40604EF",
          "PreviousTxnLgrSeq": 91826203
        }
      },
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
            "Balance": "36092186059",
            "Flags": 0,
            "OwnerCount": 14,
            "Sequence": 156917178
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "1ED8DDFD80F275CB1CE7F18BB9D906655DE8029805D8B95FB9020B30425821EB",
          "PreviousFields": {
            "Balance": "36092186079",
            "Sequence": 156917177
          },
          "PreviousTxnID": "73BBE254DDC97EAD6ECB2D9F7A7EB13DBA1A5B816C2727548FCFBC41B40604EF",
          "PreviousTxnLgrSeq": 91826203
        }
      },
      {
        "CreatedNode": {
          "LedgerEntryType": "Offer",
          "LedgerIndex": "3B4D42B185D1FE4EBED70F7E35A8E8AEA39028FB6B16DCDFC175363EA38DED28",
          "NewFields": {
            "Account": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
            "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E125486AFA57980",
            "Sequence": 156917177,
            "TakerGets": "35992000000",
            "TakerPays": {
              "currency": "USD",
              "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
              "value": "18570.025718376"
            }
          }
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "ExchangeRate": "4e12547b29376a80",
            "Flags": 0,
            "PreviousTxnID": "D4CB92E19CBADB14F82B0E0703B3F157338253EE1DD46DB91F6C98C93D01DA9C",
            "PreviousTxnLgrSeq": 91826201,
            "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E12547B29376A80",
            "TakerGetsCurrency": "0000000000000000000000000000000000000000",
            "TakerGetsIssuer": "0000000000000000000000000000000000000000",
            "TakerPaysCurrency": "0000000000000000000000005553440000000000",
            "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E12547B29376A80"
        }
      },
      {
        "CreatedNode": {
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E125486AFA57980",
          "NewFields": {
            "ExchangeRate": "4e125486afa57980",
            "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E125486AFA57980",
            "TakerPaysCurrency": "0000000000000000000000005553440000000000",
            "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230"
          }
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "Account": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
            "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E12547B29376A80",
            "BookNode": "0",
            "Flags": 0,
            "OwnerNode": "0",
            "PreviousTxnID": "D4CB92E19CBADB14F82B0E0703B3F157338253EE1DD46DB91F6C98C93D01DA9C",
            "PreviousTxnLgrSeq": 91826201,
            "Sequence": 156917168,
            "TakerGets": "35992000000",
            "TakerPays": {
              "currency": "USD",
              "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
              "value": "18569.847557976"
            }
          },
          "LedgerEntryType": "Offer",
          "LedgerIndex": "F72F9E5C9C81C6D2403C062365B34AA371D5D0BB13E1787622E936D0B8B4A499"
        }
      }
    ],
    "TransactionIndex": 23,
    "TransactionResult": "tesSUCCESS"
  },
  "type": "transaction",
  "validated": true,
  "status": "closed",
  "close_time_iso": "2024-11-01T23:31:00Z",
  "ledger_index": 91826203,
  "ledger_hash": "746D115326E08B884D7EA5F0E379272774F1B41443C000044D5DF97781E0601D",
  "hash": "2250BB2914AC7BC143AD62E7DD36F23A22F2BC50495FC29B36C6B0CA570BB4FA",
  "engine_result_code": 0,
  "engine_result": "tesSUCCESS",
  "engine_result_message": "The transaction was applied. Only final in a validated ledger."
}
```

オーダーブックストリームメッセージの形式は、[トランザクションストリームメッセージ](#トランザクションストリーム)と同様ですが、`OfferCreate`トランザクションに以下のフィールドも含まれている点が異なります。

| フィールド                | 値     | 説明 |
| :------------------------ | :----- | ---- |
| `transaction.owner_funds` | 文字列 | このOfferCreateトランザクションを送信する`Account`が、このトランザクション実行後に有する`TakerGets`通貨の金額。この通貨額が[フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)されているかどうかはチェックされません。<br>[API v2][]では`tx_json.owner_funds`に変更されました。 |


## Book Changesストリーム

`book_changes`ストリームは、新しいレジャーが検証されると`bookChanges`メッセージを送信します。このメッセージには、そのレジャーで分散型取引所で発生したすべてのオーダーブックの変更の概要が含まれています。

例 `bookChanges`メッセージ:

```json
{
  "type": "bookChanges",
  "ledger_index": 88530525,
  "ledger_hash": "E2F24290E1714C842D34A1057E6D6B7327C7DDD310263AFBC67CA8EFED7A331B",
  "ledger_time": 771099232,
  "changes": [
    {
      "currency_a": "XRP_drops",
      "currency_b": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/USD",
      "volume_a": "23020993",
      "volume_b": "11.51049687275246",
      "high": "1999999.935232603",
      "low": "1999999.935232603",
      "open": "1999999.935232603",
      "close": "1999999.935232603"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rRbiKwcueo6MchUpMFDce9XpDwHhRLPFo/43525950544F0000000000000000000000000000",
      "volume_a": "28062",
      "volume_b": "0.000643919229004",
      "high": "43580000.00000882",
      "low": "43580000.00000882",
      "open": "43580000.00000882",
      "close": "43580000.00000882"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rcEGREd8NmkKRE8GE424sksyt1tJVFZwu/5553444300000000000000000000000000000000",
      "volume_a": "147797392",
      "volume_b": "70.41143840513008",
      "high": "2099053.724049922",
      "low": "2099053.724049922",
      "open": "2099053.724049922",
      "close": "2099053.724049922"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rcRzGWq6Ng3jeYhqnmM4zcWcUh69hrQ8V/LTC",
      "volume_a": "350547165",
      "volume_b": "2.165759976556748",
      "high": "162573356.3100158",
      "low": "160134763.7403094",
      "open": "162573356.3100158",
      "close": "160134763.7403094"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL/BTC",
      "volume_a": "352373535",
      "volume_b": "0.00249291478138912",
      "high": "1413500174054660e-4",
      "low": "1413499999999996e-4",
      "open": "1413500174054660e-4",
      "close": "1413499999999996e-4"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rcvxE9PS9YBwxtGg1qNeewV6ZB3wGubZq/5553445400000000000000000000000000000000",
      "volume_a": "8768045",
      "volume_b": "4.193604075536",
      "high": "2090813.734932601",
      "low": "2090813.734932601",
      "open": "2090813.734932601",
      "close": "2090813.734932601"
    },
    {
      "currency_a": "XRP_drops",
      "currency_b": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/USD",
      "volume_a": "28113",
      "volume_b": "0.013405652999",
      "high": "2097100.380123005",
      "low": "2097100.380123005",
      "open": "2097100.380123005",
      "close": "2097100.380123005"
    },
    {
      "currency_a": "r3dVizzUAS3U29WKaaSALqkieytA2LCoRe/58434F5245000000000000000000000000000000",
      "currency_b": "rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D/434F524500000000000000000000000000000000",
      "volume_a": "75.626516003375",
      "volume_b": "63.022096669479",
      "high": "1.200000000000003",
      "low": "1.200000000000003",
      "open": "1.200000000000003",
      "close": "1.200000000000003"
    },
    {
      "currency_a": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/CNY",
      "currency_b": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/USD",
      "volume_a": "83.9115222024",
      "volume_b": "11.51049687275",
      "high": "7.290000000004561",
      "low": "7.290000000004561",
      "open": "7.290000000004561",
      "close": "7.290000000004561"
    },
    {
      "currency_a": "rcRzGWq6Ng3jeYhqnmM4zcWcUh69hrQ8V/LTC",
      "currency_b": "rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL/BTC",
      "volume_a": "0.64167647147626",
      "volume_b": "0.00073047551165797",
      "high": "878.4366638381051",
      "low": "878.4366638381051",
      "open": "878.4366638381051",
      "close": "878.4366638381051"
    },
    {
      "currency_a": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/USD",
      "currency_b": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/USD",
      "volume_a": "0.013432464305",
      "volume_b": "0.013566788948",
      "high": "0.9900990099046391",
      "low": "0.9900990099046391",
      "open": "0.9900990099046391",
      "close": "0.9900990099046391"
    }
  ]
}
```

[Book Changes]ストリームメッセージのフィールドは以下のとおりです:

| フィールド     | 値                      | 説明 |
|:---------------|:-------------------------|:-----|
| `type`         | 文字列                   | 値`bookChanges`は、これがBook Changesストリームからのものであることを示します。 |
| `ledger_index` | [レジャーインデックス][] | これらの変更を含むレジャーのレジャーインデックス。 |
| `ledger_hash`  | [ハッシュ][]             | これらの変更を含むレジャーの識別用ハッシュ。 |
| `ledger_time`  | 数値                     | これらの変更を含むレジャーの公式的な閉鎖時刻。[リップルエポック](../../../../concepts/ledgers/index.md#ripple-epoch)からの秒数。 |
| `changes`      | 配列                     | [Book Update Objects](../path-and-order-book-methods/book_changes.md#book-update-objects)のリスト。このレジャーバージョンで更新された各オーダーブックに対して1つのエントリが含まれます。オーダーブックが更新されなかった場合、配列は空です。 |


## コンセンサスストリーム

`consensus`ストリームは、[コンセンサスプロセス](../../../../concepts/consensus-protocol/index.md)でフェーズが変更されると、`consensusPhase`メッセージを送信します。このメッセージには、サーバで実行されているコンセンサスの新しいフェーズが含まれます。

```json
{
  "type": "consensusPhase",
  "consensus": "accepted"
}
```

コンセンサスストリームメッセージのフィールドは次のとおりです。

| フィールド  | 型     | 説明 |
| :---------- | :----- | ---- |
| `type`      | 文字列 | `consensusPhase`は、このメッセージがコンセンサスストリームからのものであることを示します。 |
| `consensus` | 文字列 | サーバで実行されている新しいコンセンサスフェーズ。値には、`open`、`establish`、`accepted`などがあります。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
