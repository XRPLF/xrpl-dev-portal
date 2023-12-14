---
html: ledger_accept.html
parent: server-control-methods.html
blurb: スタンドアロンモードでサーバーが現在処理中のレジャーを強制的に終了し、次のレジャー番号に進むようにします。
labels:
  - コアサーバー
---
# ledger_accept
[[ソース]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/LedgerAccept.cpp "Source")

`ledger_accept`メソッドは、サーバーが現在処理中のレジャーを強制的に終了し、次のレジャー番号に進むようにします。このメソッドはテスト専用であり、`rippled`サーバーがスタンドアロンモードで実行されている場合にのみ使用できます。

*`ledger_accept`メソッドは、権限のないユーザーは実行できない[管理メソッド](../index.md)です。*

### 要求フォーマット

要求フォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "Accept my ledger!",
  "command": "ledger_accept"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: ledger_accept
rippled ledger_accept
```
{% /tab %}

{% /tabs %}

この要求はパラメーターを受け入れません。

### 応答フォーマット

処理が成功した応答の例:
```js
{
 "id": "Accept my ledger!",
 "status": "success",
 "type": "response",
 "result": {
   "ledger_current_index": 6643240
 }
}
```

応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                | 型             | 説明                      |
|:-----------------------|:-----------------|:---------------------------------|
| `ledger_current_index` | 符号なし整数 | 新規に作成される「現行」レジャーインデックス |

**注記:** レジャーを閉鎖すると、`rippled`がそのレジャーのトランザクションの正規順序を決定してリプレイします。これにより、以前に現行レジャーに暫定的に適用されていたトランザクションの結果が変化することがあります。

### 考えられるエラー

* [汎用エラータイプ](error-formatting.html#汎用エラー)のすべて。
* `notStandAlone` - `rippled`サーバーが現在スタンドアロンモードで実行されていない場合。
