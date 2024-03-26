---
html: peer_reservations_del.html
parent: peer-management-methods.html
seo:
    description: 特定のピアサーバ用の予約済みスロットを削除します。
labels:
  - コアサーバ
---
# peer_reservations_del

[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L89 "Source")

{% code-page-name /%}メソッドは、特定の[ピアリザベーション][]を削除します（存在する場合）。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %}

_{% code-page-name /%}メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

**注記:** ピアリザベーションを削除しても、対応するピアが接続されている場合、そのピアは自動的に切断されません。

### リクエストのフォーマット

リクエストのフォーマットの例:

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

リクエストには以下のパラメーターが含まれます。

| `Field`     | 型                        | 説明                               |
|:------------|:--------------------------|:-----------------------------------|
| `public_key` | 文字列 | 削除する[ピアリザベーション][]の[ノード公開鍵][]（[base58][]フォーマット） |


### レスポンスのフォーマット

処理が成功したレスポンスの例:

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

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field` | 型     | 説明                                                      |
|:--------|:-------|:----------------------------------------------------------|
| `previous` | オブジェクト | _（省略される場合があります）_ 削除する前のピアリザベーションの最後のステータスを伴った、**ピアリザベーションオブジェクト**。このフィールドは、ピアリザベーションが正常に削除された場合、必ず表示されます。 |

**注記:** 指定された予約が存在しなかった場合は、このコマンドによって、成功を示す空の結果オブジェクトが返されます。この場合、`previous`フィールドは省略されます。

#### ピアリザベーションオブジェクト

`previous`フィールドが指定されている場合は、このピアリザベーションの以前のステータスが次のフィールドとともに表示されます。

{% partial file="/@i18n/ja/docs/_snippets/peer_reservation_object.md" /%}


### 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `publicMalformed` - リクエストの`public_key`フィールドが無効です。[base58][]フォーマットの有効なノード公開鍵である必要があります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
