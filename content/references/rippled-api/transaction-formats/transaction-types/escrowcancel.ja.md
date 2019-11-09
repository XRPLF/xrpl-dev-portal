# EscrowCancel

[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

_[Escrow Amendment][]が必要です。_

Escrowに留保されているXRPを送金元に返金します。

## {{currentpage.name}} JSONの例

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "TransactionType": "EscrowCancel",
   "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "OfferSequence": 7,
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド           | JSONの型 | [内部の型][] | 説明                |
|:----------------|:----------|:------------------|:---------------------------|
| `Owner`         | 文字列    | AccountID         | Escrow経由の支払いに資金を供給した支払元アカウントのアドレス。 |
| `OfferSequence` | 数値    | UInt32            | 取り消すEscrowを作成した[EscrowCreateトランザクション][]のトランザクションシーケンス。 |

EscrowCancelトランザクションはどのアカウントからでも送信できます。

* 対応する[EscrowCreateトランザクション][]で`CancelAfter`時刻が指定されていない場合、EscrowCancelトランザクションは失敗します。
* 指定されていても、`CancelAfter`時刻が最後に閉鎖されたレジャーの閉鎖時刻よりも後である場合は、EscrowCancelトランザクションが失敗します。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}