---
html: nft_info.html
parent: clio-methods.html
blurb: Clioサーバの`nft_info`APIを使用して、指定したNFTに関する情報を取得します。
labels:
  - 非代替性トークン, NFT
---
# nft_info
[[ソース]](https://github.com/XRPLF/clio/blob/4a5cb962b6971872d150777881801ce27ae9ed1a/src/rpc/handlers/NFTInfo.cpp "ソース")

`nft_info`コマンドはクエリ対象の[NFT](../../../../concepts/tokens/nfts/index.md)に関する情報をClioサーバに問い合わせます。[新規: Clio v1.1.0](https://github.com/XRPLF/clio/releases/tag/1.1.0 "BADGE_BLUE")

## リクエストのフォーマット
リクエストフォーマットの例：

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "nft_info",
  "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "nft_info",
    "params": [
      {
          "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
      }
    ]
}
```
{% /tab %}

{% /tabs %}

<!-- To DO: Add an example command to the assets/js/apitool-methods-ws.js file. The WebSocket Tool requires access to a publicly available Clio server.
[試してみる >](websocket-api-tool.html#nft_info)-->

リクエストには以下のパラメーターが含まれます。

| `Field`        | 型                     | 説明                    |
|:---------------|:-----------------------|:-----------------------|
| `nft_id`       | 文字列                  | 非代替性トークン(NFT)の一意の識別子。 |
| `ledger_hash`  | 文字列                  | _(省略可)_ 使用するレジャーのバージョンを示す20バイトの16進文字列。[レジャーの指定](basic-data-types.html#レジャーの指定)をご覧ください）。 |
| `ledger_index` | 文字列 または 符号なし整数 | _(省略可)_ 使用するレジャーの[レジャーインデックス](basic-data-types.html#レジャーインデックス)あるいは、レジャーを自動的に選択するためのショートカット文字列。`ledger_index`に`closed`や`current`を指定しないでください。指定した場合、P2Pの`rippled`サーバにリクエストが転送されますが、`nft_info`APIは`rippled`では利用できません。[レジャーの指定](basic-data-types.html#レジャーの指定)をご覧ください）。 |

レジャーのバージョンを指定しない場合、Clioは検証済みの最新のレジャーを使用します。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000",
    "ledger_index": 270,
    "owner": "rG9gdNygQ6npA9JvDFWBoeXbiUcTYJnEnk",
    "is_burned": true,
    "flags": 8,
    "transfer_fee": 0,
    "issuer": "rHVokeuSnjPjz718qdb47bGXBBHNMP3KDQ",
    "nft_taxon": 0,
    "nft_sequence": 0,
    "validated": true
  },
  "status": "success",
  "type": "response",
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include ledger_index:current in your request"
    },
    {
      "id": 2002,
      "message": "This server may be out of date"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000",
    "ledger_index": 269,
    "owner": "rG9gdNygQ6npA9JvDFWBoeXbiUcTYJnEnk",
    "is_burned": false,
    "flags": 8,
    "transfer_fee": 0,
    "issuer": "rHVokeuSnjPjz718qdb47bGXBBHNMP3KDQ",
    "nft_taxon": 0,
    "nft_sequence": 0,
    "uri": "https://xrpl.org",
    "validated": true,
    "status": "success"
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    },
    {
      "id": 2002,
      "message": "This server may be out of date"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット](../../api-conventions/response-formatting.md) に従い、成功すると以下のフィールドをいくつか並べた`nft_info`レスポンスオブジェクトが返されます。

| `Field`                           | 型                  | 説明                 |
|:----------------------------------|:-------------------|:---------------------|
| `nft_id`                          | 文字列              | 非代替性トークン(NFT)の一意の識別子。 |
| `ledger_index`                    | 整数                | NFT がミント(作成)された、所有者が変わった(取引された)、バーンされた(破棄された)など、このNFTの状態が変更された最新のレジャーバージョンの[レジャーインデックス](basic-data-types.html#レジャーインデックス)。返される情報には、リクエストされたレジャーと比較して直近に起こったことが含まれます。 |
| `owner`                           | 文字列              | このレジャーインデックスにおけるこのNFTの所有者のアカウントID。 |
| `is_burned`                       | 真偽値              | NFTがこのレジャーでバーンされていれば`true`を、そうでなければ`false`を返します。 |
| `flags `                          | 整数                | このNFTのフラグ |
| `transfer_fee`                    | 整数                | このNFTの送金手数料。送金手数料の詳細については、[NFTokenMintのフィールド](nftokenmint.html#nftokenmint-フィールド)をご覧ください。 |
| `issuer`                          | 文字列              | このNFTの発行者を示すアカウントID。|
| `nft_taxon`                       | 整数                | このNFTのTaxon。 |
| `nft_sequence`                    | 整数                | このNFTのシーケンス番号. |
| `uri`                             | 文字列 または `null` | _(NFTがこのレジャーでバーンされている場合は省略)_ NFTがこのレジャーでバーンされておらず、URIを持っていない場合、このフィールドは`null`です。NFTがこのレジャーでバーンされておらず、URIを持っている場合、このフィールドはNFTのデコードされたURIを含む文字列です。注意: バーンされたトークンのURIを取得する必要がある場合、トークンの`nft_info`をリクエストし直してください。その際、`ledger_index`にはトークンがバーンされたインデックスの一つ前（{_トークンがバーンされたレジャーインデックス_} - 1）を指定してください。 |


## 考えられるエラー

* いずれかの[汎用エラータイプ](error-formatting.html#汎用エラー)。
