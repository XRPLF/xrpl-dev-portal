---
html: nft-collections.html
parent: non-fungible-tokens.html
seo:
    description: You can mint NFTs as collections using the NFT Taxon field.
labels:
 - Non-fungible Tokens, NFTs
---
# Minting NFTs into Collections

You can use the `NFTokenTaxon` field to group NFTs into collections. As the minter, you can choose any numeric value from `0x0` to `0xFFFFFFFF`and assign it to NFTs as you create them. The significance of the taxon is entirely up to you.

For example, for your first collection, you might set the `NFTokenTaxon` to `1`. You might have a collection of NFTs with taxon values of `316`, `420`, or `911`. You might use taxons that start with a digit to indicate the type of NFT (for example, all Real Estate NFTs have a taxon that starts with `2`).

While the `NFTokenTaxon` field is required, you can set the value to `0` if you don't intend to create a collection.

See [NFTokenTaxon](../../../references/protocol/data-types/nftoken.md#nftokentaxon).
