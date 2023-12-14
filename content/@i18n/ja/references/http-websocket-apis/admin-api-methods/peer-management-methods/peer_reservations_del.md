---
html: peer_reservations_del.html
parent: peer-management-methods.html
blurb: 特定のピアサーバー用の予約済みスロットを削除します。
labels:
  - コアサーバー
---
# peer_reservations_del

[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L89 "Source")

`{% $frontmatter.seo.title %}`メソッドは、特定の[ピアリザベーション](peer-protocol.html#固定ピアとピアリザベーション)を削除します（存在する場合）。[新規: rippled 1.4.0](https://github.com/XRPLF/rippled/releases/tag/1.4.0 "BADGE_BLUE")

_`{% $frontmatter.seo.title %}`メソッドは、権限のないユーザーは実行できない[管理メソッド](../index.md)です。_

**注記:** ピアリザベーションを削除しても、対応するピアが接続されている場合、そのピアは自動的に切断されません。

### 要求フォーマット

要求フォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "peer_reservations_del_example_1",
    "command": "{% $frontmatter.seo.title %}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: {% $frontmatter.seo.title %} <public_key>
rippled {% $frontmatter.seo.title %} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99
```
{% /tab %}

{% /tabs %}

要求には以下のパラメーターが含まれます。

| `Field`     | 型                        | 説明                               |
|:------------|:--------------------------|:-----------------------------------|
| `public_key` | 文字列 | 削除する[ピアリザベーション](peer-protocol.html#固定ピアとピアリザベーション)の[ノード公開鍵](peer-protocol.html#ノードキーペア)（[base58](base58-encodings.html)フォーマット） |


### 応答フォーマット

処理が成功した応答の例:

{% tabs %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% tab label="コマンドライン" %}
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
{% /tab %}

{% /tabs %}

この応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field` | 型     | 説明                                                      |
|:--------|:-------|:----------------------------------------------------------|
| `previous` | オブジェクト | _（省略される場合があります）_ 削除する前のピアリザベーションの最後のステータスを伴った、**ピアリザベーションオブジェクト**。このフィールドは、ピアリザベーションが正常に削除された場合、必ず表示されます。 |

**注記:** 指定された予約が存在しなかった場合は、このコマンドによって、成功を示す空の結果オブジェクトが返されます。この場合、`previous`フィールドは省略されます。

#### ピアリザベーションオブジェクト

`previous`フィールドが指定されている場合は、このピアリザベーションの以前のステータスが次のフィールドとともに表示されます。

{% partial file="/_snippets/peer_reservation_object.ja.md" /%}


### 考えられるエラー

- いずれかの[汎用エラータイプ](error-formatting.html#汎用エラー)。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `publicMalformed` - 要求の`public_key`フィールドが無効です。[base58](base58-encodings.html)フォーマットの有効なノード公開鍵である必要があります。
