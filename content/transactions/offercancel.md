## OfferCancel

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CancelOffer.cpp "Source")

An OfferCancel transaction removes an Offer object from the XRP Ledger.

```
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

| Field         | JSON Type        | [Internal Type][] | Description           |
|:--------------|:-----------------|:------------------|:----------------------|
| OfferSequence | Unsigned Integer | UInt32            | The sequence number of a previous OfferCreate transaction. If specified, cancel any offer object in the ledger that was created by that transaction. It is not considered an error if the offer specified does not exist. |

*Tip:* To remove an old offer and replace it with a new one, you can use an [OfferCreate transaction][] with an `OfferSequence` parameter, instead of using OfferCancel and another OfferCreate.

The OfferCancel method returns [tesSUCCESS](reference-transaction-results.html) even if it did not find an offer with the matching sequence number.
