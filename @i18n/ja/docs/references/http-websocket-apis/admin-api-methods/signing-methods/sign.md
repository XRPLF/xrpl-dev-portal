---
html: sign.html # watch for clashes w/ this filename
parent: signing-methods.html
seo:
    description: トランザクションの署名済みバイナリー表現を返します。
labels:
  - トランザクション送信
---
# sign
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/SignHandler.cpp "ソース")

`sign`メソッドは[JSONフォーマットのトランザクション](../../../protocol/transactions/index.md)と[シード値](../../../../concepts/accounts/cryptographic-keys.md)を受け取り、トランザクションの署名済みバイナリー表現を返します。[マルチシグトランザクション](../../../../concepts/accounts/multi-signing.md)に署名を付与する場合は、代わりに[sign_forメソッド][]を使用します。

{% partial file="/@i18n/ja/docs/_snippets/public-signing-note.md" /%}


**注意:** 独自の`rippled`サーバを運用している場合を除き、このコマンドを使用するのではなく、[クライアントライブラリ](../../../client-libraries.md)を実行してください。詳細については[安全な署名の設定](../../../../concepts/transactions/secure-signing.md)をご覧ください。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "sign",
  "tx_json" : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : {
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   "secret" : "s████████████████████████████",
   "offline": false,
   "fee_mult_max": 1000
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "sign",
    "params": [
        {
            "offline": false,
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": "1"
                },
                "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "TransactionType": "Payment"
            },
            "fee_mult_max": 1000
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: sign secret tx_json [offline]
rippled sign s████████████████████████████ '{"TransactionType": "Payment", "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "Amount": { "currency": "USD", "value": "1", "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn" }, "Sequence": 360, "Fee": "10000"}' offline
```
{% /tab %}

{% /tabs %}

トランザクションに署名するには、[トランザクションを承認](../../../../concepts/transactions/index.md#トランザクションの承認)できるシークレットキーを提供する必要があります。通常、サーバが秘密鍵を取得するシード値を提供します。これを行うには、以下の方法があります。

* `secret`フィールドにシードを指定し、`key_type`フィールドを省略します。この値は、XRP Ledgerの[base58][]シード、RFC-1751、16進値のフォーマットで記述するか、文字列パスフレーズとして記述します（secp256k1キーのみ）。
* `key_type`値と、`seed`、`seed_hex`、または`passphrase`のいずれか1つを提供します。`secret`フィールドは省略します。（コマンドライン構文ではサポートされません）。

リクエストには以下のパラメーターが含まれます。

| `Field`        | 型      | 説明                                              |
|:---------------|:--------|:--------------------------------------------------|
| `tx_json` | オブジェクト | JSONフォーマットの[トランザクション定義](../../../protocol/transactions/index.md) |
| `secret` | 文字列 | _（省略可）_ トランザクションを提供するアカウントの秘密シード。トランザクションへの署名に使用されます。信頼できないサーバに対して、またはセキュリティが確保されていないネットワーク接続を通じて機密情報を送信しないでください。`key_type`、`seed`、`seed_hex`、`passphrase`と同時に使用することはできません。 |
| `seed` | 文字列 | _（省略可）_ トランザクションを提供するアカウントの秘密シード。トランザクションへの署名に使用されます。XRP Ledgerの[base58][]フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed_hex`、`passphrase`と同時に使用することはできません。 |
| `seed_hex` | 文字列 | _（省略可）_ トランザクションを提供するアカウントの秘密シード。トランザクションへの署名に使用されます。16進フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`passphrase`と同時に使用することはできません。 |
| `passphrase` | 文字列 | _（省略可）_ トランザクションを提供するアカウントの秘密シード。文字列パスフレーズとして、トランザクションへの署名に使用されます。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`seed_hex`と同時に使用することはできません。 |
| `key_type` | 文字列 | _（省略可）_ 指定された暗号化キーペアの[署名アルゴリズム](../../../../concepts/accounts/cryptographic-keys.md#署名アルゴリズム)。有効な種類は、`secp256k1`または`ed25519`です。デフォルトは`secp256k1`です。`secret`と同時に使用することはできません。 |
| `offline` | ブール値 | _（省略可）_ `true`の場合は、トランザクションの生成時に、トランザクションの詳細を[自動入力](#自動入力可能なフィールド)しないでください。デフォルトは`false`です。 |
| `build_path` | ブール値 | _（省略可）_ Payment型のトランザクションに対して指定した場合、署名前に`Paths`フィールドが自動で入力されます。**注意:** サーバは、このフィールドの値ではなく、このフィールドが存在するかどうかを調べます。この動作は変更される可能性があります。 |
| `fee_mult_max` | 整数 | _（省略可）_[自動的に提供される`Fee`フィールド](../../../protocol/transactions/common-fields.md#自動入力可能なフィールド)の上限値を設定します。現在の[トランザクションコストの負荷の乗数](../../../../concepts/transactions/transaction-cost.md#ローカル負荷コスト)が（`fee_mult_max` ÷ `fee_div_max`）よりも大きい場合、署名は`rpcHIGH_FEE`エラーで失敗します。トランザクションの`Fee`フィールド（[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)）を指定した場合は無視されます。デフォルトは`10`です。 |
| `fee_div_max` | 整数 | _（省略可）_ 現在の[トランザクションコストの負荷の乗数](../../../../concepts/transactions/transaction-cost.md#ローカル負荷コスト)が（`fee_mult_max` ÷ `fee_div_max`）よりも大きい場合、署名は`rpcHIGH_FEE`エラーで失敗します。トランザクションの`Fee`フィールド（[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)）を指定した場合は無視されます。デフォルトは`1`です。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.1" %}新規: rippled 0.30.1{% /badge %} |

### 自動入力可能なフィールド

`tx_json`（[トランザクションオブジェクト](../../../protocol/transactions/index.md)）の特定のフィールドを省略すると、サーバは自動的に入力しようとします。リクエストの`offline`を`true`と指定しない限り、サーバは署名前に以下のフィールドを提供します。

* `Sequence` - サーバは、送信者のアカウント情報にある次のシーケンス番号を自動的に使用します。
  * **注意:** アカウントの次のシーケンス番号は、このトランザクションが適用されるまで増分されません。トランザクションの送信および個々のトランザクションへのレスポンスを待たずに複数のトランザクションに署名する場合は、最初のトランザクション以降の各トランザクションについて、正しいシーケンス番号を手動で提供する必要があります。
* `Fee` - `Fee`パラメーターを省略した場合、サーバは適切なトランザクションコストを自動的に入力しようとします。本番環境のXRP Ledgerでは、適切な`fee_mult_max`値を提供しない限り、この処理は`rpcHIGH_FEE`エラーで失敗します。
  * `fee_mult_max`パラメーターと`fee_div_max`パラメーターは、[リファレンストランザクションコスト](../../../../concepts/transactions/transaction-cost.md#referenceトランザクションコスト)に適用される負荷スケーリング乗数によって、自動的に提供されるトランザクションコストの上限値を設定します。デフォルト設定では、自動的に提供される値が10×の乗数より大きい場合、エラーが返されます。ただし、本番環境のXRP Ledgerでは、[1000×の負荷乗数を使用することが一般的](../../../../concepts/transactions/transaction-cost.md#現在のトランザクションコスト)です。
  * コマンドライン構文では、`fee_mult_max`および`fee_div_max`はサポートされません。本番環境のXRP Ledgerの場合は、`Fee`値を提供する必要があります。
  * **注意:** 悪意のあるサーバは、`fee_mult_max`や`fee_div_max`の値を無視して、きわめて大きなトランザクションコストを指定するおそれがあります。
* `Paths` - Payment型のトランザクションの場合（XRP間の移動を除く）、Pathsフィールドは、[ripple_path_findメソッド][]を使用した場合と同様に自動的に入力できます。`build_path`を指定した場合のみ入力されます。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "tx_blob": "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F858081144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Amount": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      },
      "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Fee": "10000",
      "Flags": 2147483648,
      "Sequence": 360,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "Payment",
      "TxnSignature": "304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F8580",
      "hash": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0"
    }
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "status": "success",
        "tx_blob": "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F858081144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Amount": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "1"
            },
            "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Fee": "10000",
            "Flags": 2147483648,
            "Sequence": 360,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "Payment",
            "TxnSignature": "304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F8580",
            "hash": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0"
        }
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210094D24C795CFFA8E46FE338AF63421DA5CE5E171ED56F8E4CE70FFABA15D3CFA2022063994C52BF0393C8157EBFFCDE6A7E7EDC7B16A462CA53214F64CC8FCBB5E54A81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Amount" : {
            "currency" : "USD",
            "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "value" : "1"
         },
         "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
         "Fee" : "10000",
         "Flags" : 2147483648,
         "Sequence" : 360,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "Payment",
         "TxnSignature" : "304502210094D24C795CFFA8E46FE338AF63421DA5CE5E171ED56F8E4CE70FFABA15D3CFA2022063994C52BF0393C8157EBFFCDE6A7E7EDC7B16A462CA53214F64CC8FCBB5E54A",
         "hash" : "DE80DA6FF9F93FE4CE87C99441F403E0290E35867FF48382204CB89975BF343E"
      }
   }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`   | 型     | 説明                                                    |
|:----------|:-------|:--------------------------------------------------------|
| `tx_blob` | 文字列 | 正しく作成された署名済みトランザクションの16進バイナリー表現 |
| `tx_json` | オブジェクト | 自動的に入力されたフィールドを含む、署名済み[トランザクション全体](../../../protocol/transactions/index.md)のJSON仕様 |

**注意:** このコマンドの結果としてエラーメッセージが表示された場合は、リクエストで指定されたシークレット値がメッセージの中に含まれている可能性があります。これらのエラーが他者から見えない状態であることを確認してください。

* このエラーは、複数の人物が参照できるログファイルに書き込まないでください。
* デバッグを目的として、誰でも参照できる場所にこのエラーを貼り付けないでください。
* このエラーメッセージは、誤ってWebサイトに表示しないようにしてください。

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `highFee` - トランザクションコストに適用される現在の負荷乗数が、自動的に提供されるトランザクションコストの上限を超えています。リクエストで指定する`fee_mult_max`を大きくするか（1000以上）、`tx_json`の`Fee`フィールドに値を手動で指定します。
* `tooBusy` - トランザクションにパスが含まれていませんが、サーバがビジーであるため、パス検出処理をすぐに実行できません。管理者として接続している場合は発生しません。
* `noPath` - トランザクションにパスが含まれておらず、サーバは、このペイメントの発生経路となるパスを検出できませんでした。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
