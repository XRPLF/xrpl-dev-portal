---
html: nft-reserve-requirements.html
parent: non-fungible-tokens.html
seo:
    description: Understand reserve requirements for minting and holding NFTs.
labels:
 - Non-fungible Tokens, NFTs
---
# NFT Reserve Requirements

Minting, holding, and offering NFTs for sale require XRP held in reserve. The reserve charges can add up quickly. Understanding the reserve requirements can help you choose the best approach for your business case.

## Base Reserve

Your account must set aside a base reserve, currently 10 XRP. The base reserve XRP amount is subject to change. See [Base Reserve and Owner Reserve](../../accounts/reserves.md#base-reserve-and-owner-reserve).

## Owner Reserve

For each object you own on the XRP Ledger, there is an owner reserve, currently 2 XRP. This is to discourage users from spamming the ledger with unnecessary data, and to encourage them to clean up any data that is no longer necessary. The owner reserve amount is subject to change. See [Base Reserve and Owner Reserve](../../accounts/reserves.md#base-reserve-and-owner-reserve).

For NFTs, the _object_ does not refer to the individual NFTs, but to the `NFTokenPage` objects owned by the account. `NFTokenPage` objects can store up to 32 NFTs.

However, NFTs are not packed into pages to minimize space used. If you have 64 NFTs, it's not necessarily true that you have only 2 `NFTokenPage` objects.

A good rule of thumb is to assume, on average, that each `NFTokenPage` stores 24 NFTs.
Therefore, you can estimate the reserve requirements for minting or owning _N_ NFTs as (24N)/2, or 1/12 of one XRP per NFT.

The following table provides examples of how much the total owner reserve might be, depending on the number of NFTs owned and the number of pages holding them.

| NFTs Owned    | Best Case    | Typical Case | Worst Case |
|:------------|:----------|:-------------|:-----------|
| 32 or fewer |    2 XRP        | 2 XRP           | 2 XRP      |
| 50            | 4 XRP        | 6 XRP           | 8 XRP      |
| 200            | 14 XRP      | 18 XRP         | 26 XRP     |
| 1000          | 64 XRP      | 84 XRP         | 126 XRP    |

## `NFTokenOffer` Reserve

Each `NFTokenOffer` object costs the account placing the offer one incremental reserve. As of this writing, the incremental reserve is 2 XRP. The reserve can be recovered by cancelling the offer. The reserve is also recovered if the offer is accepted, which removes the offer from the XRP Ledger.

**Tip** After you sell an NFT, as a courtesy, cancel any stale `NFTokenOffer` objects on behalf of your bidders to give them back their reserve. You can do this with [NFTokenCancelOffer](../../../references/protocol/transactions/types/nftokencanceloffer.md) transactions.

## Practical Considerations

When minting, holding, and offering to buy and sell NFTs, the reserve requirements can add up quickly. This can result in your account going below the reserve requirement during a transaction. Going below the requirement can limit your ability to trade on the XRPL. See [Going Below the Reserve Requirement](../../accounts/reserves.md#going-below-the-reserve-requirement).

If you create a new account, mint an NFT, and create an `NFTokenSellOffer` on the XRP Ledger, that requires a minimum reserve of 14 XRP.

| Reserve Type        | Amount  |
|:--------------------|--------:|
| Base                | 10 XRP  |
| NFToken Page        | 2 XRP   |
| NFToken Offers      | 2 XRP   |
| Total               | 14 XRP  |
|                     |         |

**Note** While not a reserve requirement, keep in mind that you would want to have at least 1 XRP above your reserves to cover the trivial fee for each transaction in the mint and sell process (typically 12 drops, or .000012 XRP).

If you were to mint 200 NFTs and create an `NFTokenSellOffer`for each, that would require as much as 436 XRP held in reserve.

| Reserve Type        | Amount  |
|:--------------------|--------:|
| Base                | 10 XRP  |
| NFToken Pages       | 26 XRP  |
| NFToken Offers      | 400 XRP |
| Total               | 436 XRP |
|                     |         |

If the required reserves exceed the amount you are comfortable setting aside, consider using the mint-on-demand model to reduce the number of NFTs and offers you hold at any one time. For details, see [Batch Minting](batch-minting.md).
