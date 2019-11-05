# OfferCancel

[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CancelOffer.cpp "Source")

OfferCancelトランザクションは、XRP LedgerからOfferオブジェクトを削除します。

## {{currentpage.name}}のJSONの例

```json
{
   "TransactionType":"OfferCancel",
   "Account":"ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
   "Fee":"12",
   "Flags":0,
   "LastLedgerSequence":7108629,
   "OfferSequence":6,
   "Sequence":7
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド         | JSONの型 | [内部の型][] | 説明                  |
|:--------------|:----------|:------------------|:-----------------------------|
| OfferSequence | 数値    | UInt32            | 前のOfferCreateトランザクションのシーケンス番号。指定されている場合は、レジャーでそのトランザクションにより作成されたOfferオブジェクトがすべて取り消されます。指定されたオファーが存在しない場合はエラーと見なされません。 |

*ヒント:* 古いオファーを削除して新しいオファーに置き換えるには、OfferCancelとOfferCreateを使用する代わりに、`OfferSequence`パラメーターを指定した[OfferCreateトランザクション][]を使用できます。

OfferCancelメソッドは、一致するシーケンス番号が見つからない場合でも[tesSUCCESS](tes-success.html)を返します。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
