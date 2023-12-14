---
html: ledger_closed.html
parent: ledger-methods.html
blurb: 最新の閉鎖済みレジャーの一意のIDを返します。
label:
  - ブロックチェーン
---
# ledger_closed
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerClosed.cpp "Source")

`ledger_closed`メソッドは、最新の決済済みレジャーの一意のIDを返します。（このレジャーは必ずしも検証済みで変更不可能ではありません。）

## 要求フォーマット
要求フォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 2,
   "command": "ledger_closed"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_closed",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```
#Syntax: ledger_closed
rippled ledger_closed
```
{% /tab %}

{% /tabs %}

[試してみる >](websocket-api-tool.html#ledger_closed)

このメソッドはパラメーターを受け入れません。

## 応答フォーマット
処理が成功した応答の例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_hash": "17ACB57A0F73B5160713E81FE72B2AC9F6064541004E272BD09F257D57C30C02",
    "ledger_index": 6643099
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "ledger_hash": "8B5A0C5F6B198254A6E411AF55C29EE40AA86251D2E78DD0BB17647047FA9C24",
        "ledger_index": 8696231,
        "status": "success"
    }
}
```
{% /tab %}

{% /tabs %}

この応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型               | 説明                                     |
|:---------------|:-----------------|:-----------------------------------------|
| `ledger_hash` | 文字列 | このレジャーバージョンの一意の[ハッシュ](basic-data-types.html#ハッシュ)（16進数）。 |
| `ledger_index` | 符号なし整数 | このレジャーバージョンの[レジャーインデックス](basic-data-types.html#レジャーインデックス)。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ](error-formatting.html#汎用エラー)。
