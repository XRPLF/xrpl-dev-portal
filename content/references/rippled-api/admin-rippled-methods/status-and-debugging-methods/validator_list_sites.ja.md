# validator_list_sites
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ValidatorListSites.cpp "Source")

`validator_list_sites`コマンドは、バリデータリストを処理するサイトのステータス情報を返します。[新規: rippled 0.80.1][]

*`validator_list_sites`要求は、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。*

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 1,
   "command": "validator_list_sites"
}
```

*JSON-RPC*

```
{
   "method": "validator_list_sites",
   "params": [
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: validator_list_sites
rippled validator_list_sites
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターが含まれていません。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":5,
   "status":"success",
   "type":"response",
   "result": {
       "validator_sites": [
           {
               "last_refresh_status": "accepted",
               "last_refresh_time": "2017-Oct-13 21:26:37",
               "refresh_interval_min": 5,
               "uri": "http://127.0.0.1:51447/validators"
           }
       ]
   }
}
}
```

*JSON-RPC*

```
200 OK
{
   "result": {
       "status": "success",
       "validator_sites": [
           {
               "last_refresh_status": "accepted",
               "last_refresh_time": "2017-Oct-13 21:26:37",
               "refresh_interval_min": 5,
               "uri": "http://127.0.0.1:51447/validators"
           }
       ]
   }
}
```

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result": {
       "status": "success",
       "validator_sites": [
           {
               "last_refresh_status": "accepted",
               "last_refresh_time": "2017-Oct-13 21:26:37",
               "refresh_interval_min": 5,
               "uri": "http://127.0.0.1:51447/validators"
           }
       ]
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`           | 型  | 説明                      |
|:------------------|:------|----------------------------------|
| `validator_sites` | 配列 | バリデータサイトオブジェクトからなる配列。 |

`validator_sites`フィールドの配列の各メンバーは、次のフィールドを有するオブジェクトです。

| `Field`                | 型             | 説明                     |
|:-----------------------|:-----------------|:--------------------------------|
| `last_refresh_status`  | 文字列           | 存在する場合は、サイトの最終更新の[`ListDisposition`](https://github.com/ripple/rippled/blob/master/src/ripple/app/misc/ValidatorList.h)です。存在しない場合は、サイトに対するクエリーがまだ成功していません。 |
| `last_refresh_time`    | 文字列           | サイトの最終照会時刻を人間が読み取れる形式で表示します。存在しない場合は、サイトに対するクエリーがまだ成功していません。 |
| `refresh_interval_min` | 符号なし整数 | 更新試行間隔の分数。 |
| `uri`                  | 文字列           | サイトのURI。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}