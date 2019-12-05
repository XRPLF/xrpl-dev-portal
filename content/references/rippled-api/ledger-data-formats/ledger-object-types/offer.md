# Offer
[[Source]](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L57 "Source")

The `Offer` object type describes an offer to exchange currencies, more traditionally known as an _order_, in the XRP Ledger's distributed exchange. An [OfferCreate transaction][] only creates an `Offer` object in the ledger when the offer cannot be fully executed immediately by consuming other offers already in the ledger.

An offer can become unfunded through other activities in the network, while remaining in the ledger. However, `rippled` automatically prunes any unfunded offers it happens across in the course of transaction processing (and _only_ transaction processing, because the ledger state must only be changed by transactions).

For more information, see [Offers](offers.html).

## Example {{currentpage.name}} JSON

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

## {{currentpage.name}} Fields

An `Offer` object has the following fields:

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|---------------|-------------|
| `LedgerEntryType`   | String    | UInt16    | The value `0x006F`, mapped to the string `Offer`, indicates that this object describes an order to trade currency. |
| `Flags`             | Number    | UInt32    | A bit-map of boolean flags enabled for this offer. |
| `Account`           | String    | AccountID | The address of the account that owns this offer. |
| `Sequence`          | Number    | UInt32    | The `Sequence` value of the [OfferCreate][] transaction that created this `Offer` object. Used in combination with the `Account` to identify this Offer. |
| `TakerPays`         | String or Object | Amount | The remaining amount and type of currency requested by the offer creator. |
| `TakerGets`         | String or Object | Amount | The remaining amount and type of currency being provided by the offer creator. |
| `BookDirectory`     | String    | UInt256   | The ID of the [Offer Directory](directorynode.html) that links to this offer. |
| `BookNode`          | String    | UInt64    | A hint indicating which page of the offer directory links to this object, in case the directory consists of multiple pages. |
| `OwnerNode`         | String    | UInt64    | A hint indicating which page of the owner directory links to this object, in case the directory consists of multiple pages. **Note:** The offer does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String | Hash256 | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number | UInt32 | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Expiration`        | Number    | UInt32    | (Optional) Indicates the time after which this offer is considered unfunded. See [Specifying Time][] for details. |

## Offer Flags

There are several options which can be either enabled or disabled when an [OfferCreate transaction][] creates an offer object. In the ledger, flags are represented as binary values that can be combined with bitwise-or operations. The bit values for the flags in the ledger are different than the values used to enable or disable those flags in a transaction. Ledger flags have names that begin with _lsf_.

`Offer` objects can have the following flag values:

| Flag Name | Hex Value | Decimal Value | Description | Corresponding [OfferCreate Flag](offercreate.html#offercreate-flags) |
|-----------|-----------|---------------|-------------|------------------------|
| lsfPassive | 0x00010000 | 65536 | The object was placed as a passive offer. This has no effect on the object in the ledger. | tfPassive |
| lsfSell   | 0x00020000 | 131072 | The object was placed as a sell offer. This has no effect on the object in the ledger (because tfSell only matters if you get a better rate than you asked for, which cannot happen after the object enters the ledger). | tfSell |

## Offer ID Format

The ID of an `Offer` object is the [SHA-512Half][] of the following values, concatenated in order:

* The Offer space key (`0x006F`)
* The AccountID of the account placing the offer
* The Sequence number of the [OfferCreate transaction][] that created the offer

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
