---
html: decentralized-exchange.html
parent: concepts.html
template: pagetype-category.html.jinja
blurb: The XRP Ledger contains a fully-functional exchange where users can trade tokens for XRP or each other.
targets:
  - en
---
# Decentralized Exchange

The XRP Ledger's has possibly the world's oldest _decentralized exchange_ (sometimes abbreviated "DEX"), operating continuously since the XRP Ledger's launch in 2012. The exchange allows users to buy and sell [tokens](tokens.html) for XRP or other tokens, with minimal [fees](fees.html) charged to the network itself (not paid out to any party).

**Caution:** Any can [issue a token](issue-a-fungible-token.html) with any currency code or ticker symbol they want and sell it in the decentralized exchange. Always pay attention to the issuer of any token you buy tokens; otherwise, you might give up something of value and receive worthless tokens in exchange.

## Structure

The XRP Ledger's decentralized exchange consists of an unlimited number of currency pairs, tracked on-demand when users make trade offers. A currency pair can consist of XRP and a token or two different tokens; tokens are always identified by the combination of an issuer and a currency code. Therefore, it is possible to trade between two tokens with the same currency code and different issuers, or the same issuer and different currency codes.

Trades are executed each time a new ledger block closes, approximately every 3-5 seconds. A trade instruction in the XRP Ledger is called an [Offer](offers.html); an Offer is effectively a _limit order_ to buy or sell a specific amount of one currency (XRP or a token) for a specific amount of another. When the network executes an Offer, if there are any matching Offers for the same currency pair, they are consumed starting with the best exchange rate first. When trading two tokens, [auto-bridging](autobridging.html) automatically uses XRP to provide better exchange rates and liquidity where helpful.

An Offer can be fully or partially filled; if it's not fully filled right away, it becomes a passive Offer object in the ledger for the remaining amount. Later on, other Offers or [Cross-currency payments](cross-currency-payments.html) can match and consume the Offer. Because of this, Offers can execute at better than their requested exchange rate when initially placed, or at exactly their stated exchange rate later on (aside from minor differences to account for rounding).

Offers can be manually or automatically canceled after being placed. For details, see [Offers](offers.html).

## Limitations

The decentralized exchange is designed with the following limitations:

Because trades are only executed each time a new ledger closes (approximately every 3-5 seconds), the XRP Ledger is not suitable for [high-frequency trading](https://en.wikipedia.org/wiki/High-frequency_trading). The order transactions execute within a ledger is designed to be unpredictable, to discourage [front-running](https://en.wikipedia.org/wiki/Front_running).

The XRP Ledger does not natively represent concepts such as market orders, stop orders, or trading on leverage. Some of these may be possible with creative use of custom tokens and Offer properties.

As a decentralized system, the XRP Ledger does not have any information on the actual people and organizations behind the [accounts](accounts.html) involved in trading. Therefore, the ledger itself cannot implement restrictions around who can or cannot participate in trading, and users and issuers must take care to follow any relevant laws to regulate trading tokens that represent various types of underlying assets. Features such as [freezes](freezes.html) and [authorized trust lines](authorized-trust-lines.html) are intended to help issuers follow these types of rules.

## See Also

- **Concepts:**
    - See [Offers](offers.html) for details on how trades work in the XRP Ledger.
    - See [Tokens](tokens.html) for an overview of how various types of value can be represented in the XRP Ledger.
- **References:**
    - [account_offers method][] to look up Offers placed by an account
    - [book_offers method][] to look up Offers to buy or sell a given currency pair
    - [OfferCreate transaction][] to place a new Offer or replace an existing Offer
    - [OfferCancel transaction][] to cancel an existing Offer
    - [Offer object][] for the data structure of passive Offers in the ledger
    - [DirectoryNode object][] for the data structure that tracks all the Offers for a given currency pair and exchange rate.

<!-- NOTE: There aren't really any tutorials for using the DEX. When there are, add them here. -->
