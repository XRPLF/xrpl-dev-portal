---
html: nft-mkt-overview.html
parent: tokenization.html
blurb: Overview of NFT Marketplace use cases.
labels:
  - Tokenization
---
# NFT Marketplace Overview


## Key Features

XRPL native support for NFTs provides tools that let you do the following.

- Mint, sell, and burn NFTs
- Kick start an NFT project in little time at low expense
- Assign a broker to arrange transfers between sellers and bidders
- Authorize another account to mint NFTs for you
- Receive creator-friendly, on-ledger royalties that are honored by marketplaces

All this on top of the XRP Ledger’s greater than 10 years of performance and reliability.

## Understand Your Goals

Start by deciding what sort of marketplace you want to create.

- Marketplace, selling NFTs minted by others
- Authorized minter, minting NFTs for artists
- Digital artist, creating and selling your own NFTs

There are 4 essential areas of preparation for starting your NFT business.

1. Deciding how you will connect to the network
2. Setting up your blockchain behavior
3. Indexing required NFT information
4. Determining your permanent storage strategy to cache your NFTs

[![NFT Marketplace Flow](img/nft-mkt-overview.png "NFT Marketplace Flow")](img/nft-mkt-overview.png)

## Connect to XRPL

If you want to set up a smaller site with fewer transactions, you can work with one of the free XRP Ledger public servers. See [Public servers](public-servers.html).

If you want to set up a larger site with high volume, it might be worth investing in your own XRP Ledger server instance. See [Install rippled](install-rippled.html).

See also:

