---
html: nftoken.html
parent: basic-data-types.html
blurb: Introduction to XRPL NFTs.
labels:
  - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFToken
{% include '_snippets/nfts-disclaimer.md' %}

The `NFToken` object represents a single non-fungible token (NFT). It is not stored on its own, but is contained in a [NFTokenPage object][] alongside other NFTs.

Example {{currentpage.name}} JSON

```json
{
    "TokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
    "URI": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"
}
```


Unlike other objects, `NFToken` has no field to identify the object type or current owner of the object. `NFToken `objects are grouped into `NFTokenPages` that implicitly define the object type and identify the owner.


## TokenID

TokenID, optional, string, Hash256

This composite field uniquely identifies a token, and consists of the following sections.

1. 16 bits that identify flags or settings specific to the NFT
2. 16 bits that encode the transfer fee associated with this token, if any
3. A 160-bit account identifier of the issuer
4. A 32-bit issuer-specified [taxon](https://www.merriam-webster.com/dictionary/taxon)
5. An (automatically generated) monotonically increasing 32-bit sequence number.


![Token ID Breakdown](img/nftoken1.png "Token ID Breakdown")


The 16-bit flags, transfer fee fields, the 32-bit taxon, and the sequence number fields are stored in big-endian format.


## NFToken Flags

Flags are properties or other options associated with the `NFToken` object.


<table>
  <tr>
   <td><strong>Flag Name</strong>
   </td>
   <td><strong>Flag Value</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>lsfBurnable</code>
   </td>
   <td><code>0x0001</code>
   </td>
   <td>If set, indicates that the issuer (or an entity authorized by the issuer) can destroy the object. The object's owner can <em>always</em> do so.
   </td>
  </tr>
  <tr>
   <td><code>lsfOnlyXRP</code>
   </td>
   <td><code>0x0002</code>
   </td>
   <td>If set, indicates that the tokens can only be offered or sold for XRP.
   </td>
  </tr>
  <tr>
   <td><code>lsfTrustLine</code>
   </td>
   <td><code>0x0004</code>
   </td>
   <td>If set, indicates that the issuer wants a trustline to be automatically created. The <code>lsfTrustLine</code> field is useful when the token can be offered for sale for assets other than XRP and the issuer charges a <code>TransferFee</code>. If this flag is set, a trust line is automatically created as needed to allow the issuer to receive the appropriate transfer fee. If this flag is not set, an attempt to transfer the NFToken for an asset for which the issuer does not have a trustline fails.
   </td>
  </tr>
  <tr>
   <td><code>lsfTransferable</code>
   </td>
   <td><code>0x0008</code>
   </td>
   <td>If set, indicates that this NFT can be transferred. This flag has no effect if the token is being transferred <em>from</em> the issuer or <em>to</em> the issuer.
   </td>
  </tr>
  <tr>
   <td><code>lsfReservedFlag</code>
   </td>
   <td><code>0x8000</code>
   </td>
   <td>This proposal reserves this flag for future use. Attempts to set this flag fail.
   </td>
  </tr>
</table>


`NFToken `flags are immutable: they can only be set during the `NFTokenMint` transaction and cannot be changed later.


### Example

The example sets three flags: lsfBurnable (0x0001), lsfOnlyXRP (0x0002), lsfTransferable (0x0008). 1+2+8 = 11, or 0x000B in big endian format.

![Flags](img/nftokena.png "Flags")


### TransferFee

The TransferFee value specifies the percentage fee, in units of 1/10,000, charged by the issuer for secondary sales of the token. Valid values for this field are between 0 and 50,000, inclusive. A value of 1 is equivalent to 1bps or 0.01%, allowing transfer rates between 0% and 50%.


### Example

This value sets the transfer fee to 314 bps, or 3.14%.

![Txr Fee](img/nftokenb.png "Txr Fee")



### Issuer Identification

The third section of the TokenID is a big endian representation of the issuer’s public address.

![Issuer Address](img/nftokenc.png "Issuer Address")



### Taxon

The fourth section is a taxon created by the issuer.

![Taxon](img/nftokend.png "Taxon")

An issuer might issue several NFTs with the same taxon; to ensure that NFTs are spread across multiple pages, the taxon is scrambled using the fifth section, a dumb sequential number, as the seed for a random number generator. The scrambled value is stored with the `NFToken`, but the unscrambled value is the actual taxon.

![Dumb Sequential](img/nftokene.png "Dumb Sequential")

Notice that the scrambled version of the taxon is `0xBC8B858E`: the scrambled version of the taxon specified by the issuer. But the _actual_ value of the taxon is the unscrambled value.

### Token Sequence

The fifth section is a sequence number that increases with each `NFToken` the issuer creates. The [NFTokenMint transaction][] sets this part of the `NFTokenID` automatically based on the `MintedTokens` field of the `Issuer` account. If the issuer's [AccountRoot object][] does not have a `MintedTokens` field, the field is assumed to have the value 0; the value of the field is then incremented by exactly 1.


## URI

The URI field points to the data and/or metadata associated with the `NFToken`. This field need not be an HTTP or HTTPS URL; it could be an IPFS URI, a magnet link, immediate data encoded as an RFC2379 ["data" URL](https://datatracker.ietf.org/doc/html/rfc2397), or even an opaque issuer-specific encoding. The URI is not checked for validity, but the field is limited to a maximum length of 256 bytes.

One drawback of using this method is that the value is immutable, so it commits the issuer to hosting the data in perpetuity.


# Retrieving `NFToken` Data and Metadata

To minimize the footprint of `NFTokens` without sacrificing functionality or imposing unnecessary restrictions, XRPL NFTs do not have arbitrary data fields. Instead, data is maintained separately and referenced by the `NFToken`. The URI provides a reference to immutable content for the `Hash` and any mutable data for the `NFToken` object.

The `URI` field is especially useful for referring to non-traditional Peer-to-Peer (P2P) URLs. For example, a `minter` that stores `NFToken` data or metadata using the Inter Planetary File System (IPFS) can use the `URI` field to refer to data on IPFS in different ways, each of which is suited to different use-cases. For more context on types of IPFS links that can be used to store NFT data, see [Best Practices for Storing NFT Data using IPFS](https://docs.ipfs.io/how-to/best-practices-for-nft-data/#types-of-ipfs-links-and-when-to-use-them),

An alternative to the URI approach is for issuers of `NFToken` objects to set the `Domain` field of their issuing account to the correct domain, and offer an API for clients that want to lookup the data or metadata associated with a particular `NFToken`. Note that using this mechanism _requires_ the `minter` to acquire a domain name and set the domain name for their minting account, but does not require the `minter` to necessarily operate a server nor other service to provide the ability to query this data; instead, a `minter` can "redirect" queries to a data provider (for example, to a marketplace, registry or other service).

Your implementation should first attempt to check for the presence of the `URI` field to retrieve the associated data and/or metadata. If the `URI` field does not exist, the implementation should check for the presence of `Domain` field. If neither field exists, nothing happens. Implementations must be prepared to handle HTTP redirections (for example, using HTTP responses 301, 302, 307 and 308) from the URI.


## TXT Record Format

The format for a text record is as follows.


```
xrpl-nft-data-token-info-v1 IN TXT "https://host.example.com/api/token-info/{tokenid}"
```


Replace the string `{tokenid}` with the requested token’s `NFTokenID` as a 64-byte hex string when you attempt to query information.

Your implementation should check for the presence of `TXT` records and use those query strings if present. If no string is present, implementations should attempt to use a default URL. Assuming the domain is _example.com_, the default URL would be:


```
https://example.com/.well-known/xrpl-nft/{tokenid}
```


You create NFTs using the `NFTokenMint` transaction. You can optionally destroy NFTokens using the `NFTokenBurn` transaction.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
