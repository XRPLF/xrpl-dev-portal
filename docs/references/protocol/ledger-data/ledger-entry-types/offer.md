---
html: offer.html
parent: ledger-entry-types.html
seo:
    description: An order to make a currency trade.
labels:
  - Decentralized Exchange
---
# Offer
[[Source]](https://github.com/XRPLF/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L57 "Source")

The `Offer` ledger entry describes an [Offer](../../../../concepts/tokens/decentralized-exchange/offers.md) to exchange currencies in the XRP Ledger's [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md). (In finance, this is more traditionally known as an _order_.) An [OfferCreate transaction][] only creates an `Offer` entry in the ledger when the Offer cannot be fully executed immediately by consuming other Offers already in the ledger.

An Offer can become unfunded through other activities in the network, while remaining in the ledger. When processing transactions, the network automatically removes any unfunded Offers that those transactions come across. (Otherwise, unfunded Offers remain, because _only_ transactions can change the ledger state.)


## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rBqb89MRQJnMPq8wTwEbtz4kvxrEDfcYvt",
    "BookDirectory": "ACC27DE91DBA86FC509069EAF4BC511D73128B780F2E54BF5E07A369E2446000",
    "BookNode": "0000000000000000",
    "Flags": 131072,
    "LedgerEntryType": "Offer",
    "OwnerNode": "0000000000000000",
    "PreviousTxnID": "F0AB71E777B2DA54B86231E19B82554EF1F8211F92ECA473121C655BFC5329BF",
    "PreviousTxnLgrSeq": 14524914,
    "Sequence": 866,
    "TakerGets": {
        "currency": "XAG",
        "issuer": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH",
        "value": "37"
    },
    "TakerPays": "79550000000",
    "index": "96F76F27D8A327FC48753167EC04A46AA0E382E6F57F32FD12274144D00F1797"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Name                | JSON Type        | [Internal Type][] | Required? | Description |
|:--------------------|:-----------------|:------------------|:----------|:------------|
| `Account`           | String           | AccountID         | Yes       | The address of the account that owns this Offer. |
| `BookDirectory`     | String           | Hash256           | Yes       | The ID of the [Offer Directory](directorynode.md) that links to this Offer. |
| `BookNode`          | String           | UInt64            | Yes       | A hint indicating which page of the offer directory links to this entry, in case the directory consists of multiple pages. |
| `Expiration`        | Number           | UInt32            | No        | Indicates the time after which this Offer is considered unfunded. See [Specifying Time][] for details. |
| `LedgerEntryType`   | String           | UInt16            | Yes       | The value `0x006F`, mapped to the string `Offer`, indicates that this is an Offer entry. |
| `OwnerNode`         | String           | UInt64            | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String           | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number           | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Sequence`          | Number           | UInt32            | Yes       | The `Sequence` value of the [OfferCreate][] transaction that created this offer. Used in combination with the `Account` to identify this offer. |
| `TakerPays`         | [Currency Amount][] | Amount         | Yes       | The remaining amount and type of currency requested by the Offer creator. |
| `TakerGets`         | [Currency Amount][] | Amount         | Yes       | The remaining amount and type of currency being provided by the Offer creator. |

## Offer Flags

`Offer` entries can have the following flags combined into the `Flags` field:

| Flag Name    | Hex Value    | Decimal Value | Corresponding [OfferCreate Flag](../../transactions/types/offercreate.md#offercreate-flags) | Description |
|--------------|--------------|---------------|-------------|------------------------|
| `lsfPassive` | `0x00010000` | 65536         | `tfPassive` | The offer was placed as "passive". This has no effect after the offer is placed into the ledger. |
| `lsfSell`    | `0x00020000` | 131072        | `tfSell`    | The offer was placed as a "Sell" offer. This has no effect after the offer is placed in the ledger, because `tfSell` only matters if you get a better rate than you asked for, which can only happen when the offer is initially placed. |


## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the account that placed the offer, as long as the entry is in the ledger. Canceling or consuming the offer frees up the reserve. The reserve is also freed up if the offer is removed because it was found unfunded.


## Offer ID Format

The ID of an `Offer` entry is the [SHA-512Half][] of the following values, concatenated in order:

* The Offer space key (`0x006F`)
* The AccountID of the account placing the Offer
* The Sequence number of the [OfferCreate transaction][] that created the Offer.

    If the OfferCreate transaction used a [Ticket](../../../../concepts/accounts/tickets.md), use the `TicketSequence` value instead.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
