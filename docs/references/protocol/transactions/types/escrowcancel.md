---
html: escrowcancel.html
parent: transaction-types.html
seo:
    description: Reclaim escrowed XRP.
labels:
  - Escrow
---
# EscrowCancel

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

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

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_EscrowCancel%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22B24B9D7843F99AED7FB8A3929151D0CCF656459AE40178B77C9D44CED64E839B%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| Field           | JSON Type | [Internal Type][] | Description                |
|:----------------|:----------|:------------------|:---------------------------|
| `Owner`         | String    | AccountID         | Address of the source account that funded the escrow payment. |
| `OfferSequence` | Number    | UInt32            | Transaction sequence (or [Ticket](../../../../concepts/accounts/tickets.md) number) of [EscrowCreate transaction][] that created the escrow to cancel. |

Any account may submit an EscrowCancel transaction.

* If the corresponding [EscrowCreate transaction][] did not specify a `CancelAfter` time, the EscrowCancel transaction fails.
* Otherwise the EscrowCancel transaction fails if the `CancelAfter` time is after the close time of the most recently-closed ledger.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
