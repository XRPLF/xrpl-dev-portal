---
html: stop.html
parent: server-control-methods.html
seo:
    description: サーバのグレースフルシャットダウンを行います。
labels:
  - コアサーバ
---
# stop
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Stop.cpp "Source")

サーバのグレースフルシャットダウンを行います。

_`stop`リクエストは、権限のないユーザは実行できない*[管理メソッド](../index.md)です。_

### リクエストのフォーマット
リクエストのフォーマットの例:

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

リクエストにはパラメーターが含まれていません。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

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

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`   | 型   | 説明                          |
|:----------|:-------|:-------------------------------------|
| `message` | 文字列 | `ripple server stopping` : 正常終了の場合。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
