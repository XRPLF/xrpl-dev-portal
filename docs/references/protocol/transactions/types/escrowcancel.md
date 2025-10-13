---
seo:
    description: Cancel an expired escrow, returning the funds to the sender.
labels:
    - Escrow
---
# EscrowCancel
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

Return funds from an expired [escrow](../../../../concepts/payment-types/escrow.md) to its sender.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowCancel",
    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "OfferSequence": 7,
}
```

{% tx-example txid="B24B9D7843F99AED7FB8A3929151D0CCF656459AE40178B77C9D44CED64E839B" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field           | JSON Type            | [Internal Type][] | Description                |
|:----------------|:---------------------|:------------------|:---------------------------|
| `Owner`         | String - [Address][] | AccountID         | The account that funded the escrow payment. |
| `OfferSequence` | Number               | UInt32            | Transaction sequence (or [Ticket](../../../../concepts/accounts/tickets.md) number) of [EscrowCreate transaction][] that created the escrow to cancel. |

Any account may submit an EscrowCancel transaction.

* If the corresponding [EscrowCreate transaction][] did not specify a `CancelAfter` time, the EscrowCancel transaction fails.
* Otherwise the EscrowCancel transaction fails if the `CancelAfter` time is after the close time of the most recently-closed ledger.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:------------------------- |:------------|
| `tecNO_AUTH`              | The transaction failed because authorization requirements were not met. For example, the issuer requires authorization and the sender is not authorized. |
| `tecNO_LINE`              | The sender does not have a trust line with the issuer. For Trust Line Tokens only. |
| `tecNO_ENTRY` | The sender does not hold the MPT. |
| `tecINSUFFICIENT_RESERVE` | Unable to create a trust line or MPToken due to lack of reserves. |

## See Also

- [Escrow entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
