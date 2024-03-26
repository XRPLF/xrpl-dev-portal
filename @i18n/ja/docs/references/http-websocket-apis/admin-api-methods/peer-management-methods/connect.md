---
html: connect.html
parent: peer-management-methods.html
seo:
    description: 特定のピアrippledサーバに強制的に接続します。
labels:
  - コアサーバ
---
# connect
[[ソース]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/Connect.cpp "Source")

`connect`コマンドは、`rippled`サーバを特定のピア`rippled`サーバに強制的に接続します。

*`connect`リクエストは、権限のないユーザは実行できない[管理メソッド](../index.md)です。*

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "command": "connect",
   "ip": "192.170.145.88",
   "port": 51235
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "connect",
   "params": [
       {
           "ip": "192.170.145.88",
           "port": 51235
       }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: connect ip [port]
rippled connect 192.170.145.88 51235
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field` | 型   | 説明                                               |
|:--------|:-------|:----------------------------------------------------------|
| `ip`    | 文字列 | 接続するサーバのIPアドレス。                    |
| `port`  | 数値 | _（省略可）_ 接続時に使用するポート番号。デフォルトでは**2459**です。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0" %}新規: rippled 1.6.0{% /badge %} |

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
  "result" : {
     "message" : "connecting",
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
     "message" : "connecting",
     "status" : "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`   | 型   | 説明                                            |
|:----------|:-------|:-------------------------------------------------------|
| `message` | 文字列 | コマンドが成功した場合の値は`connecting`。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* スタンドアロンモードでは接続できません - スタンドアロンモードではネットワーク関連のコマンドが無効にされています。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
