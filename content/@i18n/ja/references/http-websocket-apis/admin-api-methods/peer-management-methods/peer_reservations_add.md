---
html: peer_reservations_add.html
parent: peer-management-methods.html
blurb: 特定のピアサーバー用の予約済みスロットを追加します。
labels:
  - コアサーバー
---
# peer_reservations_add
[[ソース]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L36 "Source")

この`{% $frontmatter.seo.title %}`メソッドは、XRP Ledger[ピアツーピアネットワーク](../../../../concepts/networks-and-servers/peer-protocol.md)内の特定のピアサーバーの予約済みスロットを追加または更新します。[新規: rippled 1.4.0](https://github.com/XRPLF/rippled/releases/tag/1.4.0 "BADGE_BLUE")

_`{% $frontmatter.seo.title %}`メソッドは、権限のないユーザーは実行できない[管理メソッド](../index.md)です。_


### 要求フォーマット

要求フォーマットの例:

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

要求には以下のパラメーターが含まれます。

| `Field`       | 型     | 説明                                                |
|:--------------|:-------|:----------------------------------------------------|
| `public_key` | 文字列 | [base58](base58-encodings.html)での予約を追加するピアリザベーションの[ノード公開鍵](peer-protocol.html#ノードキーペア) 。 |
| `description` | 文字列 | _(省略可)_ ピアリザベーションに関するカスタムの説明。64文字を超える部分は、再起動時にサーバーによって切り捨てられます。 |



### 応答フォーマット

処理が成功した応答の例:

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

この応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`    | 型     | 説明                                                   |
|:-----------|:-------|:-------------------------------------------------------|
| `previous` | オブジェクト | _（省略される場合があります）_ 同じ[ノード公開鍵](peer-protocol.html#ノードキーペア)の以前のエントリ（同じノード公開鍵を使用した予約がすでに存在する場合）。以下で説明するように、このオブジェクトは、**ピアリザベーションオブジェクト**というフォーマットになります。 |

同じ[ノード公開鍵](peer-protocol.html#ノードキーペア)に以前のエントリがなかった場合、`result`オブジェクトは空です。

#### ピアリザベーションオブジェクト

`previous`フィールドが指定されている場合は、このピアリザベーションの以前のステータスが次のフィールドとともに表示されます。

{% partial file="/_snippets/peer_reservation_object.ja.md" /%}



### 考えられるエラー

- いずれかの[汎用エラータイプ](error-formatting.html#汎用エラー)。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `publicMalformed` - 要求の`public_key`フィールドが無効です。[base58](base58-encodings.html)フォーマットの有効なノード公開鍵である必要があります。
