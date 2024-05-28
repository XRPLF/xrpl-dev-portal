---
html: response-formatting.html
parent: api-conventions.html
seo:
    description: WebSocket、JSON-RPC、コマンドラインインターフェイスのレスポンスのフォーマットとそのレスポンスに含まれるフィールド。
---
# レスポンスのフォーマット

`rippled`APIからのレスポンスのフォーマットは、メソッドが呼び出されたインターフェイス（WebSocket、JSON-RPC、コマンドライン）に応じて多少異なります。コマンドラインインターフェイスがJSON-RPCを呼び出すため、コマンドラインインターフェイスとJSON-RPCインターフェイスは同じフォーマットを使用します。

成功した場合のレスポンスに含まれるフィールドは、以下の通りです。

| `Field`         | 型         | 説明                                            |
|:----------------|:-----------|:------------------------------------------------|
| `id`            | （場合により異なる） | （WebSocketのみ）このレスポンスのリクエスト元となったリクエストで指定されているID。    |
| `status`        | 文字列      | （WebSocketのみ）値が`success`である場合、リクエストがサーバによって正常に受信され、理解されたことを示します。 |
| `result.status` | 文字列      | （JSON-RPCおよびコマンドライン）値が`success`である場合、リクエストがサーバによって正常に受信され、理解されたことを示します。 |
| `type`          | 文字列      | （WebSocketのみ）値が`response`の場合、コマンドに対する正常なレスポンスであることを示します。[非同期の通知](../public-api-methods/subscription-methods/subscribe.md)では、`ledgerClosed`や`transaction`など異なる値が使用されます。 |
| `result`        | オブジェクト | クエリーの結果。内容はコマンドによって異なります。 |
| `warning`       | 文字列      | _(省略可)_ このフィールドが存在する場合、値は文字列`load`です。これはクライアントがサーバがこのクライアントを切断する[レートリミット](rate-limiting.md)の閾値に近づいていることを意味します。 |
| `warnings`      | 配列        | _(省略可)_ このフィールドが存在する場合、重要な警告を含む1つ以上の**Warningsオブジェクト**が含まれます。詳細については、[API警告](#apiの警告)をご覧ください。 |
| `forwarded`     | 真偽値      | _(省略可)_ `true`の場合、このリクエストとレスポンスは[レポートモード][]サーバからP2Pモードサーバに転送されます。デフォルトは`false`です。 |


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

この警告は、XRP Ledgerプロトコルの1つ以上の[Amendment](../../../concepts/networks-and-servers/amendments.md)が有効になる予定であるが、現在のサーバにはそれらのAmendmentの実装がないことを示しています。これらのAmendmentが有効になると、現在のサーバは[Amendmentブロック](../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers)されるため、できるだけ早く[最新の`rippled`バージョンにアップグレード](../../../infrastructure/installation/index.md)する必要があります。

サーバは、この警告を送信するのは、クライアントが[管理者として接続している](../../../tutorials/http-websocket-apis/build-apps/get-started.md#admin-access)場合のみです。

この警告には、以下のフィールドを含む`details`フィールドが含まれます。

| フィールド            | 型     | 説明                                           |
|:--------------------|:-------|:----------------------------------------------|
| `expected_date`     | 数値    | サポートされていない最初のAmendmentが有効になると予想される時刻([リップルエポックからの秒数][])。|
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

この警告は、サーバが[Amendmentブロック](../../../concepts/networks-and-servers/amendments.md)され、同期を取ることができなくなったことを示しています。

サーバの管理者は、アクティブ化されたAmendmentをサポートするバージョンに[`rippled`をアップグレード](../../../infrastructure/installation/index.md)する必要があります。

### 1003. This is a reporting server

警告の例:

```json
"warnings" : [
  {
    "id" : 1003,
    "message" : "This is a reporting server. The default behavior of a reporting server is to only return validated data. If you are looking for not yet validated data, include \"ledger_index : current\" in your request, which will cause this server to forward the request to a p2p node. If the forward is successful the response will include \"forwarded\" : \"true\""
  }
]
```

この警告は、リクエストに応答するサーバが[レポートモード][]で実行されていることを示しています。レポートモードはピアツーピアネットワークに接続せず、まだ検証されていないレジャーデータを追跡しないため、一部のAPIメソッドが利用できないか、異なる動作をすることがあります。

一般的に、この警告は無視しても安全です。

**注意:** レポートモードで検証されていないデータをリクエストする場合、明示的に[レジャーバージョンを指定][レジャーの指定]しない限り、レポートモードはデフォルトで最新の検証済みレジャーを使用します。


## 関連項目

- [リクエストのフォーマット](request-formatting.md)
- [エラーのフォーマット](error-formatting.md): APIレスポンスの失敗
- **コンセプト:**
    - [`rippled`サーバ](../../../concepts/networks-and-servers/index.md)
    - [コンセンサス](../../../concepts/consensus-protocol/index.md)
    - [Amendment](../../../concepts/networks-and-servers/amendments.md)
        - [既知のAmendment](/resources/known-amendments.md)
- **チュートリアル:**
    - [XRP LedgerのAPIを触ってみよう](../../../tutorials/http-websocket-apis/build-apps/get-started.md)
    - [`rippled`のインストールと更新](../../../infrastructure/installation/index.md)
- **リファレンス:**
    - [featureメソッド][]
    - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
