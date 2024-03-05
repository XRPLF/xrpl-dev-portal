---
html: checkcancel.html
parent: transaction-types.html
seo:
    description: 未清算のCheckを取り消し、送金を行わずにレジャーから削除します。
labels:
  - Checks
---
# CheckCancel
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CancelCheck.cpp "Source")

_（[Checks Amendment][]が必要です）_

未清算のCheckを取り消し、送金を行わずにレジャーから削除します。Checkの送金元または送金先は、いつでもこのトランザクションタイプを使用してCheckを取り消すことができます。有効期限切れのCheckはすべてのアドレスが取り消すことができます。

## {% $frontmatter.seo.title %} JSONの例

```json
{
   "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
   "TransactionType": "CheckCancel",
   "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
   "Fee": "12"
}
```

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| フィールド       | JSONの型 | [内部の型][] | 説明                    |
|:------------|:----------|:------------------|:-------------------------------|
| `CheckID`   | 文字列    | Hash256           | 取り消す[Checkレジャーオブジェクト](../../ledger-data/ledger-entry-types/check.md)のID（64文字の16進文字列）。 |

## エラーケース

- `CheckID`により識別されるオブジェクトが存在していないか、またはCheckではない場合、トランザクションは結果コード`tecNO_ENTRY`で失敗します。
- Checkが有効期限切れではなく、CheckCancelトランザクションの送信者がCheckの送金元または送金先ではない場合、トランザクションは結果コード`tecNO_PERMISSION`で失敗します。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
