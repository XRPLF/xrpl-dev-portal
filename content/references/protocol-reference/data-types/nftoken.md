---
html: nftoken.html
parent: basic-data-types.html
blurb: Introduction to XRPL NFTs.
labels:
  - Non-fungible Tokens, NFTs
---
# NFToken

The `NFToken` object represents a single non-fungible token (NFT). It is not stored on its own, but is contained in a [NFTokenPage object][]  alongside other `NFToken` objects.

## NFToken Flags

Flags are properties or other options associated with the `NFToken` object.


| Flag Name         | Flag Value | Description                                 |
|:------------------|:-----------|:--------------------------------------------|
| `lsfBurnable`     | `0x0001`   | If enabled, the issuer (or an entity authorized by the issuer) can destroy this `NFToken`. The object's owner can always do so. |
| `lsfOnlyXRP`      | `0x0002`   | If enabled, this `NFToken` can only be offered or sold for XRP. |
| `lsfTrustLine`    | `0x0004`   | **DEPRECATED** If enabled, automatically create [trust lines](trust-lines-and-issuing.html) to hold transfer fees. Otherwise, buying or selling this `NFToken` for a fungible token amount fails if the issuer does not have a trust line for that token. The [fixRemoveNFTokenAutoTrustLine amendment][] makes it invalid to enable this flag. |
| `lsfTransferable` | `0x0008`   | If enabled, this `NFToken` can be transferred from one holder to another. Otherwise, it can only be transferred to or from the issuer. |
| `lsfReservedFlag` | `0x8000`   | This flag is reserved for future use. Attempts to set this flag fail. |

`NFToken` flags are immutable: they can only be set during the [NFTokenMint transaction][] and cannot be changed later.


### NFTokenTaxon
<!-- SPELLING_IGNORE: nftokentaxon -->

The fourth section is a `NFTokenTaxon` created by the issuer.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
