---
html: authorized-minter.html
parent: nft-mkt-overview.html
seo:
    description: Minting and selling NFTs for another account.
labels:
  - Tokenization
---
# Authorized Minter

_As an authorized minter, I want to mint tokens for a token issuer at an agreed upon rate and sell the tokens at a profit, with royalties returning to the issuer._

You can act as an authorized minter for token issuers. When you do this, you own the NFToken, but royalties flow to the NFToken issuer. When you make a sale of that NFToken, the proceeds of the initial sale go to you. You can have an agreement with your issuer to pay them some or all of your portion of the initial sale amount.

You can learn more in the tutorial [Assign an Authorized Minter](../../tutorials/javascript/nfts/assign-an-authorized-minter.md).

[![Authorized Minter Flow](/docs/img/nft-mkt-auth-minter.png "Authorized Minter Flow")](/docs/img/nft-mkt-auth-minter.png)

## Set up a rippled instance

If you want to set up a larger site with high volume, it might be worth investing in your own XRP Ledger server instance. See [Install rippled](../../infrastructure/installation/index.md).

## Set up your marketplace

Rather than designing NFTs yourself, you coordinate with an NFT creator to become an authorized minter and generate NFTs on their behalf. This allows the creator to focus on making new NFTs while you handle production and sales of the NFTs. See [Authorized Minter](../../concepts/tokens/nfts/authorizing-another-minter.md).

Once you finish creating NFTs, the creator can revoke your privileges and reassert control over the NFTs. You might also transfer the tokens to a marketplace that will handle sales of the NFTs. You can act as a broker to match sell offers to buy offers. See [Running an NFT auction](../../concepts/tokens/nfts/running-an-nft-auction.md).

![Auctioning NFTs](/docs/img/uc-nft-transferring-nfts.png)

To mint your first NFTs on behalf of another account, see [Authorizing Another Account to Mint Your NFTs](../../tutorials/javascript/nfts/assign-an-authorized-minter.md).

If you, as the owner or issuer, want to be able to burn the token in the future, set the `Flags` field to _1._ To make the NFT transferable, set the `Flags` field to _8_. Set the `Flags` field to _9_ to make the NFT both burnable and transferable. See[ Burnable flag](../../references/protocol/data-types/nftoken.md#nftoken-flags) and [Transferable flag](../../references/protocol/data-types/nftoken.md#nftoken-flags).

![Burning NFTs](/docs/img/uc-nft-burn.png)

You can arrange for the creator to receive royalties from future sales by setting a <code>transfer fee<em>. </em></code>This is a value from 0-50000 representing 0-50% of the sale price. See [Transfer Fee](../../references/protocol/data-types/nftoken.md#transferfee).

The NFToken URL is a link to the location where the content of the NFT is stored. One option is create an IPFS account and store the NFToken content at a persistent URL. See [Best Practices for Storing NFT Data](https://docs.ipfs.io/how-to/best-practices-for-nft-data).

Considerations that might be most interesting to you:

* [Minting NFTs into Collections](../../concepts/tokens/nfts/collections.md)
Use the TokenTaxon field to gather a set of NFTs centered around a specific theme or purpose.
* [Guaranteeing a Fixed Supply of NFTs](../../concepts/tokens/nfts/guaranteeing-a-fixed-supply.md)
You can assure scarcity of NFTs you create by creating them with what might be characterized as a “burner” account that you use to mint a set number of NFTs for another account, then delete the account you used to mint the NFTs. See [Guaranteeing a Fixed Supply of NFTs](../../concepts/tokens/nfts/guaranteeing-a-fixed-supply.md).

## Transferring NFTs

You transfer NFTs by creating a sell offer or accepting a buy offer. See [Transfer NFTokens](../../tutorials/javascript/nfts/transfer-nfts.md).

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
[Clio setup](../../infrastructure/installation/install-clio-on-ubuntu.md)

[https://api.xrpldata.com/docs/static/index.html#/](https://api.xrpldata.com/docs/static/index.html#/)

[https://docs.bithomp.com/#nft-xls-20](https://docs.bithomp.com/#nft-xls-20)

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
