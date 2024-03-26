---
html: response-formatting.html
parent: api-conventions.html
seo:
    description: WebSocket、JSON-RPC、コマンドラインインターフェイスのレスポンスのフォーマットとそのレスポンスに含まれるフィールド。
---
# レスポンスのフォーマット

`rippled` APIからのレスポンスのフォーマットは、メソッドが呼び出されたインターフェイス（WebSocket、JSON-RPC、コマンドライン）に応じて多少異なります。コマンドラインインターフェイスがJSON-RPCを呼び出すため、コマンドラインインターフェイスとJSON-RPCインターフェイスは同じフォーマットを使用します。

成功した場合のレスポンスに含まれるフィールドは、以下の通りです。

| `Field`         | 型     | 説明                                     |
|:----------------|:---------|:------------------------------------------------|
| `id`            | （場合により異なる） | （WebSocketのみ）このレスポンスのリクエスト元となったリクエストで指定されているID。 |
| `status`        | 文字列   | （WebSocketのみ）値が`success`である場合、リクエストがサーバによって正常に受信され、理解されたことを示します。 |
| `result.status` | 文字列   | （JSON-RPCおよびコマンドライン）値が`success`である場合、リクエストがサーバによって正常に受信され、理解されたことを示します。 |
| `type`          | 文字列   | （WebSocketのみ）値が`response`の場合、コマンドに対する正常なレスポンスであることを示します。[非同期の通知](../public-api-methods/subscription-methods/subscribe.md)では、`ledgerClosed`や`transaction`など異なる値が使用されます。 |
| `result`        | オブジェクト   | クエリーの結果。内容はコマンドによって異なります。 |


## 成功した場合のレスポンスの例

{% tabs %}

{% tab label="WebSocket" %}
```
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
```
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
```
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
