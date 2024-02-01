---
html: depositpreauth.html
parent: transaction-types.html
seo:
    description: Preauthorizes an account to send payments to this one.
labels:
  - Security
---
# DepositPreauth
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DepositPreauth.cpp "Source")

_Added by the [DepositPreauth amendment][]._

A DepositPreauth transaction gives another account pre-approval to deliver payments to the sender of this transaction. This is only useful if the sender of this transaction is using (or plans to use) [Deposit Authorization](../../../../concepts/accounts/depositauth.md).

**Tip:** You can use this transaction to preauthorize certain counterparties before you enable Deposit Authorization. This may be useful to ensure a smooth transition from not requiring deposit authorization to requiring it.

## Example {% $frontmatter.seo.title %} JSON

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

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_DepositPreauth%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22CB1BF910C93D050254C049E9003DA1A265C107E0C8DE4A7CFF55FADFD39D5656%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| Field         | JSON Type | [Internal Type][] | Description |
|:--------------|:----------|:------------------|:-----|
| `Authorize`   | String    | AccountID         | _(Optional)_ The XRP Ledger address of the sender to preauthorize. |
| `Unauthorize` | String    | AccountID         | _(Optional)_ The XRP Ledger address of a sender whose preauthorization should be revoked. |

You must provide _either_ `Authorize` or `Unauthorize`, but not both.

This transaction has the following limitations:

- An account cannot preauthorize (or unauthorize) its own address. Attempting to do so fails with the result [`temCANNOT_PREAUTH_SELF`](../transaction-results/tem-codes.md).
- Attempting to preauthorize an account which is already preauthorized fails with the result [`tecDUPLICATE`](../transaction-results/tec-codes.md).
- Attempting to unauthorize an account which is not preauthorized fails with the result [`tecNO_ENTRY`](../transaction-results/tec-codes.md).
- Attempting to preauthorize an address that is not funded in the ledger fails with the result [`tecNO_TARGET`](../transaction-results/tec-codes.md).
- Adding authorization adds a [DepositPreauth object](../../ledger-data/ledger-entry-types/depositpreauth.md) to the ledger, which counts toward the [owner reserve requirement](../../../../concepts/accounts/reserves.md#owner-reserves). If the sender of the transaction does not have enough XRP to pay for the increased reserve, the transaction fails with the result [`tecINSUFFICIENT_RESERVE`](../transaction-results/tec-codes.md). If the sender of the account is already at the maximum number of owned objects, the transaction fails with the result [`tecDIR_FULL`](../transaction-results/tec-codes.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
