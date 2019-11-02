# ledger_closed
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerClosed.cpp "Source")

`ledger_closed`メソッドは、最新の閉鎖済みレジャーの一意のIDを返します。（このレジャーは必ずしも検証済みで変更不可能ではありません。）

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id":2,
  "command":"ledger_closed"
}
```

*JSON-RPC*

```
{
   "method":"ledger_closed",
   "params":[
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: ledger_closed
rippled ledger_closed
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#ledger_closed)

このメソッドはパラメーターを受け入れません。

## 応答フォーマット
処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":1,
 "status":"success",
 "type":"response",
 "result":{
   "ledger_hash":"17ACB57A0F73B5160713E81FE72B2AC9F6064541004E272BD09F257D57C30C02",
   "ledger_index":6643099
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "ledger_hash":"8B5A0C5F6B198254A6E411AF55C29EE40AA86251D2E78DD0BB17647047FA9C24",
       "ledger_index":8696231,
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型             | 説明                              |
|:---------------|:-----------------|:-----------------------------------------|
| `ledger_hash`  | 文字列           | レジャーの一意のハッシュを示す20バイトの16進文字列。 |
| `ledger_index` | 符号なし整数 | このレジャーのシーケンス番号           |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}