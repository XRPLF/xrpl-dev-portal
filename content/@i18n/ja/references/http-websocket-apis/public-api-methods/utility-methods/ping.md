---
html: ping.html
parent: utility-methods.html
blurb: 確認レスポンスを返します。これにより、接続のステータスと遅延をテストできます。
labels:
  - コアサーバー
---
# ping
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

`ping`コマンドは確認レスポンスを返します。これにより、クライアントは接続のステータスと遅延をテストできます。

## リクエストのフォーマット
リクエストのフォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
   "id":1,
   "command":"ping"
}
```

*JSON-RPC*

```json
{
   "method":"ping",
   "params":[
       {}
   ]
}
```

*コマンドライン*

```sh
#Syntax: ping
rippled ping
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#ping)

リクエストにはパラメーターが含まれていません。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
   "id":1,
   "result":{},
   "status":"success",
   "type":"response"
}
```

*JSON-RPC*

```json
200 OK

{
   "result":{
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果にフィールドが含まれません。クライアントはリクエストからレスポンスまでのラウンドトリップ時間を遅延として測定できます。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
