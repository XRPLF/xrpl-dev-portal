---
html: depositpreauth.html
parent: transaction-types.html
seo:
    description: DepositPreauthトランザクションは別のアカウントに対し、このトランザクションの送信者に支払いを送金することを事前承認します。
labels:
  - セキュリティ
---
# DepositPreauth
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DepositPreauth.cpp "Source")

_[DepositPreauth Amendment][]により追加されました。_

DepositPreauthトランザクションは別のアカウントに対し、このトランザクションの送信者に支払いを送金することを事前承認します。これは、このトランザクションの送信者が[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を使用している（または使用する予定がある）場合にのみ有用です。

**ヒント:** このトランザクションを使用して、Deposit Authorizationを有効にする前に特定の取引相手を事前承認できます。これは、Deposit Authorizationの義務化への円滑な移行に役立ちます。

## {% $frontmatter.seo.title %} JSONの例

```json
{
 "TransactionType" : "DepositPreauth",
 "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
 "Authorize" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
 "Fee" : "10",
 "Flags" : 2147483648,
 "Sequence" : 2
}
```

{% partial file="/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| フィールド         | JSONの型 | [内部の型][] | 説明 |
|:--------------|:----------|:------------------|:-----|
| `Authorize`   | 文字列    | AccountID         | _（省略可）_ 事前承認する送信者のXRP Ledgerアドレス。 |
| `Unauthorize` | 文字列    | AccountID         | _（省略可）_ 事前承認を取り消す必要がある送信者のXRP Ledgerアドレス。 |

`Authorize`または`Unauthorize`_のいずれか_ を指定する必要がありますが、両方は指定しないでください。

このトランザクションには以下の制限があります。

- アカウントはそのアカウント自体のアドレスを事前承認（または承認解除）できません。このような操作をすると、[`temCANNOT_PREAUTH_SELF`](../transaction-results/tem-codes.md)で失敗します。
- すでに事前承認済みのアカウントを事前承認しようとすると、[`tecDUPLICATE`](../transaction-results/tec-codes.md)で失敗します。
- 事前承認されていないアカウントを承認解除しようとすると、[`tecNO_ENTRY`](../transaction-results/tec-codes.md)で失敗します。
- レジャーで資金が供給されていないアドレスを事前承認しようとすると、[`tecNO_TARGET`](../transaction-results/tec-codes.md)で失敗します。
- 承認を追加すると[DepositPreauthオブジェクト](../../ledger-data/ledger-entry-types/depositpreauth.md)がレジャーに追加されて、[所有者の必要準備金](../../../../concepts/accounts/reserves.md#所有者準備金)に反映されます。トランザクションの送信者に、増額された準備金の支払いに十分なXRPがない場合、トランザクションは[`tecINSUFFICIENT_RESERVE`](../transaction-results/tec-codes.md)で失敗します。アカウントの送信者の所有オブジェクトが最大数に達している場合、トランザクションは[`tecDIR_FULL`](../transaction-results/tec-codes.md)で失敗します。

{% raw-partial file="/_snippets/common-links.md" /%}
