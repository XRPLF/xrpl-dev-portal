---
category: 2025
date: '2025-07-18'
template: '../../@theme/templates/blogpost'
seo:
  description: The DynamicNFT amendment is currently enabled.
labels:
  - Amendments
markdown:
  editPage:
    hide: true
---

# DynamicNFT is Now Available

The DynamicNFT amendment [became enabled on the XRP Ledger](https://livenet.xrpl.org/transactions/CB5D27363B103D74F4018B5099EF9AD818AEB3634E8692D67F9FDF3CBBA778F5) on 2025-06-11. This amendment allows mutable NFTs to be minted.

## Action Required

- If you operate a core XRP Ledger (`rippled`) server, you should upgrade to version [**2.4.0**](./rippled-2.4.0.md) or higher immediately. [Version **2.5.0**](./rippled-2.5.0.md) is recommended.

Several other amendments are also open for voting according to the XRP Ledger's [amendment process](../../docs/concepts/networks-and-servers/amendments.md), which enables protocol changes following two weeks of >80% support from trusted validators.

For instructions on upgrading on supported platforms, see [Installation](/docs/infrastructure/installation/).

## DynamicNFT Amendment Details

The DynamicNFT amendment adds functionality to make mutable Non-Fungible Tokens (NFTs). NFTs that are minted with the new `tfMutable` flag enabled are mutable, which means their `URI` field can be updated after minting. NFTs that are not marked as mutable when they are minted cannot be changed.

The new [NFTokenModify transaction](/docs/references/protocol/transactions/types/nftokenmodify.md) can modify the `URI` field of a mutable NFT.

## Learn and Discuss

To learn more about upcoming protocol features, see the following resources for more information, and feel welcome to join the discussion:

- [XRPL Standards Repository](https://github.com/XRPLF/XRPL-Standards)
- [XRPL Dev Discord](https://discord.gg/sfX3ERAMjH)

To receive email updates whenever there are important releases or changes to XRP Ledger server software, subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).
