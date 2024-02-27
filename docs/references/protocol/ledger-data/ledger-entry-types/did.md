---
html: did.html
parent: ledger-entry-types.html
seo:
    description: The definition and details of a Decentralized Identifier (DID).
labels:
  - DID
status: not_enabled
---
# DID
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L330-L341 "Source")

_(Requires the [DID amendment][] {% not-enabled /%})_

A `DID` ledger entry holds references to, or data associated with, a single [DID](../../../../concepts/accounts/decentralized-identifiers.md).


## Example DID JSON

```json
{
    "Account": "rpfqJrXg5uidNo2ZsRhRY6TiF1cvYmV9Fg",
    "DIDDocument": "646F63",
    "Data": "617474657374",
    "Flags": 0,
    "LedgerEntryType": "DID",
    "OwnerNode": "0",
    "PreviousTxnID": "A4C15DA185E6092DF5954FF62A1446220C61A5F60F0D93B4B09F708778E41120",
    "PreviousTxnLgrSeq": 4,
    "URI": "6469645F6578616D706C65",
    "index": "46813BE38B798B3752CA590D44E7FEADB17485649074403AD1761A2835CE91FF"
}
```

## DID Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field               | JSON Type | [Internal Type][] | Required? | Description  |
|:--------------------|:----------|:------------------|:----------|--------------|
| `Account`           | String    | AccountID         | Yes       | The account that controls the DID. |
| `DIDDocument`       | String    | Blob              | No        | The W3C standard DID document associated with the DID. The `DIDDocument` field isn't checked for validity and is limited to a maximum length of 256 bytes. |
| `Data`              | String    | Blob              | No        | The public attestations of identity credentials associated with the DID. The `Data` field isn't checked for validity and is limited to a maximum length of 256 bytes. |
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0049`, mapped to the string `DID`, indicates that this object is a DID object. |
| `OwnerNode`         | String    | UInt64            | Yes       | A hint indicating which page of the sender's owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number    | UInt32            | Yes       | The index of the ledger that contains the transaction that most recently modified this object. |
| `URI`               | String    | Blob              | No        | The Universal Resource Identifier that points to the corresponding DID document or the data associated with the DID. This field can be an HTTP(S) URL or IPFS URI. This field isn't checked for validity and is limited to a maximum length of 256 bytes. |


## {% $frontmatter.seo.title %} Reserve

The account that creates the {% code-page-name /%} object incurs one owner reserve.


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## DID ID Format

The ID of a `DID` entry is the [SHA-512Half][] of the following values, concatenated in order:

1. The `DID` space key (`0x0049`).
2. The AccountID that controls the DID.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
