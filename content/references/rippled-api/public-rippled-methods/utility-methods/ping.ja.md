# ping
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

`ping`コマンドは確認応答を返します。これにより、クライアントは接続のステータスと遅延をテストできます。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "command":"ping"
}
```

*JSON-RPC*

```
{
   "method":"ping",
   "params":[
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: ping
rippled ping
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#ping)

要求にはパラメーターが含まれていません。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "result":{},
   "status":"success",
   "type":"response"
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果にフィールドが含まれません。クライアントは要求から応答までのラウンドトリップ時間を遅延として測定できます。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
