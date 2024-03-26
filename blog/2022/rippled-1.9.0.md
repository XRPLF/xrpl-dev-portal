---
category: 2022
date: 2022-04-07
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.9.0

Version 1.9.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes the XLS-20 amendment and fixes and updates for stability and security.

<!-- BREAK -->

## Action Required

This release introduces a new amendment to the XRP Ledger protocol to support Non-Fungible Tokens (NFTs) natively on the XRP Ledger (per the XLS-20 draft standard). This amendment is now open for voting according to the XRP Ledger's amendment process, which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, then you should upgrade to version 1.9.0 within two weeks, to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

For more information about NFTs on the XRP Ledger, see [NFT Conceptual Overview](https://xrpl.org/nft-conceptual-overview.html).

## Install / Upgrade

On supported platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds).

The most recent commit in the git log should be the change setting the version:

```text
commit 7c66747d27869f9f3c96617bd4227038f1fa92b8
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Wed Apr 6 20:28:37 2022 -0700

    Set version to 1.9.0
```

## Changelog

This release contains the following features and improvements.

### New and Improved Features

- **Introduce NFT support (XLS-20):** This release introduces support for non-fungible tokens, currently available to the developer community for broader review and testing.  Developers can create applications that allow users to mint, transfer, and ultimately burn (if desired) NFTs on the XRP Ledger. You can try out the new NFT transactions using the [nft-devnet](https://xrpl.org/xrp-testnet-faucet.html). Note that some fields and error codes from earlier releases of the supporting code have been refactored for this release, shown in the Code Refactoring section, below. [70779f](https://github.com/ripple/rippled/commit/70779f6850b5f33cdbb9cf4129bc1c259af0013e)

- **Simplify the Job Queue:** This is a refactor aimed at cleaning up and simplifying the existing job queue. Currently, all jobs are canceled at the same time and in the same way, so this commit removes the unnecessary per-job cancellation token. [#3656](https://github.com/ripple/rippled/pull/3656)

- **Optimize trust line caching:** The existing trust line caching code was suboptimal in that it stored redundant information, pinned SLEs into memory, and required multiple memory allocations per cached object. This commit eliminates redundant data, reduces the size of cached objects and unpinning SLEs from memory, and uses value types to avoid the need for `std::shared_ptr`. As a result of these changes, the effective size of a cached object includes the overhead of the memory allocator, and the `std::shared_ptr` should be reduced by at least 64 bytes. This is significant, as there can easily be tens of millions of these objects. [4d5459](https://github.com/ripple/rippled/commit/4d5459d041da8f5a349c5f458d664e5865e1f1b5)

- **Incremental improvements to pathfinding memory usage:** This commit aborts background pathfinding when closed or disconnected, exits the pathfinding job thread if there are no requests left, does not create the path find a job if there are no requests, and refactors to remove the circular dependency between InfoSub and PathRequest. [#4111](https://github.com/ripple/rippled/pull/4111)

- **Improve deterministic transaction sorting in TxQ:** This commit ensures that transactions with the same fee level are sorted by TxID XORed with the parent ledger hash, the TxQ is re-sorted after every ledger, and attempts to future-proof the TxQ tie-breaking test. [#4077](https://github.com/ripple/rippled/pull/4077)

- **Improve stop signaling for Application:** [34ca45](https://github.com/ripple/rippled/commit/34ca45713244d0defc39549dd43821784b2a5c1d)

- **Eliminate SHAMapInnerNode lock contention:** The `SHAMapInnerNode` class had a global mutex to protect the array of node children. Profiling suggested that around 4% of all attempts to lock the global would block. This commit removes that global mutex, and replaces it with a new per-node 16-way spinlock (implemented so as not to affect the size of an inner node object), effectively eliminating the lock contention. [1b9387](https://github.com/ripple/rippled/commit/1b9387eddc1f52165d3243d2ace9be0c62495eea)

- **Improve ledger-fetching logic:** When fetching ledgers, the existing code would isolate the peer that sent the most useful responses, and issue follow-up queries only to that peer. This commit increases the query aggressiveness, and changes the mechanism used to select which peers to issue follow-up queries to so as to more evenly spread the load among those peers that provided useful responses. [48803a](https://github.com/ripple/rippled/commit/48803a48afc3bede55d71618c2ee38fd9dbfd3b0)

- **Simplify and improve order book tracking:** The order book tracking code would use `std::shared_ptr` to track the lifetime of objects. This commit changes the logic to eliminate the overhead of `std::shared_ptr` by using value types, resulting in significant memory savings. [b9903b](https://github.com/ripple/rippled/commit/b9903bbcc483a384decf8d2665f559d123baaba2)


- **Negative cache support for node store:** This commit allows the cache to service requests for nodes that were previously looked up but not found, reducing the need to perform I/O in several common scenarios. [3eb8aa](https://github.com/ripple/rippled/commit/3eb8aa8b80bd818f04c99cee2cfc243192709667)

- **Improve asynchronous database handlers:** This commit optimizes the way asynchronous node store operations are processed, both by reducing the number of times locks are held and by minimizing the number of memory allocations and data copying. [6faaa9](https://github.com/ripple/rippled/commit/6faaa91850d6b2eb9fbf16c1256bf7ef11ac4646)

- **Cleanup AcceptedLedger and AcceptedLedgerTx:** This commit modernizes the `AcceptedLedger` and `AcceptedLedgerTx` classes, reduces their memory footprint, and reduces unnecessary dynamic memory allocations. [8f5868](https://github.com/ripple/rippled/commit/8f586870917818133924bf2e11acab5321c2b588)

### Code Refactoring

This release includes name changes in the NFToken API for SFields, RPC return labels, and error codes for clarity and consistency. To refactor your code, migrate the names of these items to the new names as listed below.
 
#### `SField` name changes

| Old name | New name |
|:---------|:----------|
| TokenTaxon | NFTokenTaxon |
| MintedTokens | MintedNFTokens |
| BurnedTokens | BurnedNFTokens |
| TokenID | NFTokenID |
| TokenOffers | NFTokenOffers |
| BrokerFee | NFTokenBrokerFee |
| Minter | NFTokenMinter |
| NonFungibleToken | NFToken |
| NonFungibleTokens | NFTokens |
| BuyOffer | NFTokenBuyOffer |
| SellOffer | NFTokenSellOffer |
| OfferNode | NFTokenOfferNode |
| asfAuthorizedMinter | asfAuthorizedNFTokenMinter |
| tfSellToken | tfSellNFToken |
| lsfSellToken | lsfSellNFToken |
 
#### RPC return labels

| Old name | New name |
|:---------|:----------|
| tokenid | nft_id |
| index | nft_offer_index (in responses to `nft_buy_offers` and `nft_sell_offers` requests) |
 
#### Error codes

| Old name | New name |
|:---------|:----------|
| temBAD_TRANSFER_FEE | temBAD_NFTOKEN_TRANSFER_FEE |
| tefTOKEN_IS_NOT_TRANSFERABLE | tefNFTOKEN_IS_NOT_TRANSFERABLE |
| tecNO_SUITABLE_PAGE | tecNO_SUITABLE_NFTOKEN_PAGE |
| tecBUY_SELL_MISMATCH | tecNFTOKEN_BUY_SELL_MISMATCH |
| tecOFFER_TYPE_MISMATCH | tecNFTOKEN_OFFER_TYPE_MISMATCH |
| tecCANT_ACCEPT_OWN_OFFER | tecCANT_ACCEPT_OWN_NFTOKEN_OFFER |


### Bug Fixes

- **Fix deletion of orphan node store directories:** Orphaned node store directories should only be deleted if the proper node store directories are confirmed to exist. [06e87e](https://github.com/ripple/rippled/commit/06e87e0f6add5b880d647e14ab3d950decfcf416)
