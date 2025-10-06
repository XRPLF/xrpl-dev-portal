---
seo:
    description: Cancel an offer to trade in the decentralized exchange.
labels:
    - Decentralized Exchange
---
# OfferCancel

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/CancelOffer.cpp "Source")

Cancel an [offer](../../../../concepts/tokens/decentralized-exchange/offers.md) to trade in the decentralized exchange.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "OfferCancel",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108629,
    "OfferSequence": 6,
    "Sequence": 7
}
```

{% tx-example txid="E7697D162A606FCC138C5732BF0D2A4AED49386DC59235FC3E218650AAC19744" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field           | JSON Type | [Internal Type][] | Description                  |
|:----------------|:----------|:------------------|:-----------------------------|
| `OfferSequence` | Number    | UInt32            | The sequence number (or [Ticket](../../../../concepts/accounts/tickets.md) number) of a previous OfferCreate transaction. If specified, cancel any offer object in the ledger that was created by that transaction. It is not considered an error if the offer specified does not exist. |

{% admonition type="success" name="Tip" %}To remove an old offer and replace it with a new one, you can use an [OfferCreate transaction][] with an `OfferSequence` parameter, instead of using OfferCancel and another OfferCreate.{% /admonition %}

The OfferCancel method returns [`tesSUCCESS`](../transaction-results/tes-success.md) even if it did not find an offer with the matching sequence number.

## See Also

- [Offer entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
