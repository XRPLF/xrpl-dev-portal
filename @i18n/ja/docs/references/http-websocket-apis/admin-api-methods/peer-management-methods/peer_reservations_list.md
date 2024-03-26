---
html: peer_reservations_list.html
parent: peer-management-methods.html
seo:
    description: 特定のピアサーバ用の予約済みスロットをリスト表示します。
labels:
  - コアサーバ
---
# peer_reservations_list
[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L116 "Source")

{% code-page-name /%}メソッドは、[ピアリザベーション][]を一覧表示します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %}

_{% code-page-name /%}メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_


### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "peer_reservations_list_example_1",
  "command": "{% $frontmatter.seo.title %}"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: {% $frontmatter.seo.title %}
rippled {% $frontmatter.seo.title %}
```
{% /tab %}

{% /tabs %}

このリクエストにはパラメーターは含まれません。


### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "peer_reservations_list_example_1",
  "result": {
    "reservations": [
      {
        "description": "Ripple s1 server 'WOOL'",
        "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      {
        "node": "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
      }
    ]
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
    "reservations" : [
       {
          "description" : "Ripple s1 server 'WOOL'",
          "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
       },
       {
          "node" : "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
       }
    ],
    "status" : "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
2019-Dec-27 21:56:07.253260422 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
  "result" : {
    "reservations" : [
       {
          "description" : "Ripple s1 server 'WOOL'",
          "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
       },
       {
          "node" : "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
       }
    ],
    "status" : "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型    | 説明                                                |
|:---------------|:------|:----------------------------------------------------|
| `reservations` | 配列 | 既存の[ピアリザベーション][]のリスト。各メンバーはピアリザベーションオブジェクトです。詳細は以下のとおりです。 |

#### ピアリザベーションオブジェクト

`reservations`配列の各メンバーは、1つの[ピアリザベーション][]を表すJSONオブジェクトです。このオブジェクトのフィールドを次に示します。

{% partial file="/@i18n/ja/docs/_snippets/peer_reservation_object.md" /%}


### 考えられるエラー

- いずれかの[汎用エラータイプ][]。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
