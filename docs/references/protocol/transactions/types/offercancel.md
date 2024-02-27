---
html: offercancel.html
parent: transaction-types.html
seo:
    description: Withdraw a currency-exchange order.
labels:
  - Decentralized Exchange
---
# OfferCancel

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/CancelOffer.cpp "Source")

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

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_OfferCancel%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22E7697D162A606FCC138C5732BF0D2A4AED49386DC59235FC3E218650AAC19744%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field           | JSON Type | [Internal Type][] | Description                  |
|:----------------|:----------|:------------------|:-----------------------------|
| `OfferSequence` | Number    | UInt32            | The sequence number (or [Ticket](../../../../concepts/accounts/tickets.md) number) of a previous OfferCreate transaction. If specified, cancel any offer object in the ledger that was created by that transaction. It is not considered an error if the offer specified does not exist. |

*Tip:* To remove an old offer and replace it with a new one, you can use an [OfferCreate transaction][] with an `OfferSequence` parameter, instead of using OfferCancel and another OfferCreate.

The OfferCancel method returns [`tesSUCCESS`](../transaction-results/tes-success.md) even if it did not find an offer with the matching sequence number.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
