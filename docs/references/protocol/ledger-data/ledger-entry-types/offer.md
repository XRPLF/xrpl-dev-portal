---
seo:
    description: An offer (order) to trade currencies in the decentralized exchange.
labels:
  - Decentralized Exchange
---
# Offer
[[Source]](https://github.com/XRPLF/rippled/blob/7e24adbdd0b61fb50967c4c6d4b27cc6d81b33f3/include/xrpl/protocol/detail/ledger_entries.macro#L242-L255 "Source")

An `Offer` ledger entry describes an [offer](../../../../concepts/tokens/decentralized-exchange/offers.md) to exchange currencies in the XRP Ledger's [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md). (In finance, this is more traditionally known as an _order_.) You an create a new offer entry by sending an [OfferCreate transaction][] that is not fully executed immediately.

An offer can become unfunded through other activities in the network, while remaining in the ledger. When processing transactions, the network automatically removes any unfunded Offers that those transactions come across. (Otherwise, unfunded Offers remain, because _only_ transactions can change the ledger state.)


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

| Name                | JSON Type            | [Internal Type][] | Required? | Description |
|:--------------------|:---------------------|:------------------|:----------|:------------|
| `Account`           | String - [Address][] | AccountID         | Yes       | The account that owns this offer. |
| `AdditionalBooks`   | Array                | Array             | No        | A list of additional offer directories that link to this offer. This field is only present if this is a hybrid offer in a [permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md). The array always contains exactly 1 entry. {% amendment-disclaimer name="PermissionedDEX" /%} |
| `BookDirectory`     | String - [Hash][]    | UInt256           | Yes       | The ID of the [offer directory](directorynode.md) that links to this offer. |
| `BookNode`          | String               | UInt64            | Yes       | A hint indicating which page of the offer directory links to this entry, in case the directory consists of multiple pages. |
| `DomainID`          | String - [Hash][]    | UInt256           | No        | The ledger entry ID of a permissioned domain. If present, this offer belongs to the corresponding [Permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md). {% amendment-disclaimer name="PermissionedDEX" /%} |
| `Expiration`        | Number               | UInt32            | No        | Indicates the time after which this offer is considered unfunded. See [Specifying Time][] for details. |
| `LedgerEntryType`   | String               | UInt16            | Yes       | The value `0x006F`, mapped to the string `Offer`, indicates that this is an offer entry. |
| `OwnerNode`         | String               | UInt64            | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String - [Hash][]    | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number               | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Sequence`          | Number               | UInt32            | Yes       | The `Sequence` value of the [OfferCreate][] transaction that created this offer. Used in combination with the `Account` to identify this offer. |
| `TakerPays`         | [Currency Amount][]  | Amount            | Yes       | The remaining amount and type of currency requested by the offer creator. |
| `TakerGets`         | [Currency Amount][]  | Amount            | Yes       | The remaining amount and type of currency being provided by the offer creator. |

## Offer Flags

`Offer` entries can have the following flags combined into the `Flags` field:

| Flag Name    | Hex Value    | Decimal Value | Corresponding [OfferCreate Flag](../../transactions/types/offercreate.md#offercreate-flags) | Description |
|--------------|--------------|---------------|-------------|------------------------|
| `lsfPassive` | `0x00010000` | 65536         | `tfPassive` | The offer was placed as passive. This has no effect after the offer is placed into the ledger. |
| `lsfSell`    | `0x00020000` | 131072        | `tfSell`    | The offer was placed as a sell offer. This has no effect after the offer is placed in the ledger, because `tfSell` only matters if you get a better rate than you asked for, which can only happen when the offer is initially placed. |
| `lsfHybrid`  | `0x00040000` | 262144        | `tfHybrid`  | The offer was placed as a hybrid offer, which means it is listed in a [permissioned DEX](/docs/concepts/tokens/decentralized-exchange/permissioned-dexes.md) and the open DEX. {% amendment-disclaimer name="PermissionedDEX" /%} |

## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the account that placed the offer, as long as the entry is in the ledger. Canceling or consuming the offer frees up the reserve. The reserve is also freed up if the offer is removed because it was found unfunded.


## Offer ID Format

The ID of an `Offer` entry is the [SHA-512Half][] of the following values, concatenated in order:

* The Offer space key (`0x006F`)
* The AccountID of the account placing the offer
* The Sequence number of the [OfferCreate transaction][] that created the offer.

    If the OfferCreate transaction used a [ticket](../../../../concepts/accounts/tickets.md), use the `TicketSequence` value instead.

## See Also

- **Transactions:**
  - [OfferCancel transaction][]
  - [OfferCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
