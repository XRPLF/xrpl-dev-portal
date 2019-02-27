# EscrowFinish

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

_Requires the [Escrow amendment][]._

Deliver XRP from a held payment to the recipient.

## Example {{currentpage.name}} JSON

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

{% include '_snippets/tx-fields-intro.md' %}
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

**Note:** The minimum [transaction cost](transaction-cost.html) to submit an EscrowFinish transaction increases if it contains a fulfillment. If the transaction has no fulfillment, the transaction cost is the standard 10 drops. If the transaction contains a fulfillment, the transaction cost is 330 [drops of XRP][] plus another 10 drops for every 16 bytes in size of the preimage.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
