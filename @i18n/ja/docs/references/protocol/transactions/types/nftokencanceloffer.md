---
html: nftokencanceloffer.html
parent: transaction-types.html
seo:
    description: NFTokenの売買のための既存のトークンへのオファーをキャンセルする。
labels:
  - NFT, 非代替性トークン
---
# NFTokenCancelOffer

`NFTokenCancelOffer`トランザクションは、`NFTokenCreateOffer`を使用して作成した既存のトークンへのオファーをキャンセルするために使用できます。

## {% $frontmatter.seo.title %} JSONの例

```json
{
      "TransactionType": "NFTokenCancelOffer",
      "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "NFTokenOffers": [
      "9C92E061381C1EF37A8CDE0E8FC35188BFC30B1883825042A64309AC09F4C36D"
    ]
}
```

_([NonFungibleTokensV1_1 amendment][]により追加されました)_


## アクセス権

`NFTokenOffer` オブジェクトで表される既存のオファーは、以下の方法でキャンセルすることができます。

* `NFTokenOffer`を最初に作成したアカウント
* `NFTokenOffer`の`Destination`フィールドのアカウント（存在する場合）
* `NFTokenOffer`が有効期限を指定しており、`NFTokenCancelOffer`が含まれる親レジャーのクローズ時刻が有効期限より大きい場合、任意のアカウントに設定することができます

このトランザクションは、リストアップされた`NFTokenOffer`オブジェクトがあればレジャーから削除し、それに応じて必要な準備金を調整します。`NFTokenOffer`が見つからなくてもエラーにはなりません。その場合、トランザクションは正常に完了するでしょう。

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド          | JSONの型  | [内部の型][]        | 説明                     |
|:------------------|:----------|:------------------|:-------------------------|
| `NFTokenOffers`     |  配列     | VECTOR256         | キャンセルする`NFTokenOffer`オブジェクトのIDの配列(`NFToken`オブジェクトのIDではなく、`NFTokenOffer`オブジェクトのID)です。各エントリは[NFTokenOffer](../../ledger-data/ledger-entry-types/nftokenoffer.md)オブジェクトの異なる[オブジェクトID](../../ledger-data/common-fields.md)である必要があり、配列に重複した項目がある場合、トランザクションはエラーとなります。 |

`NFTokenOffers`フィールドのIDの1つ以上が、レジャーに現在存在するオブジェクトを参照していない場合でも、トランザクションは成功します（たとえば、それらのオファーはすでに削除されている可能性があります）。IDの1つが存在するオブジェクトを指していても、[NFTokenOffer](../../ledger-data/ledger-entry-types/nftokenoffer.md)オブジェクトでない場合は、エラーでトランザクションが失敗します。

注意すべき点は、誤って`nft_offer_index`ではなく`nft_id`を指定してしまった場合、`tesSUCCESS`レスポンスを受け取る可能性があることです。適切にフォーマットされたID値が見つからない場合、システムは`NFTokenOffer`が既に削除されたと判断するからです。

IDが[NFTokenOffer](../../ledger-data/ledger-entry-types/nftokenoffer.md)オブジェクトでないオブジェクトを指している場合、トランザクションはエラーで失敗します。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード         | 説明                                                     |
|:-------------------|:--------------------------------------------------------|
| `temDISABLED`                 | [NonFungibleTokensV1 Amendment][]は有効ではありません。 |
| `temMALFORMED`     | トランザクションが有効なフォーマットではありませんでした。たとえば、`NFTokenOffers`配列が空であるか、一度にキャンセルできるオファーの最大数を超える数を含んでいた場合です。 |
| `tecNO_PERMISSION` | `NFTokenOffers`フィールドのIDのうち少なくとも1つが、キャンセルできないオブジェクトを参照しています。例えば、このトランザクションの送信者がオファーの所有者や`Destination`ではない場合や、オブジェクトが`NFTokenOffer`タイプのオブジェクトではなかった場合などです。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
