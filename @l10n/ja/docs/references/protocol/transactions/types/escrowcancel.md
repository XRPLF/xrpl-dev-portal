---
seo:
    description: Escrowに留保されているXRPを送金元に返金します。
labels:
    - Escrow
---
# EscrowCancel
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

Escrowに留保されているXRPを送金元に返金します。

{% amendment-disclaimer name="Escrow" /%}

## {% $frontmatter.seo.title %} JSONの例

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "TransactionType": "EscrowCancel",
   "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "OfferSequence": 7,
}
```

{% tx-example txid="B24B9D7843F99AED7FB8A3929151D0CCF656459AE40178B77C9D44CED64E839B" /%}


{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド           | JSONの型 | [内部の型][] | 説明                |
|:----------------|:----------|:------------------|:---------------------------|
| `Owner`         | 文字列    | AccountID         | Escrow経由の支払いに資金を供給した支払元アカウントのアドレス。 |
| `OfferSequence` | 数値    | UInt32            | 取り消すEscrowを作成した[EscrowCreateトランザクション][]のトランザクションシーケンス。 |

EscrowCancelトランザクションはどのアカウントからでも送信できます。

* 対応する[EscrowCreateトランザクション][]で`CancelAfter`時刻が指定されていない場合、EscrowCancelトランザクションは失敗します。
* 指定されていても、`CancelAfter`時刻が最後に閉鎖されたレジャーの閉鎖時刻よりも後である場合は、EscrowCancelトランザクションが失敗します。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