* [Pros and cons of running your own server](networks-and-servers.html#reasons-to-run-your-own-server).

## Set Up Basic Blockchain Functions

You can begin to build your marketplace by minting some NFTs to sell.

To create your first NFTs, follow the instructions in the tutorial _Mint and Burn NFTokens_. See [Mint and Burn NFTokens](mint-and-burn-nfts-using-javascript.html).

The NFToken URL is a link to the location where the content of the NFT is stored. One option is create an IPFS account and store the NFToken content at a persistent URL. See [Best Practices for Storing NFT Data](https://docs.ipfs.io/how-to/best-practices-for-nft-data).

If you, as the issuer, want to be able to burn the token in the future, set the `Flags` field to _1._ To make the NFT transferable, set the `Flags` field to _8_. Set the `Flags` field to _9_ to make the NFT both burnable and transferable. See [Burnable flag](nftoken.html) and [Transferable flag](nftoken.html).

![Burning a token](img/uc-nft-burn.png)

You can collect royalties from future sales by setting a <code>transfer fee<em>. </em></code>This is a value from 0-50000 representing 0-50% of the sale price. See [Transfer Fee](nftoken.html#transferfee).

You can mint NFTs in logical collections using the `TokenTaxon` field. See [Minting NFTs into Collections](nft-collections.html).

You can mint your own NFTs with content you create yourself, but you can also become an authorized minter to generate NFTs on behalf of another creator. This allows the creator to focus on making new NFTs while you handle production and sales of the NFTs.

Once the authorized minter has finished creating NFTs for you, you can revoke their privileges so that they no longer have any control over your NFTs.

See [Authorized Minter](nftoken-authorized-minting.html).

Minted NFTs are listed on a `NFTokenPage`. There is a reserve requirement of 2 XRP for every `NFTokenPage` on your account. See [NFT Reserve Requirements](nft-reserve-requirements.html).

Each `NFTokenPage` holds 16-32 NFTs. Minting a large number of NFTs can tie up a great deal of your XRP. You can keep your XRP liquid by minting on demand (or _lazy minting_). See [Lazy minting](nftoken-batch-minting.html#mint-on-demand-lazy-minting) vs [Scripted minting](nftoken-batch-minting.html#scripted-minting).


### Setting up a wallet

Set up a new wallet. See [Xumm](https://xumm.app/).

When you set up your account, keep in mind that there is a base reserve requirement of 10 XRP. See [Reserves](reserves.html#base-reserve-and-owner-reserve).

### Transferring NFTs

You transfer NFTs by creating a sell offer or accepting a buy offer. See [Transfer NFTokens](transfer-nfts-using-javascript.html).

![Transferring NFTs](img/uc-nft-transferring-nfts.png)

You can sell your NFTs in an auction format. See [Running an NFT Auction](nftoken-auctions.html).

You can act as a broker, connecting sellers with bidders, completing the transfer and keeping a percentage of the purchase price. See [Broker a NFToken sale](broker-an-nft-sale-using-javascript.html).

#### Reserve requirements

There are several XRP reserve requirements when you mint NFTs for sale. Each NFToken page requires a reserve of 2 XRP. A NFToken page can store 16-32 NFTs.

Each `NFTokenOffer` object requires a reserve of 2 XRP.

![Reserves](img/uc-nft-reserves.png)

When you post the `NFTokenOffer` or sell the NFT, there are trivial transfer fees (roughly 6000 drops, or .006 XRP). When you are selling at a high volume, the trivial amounts can add up quickly, and need to be considered as part of your cost of doing business.

See:

1. [NFTokenOffer](nft-reserve-requirements.html#nftokenoffer-reserve)
2. NFToken page ([Owner reserve](nft-reserve-requirements.html#owner-reserve))
3. Trivial [transfer fees](transfer-fees.html)

#### Checkout

The most straightforward payment for XRPL NFTs is XRP. For examples of selling and buying NFTs using XRP, see [Transfer NFTokens](transfer-nfts-using-javascript.html).

![Checkout](img/uc-nft-checkout.png)

For trade in other currencies, you can leverage the DEX to accept and convert issued currencies of all kinds. See [Trade in the Decentralized Exchange](trade-in-the-decentralized-exchange.html#trade-in-the-decentralized-exchange).

<!-- 

- Fiat payment ([Cross-currency payments](cross-currency-payments.html))
- On-chain validation of completing transactions [No link- isn’t this just a cross-currency payment?] (Query after the transaction is completed.]
 -->

## Indexing NFTs

When listing NFTs for sale, it can be useful to use object metadata to organize them. 

![Indexing NFTs](img/uc-nft-indexing.png)

You can use queries in the XRPL libraries, the Clio server, and extensions in the XRPL API and Bithomp libraries to sort and filter NFTs by creator, price, collection, rarity, and more.

See:

- [Clio setup](install-clio-on-ubuntu.html) 
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

## NFT Caching
<!-- 

Image optimization for web experience [No link]

 -->
NFTs that are created in the crypto space are expected to store metadata, including media, attributes, and so on. Currently most are stored on IPFS or Arweave to avoid centralization.

<!--  We can't use this example.
See  [HERE](https://xrp.cafe/nft/00081770CCE71D9E7BD07E3A771C7619DA982D62CD37325A99B664A500000209)) -->

Although IPFS / Arweave are great solutions to promote decentralization, fetching the metadata efficiently is a problem. Reaching IPFS / Arweave directly to fetch metadata is not fast enough for modern websites that require immediate responses from users that are scrolling through multiple pages of NFTs with high-quality media. Many NFT marketplaces on XRPL today are storing cached versions of the IPFS originals to have fast and reliable responsive websites, but this process is expensive and inefficient.

Cloudflare, Infura, and many other providers are increasingly focusing on storing these decentralized files and retrieving them fast for users.

See [NFT Caching](nftoken.html#retrieving-nftoken-data-and-metadata).

<!-- 
You can also consider a solution such as Pinata. [https://drive.google.com/file/d/14wuulkvjVjtGlUJj0ppaJ4Sziyp5WFGA/view?usp=sharing](https://drive.google.com/file/d/14wuulkvjVjtGlUJj0ppaJ4Sziyp5WFGA/view?usp=sharing) 

We can derive inspiration for the need of caching and point to some of their docs 
[https://docs.pinata.cloud/gateways](https://docs.pinata.cloud/gateways) 
 -->


