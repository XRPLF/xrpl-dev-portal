---
html: response-formatting.html
parent: api-conventions.html
seo:
    description: WebSocket、JSON-RPC、コマンドラインインターフェイスのレスポンスのフォーマットとそのレスポンスに含まれるフィールド。
---
# レスポンスのフォーマット

`xrpld`APIからのレスポンスのフォーマットは、メソッドが呼び出されたインターフェイス（WebSocket、JSON-RPC、コマンドライン）に応じて多少異なります。コマンドラインインターフェイスがJSON-RPCを呼び出すため、コマンドラインインターフェイスとJSON-RPCインターフェイスは同じフォーマットを使用します。

成功した場合のレスポンスに含まれるフィールドは、以下の通りです。

{% tabs %}
{% tab label="WebSocket" %}
| フィールド        | 型                 | 必須？ | 説明 |
|:----------------|:-------------------|:------|------|
| `status`        | 文字列              | はい   | 値が`success`である場合、リクエストがサーバによって正常に受信され、理解されたことを示します。一部の[クライアントライブラリ](../../client-libraries.md)では、成功時にこのフィールドが省略されます。 |
| `type`          | 文字列              | はい   | 値が`response`の場合、APIリクエストに対する直接のレスポンスであることを示します。[非同期の通知](../public-api-methods/subscription-methods/subscribe.md)では、`ledgerClosed`や`transaction`など異なる値が使用されます。 |
| `result`        | オブジェクト         | はい   | クエリーの結果。内容はAPIメソッドによって異なります。 |
| `id`            | （場合により異なる） | いいえ | このレスポンスの元になったリクエストで指定された任意のID。リクエストでIDが指定されていない場合は省略されます。 |
| `warning`       | 文字列              | いいえ | このフィールドが存在する場合、値は文字列`load`です。これは、サーバがこのクライアントを切断する[レートリミット](rate-limiting.md)の閾値に、クライアントが近づいていることを意味します。 |
| `warnings`      | 配列                | いいえ | このフィールドが存在する場合、重要な警告を含む1つ以上の**Warningsオブジェクト**が含まれます。詳細については、[APIの警告](#apiの警告)を参照してください。 |
| `forwarded`     | 真偽値              | いいえ | `true`の場合、リクエストにClioでは利用できないデータが必要なため、このリクエストとレスポンスはClioサーバからP2Pモードサーバに転送され（て戻され）ています。デフォルトは`false`です。 |
{% /tab %}
{% tab label="JSON-RPC" %}
| フィールド        | 型          | 必須？ | 説明 |
|:----------------|:------------|:------|------|
| `result`        | オブジェクト  | はい   | クエリーの結果。内容はコマンドによって異なります。 |
| `result.status` | 文字列       | はい   | 値が`success`である場合、リクエストがサーバによって正常に受信され、理解されたことを示します。一部の[クライアントライブラリ](../../client-libraries.md)では、成功時にこのフィールドが省略されます。 |
| `warning`       | 文字列       | いいえ | このフィールドが存在する場合、値は文字列`load`です。これは、サーバがこのクライアントを切断する[レートリミット](rate-limiting.md)の閾値に、クライアントが近づいていることを意味します。 |
| `warnings`      | 配列         | いいえ | このフィールドが存在する場合、重要な警告を含む1つ以上の**Warningsオブジェクト**が含まれます。詳細については、[APIの警告](#apiの警告)を参照してください。 |
| `forwarded`     | 真偽値       | いいえ | `true`の場合、リクエストにClioでは利用できないデータが必要なため、このリクエストとレスポンスはClioサーバからP2Pモードサーバに転送され（て戻され）ています。デフォルトは`false`です。 |
{% /tab %}
{% /tabs %}


## 成功した場合のレスポンスの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "27389517749",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 18,
      "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
      "PreviousTxnLgrSeq": 6592159,
      "Sequence": 1400,
      "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
    },
    "ledger_index": 6760970
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
HTTP Status: 200 OK

{
   "result": {
       "account_data": {
           "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "Balance": "27389517749",
           "Flags": 0,
           "LedgerEntryType": "AccountRoot",
           "OwnerCount": 18,
           "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
           "PreviousTxnLgrSeq": 6592159,
           "Sequence": 1400,
           "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
       },
       "ledger_index": 6761012,
       "status": "success"
   }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
   "result": {
       "account_data": {
           "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "Balance": "27389517749",
           "Flags": 0,
           "LedgerEntryType": "AccountRoot",
           "OwnerCount": 18,
           "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
           "PreviousTxnLgrSeq": 6592159,
           "Sequence": 1400,
           "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
       },
       "ledger_index": 6761012,
       "status": "success"
   }
}
```
{% /tab %}

{% /tabs %}


## APIの警告

レスポンスに`warnings`の配列が含まれる場合、その配列の各要素はサーバからの個別の警告を表します。このような**警告オブジェクト**はそれぞれ以下のフィールドを含みます：

| フィールド  | 型         | 説明                                                     |
|:----------|:-----------|:--------------------------------------------------------|
| `id`      | 数値        | この警告メッセージの一意の数値コード。                        |
| `message` | 文字列      | このメッセージの原因を説明する人間が読める文字列。このメッセージの内容に依存するようなソフトウェアを書かないでください。代わりに`id`(および`details`(もしあれば))を使って警告を識別してください。 |
| `details` | オブジェクト | _(省略可)_ この警告に関する追加情報。内容は警告の種類によって異なります。 |

以下の資料では、考えられるすべての警告について説明しています。

### 1001. Unsupported amendments have reached majority

警告の例:

```json
"warnings" : [
  {
    "details" : {
      "expected_date" : 864030,
      "expected_date_UTC" : "2000-Jan-11 00:00:30.0000000 UTC"
    },
    "id" : 1001,
    "message" : "One or more unsupported amendments have reached majority. Upgrade to the latest version before they are activated to avoid being amendment blocked."
  }
]
```

この警告は、XRP Ledgerプロトコルの1つ以上の[Amendment](../../../concepts/networks-and-servers/amendments.md)が有効になる予定であるが、現在のサーバにはそれらのAmendmentの実装がないことを示しています。これらのAmendmentが有効になると、現在のサーバは[Amendmentブロック](../../../concepts/networks-and-servers/amendments.md#amendment-blocked)されるため、できるだけ早く[最新の`xrpld`バージョンにアップグレード](../../../infrastructure/installation/index.md)する必要があります。

サーバがこの警告を送信するのは、クライアントが[管理者として接続している](/docs/tutorials/get-started/get-started-http-websocket-apis.md#admin-access)場合のみです。

この警告には、以下のフィールドを含む`details`フィールドが含まれます。

| フィールド            | 型     | 説明                                           |
|:--------------------|:-------|:----------------------------------------------|
| `expected_date`     | 数値    | サポートされていない最初のAmendmentが有効になると予想される時刻([Rippleエポック以降の経過秒数][])。|
| `expected_date_UTC` | 文字列  | サポートされていない最初のAmendmentが有効になると予想される時刻(UTCでのタイムスタンプ)。 |

レジャーのクローズ時間の変動により、これらはおおよその時刻となります。また、指定された時刻までにAmendmentが80%以上のバリデータからサポートされ続けない場合、Amendmentが有効にならず、期待された時刻にAmendmentが有効にならない可能性があります。サポートされていないAmendmentが有効にならない限り、サーバはAmendmentブロックされません。


### 1002. This server is amendment blocked

警告の例:

```json
"warnings" : [
  {
    "id" : 1002,
    "message" : "This server is amendment blocked, and must be updated to be able to stay in sync with the network."
  }
]
```

この警告は、サーバが[Amendmentブロック](../../../concepts/networks-and-servers/amendments.md#amendment-blocked)され、XRP Ledgerとの同期を維持できなくなったことを示しています。

サーバの管理者は、アクティブ化されたAmendmentをサポートするバージョンに[`xrpld`をアップグレード](../../../infrastructure/installation/index.md)する必要があります。

### 2001. This is a clio server

警告の例:

```json
"warnings": [
  {
    "id": 2001,
    "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
  }
]
```

この警告は、リクエストに応答したサーバがClioサーバであり、ピアツーピアネットワークに直接アクセスできないことを示しています。一部のAPIメソッドは動作が異なったり、追加の情報を含んだりすることがあります。また、検証されていないデータが必要なリクエストは、ピアツーピアサーバに転送されます。

一般的に、この警告は無視しても安全です。

{% admonition type="warning" name="注意" %}明示的に[レジャーバージョンを指定][レジャーの指定]せずにレジャーデータをリクエストすると、Clioはデフォルトで、処理中の現在のレジャーではなく最新の検証済みレジャーを使用します。{% /admonition %}


## 関連項目

- [リクエストのフォーマット](request-formatting.md)
- [エラーのフォーマット](error-formatting.md): APIレスポンスの失敗
- **コンセプト:**
    - [`xrpld`サーバ](../../../concepts/networks-and-servers/index.md)
    - [コンセンサス](../../../concepts/consensus-protocol/index.md)
    - [Amendment](../../../concepts/networks-and-servers/amendments.md)
        - [既知のAmendment](/resources/known-amendments.md)
- **チュートリアル:**
    - [XRP LedgerのAPIを触ってみよう](/docs/tutorials/get-started/get-started-http-websocket-apis.md)
    - [`xrpld`のインストールと更新](../../../infrastructure/installation/index.md)
- **リファレンス:**
    - [featureメソッド][]
    - [server_infoメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
