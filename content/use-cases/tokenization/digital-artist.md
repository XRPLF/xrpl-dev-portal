---
html: digital-artist.html
parent: nft-mkt-overview.html
blurb: Creating an NFT Marketplace for buying and selling NFTs.
labels:
  - Tokenization
---
# Digital Artist

_As a Digital Artist, I want to use the XRPL to create an NFT of my work and sell it on the XRPL, because the XRPL is both cost efficient and carbon neutral._

---

When you create an NFT, you create a unique token on the XRPL that is effectively a placeholder for an actual physical or digital asset. When you create the NFT, you provide a URL to a digital file that is the item itself, such as a digital artwork, or a URL to a placeholder that represents an item in the physical world, like a painting or statue.

![NFTs can be Physical or Digital](img/uc-nft-physical-vs-digital.png)

As a digital artist, you’re focused on creating NFTs, presumably to sell on the XRP Ledger (it’s  also possible you might create NFTs as a way of establishing provenance for your creations).

You can create NFTs using an app such as [Xumm](https://xumm.app).

For a more hands-on experience, you can follow the steps in [Quickstart Tutorial 3 - Mint and Burn NFTokens](mint-and-burn-nfts-using-javascript.html). 

[![Digital Artist Flow](img/nft-mkt-digital-artist.png "Digital Artist Flow")](img/nft-mkt-digital-artist.png)

## Use a public server

As you get started, you will likely have comparatively few transactions. You can work with one of the free XRP Ledger public servers. As your business grows, you might consider creating your own XRP Ledger instance to handle increased sales traffic. See [Public servers](public-servers.html).

## Create NFTs

Build your marketplace by minting NFTs to sell.

To create your first NFTs, follow the instructions in the tutorial _Mint and Burn NFTokens_. Keep the following in mind as you create your NFTs:

* You can collect royalties from future sales by setting a <code>transfer fee</code>. This is a value from 0-50000 representing 0-50% of the sale price. See [Transfer Fee](nftoken.html#transferfee).
* The NFT URL is a link to the location where the content of the NFT is stored. One option is to store the NFT content at a persistent URL using a service such as IPFS. See [NFT Payload Storage Options](https://dev.to/ripplexdev/nft-payload-storage-options-569i).
* You can mint NFTs in logical collections using the <code>TokenTaxon</code> field. See [Minting NFTs into Collections](nft-collections.html).
* If you, as the issuer, want to be able to burn the token in the future, set the `Flags` field to _1_. To make the NFT transferable, set the `Flags` field to _8_. Set the `Flags` field to _9_ to make the NFT both burnable and transferable. See [Burnable flag](nftoken.html#nftoken-flags) and [Transferable flag](nftoken.html#nftoken-flags).

See [Mint and Burn NFTokens](mint-and-burn-nfts-using-javascript.html).

## Sell NFTs

You transfer NFTs by creating a sell offer. Other accounts can choose to accept your offer, completing the transfer. See [Transfer NFTokens](transfer-nfts-using-javascript.html).

![Transfer NFTs](img/uc-nft-transferring-nfts.png)

You can sell your NFTs in an auction format. See [Running an NFT Auction](nftoken-auctions.html).

### Reserve requirements

There are several XRP reserve requirements when you mint NFTs for sale. Each NFToken page requires a reserve of 2 XRP. A NFToken page can store 16-32 NFTs.

![NFT Reserve Requirements](img/uc-nft-reserves.png)

Each `NFTokenOffer` object also requires a reserve of 2 XRP.

When you post the `NFTokenOffer` or sell the NFT, there are trivial transfer fees (roughly 6000 drops, or .006 XRP). When you are selling at a high volume, the trivial amounts can add up quickly, and need to be considered as part of your cost of doing business.

See:

1. [NFTokenOffer](nft-reserve-requirements.html#nftokenoffer-reserve)
2. NFToken page ([Owner reserve](nft-reserve-requirements.html#owner-reserve))
3. [Transfer fees](transfer-fees.html)

### Checkout

The most straightforward payment for XRPL NFTs is XRP. For examples of selling and buying NFTs using XRP, see [Transfer NFTokens](transfer-nfts-using-javascript.html).

![Checkout](img/uc-nft-checkout.png)

For trade in other currencies, you can leverage the DEX to accept and convert issued currencies of all kinds. See [Trade in the Decentralized Exchange](trade-in-the-decentralized-exchange.html#trade-in-the-decentralized-exchange).


## Indexing NFTs

When listing NFTs for sale, it can be useful to use object metadata to organize them.

![Indexing NFTs](img/uc-nft-indexing.png)

You can use queries in the XRPL libraries, the Clio server, and extensions in the XRPL API and Bithomp libraries to sort and filter NFTs by creator, price, collection, rarity, and more.

See:

- [Clio setup](install-clio-on-ubuntu.html) 
- [XRPL Data API](https://api.xrpldata.com/docs/static/index.html#/)
- [Bithomp](https://docs.bithomp.com/#nft-xls-20)


## Burning NFTs

There are some workflows where it makes sense for the issuer to retain the right to burn the token at some point in the future, regardless of the current owner. For example, NFTs used for carbon credits can be minted and traded, but once the carbon is captured, the NFT can be burned so that it is no longer transferable. For these scenarios, set the `lsfBurnable` flag when you mint the NFT.

![Burning an NFT](img/uc-nft-burn.png)

Another example might be burning an in-game asset that is lost by a player after losing a life in the game. You might also burn an NFT ticket after successful redemption to prevent it from being used again.