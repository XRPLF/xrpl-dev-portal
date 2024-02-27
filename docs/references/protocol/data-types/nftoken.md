---
html: nftoken.html
parent: basic-data-types.html
seo:
    description: Introduction to XRPL NFTs.
labels:
  - Non-fungible Tokens, NFTs
---
# NFToken

The `NFToken` object represents a single non-fungible token (NFT). It is not stored on its own, but is contained in a [NFTokenPage object][] alongside other `NFToken` objects.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "NFTokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
    "URI": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"
}
```

Unlike full-fledged [ledger entries](../ledger-data/ledger-entry-types/index.md), `NFToken` has no field to identify the object type or current owner of the object. `NFToken` objects are grouped into pages that implicitly define the object type and identify the owner.


## NFTokenID
<!-- SPELLING_IGNORE: nftokenid -->

`NFTokenID`, optional, string, Hash256

This composite field uniquely identifies a token, and consists of the following sections.

A) 16 bits that identify flags or settings specific to the NFToken

B) 16 bits that encode the transfer fee associated with this NFToken, if any

C) A 160-bit account identifier of the issuer

D) A 32-bit issuer-specified [`NFTokenTaxon`](https://www.merriam-webster.com/dictionary/taxon)

E) An (automatically generated) monotonically increasing 32-bit sequence number.

![Token ID Breakdown](/docs/img/nftoken1.png "Token ID Breakdown")

The 16-bit flags, transfer fee fields, the 32-bit `NFTokenTaxon`, and the sequence number fields are stored in big-endian format.

## NFToken Flags

Flags are properties or other options associated with the `NFToken` object.


| Flag Name         | Flag Value | Description                                 |
|:------------------|:-----------|:--------------------------------------------|
| `lsfBurnable`     | `0x0001`   | If enabled, the issuer (or an entity authorized by the issuer) can destroy this `NFToken`. The object's owner can always do so. |
| `lsfOnlyXRP`      | `0x0002`   | If enabled, this `NFToken` can only be offered or sold for XRP. |
| `lsfTrustLine`    | `0x0004`   | **DEPRECATED** If enabled, automatically create [trust lines](../../../concepts/tokens/fungible-tokens/index.md) to hold transfer fees. Otherwise, buying or selling this `NFToken` for a fungible token amount fails if the issuer does not have a trust line for that token. The [fixRemoveNFTokenAutoTrustLine amendment][] makes it invalid to enable this flag. |
| `lsfTransferable` | `0x0008`   | If enabled, this `NFToken` can be transferred from one holder to another. Otherwise, it can only be transferred to or from the issuer. |
| `lsfReservedFlag` | `0x8000`   | This flag is reserved for future use. Attempts to set this flag fail. |

`NFToken` flags are immutable: they can only be set during the [NFTokenMint transaction][] and cannot be changed later.

### Example

The example sets three flags: `lsfBurnable` (`0x0001`), `lsfOnlyXRP` (`0x0002`), `lsfTransferable` (`0x0008`). 1+2+8 = 11, or `0x000B` in big endian format.

![Flags](/docs/img/nftokena.png "Flags")

### TransferFee
<!-- SPELLING_IGNORE: transferfee -->

The `TransferFee` value specifies the percentage fee, in units of 1/100,000, charged by the issuer for secondary sales of the token. Valid values for this field are between 0 and 50,000, inclusive. A value of 1 is equivalent to 0.001% or 1/10 of a basis point (bps), allowing transfer rates between 0% and 50%.

### Example

This value sets the transfer fee to 314, or 0.314%.

![Transfer Fee](/docs/img/nftokenb.png "Transfer Fee")

### Issuer Identification

The third section of the `NFTokenID` is a big endian representation of the issuer’s public address.

![Issuer Address](/docs/img/nftokenc.png "Issuer Address")

### NFTokenTaxon
<!-- SPELLING_IGNORE: nftokentaxon -->

The fourth section is a `NFTokenTaxon` created by the issuer.

![Diagram of `NFTokenTaxon` bits](/docs/img/nftokend.png)

An issuer might issue several `NFToken` objects with the same `NFTokenTaxon`; to ensure that `NFToken` objects are spread across multiple pages, the `NFTokenTaxon` is scrambled using the fifth section, a sequential number, as the seed for a random number generator. The scrambled value is stored with the `NFToken`, but the unscrambled value is the actual `NFTokenTaxon`.

Notice that the scrambled version of the `NFTokenTaxon` is `0xBC8B858E`, the scrambled version of the `NFTokenTaxon` specified by the issuer. But the _actual_ value of the `NFTokenTaxon` is the unscrambled value.

### Token Sequence

The fifth section is a sequence number that increases with each `NFToken` the issuer creates.

![Sequence Number](/docs/img/nftokene.png "Sequence Number")

The [NFTokenMint transaction][] sets this part of the `NFTokenID` automatically based on the `MintedNFTokens` field of the `Issuer` account. If the issuer's [AccountRoot object][] does not have a `MintedNFTokens` field, the field is assumed to have the value 0; the value of the field is then incremented by exactly 1.

## URI

The URI field points to the data or metadata associated with the `NFToken`. This field does not need to be an HTTP or HTTPS URL; it could be an IPFS URI, a magnet link, an [RFC 2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397), or even a totally custom encoding. The URI is not checked for validity, but the field is limited to a maximum length of 256 bytes.

**Caution:** The URI is immutable, so no one can update it if, for example, it links to a website that no longer exists.

# Retrieving NFToken Data and Metadata

To minimize the footprint of `NFTokens` without sacrificing functionality or imposing unnecessary restrictions, XRPL NFTs do not have arbitrary data fields. Instead, data is maintained separately and referenced by the `NFToken`. The URI provides a reference to immutable content for the `Hash` and any mutable data for the `NFToken` object.

The `URI` field is especially useful for referring to non-traditional Peer-to-Peer (P2P) URLs. For example, a minter that stores `NFToken` data or metadata using the Inter Planetary File System (IPFS) can use the `URI` field to refer to data on IPFS in different ways, each of which is suited to different use-cases. For more context on types of IPFS links that can be used to store NFT data, see [Best Practices for Storing NFT Data using IPFS](https://docs.ipfs.io/how-to/best-practices-for-nft-data/#types-of-ipfs-links-and-when-to-use-them),

## TXT Record Format

The format for a text record is as follows.

```
xrpl-nft-data-token-info-v1 IN TXT "https://host.example.com/api/token-info/{nftokenid}"
```

Replace the string `{nftokenid}` with the requested `NFTokenID` as a 64-byte hex string when you attempt to query information.

Your implementation should check for the presence of `TXT` records and use those query strings if present. If no string is present, implementations should attempt to use a default URL. Assuming the domain is _example.com_, the default URL would be:

```
https://example.com/.well-known/xrpl-nft/{nftokenid}
```

You create `NFToken` objects using the `NFTokenMint` transaction. You can optionally destroy `NFToken` objects using the `NFTokenBurn` transaction.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
