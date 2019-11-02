# stop
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Stop.cpp "Source")

サーバーのグレースフルシャットダウンを行います。

_`stop`要求は、権限のないユーザーは実行できない*[管理メソッド](admin-rippled-methods.html)です。_

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 0,
   "command": "stop"
}
```

*JSON-RPC*

```
{
   "method": "stop",
   "params": [
       {}
   ]
}
```

*コマンドライン*

```
rippled stop
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターが含まれていません。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
  "result" : {
     "message" : "ripple server stopping",
     "status" : "success"
  }
}
```

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "message" : "ripple server stopping",
     "status" : "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`   | 型   | 説明                          |
|:----------|:-------|:-------------------------------------|
| `message` | 文字列 | `ripple server stopping` : 正常終了の場合。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
