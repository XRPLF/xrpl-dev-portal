---
html: stop.html
parent: server-control-methods.html
blurb: サーバーのグレースフルシャットダウンを行います。
labels:
  - コアサーバー
---
# stop
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Stop.cpp "Source")

サーバーのグレースフルシャットダウンを行います。

_`stop`要求は、権限のないユーザーは実行できない*[管理メソッド](../index.md)です。_

### 要求フォーマット
要求フォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 0,
   "command": "stop"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "stop",
   "params": [
       {}
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```
rippled stop
```
{% /tab %}

{% /tabs %}

要求にはパラメーターが含まれていません。

### 応答フォーマット

処理が成功した応答の例:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
  "result" : {
     "message" : "ripple server stopping",
     "status" : "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result" : {
     "message" : "ripple server stopping",
     "status" : "success"
  }
}
```
{% /tab %}

{% /tabs %}

応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`   | 型   | 説明                          |
|:----------|:-------|:-------------------------------------|
| `message` | 文字列 | `ripple server stopping` : 正常終了の場合。 |

### 考えられるエラー

* [汎用エラータイプ](../../api-conventions/error-formatting.md#汎用エラー)のすべて。
