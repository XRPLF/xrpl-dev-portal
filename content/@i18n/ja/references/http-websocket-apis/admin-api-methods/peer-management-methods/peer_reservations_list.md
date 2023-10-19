---
html: peer_reservations_list.html
parent: peer-management-methods.html
blurb: 特定のピアサーバー用の予約済みスロットをリスト表示します。
labels:
  - コアサーバー
---
# peer_reservations_list
[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L116 "Source")

`{{currentpage.name}}`メソッドは、[ピアリザベーション][]を一覧表示します。[新規: rippled 1.4.0][]

_`{{currentpage.name}}`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-api-methods.html)です。_


### 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "peer_reservations_list_example_1",
  "command": "{{currentpage.name}}"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}"
}
```

*コマンドライン*

```sh
#Syntax: {{currentpage.name}}
rippled {{currentpage.name}}
```

<!-- MULTICODE_BLOCK_END -->

この要求にはパラメーターは含まれません。


### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

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

*JSON-RPC*

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

*コマンドライン*

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

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型    | 説明                                                |
|:---------------|:------|:----------------------------------------------------|
| `reservations` | 配列 | 既存の[ピアリザベーション][]のリスト。各メンバーはピアリザベーションオブジェクトです。詳細は以下のとおりです。 |

#### ピアリザベーションオブジェクト

`reservations`配列の各メンバーは、1つの[ピアリザベーション][]を表すJSONオブジェクトです。このオブジェクトのフィールドを次に示します。

{% include '_snippets/peer_reservation_object.ja.md' %}
<!--_ -->

### 考えられるエラー

- いずれかの[汎用エラータイプ][]。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
