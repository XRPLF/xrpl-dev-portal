---
html: peer_reservations_list.html
parent: peer-management-methods.html
blurb: 特定のピアサーバー用の予約済みスロットをリスト表示します。
labels:
  - コアサーバー
---
# peer_reservations_list
[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L116 "Source")

`{% $frontmatter.seo.title %}`メソッドは、[ピアリザベーション](peer-protocol.html#固定ピアとピアリザベーション)を一覧表示します。[新規: rippled 1.4.0](https://github.com/XRPLF/rippled/releases/tag/1.4.0 "BADGE_BLUE")

_`{% $frontmatter.seo.title %}`メソッドは、権限のないユーザーは実行できない[管理メソッド](../index.md)です。_


### 要求フォーマット

要求フォーマットの例:

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

この要求にはパラメーターは含まれません。


### 応答フォーマット

処理が成功した応答の例:

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

この応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型    | 説明                                                |
|:---------------|:------|:----------------------------------------------------|
| `reservations` | 配列 | 既存の[ピアリザベーション](peer-protocol.html#固定ピアとピアリザベーション)のリスト。各メンバーはピアリザベーションオブジェクトです。詳細は以下のとおりです。 |

#### ピアリザベーションオブジェクト

`reservations`配列の各メンバーは、1つの[ピアリザベーション](peer-protocol.html#固定ピアとピアリザベーション)を表すJSONオブジェクトです。このオブジェクトのフィールドを次に示します。

{% partial file="/_snippets/peer_reservation_object.ja.md" /%}


### 考えられるエラー

- いずれかの[汎用エラータイプ](error-formatting.html#汎用エラー)。
