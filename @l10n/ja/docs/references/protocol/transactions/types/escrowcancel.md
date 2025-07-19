---
html: escrowcancel.html
parent: transaction-types.html
seo:
    description: Escrowに留保されているXRPを送金元に返金します。
labels:
  - Escrow
---
# EscrowCancel

[[ソース]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/Escrow.cpp "Source")

_[Escrow Amendment][]により追加されました。_

Escrowに留保されているXRPを送金元に返金します。

## {% $frontmatter.seo.title %} JSONの例

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "TransactionType": "EscrowCancel",
   "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "OfferSequence": 7,
}
```

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| フィールド           | JSONの型 | [内部の型][] | 説明                |
|:----------------|:----------|:------------------|:---------------------------|
| `Owner`         | 文字列    | AccountID         | Escrow経由の支払いに資金を供給した支払元アカウントのアドレス。 |
| `OfferSequence` | 数値    | UInt32            | 取り消すEscrowを作成した[EscrowCreateトランザクション][]のトランザクションシーケンス。 |

EscrowCancelトランザクションはどのアカウントからでも送信できます。

* 対応する[EscrowCreateトランザクション][]で`CancelAfter`時刻が指定されていない場合、EscrowCancelトランザクションは失敗します。
* 指定されていても、`CancelAfter`時刻が最後に閉鎖されたレジャーの閉鎖時刻よりも後である場合は、EscrowCancelトランザクションが失敗します。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
