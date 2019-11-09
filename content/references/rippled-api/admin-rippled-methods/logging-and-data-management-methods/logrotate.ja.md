# logrotate
[[ソース]<br>](https://github.com/ripple/rippled/blob/743bd6c9175c472814448ea889413be79dfd1c07/src/ripple/rpc/handlers/LogRotate.cpp "Source")

`logrotate`コマンドは、ログファイルを閉じて再度開きます。これは、Linuxファイルシステムでのログローテーションを促進することを目的としています。

_`logrotate`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。_

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": "lr1",
   "command": "logrotate"
}
```

*コマンドライン*

```
rippled logrotate
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターが含まれていません。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
200 OK
{
  "result" : {
     "message" : "The log file was closed and reopened.",
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
     "message" : "The log file was closed and reopened.",
     "status" : "success"
  }
}

```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`   | 型   | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | 文字列 | 正常に完了した場合、次のメッセージが含まれています。 `The log file was closed and reopened.` |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}