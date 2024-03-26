---
html: node_to_shard.html
parent: logging-and-data-management-methods.html
seo:
    description: レジャーストアからシャードストアにデータをコピーします。
labels:
  - データ保持
---
# node_to_shard
[[ソース]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/rpc/handlers/NodeToShard.cpp "Source")

{% code-page-name /%}メソッドは、レジャーストアから[シャードストア](../../../../infrastructure/configuration/data-retention/history-sharding.md)へのデータコピーを管理します。データコピーの開始、停止、状態チェックが可能です。

_{% code-page-name /%}メソッドは、権限のないユーザには実行できない[管理メソッド](../index.md)です。_


### リクエストのフォーマット

リクエストのフォーマット例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "{% $frontmatter.seo.title %}",
    "action": "start"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
        "action": "start"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: {% $frontmatter.seo.title %} start|stop|status
rippled {% $frontmatter.seo.title %} start
```
{% /tab %}

{% /tabs %}

リクエストは、以下のパラメータを含みます:

| `項目`  | 型   | 説明
|:---------|:-------|:---------------------------------------------------------|
| `action` | String | どのような動作をさせるかによって、 `start`、`stop` または `status` のいずれかを指定します。 |


### レスポンスのフォーマット

正常レスポンス例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "message": "Database import initiated..."
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result" : {
      "message" : "Database import initiated...",
      "status" : "success"
   }
}

```
{% /tab %}

{% tab label="Commandline" %}
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
{% /tab %}

{% /tabs %}

レスポンスは、[標準フォーマット][]に従っており、成功した場合は、以下の項目を含みます:

| `項目`   | 型   | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | 文字列 | コマンドにレスポンスして実行されたアクションを示す、可読性の高いメッセージ。 |


### 起こり得るエラー

- いずれかの[汎用エラータイプ][]。
- `internal` - コピーが実行されていない時にコピーの状態チェックをするといったような無効な操作の場合。
- `notEnabled` - サーバが[履歴シャード](../../../../infrastructure/configuration/data-retention/history-sharding.md)を保存するように環境設定されていない場合。
- `invalidParams` - 1つ以上の項目が誤って定義されている、もしくは、1つ以上の必須項目が抜けている。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
