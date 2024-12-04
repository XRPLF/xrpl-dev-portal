---
html: digital-artist.html
parent: nft-mkt-overview.html
seo:
    description: Creating an NFT Marketplace for buying and selling NFTs.
labels:
  - Tokenization
---
# Digital Artist

_As a Digital Artist, I want to use the XRPL to create a NFToken of my work and sell it on the XRPL, because the XRPL is both cost efficient and carbon neutral._

---

When you create a NFToken, you create a unique token on the XRPL that is effectively a placeholder for an actual physical or digital asset. When you create the NFToken, you provide a URL to a digital file that is the item itself, such as a digital artwork, or a URL to a placeholder that represents an item in the physical world.

As a digital artist, you’re focused on creating NFTs, presumably to sell on the XRP Ledger (it’s  also possible you might create NFTs as a way of establishing provenance for your creations).

You can create NFTokens using an app such as the [Xaman app](https://xaman.app).

For a more hands-on experience, you can follow the steps in the [Quickstart Tutorial 3 - Mint and Burn NFTokens](../../tutorials/javascript/nfts/mint-and-burn-nfts.md).

[![Digital Artist Flow](/docs/img/nft-mkt-digital-artist.png "Digital Artist Flow")](/docs/img/nft-mkt-digital-artist.png)

## Use a public server

As you get started, you will likely have comparatively few transactions. You can work with one of the free XRP Ledger public servers. As your business grows, you might consider your own NFT Ledger instance to handle increased sales traffic. See [Public servers](../../tutorials/public-servers.md).

## Create NFTs

Build your marketplace by minting NFTs to sell.

To create your first NFTs, follow the instructions in the tutorial _Mint and Burn NFTokens_. Keep the following in mind as you create your NFTs:

* You can collect royalties from future sales by setting a <code>transfer fee<em>. </em></code>This is a value from 0-50000 representing 0-50% of the sale price. See [Transfer Fee](../../references/protocol/data-types/nftoken.md#transferfee).
* The NFToken URL is a link to the location where the content of the NFT is stored. One option is create an IPFS account and store the NFToken content at a persistent URL. See [Best Practices for Storing NFT Data](https://docs.ipfs.io/how-to/best-practices-for-nft-data). [Add link to blog post about alternative NFT cache options.]
* You can mint NFTs in logical collections using the <code>TokenTaxon</code> field. See [Minting NFTs into Collections](../../concepts/tokens/nfts/collections.md).
* If you, as the issuer, want to be able to burn the token in the future, set the <code>Flags</code> field to <em>1.</em> To make the NFT transferable, set the <code>Flags</code> field to <em>8</em>. Set the <code>Flags</code> field to <em>9</em> to make the NFT both burnable and transferable. See[ Burnable flag](../../references/protocol/data-types/nftoken.md#nftoken-flags) and [Transferable flag](../../references/protocol/data-types/nftoken.md#nftoken-flags).

See [Mint and Burn NFTokens](../../tutorials/javascript/nfts/mint-and-burn-nfts.md).

## Sell NFTs

You transfer NFTs by creating a sell offer. See [Transfer NFTokens](../../tutorials/javascript/nfts/transfer-nfts.md).

![Transferring NFTs](/docs/img/uc-nft-transferring-nfts.png)

You can sell your NFTs in an auction format. See [Running an NFT Auction](../../concepts/tokens/nfts/running-an-nft-auction.md).

### Reserve requirements

There are several XRP reserve requirements when you mint NFTs for sale. Each NFToken page requires a reserve of 2 XRP. A NFToken page can store 16-32 NFTs.

Each `NFTokenOffer` object requires a reserve of 2 XRP.

![Reserves](/docs/img/uc-nft-reserves.png)

When you post the `NFTokenOffer` or sell the NFT, there are trivial transfer fees (roughly 6000 drops, or .006 XRP). When you are selling at a high volume, the trivial amounts can add up quickly, and need to be considered as part of your cost of doing business.

See:

1. [NFTokenOffer](../../concepts/tokens/nfts/reserve-requirements.md#nftokenoffer-reserve)
2. NFToken page ([Owner reserve](../../concepts/tokens/nfts/reserve-requirements.md#owner-reserve))
3. Trivial [transfer fees](../../concepts/tokens/transfer-fees.md)

### Checkout

The most straightforward payment for XRPL NFTs is XRP. For examples of selling and buying NFTs using XRP, see [Transfer NFTokens](../../tutorials/javascript/nfts/transfer-nfts.md).

![Checkout](/docs/img/uc-nft-checkout.png)

For trade in other currencies, you can leverage the DEX to accept and convert issued currencies of all kinds. See [Trade in the Decentralized Exchange](../../tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange.md#trade-in-the-decentralized-exchange).


## Indexing NFTs

When listing NFTs for sale, it can be useful to use object metadata to organize them. You can use queries in the XRPL libraries, the Clio server, and extensions in the XRPL API and Bithomp libraries to sort and filter NFTs by creator, price, collection, rarity, and more.

![Indexing NFTs](/docs/img/uc-nft-indexing.png)

See:

- [Clio setup](../../infrastructure/installation/install-clio-on-ubuntu.md)
- [XRPL Data API](https://api.xrpldata.com/docs/static/index.html#/)
- [Bithomp](https://docs.bithomp.com/#nft-xls-20)


## Burning NFTs

There are some workflows where it makes sense for the issuer to retain the right to burn the token at some point in the future, regardless of the current owner. For example, NFTs used for carbon credits can be minted and traded, but once the carbon is captured, the NFT can be burned so that it is no longer transferable. For these scenarios, set the `lsfBurnable` flag when you mint the NFT.

![Burning NFTs](/docs/img/uc-nft-burn.png)

Another example might be burning an in-game asset that is lost by a player after losing a life in the game. You might also burn an NFT ticket after successful redemption to prevent it from being used again.
