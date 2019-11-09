# エラーのフォーマット

エラーが発生する可能性のある状況をすべて挙げることは不可能です。トランスポートレイヤーで発生する場合（ネットワーク接続が失われる場合など）には、使用しているクライアントとトランスポートに応じてその結果は異なります。ただし、`rippled`サーバーが要求を正常に受信した場合、サーバーは標準のエラー形式での応答を試みます。

**注意:** 要求の結果がエラーになった場合、応答の一部として要求全体がコピーされます。このため、エラーのデバッグに取り組むことができます。ただし、これには要求で渡した機密情報がすべて含まれます。エラーメッセージを共有するときには、アカウントの重要な機密情報を他のユーザーに誤って公開することがないように、十分に注意してください。


エラーの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

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

*JSON-RPC*

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

*コマンドライン*

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

<!-- MULTICODE_BLOCK_END -->


## WebSocketフォーマット

| `Field`   | 型     | 説明                                           |
|:----------|:---------|:------------------------------------------------------|
| `id`      | （場合により異なる） | この応答の要求元となったWeb Socket要求に指定されていたID |
| `status`  | 文字列   | `"error"` : 要求が原因でエラーが発生した場合              |
| `type`    | 文字列   | 通常は`"response"`。これは、コマンドに対し正常に応答したことを示します。 |
| `error`   | 文字列   | 発生したエラータイプの一意のコード。     |
| `request` | オブジェクト   | このエラーが発生した要求のコピー（JSONフォーマット）。**注意:** 要求にアカウントの機密情報が含まれている場合、ここにコピーされます。 |


## JSON-RPCフォーマット

一部のJSON-RPC要求は、HTTPレイヤーでエラーコードで応答します。この場合、応答は応答本文にプレーンテキストで記述されます。たとえば`method`パラメーターでコマンドを指定し忘れた場合、応答は次のようになります。

```
HTTP Status: 400 Bad Request
Null method
```

HTTPステータスコード200 OKが返されるその他のエラーの場合、応答はJSONフォーマットで、以下のフィールドが使用されます。

| `Field`          | 型   | 説明                                      |
|:-----------------|:-------|:-------------------------------------------------|
| `result`         | オブジェクト | クエリーに対する応答が含まれているオブジェクト      |
| `result.error`   | 文字列 | 発生したエラータイプの一意のコード。 |
| `result.status`  | 文字列 | `"error"` : 要求が原因でエラーが発生した場合         |
| `result.request` | オブジェクト | このエラーが発生した要求のコピー（JSONフォーマット）。**注意:** 要求にアカウントの機密情報が含まれている場合、ここにコピーされます。**注記:** 発行される要求にかかわらず、要求はWebSocketフォーマットに再設定されます。 |


## 汎用エラー

すべてのメソッドは、以下のいずれかの値の`error`コードを返す可能性があります。

* `unknownCmd` - 要求に、`rippled`サーバーが認識する[コマンド](rippled-api.html)が含まれていません。
* `jsonInvalid` -（WebSocketのみ）要求は適切なJSONオブジェクトではありません。
    * この場合JSON-RPCは、代わりに400 Bad Request HTTPエラーを返します。
* `missingCommand` -（WebSocketのみ）要求に`command`フィールドが指定されていませんでした。
    * この場合JSON-RPCは、代わりに400 Bad Request HTTPエラーを返します。
* `tooBusy` -サーバーの負荷が高すぎるため、現在このコマンドを実行できません。管理者として接続している場合は、通常このエラーが返されることはありません。
* `noNetwork` - サーバーとXRP Ledgerピアツーピアネットワークのその他の部分との接続で問題が発生しています（サーバーがスタンドアロンモードで実行されていません）。
* `noCurrent` - 高い負荷、ネットワークの問題、バリデータ障害、誤った構成、またはその他の問題が原因で、サーバーが現行のレジャーを認識できません。
* `noClosed` - サーバーに閉鎖済みレジャーがありません。通常、このエラーは起動が完了していないことが原因で発生します。
* `wsTextRequired` -（WebSocketのみ）要求の[opcode](https://tools.ietf.org/html/rfc6455#section-5.2)がテキストではありません。
