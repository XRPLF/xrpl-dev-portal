---
seo:
    description: A set of links to other ledger entries, either objects owned by an account or trades in the decentralized exchange.
labels:
  - Data Retention
  - Decentralized Exchange
---
# DirectoryNode
[[Source]](https://github.com/XRPLF/rippled/blob/7e24adbdd0b61fb50967c4c6d4b27cc6d81b33f3/include/xrpl/protocol/detail/ledger_entries.macro#L177-L192 "Source")

The `DirectoryNode` ledger entry type provides a list of links to other entries in the ledger's state data. A single conceptual _Directory_ takes the form of a doubly linked list, with one or more DirectoryNode entries each containing up to 32 [IDs of other entries](../common-fields.md). The first DirectoryNode entry is called the root of the directory, and all entries other than the root can be added or deleted as necessary.

There are three kinds of directory:

* _Owner directories_ list other entries owned by an account, such as [`RippleState` (trust line)](ripplestate.md) or [`Offer`](offer.md) entries.
* _Offer directories_ list the offers available in the [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md). A single offer directory contains all the offers that have the same exchange rate for the same token (currency code and issuer).
* _NFT Offer directories_ list buy and sell offers for NFTs. Each NFT has up to two directories, one for buy offers, the other for sell offers.

All types of directories are automatically updated by the protocol as necessary.

## Example {% $frontmatter.seo.title %} JSON

{% tabs %}

{% tab label="Offer Directory" %}
```json
{
    "ExchangeRate": "4e133c40576f7c00",
    "Flags": 0,
    "Indexes": [
        "353E55E7A0B0E82D16DF6E748D48BDAFE4C56045DF5A8B0ED723FF3C38A4787A"
    ],
    "LedgerEntryType": "DirectoryNode",
    "PreviousTxnID": "0F79E60C8642A23658ECB29D939499EA0F28D804077B7EE16613BE0C813A2DD6",
    "PreviousTxnLgrSeq": 91448326,
    "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E133C40576F7C00",
    "TakerGetsCurrency": "0000000000000000000000000000000000000000",
    "TakerGetsIssuer": "0000000000000000000000000000000000000000",
    "TakerPaysCurrency": "0000000000000000000000005553440000000000",
    "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230",
    "index": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E133C40576F7C00"
}
```
{% /tab %}

{% tab label="Owner Directory" %}
```json
{
    "Flags": 0,
    "IndexNext": "0",
    "IndexPrevious": "0",
    "Indexes": [
        "1192C0191D1B8861AA6F5A84A575E0CBE4B97574A5E8B3D7B7AD64643EE38CA7",
        "16A0674079229DB47EDDF4FD83AFEA59ADAC944DD5F16EA5D9C989ED8F918AE0",
        "1F65776E640C97B76E365763E97E5B59B6C4CDBB46FB7C8869D1712528985E6D",
        "35D6A9F578E63C875EDB6348E55EFADBD300A0817290276D8CC3DD3587FAD4B3",
        "36B236D80688C2975A5D24935020B75BEB4B26F5115D71943356E86CCD3B8CE4",
        "39E8F12D519E5C6C1AC36434D7340281C362508B7D5BC863166C8FE8621A124C",
        "4DF14053E1BD697C5B4A4A1A7BA8988BD802F0CD5DB6ED9C2AC74AD8A7B91A35",
        "5E2D97ABAB0D2BE1948F275823096597E3359DD0696CF2938A712169394236BE",
        "678CE03A2F8157FBF7D5EFDED2D55D127F60EC26BC4F51DBC8FB05DF370B248E",
        "8250CE37F6495903C1F7D16E072E8823ECE06FA73F011A0F8D79D5626BF581BB",
        "C353DA9F84EB02B4206D6F5166A9277916559115EEDF7B841C38E4473084A010",
        "CB2D979DE863A7AF792A12D6C4518E2B299EF782E361705DE7F1D0077521D521",
        "DFA7CB434A3D9D782C2FACEB95F431476D3AAAD62078C0FBE8C115E00039C6F5"
    ],
    "LedgerEntryType": "DirectoryNode",
    "Owner": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
    "PreviousTxnID": "CB802FC111C4C03B1E1D762E813D3F1F47347E57C68D00B5F92822C417C2484C",
    "PreviousTxnLgrSeq": 91448329,
    "RootIndex": "0A2600D85F8309FE7F75A490C19613F1CE0C37483B856DB69B8140154C2335F3",
    "index": "0A2600D85F8309FE7F75A490C19613F1CE0C37483B856DB69B8140154C2335F3"
}
```
{% /tab %}

{% tab label="NFT Offer Directory" %}
```json
{
    "Flags": 1,
    "Indexes": [
        "68227B203065DED9EEB8B73FC952494A1DA6A69CEABEAA99923836EB5E77C95A"
    ],
    "LedgerEntryType": "DirectoryNode",
    "NFTokenID": "000822603EA060FD1026C04B2D390CC132D07D600DA9B082CB5CE9AC0487E50B",
    "PreviousTxnID": "EF8A9AD51E7CC6BBD219C3C980EC3145C7B0814ED3184471FD952D9D23A1918D",
    "PreviousTxnLgrSeq": 91448417,
    "RootIndex": "0EC5802BD1AB56527A9DE524CCA2A2BA25E1085CCE7EA112940ED115FFF91EE2",
    "index": "0EC5802BD1AB56527A9DE524CCA2A2BA25E1085CCE7EA112940ED115FFF91EE2"
}
```
{% /tab %}

{% /tabs %}

## {% $frontmatter.seo.title %} Fields

| Name                | JSON Type | [Internal Type][] | Required? | Description |
|:--------------------|:----------|:------------------|:----------|:------------|
| `DomainID`          | String    | UInt256           | No        | (Offer directories only) The ledger entry ID of a permissioned domain. If present, this order book belongs to the corresponding [Permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md). Otherwise, this order book is part of the open DEX. {% amendment-disclaimer name="PermissionedDEX" /%} |
| `ExchangeRate`      | String    | UInt64            | No        | (Offer directories only) **DEPRECATED**. Do not use. |
| `Flags`             | Number    | UInt32            | Yes       | A bit-map of boolean flags enabled for this object. Currently, the protocol defines no flags for `DirectoryNode` objects. The value is always `0`. |
| `Indexes`           | Array     | Vector256         | Yes       | The contents of this directory: an array of IDs of other objects. |
| `IndexNext`         | Number    | UInt64            | No        | If this directory consists of multiple pages, this ID links to the next object in the chain, wrapping around at the end. |
| `IndexPrevious`     | Number    | UInt64            | No        | If this directory consists of multiple pages, this ID links to the previous object in the chain, wrapping around at the beginning. |
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0064`, mapped to the string `DirectoryNode`, indicates that this object is part of a directory. |
| `NFTokenID`         | String    | UInt256           | No        | (NFT offer directories only) ID of the NFT in a buy or sell offer. |
| `Owner`             | String    | AccountID         | No        | (Owner directories only) The address of the account that owns the objects in this directory. |
| `PreviousTxnID`     | String    | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq` | Number    | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `RootIndex`         | String    | UInt256           | Yes       | The ID of root object for this directory. |
| `TakerGetsCurrency` | String    | UInt160           | No        | (Offer directories only) The currency code of the `TakerGets` amount from the offers in this directory. |
| `TakerGetsIssuer`   | String    | UInt160           | No        | (Offer directories only) The issuer of the `TakerGets` amount from the offers in this directory. |
| `TakerPaysCurrency` | String    | UInt160           | No        | (Offer directories only) The currency code of the `TakerPays` amount from the offers in this directory. |
| `TakerPaysIssuer`   | String    | UInt160           | No        | (Offer directories only) The issuer of the `TakerPays` amount from the offers in this directory. |


## {% $frontmatter.seo.title %} Flags

{% code-page-name /%} entries can have the following values in the `Flags` field:

| Flag Name              | Hex Value    | Decimal Value | Description |
|:-----------------------|:-------------|:--------------|:------------|
| `lsfNFTokenBuyOffers`  | `0x00000001` | 1             | This directory contains NFT buy offers. |
| `lsfNFTokenSellOffers` | `0x00000002` | 2             | This directory contains NFT sell offers. |

Owner directories and offer directories for fungible tokens do not use flags; their `Flags` value is always 0.


## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries do not require a reserve.


## Directory ID Formats

There are three different formulas for creating the ID of a DirectoryNode, depending on which of the following the DirectoryNode represents:

* The first page (also called the root) of an Owner or NFT Offer directory
* The first page of an Offer directory, with variants for the open DEX and permissioned DEX {% amendment-disclaimer name="PermissionedDEX" /%}
* Later pages of any type

The first page of an Owner directory or NFT Offer directory has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

* The Owner directory space key (`0x004F`)
* The AccountID from the `Owner` field.

The first page of an Offer directory has a special ID: the higher 192 bits define the order book, and the remaining 64 bits define the exchange rate of the offers in that directory. (The ID is big-endian, so the book is in the more significant bits, which come first, and the quality is in the less significant bits which come last.) This provides a way to iterate through an order book from best offers to worst. Specifically: the first 192 bits are the first 192 bits of the [SHA-512Half][] of the following values, concatenated in order:

* The Book directory space key (`0x0042`)
* The 160-bit currency code from the `TakerPaysCurrency`
* The 160-bit currency code from the `TakerGetsCurrency`
* The AccountID from the `TakerPaysIssuer`
* The AccountID from the `TakerGetsIssuer`
* The `DomainID` of the permissioned domain this order book belongs to, if part of a permissioned DEX. Omitted for order books in the open DEX.

The lower 64 bits of an Offer directory's ID represent the `TakerPays` amount divided by `TakerGets` amount from the offer(s) in that directory as a 64-bit number in the XRP Ledger's internal amount format.

If the DirectoryNode is not the first page in the directory, it has an ID that is the [SHA-512Half][] of the following values, concatenated in order:

* The DirectoryNode space key (`0x0064`)
* The ID of the root DirectoryNode
* The page number of this object. (Since 0 is the root DirectoryNode, this value is an integer 1 or higher.)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
