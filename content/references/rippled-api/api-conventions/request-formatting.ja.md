# 要求フォーマット

## WebSocketフォーマット  

`rippled`サーバーへのWebSocketを開いた後、以下の属性を使用して、コマンドを[JSON](https://en.wikipedia.org/wiki/JSON)オブジェクトとして送信できます。

* コマンド名を最上位の`"command"`フィールドに指定します。
* このコマンドのすべての関連パラメーターも最上位に指定します。
* オプションで、任意の値を指定した`"id"`フィールドを指定します。この要求への応答では、同一の`"id"`フィールドを使用します。そうすることで、応答が順不同で到達した場合も、どの要求によってどの応答を得られたのかがわかります。

応答はJSONオブジェクトとして返されます。

## JSON-RPCフォーマット

JSON-RPC要求を実行するには、`rippled`サーバーがJSON-RPC接続をリッスンしているポートおよびIPで、HTTP **POST**要求をルートパス（`/`）に送信します。HTTP/1.0またはHTTP/1.1を使用できます。HTTPSを使用する場合は、TLS v1.2を使用してください。セキュリティ上の理由から、`rippled`ではSSL v3以前を _サポートしていません_ 。

常に`Content-Type`ヘッダー（値`application/json`）を指定してください。

複数の要求を実行する予定の場合は、要求間で接続を閉じてから開く操作を行わずに済むように、[Keep-Alives](http://tools.ietf.org/html/rfc7230#section-6.3)を使用してください。

以下の属性を指定した要求本文を[JSON](https://en.wikipedia.org/wiki/JSON)オブジェクトとして送信します。

* コマンドを最上位の`"method"` フィールドに指定します。
* 最上位の`"params"`フィールドを指定します。このフィールドの内容は、コマンドのすべてのパラメーターが指定された1つの入れ子JSONオブジェクトのみを保持している**1要素配列**です。

応答もJSONオブジェクトです。

## コマンドライン形式

コマンドラインでは、通常の（ダッシュが先頭に付いた）コマンドラインオプションの後にコマンドを指定し、その後に一連の限定的なパラメーターをスペースで区切って指定します。スペースやその他の特殊文字が含まれている可能性のあるパラメーター値は、一重引用符で囲みます。

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 2,
 "command": "account_info",
 "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
 "strict": true,
 "ledger_index": "validated"
}
```

*JSON-RPC*

```
POST http://s1.ripple.com:51234/
{
   "method": "account_info",
   "params": [
       {
           "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "strict": true,
           "ledger_index": "validated"
       }
   ]
}
```

*コマンドライン*

```
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated true
```

<!-- MULTICODE_BLOCK_END -->
