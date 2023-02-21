---
html: non-fungible-token-transfers.html
parent: non-fungible-tokens.html
blurb: Trading NFTokens in direct or brokered mode.
labels:
 - Non-fungible Tokens, NFTs
---

# Trading NFTokens on the XRP Ledger

You can transfer `NFToken` objects between accounts on the XRP Ledger. You can offer to buy or sell a `NFToken`, or accept offers from other accounts to buy a `NFToken` you own. You can even give away a `NFToken` by offering to sell it at a price of 0.  All offers are created using [NFTokenCreateOffer transaction][].

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Reserve Requirements

Every NFTokenOffer object requires that your account increase its owner reserve, currently 2 XRP per `NFTokenSellOffer` and 2 XRP per `NFTokenBuyOffer`. This is to prevent accounts from spamming the ledger with offers they don't intend to complete.

See [NFT Reserve Requirements](nft-reserve-requirements.html).

## Sell Offers

### Create a Sell Offer

As the owner of a `NFToken` object, you can create a sell offer using a [NFTokenCreateOffer transaction][] with the `tfSellToken` flag. You provide the `NFTokenID` and the `Amount` you are willing to accept in payment. You can optionally specify an `Expiration` date, after which the offer is no longer valid, and a `Destination` account, which is the only account that is allowed to buy the `NFToken`.

### Accept a Sell Offer

To buy a `NFToken` that is offered for sale, you use a `NFTokenAcceptOffer` transaction. You provide the owner account and specify the `NFTokenOfferID` of the `NFTokenOffer` object you choose to accept.

## Buy Offers

### Create a Buy Offer

Any account can offer to buy a `NFToken`. You can create a buy offer using [NFTokenCreateOffer][] _without_ the `tfSellToken` flag. You provide the `Owner` account, `NFTokenID`, and the `Amount` of your offer.

### Accept a Buy Offer

Use the `NFTokenAcceptOffer` transaction to transfer a `NFToken`. Provide the `NFTokenOfferID` and the owner account to complete the transaction.

## Trading Modes

When trading a `NFToken`, you can choose between a _direct_ transaction between a buyer and seller or a _brokered_ transaction, where a third party account matches a sell and buy offer to arrange the trade.

Trading in direct mode gives the seller control over the transfer. The seller can either post a `NFToken` for sale so that anyone can buy it, or sell a `NFToken` to a specific account. The seller receives the entire price for the `NFToken`.

In brokered mode, the seller allows a third party account to broker the sale of the `NFToken`. The broker account collects a broker fee for the transfer at an agreed upon rate. This happens as one transaction, paying the broker and seller from the buyer’s funds without requiring an up front investment by the broker.

### When to Use Brokered Mode

If a `NFToken` creator has the time and patience to seek out the right buyers, the creator keeps all proceeds from the sale. This works fine for a creator who sells few `NFToken` objects at variable prices.

On the other hand, creators might not want to spend their time selling their creations when they could spend the time creating. Instead of handling each individual sale, the sales work can be turned over to a third-party broker account.

Using a broker offers several advantages. For example:

* The broker can act as an agent, working to maximize the selling price of the `NFToken`. If the broker is paid a percentage of the sale price, the higher the price, the more the broker earns.
* The broker can act as a curator, organizing `NFToken` objects based on a niche market, price point, or other criteria. This can attract groups of buyers who might not otherwise discover a creator’s work.
* The broker can act as a marketplace, similar to Opensea.io, to handle the auction process at the application layer.

### Brokered Sale Workflows

In the most straightforward workflow, a creator mints a new `NFToken`. The creator initiates a sell offer, entering the minimum acceptable sale price and setting the broker as the destination. Potential buyers make bids for the `NFToken`, setting the broker as the destination for the bid. The broker selects a winning bid and completes the transaction, taking a broker’s fee. As a best practice, the broker then cancels any remaining buy offers for the `NFToken`.

![Brokered Mode with Reserve](img/nft-brokered-mode-with-reserve.png)

Another potential workflow would give the creator more control over the sale. In this workflow, the creator mints a new `NFToken`. Bidders create their offers, setting the broker as the destination. The broker selects the winning bid, subtracts their broker fee, and uses `NFTokenCreateOffer` to request that the creator sign off on the offer. The creator signs the requested offer, setting the broker as the destination. The broker completes the sale using `NFTokenAcceptOffer`, retaining the broker fee. The broker cancels any remaining bids for the `NFToken` using `NFTokenCancelOffer`.

![Brokered Mode without Reserve](img/nft-brokered-mode-without-reserve.png)

The same workflows can be used when an owner resells a `NFToken` created by another account.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
