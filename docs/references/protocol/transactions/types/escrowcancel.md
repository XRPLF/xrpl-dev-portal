---
html: escrowcancel.html
parent: transaction-types.html
seo:
    description: Reclaim escrowed XRP.
labels:
  - Escrow
---
# EscrowCancel

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

_Added by the [Escrow amendment][]._

Return escrowed XRP to the sender.

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

| Field           | JSON Type | [Internal Type][] | Description                |
|:----------------|:----------|:------------------|:---------------------------|
| `Owner`         | String    | AccountID         | Address of the source account that funded the escrow payment. |
| `OfferSequence` | Number    | UInt32            | Transaction sequence (or [Ticket](../../../../concepts/accounts/tickets.md) number) of [EscrowCreate transaction][] that created the escrow to cancel. |

Any account may submit an EscrowCancel transaction.

* If the corresponding [EscrowCreate transaction][] did not specify a `CancelAfter` time, the EscrowCancel transaction fails.
* Otherwise the EscrowCancel transaction fails if the `CancelAfter` time is after the close time of the most recently-closed ledger.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
