# connect
[[ソース]<br>](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/Connect.cpp "Source")

`connect`コマンドは、`rippled`サーバーを特定のピア`rippled`サーバーに強制的に接続します。

*`connect`要求は、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。*

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "command": "connect",
   "ip": "192.170.145.88",
   "port": 51235
}
```

*JSON-RPC*

```
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


*コマンドライン*

```
#Syntax: connect ip [port]
rippled connect 192.170.145.88 51235
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field` | 型   | 説明                                               |
|:--------|:-------|:----------------------------------------------------------|
| `ip`    | 文字列 | 接続するサーバーのIPアドレス。                    |
| `port`  | 数値 | _（省略可）_ 接続時に使用するポート番号。デフォルトでは6561です。 |

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
  "result" : {
     "message" : "connecting",
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
     "message" : "connecting",
     "status" : "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`   | 型   | 説明                                            |
|:----------|:-------|:-------------------------------------------------------|
| `message` | 文字列 | コマンドが成功した場合の値は`connecting`。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* スタンドアロンモードでは接続できません - スタンドアロンモードではネットワーク関連のコマンドが無効にされています。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
