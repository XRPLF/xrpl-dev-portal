---
html: node_to_shard.html
parent: logging-and-data-management-methods.html
blurb: レジャーストアからシャードストアにデータをコピーします。
labels:
  - データ保持
---
# node_to_shard
[[ソース]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/rpc/handlers/NodeToShard.cpp "Source")

`{{currentpage.name}}`メソッドは、レジャーストアから[シャードストア](history-sharding.html)へのデータコピーを管理します。データコピーの開始、停止、状態チェックが可能です。

_`{{currentpage.name}}`メソッドは、権限のないユーザーには実行できない[管理メソッド](admin-api-methods.html)です。_


### リクエストフォーマット

リクエストフォーマット例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "command": "{{currentpage.name}}",
    "action": "start"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
        "action": "start"
    }]
}
```

*Commandline*

```sh
#Syntax: {{currentpage.name}} start|stop|status
rippled {{currentpage.name}} start
```

<!-- MULTICODE_BLOCK_END -->

リクエストは、以下のパラメータを含みます:

| `項目`  | 型   | 説明
|:---------|:-------|:---------------------------------------------------------|
| `action` | String | どのような動作をさせるかによって、 `start`、`stop` または `status` のいずれかを指定します。 |


### レスポンスフォーマット

正常レスポンス例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "message": "Database import initiated..."
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
   "result" : {
      "message" : "Database import initiated...",
      "status" : "success"
   }
}

```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "message" : "Database import initiated...",
      "status" : "success"
   }
}

```

<!-- MULTICODE_BLOCK_END -->

レスポンスは、[標準フォーマット][]に従っており、成功した場合は、以下の項目を含みます:

| `項目`   | 型   | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | 文字列 | コマンドに応答して実行されたアクションを示す、可読性の高いメッセージ。 |


### 起こり得るエラー

- いずれかの[汎用エラータイプ][]。
- `internal` - コピーが実行されていない時にコピーの状態チェックをするといったような無効な操作の場合。
- `notEnabled` - サーバが[履歴シャード](history-sharding.html)を保存するように環境設定されていない場合。
- `invalidParams` - 1つ以上の項目が誤って定義されている、もしくは、1つ以上の必須項目が抜けている。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
