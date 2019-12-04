# EscrowCancel

[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

_Requires the [Escrow amendment][]._

Return escrowed XRP to the sender.

## Example {{currentpage.name}} JSON

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


| Field           | JSON Type | [Internal Type][] | Description                |
|:----------------|:----------|:------------------|:---------------------------|
| `Owner`         | String    | AccountID         | Address of the source account that funded the escrow payment. |
| `OfferSequence` | Number    | UInt32            | Transaction sequence of [EscrowCreate transaction][] that created the escrow to cancel. |

Any account may submit an EscrowCancel transaction.

* If the corresponding [EscrowCreate transaction][] did not specify a `CancelAfter` time, the EscrowCancel transaction fails.
* Otherwise the EscrowCancel transaction fails if the `CancelAfter` time is after the close time of the most recently-closed ledger.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
