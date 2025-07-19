---
html: offercancel.html
parent: transaction-types.html
seo:
    description: Withdraw a currency-exchange order.
labels:
  - Decentralized Exchange
---
# OfferCancel

[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/CancelOffer.cpp "Source")

An OfferCancel transaction removes an Offer object from the XRP Ledger.

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

{% raw-partial file="/docs/_snippets/common-links.md" /%}
