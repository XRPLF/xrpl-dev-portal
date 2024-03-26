---
html: peer_reservations_add.html
parent: peer-management-methods.html
seo:
    description: 特定のピアサーバ用の予約済みスロットを追加します。
labels:
  - コアサーバ
---
# peer_reservations_add
[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L36 "Source")

この{% code-page-name /%}メソッドは、XRP Ledger[ピアツーピアネットワーク](../../../../concepts/networks-and-servers/peer-protocol.md)内の特定のピアサーバの予約済みスロットを追加または更新します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %}

_{% code-page-name /%}メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_


### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "peer_reservations_add_example_1",
    "command": "{% $frontmatter.seo.title %}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99",
    "description": "Ripple s1 server 'WOOL'"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99",
      "description": "Ripple s1 server 'WOOL'"
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: {% $frontmatter.seo.title %} <public_key> [<description>]
rippled {% $frontmatter.seo.title %} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99 "Ripple s1 server 'WOOL'"
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`       | 型     | 説明                                                |
|:--------------|:-------|:----------------------------------------------------|
| `public_key` | 文字列 | [base58][]での予約を追加するピアリザベーションの[ノード公開鍵][] 。 |
| `description` | 文字列 | _(省略可)_ ピアリザベーションに関するカスタムの説明。64文字を超える部分は、再起動時にサーバによって切り捨てられます。 |



### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "peer_reservations_add_example_1",
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
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
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    },
    "status": "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    },
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`    | 型     | 説明                                                   |
|:-----------|:-------|:-------------------------------------------------------|
| `previous` | オブジェクト | _（省略される場合があります）_ 同じ[ノード公開鍵][]の以前のエントリ（同じノード公開鍵を使用した予約がすでに存在する場合）。以下で説明するように、このオブジェクトは、**ピアリザベーションオブジェクト**というフォーマットになります。 |

同じ[ノード公開鍵][]に以前のエントリがなかった場合、`result`オブジェクトは空です。

#### ピアリザベーションオブジェクト

`previous`フィールドが指定されている場合は、このピアリザベーションの以前のステータスが次のフィールドとともに表示されます。

{% partial file="/@i18n/ja/docs/_snippets/peer_reservation_object.md" /%}



### 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `publicMalformed` - リクエストの`public_key`フィールドが無効です。[base58][]フォーマットの有効なノード公開鍵である必要があります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
