---
html: nft_buy_offers.html
parent: path-and-order-book-methods.html
seo:
    description: NFTokenに対するすべての購入オファーのリストを取得します。
labels:
  - 非代替性トークン, NFT, NFToken
---
# nft_buy_offers
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/NFTOffers.cpp "ソース")

`nft_buy_offers`メソッドは、与えられた[NFToken][]オブジェクトに対する購入オファーのリストを返します。

_([NonFungibleTokensV1_1 amendment][]により追加されました。)_

## リクエストのフォーマット
リクエストのフォーマットの例：

{% raw-partial file="/@i18n/ja/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "nft_buy_offers",
  "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "nft_buy_offers",
  "params": [{
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#nft_buy_offers)

リクエストには以下のパラメーターが含まれます。

| `Field`        | 型               | 説明                                      |
|:---------------|:-----------------|:-----------------------------------------|
| `nft_id`       | 文字列            | [NFToken][] オブジェクトの一意の識別子。      |
| `ledger_hash`  | 文字列            | _(省略可)_ 使用するレジャーのバージョンを示す20バイトの16進文字列。[レジャーの指定][]をご覧ください）。 |
| `ledger_index` | 文字列 または 数値  | _(省略可)_ 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。[レジャーの指定][]をご覧ください）。 |
| `limit`        | 整数値            | _(省略可)_ 取得するNFTの購入オファーの数を制限します。この値は50未満または500を超えることはできません。この範囲外の正の値は、最も近い有効な値に置き換えられます。デフォルトは250です。 |
| `marker`       | [マーカー][]       | _(省略可)_ 以前のページ分割されたレスポンスの値。そのレスポンスが終了したところからデータの取得を再開します。 |


## レスポンスのフォーマット
処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "offers": [
      {
        "amount": "1500",
        "flags": 0,
        "nft_offer_index": "3212D26DB00031889D4EF7D9129BB0FA673B5B40B1759564486C0F0946BA203F",
        "owner": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx"
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
  "result": {
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "offers": [
      {
        "amount": "1500",
        "flags": 0,
        "nft_offer_index": "3212D26DB00031889D4EF7D9129BB0FA673B5B40B1759564486C0F0946BA203F",
        "owner": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx"
      }
    ],
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`  | 型         | 説明                                                  |
|:---------|:-----------|:-----------------------------------------------------|
| `nft_id` | 文字列      | リクエストで指定された NFToken   |
| `offers` | 配列        | トークンの購入オファー一覧。各オファーは **購入オファー** (下記参照)の形式で表示されます。 |
| `limit`  | 数値        | _(省略可)_ リクエストで指定された`limit`。 |
| `marker` | [マーカー][] | _(省略可)_ レスポンスがページ分割されていることを示す、サーバ定義の値。これを次の呼び出しに渡すと、この呼び出しが中断したところから再開します。この後に情報のページがない場合は省略されます。 |

### 購入オファー

`offers`配列の各メンバーは、対象のNFTを購入するための1つの[NFTokenOfferオブジェクト][]を表し、以下のフィールドを持ちます。

| `Field`           | 型                     | 説明                                   |
|:------------------|:-----------------------|:--------------------------------------|
| `amount`          | 文字列 または オブジェクト | NFTを購入するために提示される金額で、XRPのドロップ数を表す文字列、または(代替可能)トークンの金額を表すオブジェクトです。([通貨金額の指定][通貨額]をご覧ください)。 |
| `flags`           | 数値                    | このオファーのためのフラグ。指定できる値については、[NFTokenOfferのフラグ](../../../protocol/ledger-data/ledger-entry-types/nftokenoffer.md#nftokenofferのフラグ)をご覧ください。 |
| `nft_offer_index` | 文字列                   | このオファーの[レジャーオブジェクトID](../../../protocol/ledger-data/common-fields.md)。 |
| `owner`           | 文字列                   | このオファーを作成アカウント。   |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されているアドレスが、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
