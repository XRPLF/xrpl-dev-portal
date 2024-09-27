---
html: ledger_current.html
parent: ledger-methods.html
seo:
    description: 現在進行中のレジャーの一意のIDを返します。
label:
  - ブロックチェーン
---
# ledger_current
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerCurrent.cpp "Source")

`ledger_current`メソッドは、現在進行中のレジャーの一意のIDを返します。このコマンドで返されるレジャーは確定されたものではないため、このコマンドは主にテストに有用です。

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id":2,
  "command":"ledger_current"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"ledger_current",
   "params":[
       {}
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: ledger_current
rippled ledger_current
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger_current)

このリクエストにはパラメーターは含まれていません。


## レスポンスのフォーマット
処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "id":2,
 "status":"success",
 "type":"response",
 "result":{
   "ledger_current_index":6643240
 }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result":{
       "ledger_current_index":8696233,
       "status":"success"
   }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型             | 説明                    |
|:-----------------------|:-----------------|:-------------------------------|
| `ledger_current_index` | 符号なし整数 | このレジャーのシーケンス番号 |

現行レジャーのハッシュは、レジャーの内容とともに常に変化するため、`ledger_hash`フィールドはありません。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
