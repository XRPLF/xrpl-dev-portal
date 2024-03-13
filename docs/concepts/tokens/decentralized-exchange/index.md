---
html: decentralized-exchange.html
parent: tokens.html
metadata:
  indexPage: true
seo:
    description: The XRP Ledger contains a fully functional exchange where users can trade tokens for XRP or each other.
targets:
  - en
---
# Decentralized Exchange

The XRP Ledger has possibly the world's oldest _decentralized exchange_ (sometimes abbreviated "DEX"), operating continuously since the XRP Ledger's launch in 2012. The exchange allows users to buy and sell [tokens](../index.md) for XRP or other tokens, with minimal [fees](../../transactions/fees.md) charged to the network itself (not paid out to any party).

**Caution:** Anyone can [issue a token](../../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md) with any currency code or ticker symbol they want and sell it in the decentralized exchange. Always perform due diligence before buying a token, and pay attention to the issuer. Otherwise, you might give up something of value and receive worthless tokens in exchange.

## Structure

The XRP Ledger's decentralized exchange consists of an unlimited number of currency pairs, tracked on-demand when users make trades. A currency pair can consist of XRP and a token or two different tokens; tokens are always identified by the combination of an issuer and a currency code. It is possible to trade between two tokens with the same currency code and different issuers, or the same issuer and different currency codes. <!-- STYLE_OVERRIDE: limited number -->

As with all changes to the XRP Ledger, you need to send a [transaction](../../transactions/index.md) to make a trade. A trade in the XRP Ledger is called an [Offer](offers.md). An Offer is effectively a [_limit order_](https://en.wikipedia.org/wiki/Order_(exchange)#Limit_order) to buy or sell a specific amount of one currency (XRP or a token) for a specific amount of another. When the network executes an Offer, if there are any matching Offers for the same currency pair, they are consumed starting with the best exchange rate first.

An Offer can be fully or partially filled; if it's not fully filled right away, it becomes a passive Offer object in the ledger for the remaining amount. Later on, other Offers or [Cross-currency payments](../../payment-types/cross-currency-payments.md) can match and consume the Offer. Because of this, Offers can execute at better than their requested exchange rate when initially placed, or at exactly their stated exchange rate later on (aside from minor differences to account for rounding).

Offers can be manually or automatically canceled after being placed. For details on this and other properties of Offers, see [Offers](offers.md).

When trading two tokens, [auto-bridging](autobridging.md) improves exchange rates and liquidity by automatically trading token-to-XRP and XRP-to-token when doing so is cheaper than trading directly token-to-token.

### Example Trade

[{% inline-svg file="/docs/img/decentralized-exchange-example-trade.svg" /%}](/docs/img/decentralized-exchange-example-trade.svg "Diagram: Partially filled offer to buy a token for XRP.")

The above diagram shows an example trade in the decentralized exchange. In this example, a trader named Tran places an Offer to buy 100 tokens with the currency code FOO issued by a fictional business called WayGate. (For brevity, "FOO.WayGate" refers to these tokens.) Tran specifies that he is willing to spend up to 1000 XRP for the full total. When Tran's transaction is processed, the following things happen:

1. The network calculates the exchange rate of Tran's Offer, by dividing the amount to buy by the amount to pay.
0. The network finds the order book for the reverse of Tran's Offer: in this case, that means the order book for selling FOO.WayGate and buying XRP. This order book already has several existing Offers from other traders for varying amounts and exchange rates.
0. Tran's Offer "consumes" matching Offers, starting with the best exchange rate and working its way down, until either Tran's Offer has been fully filled, or there are no more Offers whose exchange rate is equal or better than the rate specified in Tran's Offer. In this example, only 22 FOO.WayGate are available at the requested rate or better. The consumed Offers are removed from the order book.
0. Tran receives the amount of FOO.WayGate that the trade was able to acquire, from the various traders who had previous placed orders to sell it. These tokens go to Tran's [trust line](../fungible-tokens/index.md) to WayGate for FOO. (If Tran did not already have that trust line, one is automatically created.)
0. In return, those traders receive XRP from Tran according to their stated exchange rates.
0. The network calculates the remainder of Tran's Offer: since the original Offer was to buy 100 FOO.WayGate and so far Tran has received 22, the remainder is 78 FOO.WayGate. Using the original exchange rate, that means that the rest of Tran's Offer is now to buy 78 FOO.WayGate for 780 XRP.
0. The resulting "remainder" gets placed onto the order book for trades going the same direction as Tran's: selling XRP and buying FOO.WayGate.

Later transactions, including ones executed immediately after Tran's in the _same_ ledger, use the updated order books for their trades, so they can consume part or all of Tran's Offer until it's fully filled or Tran cancels it.

**Note:** The canonical order transactions execute in when a ledger is closed and validated is not the same as the order those transactions were sent. When multiple transactions affect the same order book in the same ledger, the final results of those transactions may be very different than the tentative results calculated at the time of transaction submission. For more details on when transactions' results are or are not final, see [Finality of Results](../../transactions/finality-of-results/index.md).


## Limitations

The decentralized exchange is designed with the following limitations:

Because trades are only executed each time a new ledger closes (approximately every 3-5 seconds), the XRP Ledger is not suitable for [high-frequency trading](https://en.wikipedia.org/wiki/High-frequency_trading). The order transactions execute within a ledger is designed to be unpredictable, to discourage [front-running](https://en.wikipedia.org/wiki/Front_running).

The XRP Ledger does not natively represent concepts such as market orders, stop orders, or trading on leverage. Some of these may be possible with creative use of custom tokens and Offer properties.

As a decentralized system, the XRP Ledger does not have any information on the actual people and organizations behind the [accounts](../../accounts/index.md) involved in trading. The ledger itself cannot implement restrictions around who can or cannot participate in trading, and users and issuers must take care to follow any relevant laws to regulate trading tokens that represent various types of underlying assets. Features such as [freezes](../fungible-tokens/freezes.md) and [authorized trust lines](../fungible-tokens/authorized-trust-lines.md) are intended to help issuers comply with relevant laws and regulations.

## See Also

- **Concepts:**
    - See [Offers](offers.md) for details on how trades work in the XRP Ledger.
    - See [Tokens](../index.md) for an overview of how various types of value can be represented in the XRP Ledger.
- **References:**
    - [account_offers method][] to look up Offers placed by an account
    - [book_offers method][] to look up Offers to buy or sell a given currency pair
    - [OfferCreate transaction][] to place a new Offer or replace an existing Offer
    - [OfferCancel transaction][] to cancel an existing Offer
    - [Offer object][] for the data structure of passive Offers in the ledger
    - [DirectoryNode object][] for the data structure that tracks all the Offers for a given currency pair and exchange rate.

{% raw-partial file="/docs/_snippets/common-links.md" /%}


{% child-pages /%}
