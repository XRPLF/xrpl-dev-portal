---
category: 2025
date: '2025-06-03'
template: '../../@theme/templates/blogpost'
seo:
  description: Two fix amendments to the XRP Ledger protocol have become enabled, and the DynamicNFT is expect to be enabled soon.
labels:
  - Amendments
markdown:
  editPage:
    hide: true
---

# Two Fix Amendments Enabled, dNFTs Expected

Two fixes to the XRP Ledger protocol, [fixFrozenLPTokenTransfer](/resources/known-amendments#fixfrozenlptokentransfer) and [fixInvalidTxFlags](/resources/known-amendments#fixinvalidtxflags), became enabled on 2025-05-15. Additionally, the [DynamicNFT amendment](/resources/known-amendments#dynamicnft) has gained support from a supermajority of validators and will become enabled on 2025-06-11 if it maintains continuous support. The minimum core server version to support these amendments is **v2.4.0**; any servers on older versions are now amendment blocked.

<!-- BREAK -->

## Action Required

- If you operate a core XRP Ledger (`rippled`) server, you must upgrade to version [**2.4.0**](./rippled-2.4.0.md) or higher, for service continuity.
- If you operate a Clio server, you must upgrade to version **2.4.0** or higher, for service continuity. [Version **2.4.1**](./clio-2.4.1.md) is recommended.

### Impact of Not Upgrading

If you operate a `rippled` server that is older than version 2.4.0, then your server is now amendment blocked, meaning that your server:

- Cannot determine the validity of a ledger
- Cannot submit or process transactions
- Does not participate in the consensus process
- Does not vote on future amendments
- Could rely on potentially invalid data

If you operate a Clio server that is older than version 2.4.0, then your server cannot process new ledgers from the network.

For instructions on upgrading core servers on supported platforms, see [Installation](/docs/infrastructure/installation/).

## DynamicNFT Amendment Details

The DynamicNFT amendment adds functionality to make mutable Non-Fungible Tokens (NFTs). NFTs that are minted with the new `tfMutable` flag enabled are mutable, which means their `URI` field can be updated after minting. NFTs that are not marked as mutable when they are minted cannot be changed.

The new [NFTokenModify transaction](/docs/references/protocol/transactions/types/nftokenmodify.md) can modify the `URI` field of a mutable NFT.

## Upcoming Amendments

The [Known Amendments](/resources/known-amendments) page has been updated to list several amendments which are on track to be included in the upcoming 2.5.0 release of the core XRP Ledger server. These amendments are:

- **Batch**: Submit several transactions as one batch to be processed together.
- **fixAMMv1_3**: Fix some bugs in Automated Market Makers, including rounding on deposits and stricter validation in the auction slot mechanism.
- **fixEnforceNFTokenTrustlineV2**: Fix bugs that could allow NFT issuers to receive fungible tokens as transfer fees, circumventing authorized trust lines or deep freeze.
- **fixPayChanCancelAfter**: Fix a bug that could allow you to create a payment channel that has already expired.
- **PermissionDelegation**: Allow accounts to delegate some permissions to other accounts.
- **PermissionedDEX**: Create controlled environments for trading in the Decentralized Exchange, restricted by permissioned domains.
- **SingleAssetVault**: Create a mechanism for pooling assets from multiple depositors into a single structure in the ledger.
- **TokenEscrow**: Extend escrow functionality to support issued tokens and MPTs.

All of these amendments have already been merged to the `develop` branch and are undergoing final testing now. They will be officially _open for voting_ when they are included in a stable release. Any amendments that are open for voting can become enabled following two weeks of support from a supermajority of greater than 80% of trusted validators, per the [amendment process](/docs/concepts/networks-and-servers/amendments).

## Learn and Discuss

If you have more feedback on these and other upcoming protocol features, your feedback is welcome! See the following resources for more:

- [XRPL Standards Repository](https://github.com/XRPLF/XRPL-Standards)
- [XRPL Dev Discord](https://discord.gg/sfX3ERAMjH)
