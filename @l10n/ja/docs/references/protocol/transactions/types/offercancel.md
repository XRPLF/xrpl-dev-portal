---
html: offercancel.html
parent: transaction-types.html
seo:
  description: XRP LedgerからOfferオブジェクトを削除します。
labels:
  - 分散型取引所
---

# OfferCancel

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/CancelOffer.cpp "Source")

OfferCancelトランザクションは、XRP LedgerからOfferオブジェクトを削除します。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "TransactionType": "OfferCancel",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108629,
  "OfferSequence": 6,
  "Sequence": 7
}
```

{% tx-example txid="E7697D162A606FCC138C5732BF0D2A4AED49386DC59235FC3E218650AAC19744" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド    | JSONの型 | [内部の型][] | 説明                                                                                                                                                                                                                       |
| :------------ | :------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OfferSequence | 数値     | UInt32       | 前のOfferCreateトランザクションのシーケンス番号。指定されている場合は、レジャーでそのトランザクションにより作成されたOfferオブジェクトがすべて取り消されます。指定されたオファーが存在しない場合はエラーと見なされません。 |

{% admonition type="success" name="ヒント" %}古いオファーを削除して新しいオファーに置き換えるには、OfferCancelとOfferCreateを使用する代わりに、`OfferSequence`パラメーターを指定した[OfferCreateトランザクション][]を使用できます。{% /admonition %}

OfferCancelメソッドは、一致するシーケンス番号が見つからない場合でも[tesSUCCESS](../transaction-results/tes-success.md)を返します。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
