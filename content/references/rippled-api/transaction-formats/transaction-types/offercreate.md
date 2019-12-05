# OfferCreate

[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateOffer.cpp "Source")

An OfferCreate transaction is effectively a [limit order](http://en.wikipedia.org/wiki/limit_order). It defines an intent to exchange currencies, and creates an [Offer object](offer.html) if not completely fulfilled when placed. Offers can be partially fulfilled.

For more information about how Offers work, see [Offers](offers.html).

## Example {{currentpage.name}} JSON

```json
{
    "TransactionType": "OfferCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108682,
    "Sequence": 8,
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    }
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| Field          | JSON Type           | [Internal Type][] | Description       |
|:---------------|:--------------------|:------------------|:------------------|
| [Expiration][] | Number              | UInt32            | _(Optional)_ Time after which the offer is no longer active, in [seconds since the Ripple Epoch][]. |
| OfferSequence  | Number              | UInt32            | _(Optional)_ An offer to delete first, specified in the same way as [OfferCancel][]. |
| TakerGets      | [Currency Amount][] | Amount            | The amount and type of currency being provided by the offer creator. |
| TakerPays      | [Currency Amount][] | Amount            | The amount and type of currency being requested by the offer creator. |

[Expiration]: offers.html#offer-expiration

## OfferCreate Flags

Transactions of the OfferCreate type support additional values in the [`Flags` field](transaction-common-fields.html#flags-field), as follows:

| Flag Name           | Hex Value  | Decimal Value | Description               |
|:--------------------|:-----------|:--------------|:--------------------------|
| tfPassive           | 0x00010000 | 65536         | If enabled, the offer does not consume offers that exactly match it, and instead becomes an Offer object in the ledger. It still consumes offers that cross it. |
| tfImmediateOrCancel | 0x00020000 | 131072        | Treat the offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel). If enabled, the offer never becomes a ledger object: it only tries to match existing offers in the ledger. If the offer cannot match any offers immediately, it executes "successfully" without trading any currency. In this case, the transaction has the [result code](transaction-results.html) `tesSUCCESS`, but creates no [Offer objects](offer.html) in the ledger. |
| tfFillOrKill        | 0x00040000 | 262144        | Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill). Only try to match existing offers in the ledger, and only do so if the entire `TakerPays` quantity can be obtained. If the [fix1578 amendment][] is enabled and the offer cannot be executed when placed, the transaction has the [result code](transaction-results.html) `tecKILLED`; otherwise, the transaction uses the result code `tesSUCCESS` even when it was killed without trading any currency. |
| tfSell              | 0x00080000 | 524288        | Exchange the entire `TakerGets` amount, even if it means obtaining more than the `TakerPays` amount in exchange. |

The following invalid flag combination prompts a `temINVALID_FLAG` error:

* tfImmediateOrCancel and tfFillOrKill







<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
