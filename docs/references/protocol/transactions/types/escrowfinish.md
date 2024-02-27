---
html: escrowfinish.html
parent: transaction-types.html
seo:
    description: Deliver escrowed XRP to recipient.
labels:
  - Escrow
---
# EscrowFinish

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

_Added by the [Escrow amendment][]._

Deliver XRP from a held payment to the recipient.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowFinish",
    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "OfferSequence": 7,
    "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
    "Fulfillment": "A0028000"
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_EscrowFinish%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22317081AF188CDD4DBE55C418F41A90EC3B959CDB3B76105E0CBE6B7A0F56C5F7%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| Field           | JSON Type        | [Internal Type][] | Description         |
|:----------------|:-----------------|:------------------|:--------------------|
| `Owner`         | String           | AccountID         | Address of the source account that funded the held payment. |
| `OfferSequence` | Unsigned Integer | UInt32            | Transaction sequence of [EscrowCreate transaction][] that created the held payment to finish. |
| `Condition`     | String           | Blob              | _(Optional)_ Hex value matching the previously-supplied [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1) of the held payment. |
| `Fulfillment`   | String           | Blob              | _(Optional)_ Hex value of the [PREIMAGE-SHA-256 crypto-condition fulfillment](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1.4) matching the held payment's `Condition`. |

Any account may submit an EscrowFinish transaction.

- If the held payment has a `FinishAfter` time, you cannot execute it before this time. Specifically, if the corresponding [EscrowCreate transaction][] specified a `FinishAfter` time that is after the close time of the most recently-closed ledger, the EscrowFinish transaction fails.
- If the held payment has a `Condition`, you cannot execute it unless you provide a matching `Fulfillment` for the condition.
- You cannot execute a held payment after it has expired. Specifically, if the corresponding [EscrowCreate transaction][] specified a `CancelAfter` time that is before the close time of the most recently-closed ledger, the EscrowFinish transaction fails.

**Note:** The minimum [transaction cost](../../../../concepts/transactions/transaction-cost.md) to submit an EscrowFinish transaction increases if it contains a fulfillment. If the transaction has no fulfillment, the transaction cost is the standard 10 drops. If the transaction contains a fulfillment, the transaction cost is 330 [drops of XRP][] plus another 10 drops for every 16 bytes in size of the preimage.

In [non-production networks](../../../../concepts/networks-and-servers/parallel-networks.md), it may be possible [to delete](../../../../concepts/accounts/deleting-accounts.md) the destination account of a pending escrow. In this case, an attempt to finish the escrow fails with the result `tecNO_TARGET`, but the escrow object remains unless it has expired normally. If another payment re-creates the destination account, the escrow can be finished successfully. The destination account of an escrow can only be deleted if the escrow was created before the [fix1523 amendment](/resources/known-amendments.md#fix1523) became enabled. No such escrows exist in the production XRP Ledger, so this edge case is not possible on the production XRP Ledger. This edge case is also not possible in test networks that enable both fix1523 and Escrow amendments at the same time, which is the default when you [start a new genesis ledger](../../../../infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
