# DirectoryNode
[[Source]](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L44 "Source")

The `DirectoryNode` object type provides a list of links to other objects in the ledger's state tree. A single conceptual _Directory_　takes the form of a doubly linked list, with one or more DirectoryNode objects each containing up to 32 [IDs](ledgers.html#tree-format) of other objects. The first object is called the root of the directory, and all objects other than the root object can be added or deleted as necessary.

There are two kinds of Directories:

* **Owner directories** list other objects owned by an account, such as `RippleState` or `Offer` objects.
* **Offer directories** list the offers available in the distributed exchange. A single Offer directory contains all the offers that have the same exchange rate for the same issuances.

## Example {{currentpage.name}} JSON

<!-- MULTICODE_BLOCK_START -->

*Offer Directory*

```json
{
    "ExchangeRate": "4F069BA8FF484000",
    "Flags": 0,
    "Indexes": [
        "AD7EAE148287EF12D213A251015F86E6D4BD34B3C4A0A1ED9A17198373F908AD"
    ],
    "LedgerEntryType": "DirectoryNode",
    "RootIndex": "1BBEF97EDE88D40CEE2ADE6FEF121166AFE80D99EBADB01A4F069BA8FF484000",
    "TakerGetsCurrency": "0000000000000000000000000000000000000000",
    "TakerGetsIssuer": "0000000000000000000000000000000000000000",
    "TakerPaysCurrency": "0000000000000000000000004A50590000000000",
    "TakerPaysIssuer": "5BBC0F22F61D9224A110650CFE21CC0C4BE13098",
    "index": "1BBEF97EDE88D40CEE2ADE6FEF121166AFE80D99EBADB01A4F069BA8FF484000"
}
```

*Owner Directory*

```json
{
    "Flags": 0,
    "Indexes": [
        "AD7EAE148287EF12D213A251015F86E6D4BD34B3C4A0A1ED9A17198373F908AD",
        "E83BBB58949A8303DF07172B16FB8EFBA66B9191F3836EC27A4568ED5997BAC5"
    ],
    "LedgerEntryType": "DirectoryNode",
    "Owner": "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ",
    "RootIndex": "193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94",
    "index": "193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94"
}
```

<!-- MULTICODE_BLOCK_END -->

## {{currentpage.name}} Fields

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|---------------|-------------|
| `LedgerEntryType`   | String    | UInt16    | The value `0x0064`, mapped to the string `DirectoryNode`, indicates that this object is part of a Directory. |
| `Flags`             | Number    | UInt32    | A bit-map of boolean flags enabled for this directory. Currently, the protocol defines no flags for DirectoryNode objects. |
| `RootIndex`         | String    | Hash256   | The ID of root object for this directory. |
| `Indexes`           | Array     | Vector256 | The contents of this Directory: an array of IDs of other objects. |
| `IndexNext`         | Number    | UInt64    | (Optional) If this Directory consists of multiple pages, this ID links to the next object in the chain, wrapping around at the end. |
| `IndexPrevious`     | Number    | UInt64    | (Optional) If this Directory consists of multiple pages, this ID links to the previous object in the chain, wrapping around at the beginning. |
| `Owner`             | String    | AccountID | (Owner Directories only) The address of the account that owns the objects in this directory. |
| `ExchangeRate`      | Number    | UInt64    | (Offer Directories only) **DEPRECATED**. Do not use. |
| `TakerPaysCurrency` | String    | Hash160   | (Offer Directories only) The currency code of the TakerPays amount from the offers in this directory. |
| `TakerPaysIssuer`   | String    | Hash160   | (Offer Directories only) The issuer of the TakerPays amount from the offers in this directory. |
| `TakerGetsCurrency` | String    | Hash160   | (Offer Directories only) The currency code of the TakerGets amount from the offers in this directory. |
| `TakerGetsIssuer`   | String    | Hash160   | (Offer Directories only) The issuer of the TakerGets amount from the offers in this directory. |

## Directory ID Formats

There are three different formulas for creating the ID of a DirectoryNode, depending on which of the following the DirectoryNode represents:

* The first page (also called the root) of an Owner Directory
* The first page of an Offer Directory
* Later pages of either type

**The first page of an Owner Directory** has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

* The Owner Directory space key (`0x004F`)
* The AccountID from the `Owner` field.

**The first page of an Offer Directory** has a special ID: the higher 192 bits define the order book, and the remaining 64 bits define the exchange rate of the offers in that directory. (The ID is big-endian, so the book is in the more significant bits, which come first, and the quality is in the less significant bits which come last.) This provides a way to iterate through an order book from best offers to worst. Specifically: the first 192 bits are the first 192 bits of the [SHA-512Half][] of the following values, concatenated in order:

* The Book Directory space key (`0x0042`)
* The 160-bit currency code from the `TakerPaysCurrency`
* The 160-bit currency code from the `TakerGetsCurrency`
* The AccountID from the `TakerPaysIssuer`
* The AccountID from the `TakerGetsIssuer`

The lower 64 bits of an Offer Directory's ID represent the TakerPays amount divided by TakerGets amount from the offer(s) in that directory as a 64-bit number in the XRP Ledger's internal amount format.

**If the DirectoryNode is not the first page in the Directory** (regardless of whether it is an Owner Directory or an Offer Directory), then it has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

* The DirectoryNode space key (`0x0064`)
* The ID of the root DirectoryNode
* The page number of this object. (Since 0 is the root DirectoryNode, this value is an integer 1 or higher.)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
