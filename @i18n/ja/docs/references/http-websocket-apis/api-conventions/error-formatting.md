---
html: error-formatting.html
parent: api-conventions.html
seo:
    description: WebSocket、JSON-RPC、コマンドラインインターフェイスのエラーフォーマットと汎用エラーコードです。
---
# エラーのフォーマット

エラーが発生する可能性のある状況をすべて挙げることは不可能です。トランスポートレイヤーで発生する場合（ネットワーク接続が失われる場合など）には、使用しているクライアントとトランスポートに応じてその結果は異なります。ただし、`rippled`サーバがリクエストを正常に受信した場合、サーバは標準のエラー形式でのレスポンスを試みます。

**注意:** リクエストの結果がエラーになった場合、レスポンスの一部としてリクエスト全体がコピーされます。このため、エラーのデバッグに取り組むことができます。ただし、これにはリクエストで渡した機密情報がすべて含まれます。エラーメッセージを共有するときには、アカウントの重要な機密情報を他のユーザに誤って公開することがないように、十分に注意してください。


エラーの例:

{% tabs %}

{% tab label="WebSocket" %}
```
{
  "id": 3,
  "status": "error",
  "type": "response",
  "error": "ledgerIndexMalformed",
  "request": {
    "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "command": "account_info",
    "id": 3,
    "ledger_index": "-",
    "strict": true
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```
HTTP Status: 200 OK
{
    "result": {
        "error": "ledgerIndexMalformed",
        "request": {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "command": "account_info",
            "ledger_index": "-",
            "strict": true
        },
        "status": "error"
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```
{
    "result": {
        "error": "ledgerIndexMalformed",
        "request": {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "command": "account_info",
            "ledger_index": "-",
            "strict": true
        },
        "status": "error"
    }
}
```
{% /tab %}

{% /tabs %}


## WebSocketフォーマット

| `Field`   | 型       | 説明                                                  |
|:----------|:---------|:------------------------------------------------------|
| `id` | （場合により異なる） | このレスポンスのリクエスト元となったWeb Socketリクエストに指定されていたID |
| `status` | 文字列 | `"error"`: リクエストが原因でエラーが発生した場合 |
| `type` | 文字列 | 通常は`"response"`。これは、コマンドに対し正常にレスポンスしたことを示します。 |
| `error` | 文字列 | 発生したエラータイプの一意のコード。 |
| `request` | オブジェクト | このエラーが発生したリクエストのコピー（JSONフォーマット）。**注意:** リクエストにアカウントの機密情報が含まれている場合、ここにコピーされます。 |


## JSON-RPCフォーマット

一部のJSON-RPCリクエストは、HTTPレイヤーでエラーコードでレスポンスします。この場合、レスポンスはレスポンス本文にプレーンテキストで記述されます。たとえば`method`パラメーターでコマンドを指定し忘れた場合、レスポンスは次のようになります。

```
HTTP Status: 400 Bad Request
Null method
```

HTTPステータスコード200 OKが返されるその他のエラーの場合、レスポンスはJSONフォーマットで、以下のフィールドが使用されます。

| `Field`          | 型     | 説明                                             |
|:-----------------|:-------|:-------------------------------------------------|
| `result` | オブジェクト | クエリーに対するレスポンスが含まれているオブジェクト |
| `result.error` | 文字列 | 発生したエラータイプの一意のコード。 |
| `result.status` | 文字列 | `"error"`: リクエストが原因でエラーが発生した場合 |
| `result.request` | オブジェクト | このエラーが発生したリクエストのコピー（JSONフォーマット）。**注意:** リクエストにアカウントの機密情報が含まれている場合、ここにコピーされます。**注記:** 発行されるリクエストにかかわらず、リクエストはWebSocketフォーマットに再設定されます。 |


## 汎用エラー

すべてのメソッドは、以下のいずれかの値の`error`コードを返す可能性があります。

* `unknownCmd` - リクエストに、`rippled`サーバが認識する[コマンド](../index.md)が含まれていません。
* `jsonInvalid` -（WebSocketのみ）リクエストは適切なJSONオブジェクトではありません。
  * この場合JSON-RPCは、代わりに400 Bad Request HTTPエラーを返します。
* `missingCommand` -（WebSocketのみ）リクエストに`command`フィールドが指定されていませんでした。
  * この場合JSON-RPCは、代わりに400 Bad Request HTTPエラーを返します。
* `tooBusy` - サーバの負荷が高すぎるため、現在このコマンドを実行できません。管理者として接続している場合は、通常このエラーが返されることはありません。
* `noNetwork` - サーバとXRP Ledgerピアツーピアネットワークのその他の部分との接続で問題が発生しています（サーバがスタンドアロンモードで実行されていません）。
* `noCurrent` - 高い負荷、ネットワークの問題、バリデータ障害、誤った構成、またはその他の問題が原因で、サーバが現行のレジャーを認識できません。
* `noClosed` - サーバに決済済みレジャーがありません。通常、このエラーは起動が完了していないことが原因で発生します。
* `wsTextRequired` -（WebSocketのみ）リクエストの[opcode](https://tools.ietf.org/html/rfc6455#section-5.2)がテキストではありません。
* `amendmentBlocked` - サーバの状態が[Amendment blocked](../../../concepts/networks-and-servers/amendments.md#amendment-blocked)であるため、XRP Ledgerネットワークとの同期を維持するために最新バージョンに更新する必要があります。
