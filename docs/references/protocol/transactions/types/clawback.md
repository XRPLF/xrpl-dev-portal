---
seo:
    description: Claw back tokens you've issued.
labels:
    - Tokens
---
# Clawback
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Clawback.cpp "Source")

[Claw back tokens](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md) issued by your account. Issuers can only claw back [trust line tokens](../../../../concepts/tokens/fungible-tokens/trust-line-tokens.md) if they enabled the **Allow Trust Line Clawback** setting before issuing any tokens. Issuers can claw back [MPTs](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) if the corresponding MPT Issuance has clawback enabled.

{% amendment-disclaimer name="Clawback" /%}

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

| Field              | JSON Type | [Internal Type][] | Required? | Description |
|:-------------------|:----------|:------------------|:----------|-------------|
| `Amount`           | [Currency Amount][]  | Amount | Yes       | The amount to claw back. The quantity in the `value` sub-field must not be zero. If this is more than the current balance, the transaction claws back the entire balance. When clawing back trust line tokens, the `issuer` sub-field indicates the token holder to claw back tokens from.|
| `Holder`           | String    | AccountID         | No        | The holder to claw back tokens from, if clawing back MPTs. The holder must have a non-zero balance of the MPT issuance indicated in the `Amount` field. {% amendment-disclaimer name="MPTokensV1" /%} |

When clawing back trust line tokens, you must omit the `Holder` field. When clawing back MPTs, you must provide the `Holder` field.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | The [Clawback amendment][] is not enabled. |
| `temBAD_AMOUNT` | The amount of tokens specified to claw back is invalid or zero, or the specified holder is the issuer. |
| `tecAMM_ACCOUNT` | The specified holder is an Automated Market Maker (AMM). To claw back tokens from an AMM, use [`AMMClawback`](./ammclawback.md) instead. |
| `tecNO_LINE` | There is no trust line with the counterparty or that trust line's balance is 0. |
| `tecNO_PERMISSION` | The sender of this transaction does not have the ability to claw back the specified tokens. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
