---
html: peer_reservations_del.html
parent: peer-management-methods.html
blurb: 特定のピアサーバー用の予約済みスロットを削除します。
labels:
  - コアサーバー
---
# peer_reservations_del

[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L89 "Source")

`{{currentpage.name}}`メソッドは、特定の[ピアリザベーション][]を削除します（存在する場合）。[新規: rippled 1.4.0][]

_`{{currentpage.name}}`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-api-methods.html)です。_

**注記:** ピアリザベーションを削除しても、対応するピアが接続されている場合、そのピアは自動的に切断されません。

### 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "id": "peer_reservations_del_example_1",
    "command": "{{currentpage.name}}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }]
}
```

*コマンドライン*

```sh
#Syntax: {{currentpage.name}} <public_key>
rippled {{currentpage.name}} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`     | 型                        | 説明                               |
|:------------|:--------------------------|:-----------------------------------|
| `public_key` | 文字列 | 削除する[ピアリザベーション][]の[ノード公開鍵][]（[base58][]フォーマット） |


### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "peer_reservations_del_example_1",
  "result": {
    "previous": {
      "description": "Ripple s1 server 'WOOL'",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
   "result" : {
      "previous" : {
         "description" : "Ripple s1 server 'WOOL'",
         "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      "status" : "success"
   }
}
```

*コマンドライン*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "previous" : {
         "description" : "Ripple s1 server 'WOOL'",
         "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field` | 型     | 説明                                                      |
|:--------|:-------|:----------------------------------------------------------|
| `previous` | オブジェクト | _（省略される場合があります）_ 削除する前のピアリザベーションの最後のステータスを伴った、**ピアリザベーションオブジェクト**。このフィールドは、ピアリザベーションが正常に削除された場合、必ず表示されます。 |

**注記:** 指定された予約が存在しなかった場合は、このコマンドによって、成功を示す空の結果オブジェクトが返されます。この場合、`previous`フィールドは省略されます。

#### ピアリザベーションオブジェクト

`previous`フィールドが指定されている場合は、このピアリザベーションの以前のステータスが次のフィールドとともに表示されます。

{% include '_snippets/peer_reservation_object.ja.md' %}
<!--_ -->

### 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `publicMalformed` - 要求の`public_key`フィールドが無効です。[base58][]フォーマットの有効なノード公開鍵である必要があります。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
