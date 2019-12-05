# DepositPreauth
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/DepositPreauth.cpp "Source")

_Requires the [DepositPreauth amendment][]._

A DepositPreauth transaction gives another account pre-approval to deliver payments to the sender of this transaction. This is only useful if the sender of this transaction is using (or plans to use) [Deposit Authorization](depositauth.html).

**Tip:** You can use this transaction to preauthorize certain counterparties before you enable Deposit Authorization. This may be useful to ensure a smooth transition from not requiring deposit authorization to requiring it.

## Example {{currentpage.name}} JSON

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

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| Field         | JSON Type | [Internal Type][] | Description |
|:--------------|:----------|:------------------|:-----|
| `Authorize`   | String    | AccountID         | _(Optional)_ The XRP Ledger address of the sender to preauthorize. |
| `Unauthorize` | String    | AccountID         | _(Optional)_ The XRP Ledger address of a sender whose preauthorization should be revoked. |

You must provide _either_ `Authorize` or `Unauthorize`, but not both.

This transaction has the following limitations:

- An account cannot preauthorize (or unauthorize) its own address. Attempting to do so fails with the result [`temCANNOT_PREAUTH_SELF`](tem-codes.html).
- Attempting to preauthorize an account which is already preauthorized fails with the result [`tecDUPLICATE`](tec-codes.html).
- Attempting to unauthorize an account which is not preauthorized fails with the result [`tecNO_ENTRY`](tec-codes.html).
- Attempting to preauthorize an address that is not funded in the ledger fails with the result [`tecNO_TARGET`](tec-codes.html).
- Adding authorization adds a [DepositPreauth object](depositpreauth-object.html) to the ledger, which counts toward the [owner reserve requirement](reserves.html#owner-reserves). If the sender of the transaction does not have enough XRP to pay for the increased reserve, the transaction fails with the result [`tecINSUFFICIENT_RESERVE`](tec-codes.html). If the sender of the account is already at the maximum number of owned objects, the transaction fails with the result [`tecDIR_FULL`](tec-codes.html).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
