---
html: nftoken-marketplace.html
parent: nft-mkt-overview.html
seo:
    description: Creating an NFT Marketplace for buying and selling NFTs.
labels:
  - Tokenization
---
# NFT Marketplace

_In my NFToken Marketplace, I want to use the XRPL to create a web presence where I can arrange transfer of a curated selection of NFTokens to consumers, with the benefit that I can build a brand and earn broker fees based on sales._

---

NFToken Marketplaces act as intermediaries between NFToken creators and collectors. As a marketplace curator, you seek out NFToken creators and assemble a collection of items to sell. Buyers come to your site to review your selections and post offers. You match the minimum prices set by the creators with the optimal offers from the buyers, complete the transaction, and collect a broker fee.

## Creating an NFT Marketplace

[![NFT Marketplace Flow](/docs/img/nft-mkt-marketplace.png "NFT Marketplace Flow")](/docs/img/nft-mkt-marketplace.png)


## Set up a rippled instance

When you set up a serious marketplace site with high volume, it justifies the decision to set up your own XRP Ledger server instance. See [Install rippled](../../infrastructure/installation/index.md).


### Setting up a wallet

Set up a new wallet. See [Xaman](https://xaman.app/).

Base reserve requirements See [Reserves](../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve).

### Transferring NFTs

You transfer NFTs by creating a sell offer or accepting a buy offer. See [Transfer NFTokens](../../tutorials/javascript/nfts/transfer-nfts.md).

![Transferring NFTs](/docs/img/uc-nft-transferring-nfts.png)

You can sell your NFTs in an auction format. See [Running an NFT Auction](../../concepts/tokens/nfts/running-an-nft-auction.md).

You can act as a broker, connecting sellers with bidders, completing the transfer and keeping a percentage of the purchase price. See [Broker a NFToken sale](../../tutorials/javascript/nfts/broker-an-nft-sale.md).


### Reserve requirements

There are several XRP reserve requirements when you mint NFTs for sale. Each NFToken page requires a reserve of 2 XRP. A NFToken page can store 16-32 NFTs.

![Reserves](/docs/img/uc-nft-reserves.png)

Each `NFTokenOffer` object requires a reserve of 2 XRP.

When you post the `NFTokenOffer` or sell the NFT, there are trivial transfer fees (roughly 6000 drops, or .006 XRP). When you are selling at a high volume, the trivial amounts can add up quickly, and need to be considered as part of your cost of doing business.

See:

1. [NFTokenOffer](../../concepts/tokens/nfts/reserve-requirements.md#nftokenoffer-reserve)
2. NFToken page ([Owner reserve](../../concepts/tokens/nfts/reserve-requirements.md#owner-reserve))
3. Trivial [transfer fees](../../concepts/tokens/transfer-fees.md)

You can learn more about brokered sales in the topic [Trading Tokens on the XRP Ledger](../../concepts/tokens/nfts/trading.md).

Learn more about token transfer fees in the topic [Transfer Fees](../../concepts/tokens/transfer-fees.md).

You can get started building a brokered sales marketplace by following the steps in the [Broker a NFToken Sale](../../tutorials/javascript/nfts/broker-an-nft-sale.md).

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

<!--

Sorting and filtering [No link]
    Creator - nft_info (issuer field)
    Price - nft_sell_offer->offers->amount field)
    Popularity - ?
    Newly listed
    Collection - nft_info (token taxon field)
    XRP vs $ vs IOUs

Search [No link]
Featured NFTs [No link]
Supplement Information [No link]
    Rarity
    Floor price
    History
        Number of owners
        Price History

 -->
