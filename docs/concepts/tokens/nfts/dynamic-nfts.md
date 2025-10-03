---
seo:
    description: Create NFTs with the option of changing the URI to update its referenced data object.
labels:
  - Non-fungible Tokens, NFTs
---
# Dynamic Non-Fungible Tokens (dNFTs)

Standard NFTs are immutable. In some use cases, you need to update the referenced data object after the initial minting of an NFT. For example, a concert ticket for a postponed event could be updated with an alternate date, or a virtual trading card for an athlete could be periodically updated with current statistics. Dynamic Non-Fungible Tokens (dNFTs) provide the flexibility required for these use cases.

## Creating a dNFT

When minting a new NFT, enable the `tfMutable` flag (`0x00000010`) to make the NFT mutable.

## Modifying a dNFT

The issuer, or their authorized minter, can modify a dNFT at any time, by sending a [NFTokenModify transaction][]. Only the `URI` field of the NFT can be changed this way.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
