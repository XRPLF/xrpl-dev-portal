# ledger_current
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerCurrent.cpp "Source")

`ledger_current`メソッドは、現在進行中のレジャーの一意のIDを返します。このコマンドで返されるレジャーは確定されたものではないため、このコマンドは主にテストに有用です。

## 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id":2,
  "command":"ledger_current"
}
```

*JSON-RPC*

```
{
   "method":"ledger_current",
   "params":[
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: ledger_current
rippled ledger_current
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#ledger_current)

この要求にはパラメーターは含まれていません。


## 応答フォーマット
処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":2,
 "status":"success",
 "type":"response",
 "result":{
   "ledger_current_index":6643240
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "ledger_current_index":8696233,
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型             | 説明                    |
|:-----------------------|:-----------------|:-------------------------------|
| `ledger_current_index` | 符号なし整数 | このレジャーのシーケンス番号 |

現行レジャーのハッシュは、レジャーの内容とともに常に変化するため、`ledger_hash`フィールドはありません。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}