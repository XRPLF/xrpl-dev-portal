---
seo:
    description: Contains links to other objects.
labels:
  - Data Retention
  - Decentralized Exchange
---
# DirectoryNode
[[Source]](https://github.com/XRPLF/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L44 "Source")

The `DirectoryNode` ledger entry type provides a list of links to other entries in the ledger's state data. A single conceptual _Directory_　takes the form of a doubly linked list, with one or more DirectoryNode entries each containing up to 32 [IDs of other entries](../common-fields.md). The first DirectoryNode entry is called the root of the directory, and all entries other than the root can be added or deleted as necessary.

There are three kinds of directory:

* _Owner directories_ list other entries owned by an account, such as [`RippleState` (trust line)](ripplestate.md) or [`Offer`](offer.md) entries.
* _Offer directories_ list the offers available in the [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md). A single Offer directory contains all the offers that have the same exchange rate for the same token (currency code and issuer).
* _NFT Offer directories_ list buy and sell offers for NFTs. Each NFT has up to two directories, one for buy offers, the other for sell offers.

## Example {% $frontmatter.seo.title %} JSON

{% tabs %}

{% tab label="Offer Directory" %}
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
{% /tab %}

{% tab label="Owner Directory" %}
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
{% /tab %}

{% tab label="NFT Offer Directory" %}
```json
{
   "result": {
      "index": "CC45A27DAF06BFA45E8AFC92801AD06A06B7004DAD0F7022E439B3A2F6FA5B5A",
      "ledger_current_index": 310,
      "node": {
         "Flags": 2,
         "Indexes": [
            "83C81AC39F9771DDBCD66F6C225FC76EFC0971384EC6148BAFA5BD18019FC495"
         ],
         "LedgerEntryType": "DirectoryNode",
         "NFTokenID": "000800009988C43C563A7BB35AF34D642990CDF089F11B445EB3DCCD00000132",
         "RootIndex": "CC45A27DAF06BFA45E8AFC92801AD06A06B7004DAD0F7022E439B3A2F6FA5B5A",
         "index": "CC45A27DAF06BFA45E8AFC92801AD06A06B7004DAD0F7022E439B3A2F6FA5B5A"
      },
      "status": "success",
      "validated": false
   }
}
```
{% /tab %}

{% /tabs %}

## {% $frontmatter.seo.title %} Fields

| Name                | JSON Type | [Internal Type][] | Required? | Description |
|:--------------------|:----------|:------------------|:----------|:------------|
| `ExchangeRate`      | String    | UInt64            | No        | (Offer directories only) **DEPRECATED**. Do not use. |
| `Flags`             | Number    | UInt32            | Yes       | A bit-map of boolean flags enabled for this object. Currently, the protocol defines no flags for `DirectoryNode` objects. The value is always `0`. |
| `Indexes`           | Array     | Vector256         | Yes       | The contents of this directory: an array of IDs of other objects. |
| `IndexNext`         | Number    | UInt64            | No        | If this directory consists of multiple pages, this ID links to the next object in the chain, wrapping around at the end. |
| `IndexPrevious`     | Number    | UInt64            | No        | If this directory consists of multiple pages, this ID links to the previous object in the chain, wrapping around at the beginning. |
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0064`, mapped to the string `DirectoryNode`, indicates that this object is part of a directory. |
| `NFTokenID`         | String    | Hash25            | No       |(NFT offer directories only) ID of the NFT in a buy or sell offer. |
| `Owner`             | String    | AccountID         | No        | (Owner directories only) The address of the account that owns the objects in this directory. |
| `RootIndex`         | String    | Hash256           | Yes       | The ID of root object for this directory. |
| `TakerGetsCurrency` | String    | Hash160           | No        | (Offer directories only) The currency code of the `TakerGets` amount from the offers in this directory. |
| `TakerGetsIssuer`   | String    | Hash160           | No        | (Offer directories only) The issuer of the `TakerGets` amount from the offers in this directory. |
| `TakerPaysCurrency` | String    | Hash160           | No        |(Offer directories only) The currency code of the `TakerPays` amount from the offers in this directory. |
| `TakerPaysIssuer`   | String    | Hash160           | No        | (Offer directories only) The issuer of the `TakerPays` amount from the offers in this directory. |


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries do not require a reserve.


## Directory ID Formats

There are three different formulas for creating the ID of a DirectoryNode, depending on which of the following the DirectoryNode represents:

* The first page (also called the root) of an Owner or NFT Offer directory
* The first page of an Offer directory
* Later pages of either type

The first page of an Owner directory or NFT Offer directory has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

* The Owner directory space key (`0x004F`)
* The AccountID from the `Owner` field.

The first page of an Offer directory has a special ID: the higher 192 bits define the order book, and the remaining 64 bits define the exchange rate of the offers in that directory. (The ID is big-endian, so the book is in the more significant bits, which come first, and the quality is in the less significant bits which come last.) This provides a way to iterate through an order book from best offers to worst. Specifically: the first 192 bits are the first 192 bits of the [SHA-512Half][] of the following values, concatenated in order:

* The Book directory space key (`0x0042`)
* The 160-bit currency code from the `TakerPaysCurrency`
* The 160-bit currency code from the `TakerGetsCurrency`
* The AccountID from the `TakerPaysIssuer`
* The AccountID from the `TakerGetsIssuer`

The lower 64 bits of an Offer directory's ID represent the `TakerPays` amount divided by `TakerGets` amount from the offer(s) in that directory as a 64-bit number in the XRP Ledger's internal amount format.

If the DirectoryNode is not the first page in the directory, it has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

* The DirectoryNode space key (`0x0064`)
* The ID of the root DirectoryNode
* The page number of this object. (Since 0 is the root DirectoryNode, this value is an integer 1 or higher.)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
