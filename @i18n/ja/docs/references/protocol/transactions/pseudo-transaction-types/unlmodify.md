---
html: unlmodify.html
parent: pseudo-transaction-types.html
seo:
    description: 現在オフラインとみなされている信頼できるバリデータのリストを変更します。
labels:
  - ブロックチェーン
---
# UNLModify

_([NegativeUNL amendment][]により追加されました)_

`UNLModify`[疑似トランザクション](pseudo-transaction-types.md)は[Negative UNL](../../../../concepts/consensus-protocol/negative-unl.md)の変更を示し、信頼できるバリデータがオフラインになったかオンラインに戻ってきたことを示します。

**注記:** 擬似トランザクションを送信することはできませんが、台帳を処理する際に擬似トランザクションを発見することがあります。

## {% $frontmatter.seo.title %} JSONの例

```json
{
  "Account": "",
  "Fee": "0",
  "LedgerSequence": 1600000,
  "Sequence": 0,
  "SigningPubKey": "",
  "TransactionType": "UNLModify",
  "UNLModifyDisabling": 1,
  "UNLModifyValidator": "ED6629D456285AE3613B285F65BBFF168D695BA3921F309949AFCD2CA7AFEC16FE",
}
```

{% partial file="/@i18n/ja/docs/_snippets/pseudo-tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| 名前                 | JSONの型 | [内部の型][] | 説明           |
|:---------------------|:--------|:------------------|:----------------------|
| `TransactionType`    | 文字列   | UInt16      | `0x0066`は文字列`UNLModify`にマッピングされ、このオブジェクトが`UNLModify`擬似トランザクションであることを表します。 |
| `LedgerSequence`     | 数値     | UInt32      | この擬似トランザクションが出現する[レジャーインデックス][]です。これは、この擬似トランザクションを、同じ変更の他の出現と区別するものです。 |
| `UNLModifyDisabling` | 数値     | UInt8       | `1`の場合、この変更はネガティブUNLにバリデータを追加することを意味します。0` の場合、この変更はネガティブ UNL からバリデータを削除することを意味します。(これらの値以外は使用できません) |
| `UNLModifyValidator` | 文字列   | Blob        | 追加または削除するバリデータであり、そのマスター公開鍵で識別されます。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
