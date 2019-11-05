# OfferCreate

[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateOffer.cpp "Source")

OfferCreateトランザクションは、効果的な[指値注文](http://en.wikipedia.org/wiki/limit_order)です。OfferCreateは通貨の交換を行う意図を定義するもので、配置時に完全に履行されていない場合は[Offerオブジェクト](offer.html)を作成します。オファーは部分的に履行することもできます。

オファーがどのように機能するかについての詳細は、[オファー](offers.html)を参照してください。

## {{currentpage.name}} JSONの例

```json
{
    "TransactionType": "OfferCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108682,
    "Sequence": 8,
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    }
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド          | JSONの型           | [内部の型][] | 説明       |
|:---------------|:--------------------|:------------------|:------------------|
| [Expiration][] | 数字              | UInt32            | _（省略可）_ オファーがアクティブでなくなるまでの時間（[Rippleエポック以降の経過秒数][]）。 |
| OfferSequence  | 数字              | UInt32            | _（省略可）_ 最初に削除されるオファー（[OfferCancel][]と同様に指定されます）。 |
| TakerGets      | [通貨額][] | Amount            | オファーの作成者によって作成される金額および通貨の種類。 |
| TakerPays      | [通貨額][] | Amount            | オファーの作成者によって要求される金額および通貨の種類。 |

[Expiration]: offers.html#オファーの有効期限

## OfferCreateフラグ

OfferCreate型のトランザクションについては、[`Flags`フィールド](transaction-common-fields.html#flagsフィールド)で以下の値が追加でサポートされます。

| フラグ名           | 16進数  | 10進数 | 説明               |
|:--------------------|:-----------|:--------------|:--------------------------|
| tfPassive           | 0x00010000 | 65536         | 有効な場合、オファーはオファーが完全に一致するオファーを消費せず、代わりにレジャーのOfferオブジェクトになります。それはまだクロスしたオファーを消費します。 |
| tfImmediateOrCancel | 0x00020000 | 131072        | オファーを[IOC注文](http://en.wikipedia.org/wiki/Immediate_or_cancel)として扱います。有効な場合、オファーはレジャーオブジェクトにはなりません。レジャー内の既存のオファーと一致させようとするだけです。即時にオファーがどのオファーとも一致しない場合、どの通貨とも取引せずに「正常に」実行します。この場合、トランザクションは `tesSUCCESS`の[結果コード](transaction-results.html)を返しますが、レジャー内には、[Offerオブジェクト](offer.html)を作成しません。 |
| tfFillOrKill        | 0x00040000 | 262144        | オファーを[FOK注文](http://en.wikipedia.org/wiki/Fill_or_kill)として扱います。レジャー内の既存のオファーのみを一致私用とします。またこれは、全`TakerPays`の数量が取得できる場合に限られます。[fix1578 amendment][]が有効な場合でオファーを配置した時に実行できない場合、トランザクションは`tecKILLED`の[結果コード](transaction-results.html)を返します。そうでない場合は、トランザクションは、どの通貨とも取り引きせずにキャンセルされた場合でも`tesSUCCESS`の結果コードを返します。 |
| tfSell              | 0x00080000 | 524288        | 取引所で`TakerPays` Amountよりも多く取得することになっても、`TakerGets` Amountを交換します。 |

次の無効なフラグの組合せは、`temINVALID_FLAG`エラーを返します。

* tfImmediateOrCancelとtfFillOrKill







<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
