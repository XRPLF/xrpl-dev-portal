---
html: ping.html
parent: utility-methods.html
seo:
    description: 確認レスポンスを返します。これにより、接続のステータスと遅延をテストできます。
labels:
  - コアサーバ
---
# ping
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

`ping`コマンドは確認レスポンスを返します。これにより、クライアントは接続のステータスと遅延をテストできます。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":1,
   "command":"ping"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"ping",
   "params":[
       {}
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: ping
rippled ping
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ping)

リクエストにはパラメーターが含まれていません。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":1,
   "result":{},
   "status":"success",
   "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result":{
       "status":"success"
   }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果にフィールドが含まれません。クライアントはリクエストからレスポンスまでのラウンドトリップ時間を遅延として測定できます。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
