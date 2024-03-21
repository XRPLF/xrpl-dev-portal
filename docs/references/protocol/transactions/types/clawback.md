---
html: clawback.html
parent: transaction-types.html
seo:
    description: Claw back tokens you've issued.
labels:
  - Tokens
---
# Clawback

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Clawback.cpp "Source")

{% partial file="/docs/_snippets/clawback-disclaimer.md" /%}

Claw back tokens issued by your account.

Clawback is disabled by default. To use clawback, you must send an [AccountSet transaction][] to enable the **Allow Trust Line Clawback** setting. An issuer with any existing tokens cannot enable Clawback. You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists.  After you enable Clawback, it cannot reverted: the account permanently gains the ability to claw back issued assets on trust lines.

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "Clawback",
  "Account": "rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S",
  "Amount": {
      "currency": "FOO",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "314.159"
    }
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field              | JSON Type | [Internal Type][] | Description       |
|:-------------------|:----------|:------------------|:------------------|
| `Amount`           | [Currency Amount][]  | Amount |Indicates the amount being clawed back, as well as the counterparty from which the amount is being clawed back. The quantity to claw back, in the `value` sub-field, must not be zero. If this is more than the current balance, the transaction claws back the entire balance. The sub-field `issuer` within `Amount` represents the token holder's account ID, rather than the issuer's.|

**Note:** In the XRP Ledger, the party that created a token is called the _issuer_, but trust lines are bidirectional and, under some configurations, both sides can be seen as the issuer. In this transaction, the token issuer's address is in the `Account` field, and the token holder's address is in the `Amount` field's `issuer` sub-field.


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | Occurs if the [Clawback amendment](/resources/known-amendments.md#clawback) is not enabled. |
| `temBAD_AMOUNT` | Occurs if the holder's balance is 0. It is not an error if the amount exceeds the holder's balance; in that case, the maximum available balance is clawed back. Also occurs if the counterparty listed in `Amount` is the same as the `Account` issuing this transaction. |
| `tecNO_LINE` | Occurs there is no trust line with the counterparty or that trust line's balance is 0. |
| `tecNO_PERMISSION` | Occurs if you attempt to set `lsfAllowTrustlineClawback` while `lsfNoFreeze` is set. Also occurs, conversely, if you try to set `lsfNoFreeze` while `lsfAllowTrustLineClawback` is set. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
