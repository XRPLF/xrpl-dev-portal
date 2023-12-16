---
html: ping.html
parent: utility-methods.html
blurb: 確認応答を返します。これにより、接続のステータスと遅延をテストできます。
labels:
  - コアサーバー
---
# ping
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Ping.cpp "Source")

`ping`コマンドは確認応答を返します。これにより、クライアントは接続のステータスと遅延をテストできます。

## 要求フォーマット
要求フォーマットの例:

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

要求にはパラメーターが含まれていません。

## 応答フォーマット

処理が成功した応答の例:

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

この応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果にフィールドが含まれません。クライアントは要求から応答までのラウンドトリップ時間を遅延として測定できます。

## 考えられるエラー

* [汎用エラータイプ](../../api-conventions/error-formatting.md#汎用エラー)のすべて。
