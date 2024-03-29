---
date: 2017-02-10
category: 2017
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# TickSize Amendment Open for Voting

Previously [introduced](https://developers.ripple.com/blog/2017/rippled-0.50.0.html) in `rippled` version 0.50.0, the [TickSize amendment](https://ripple.com/build/amendments/#ticksize) to the Ripple Consensus Ledger is now open for voting. The amendment changes the way offers are ranked in the RCL's order books, so that currency issuers can configure how many significant digits are taken into account when ranking offers by exchange rate.

Ripple expects several benefits to result from adoption of the TickSize amendment, including faster price discovery and deeper liquidity, as well as a reduction in transaction spam and ledger churn on the RCL.

The introduction of TickSize demonstrates Ripple’s continued commitment to supporting the RCL as a unique distributed ledger technology for settlement of global payments.

## Action Required

1. **If you operate a `rippled` server and accept secure client connections**, then you should upgrade to 0.50.2 immediately. If you operate a rippled server, but do not accept secure client connections then you should upgrade to version 0.50.0 by Tuesday, 2017-02-21, for service continuity.

2. **If you run a gateway that issues currency on the RCL**, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to determine what tick size is appropriate for your issuing asset.

3. **If you trade on the RCL** and have algorithmic trading bots, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to update your trading system to check the tick size for a given issuer.

4. **If you have backend software**, which constructs and submits transactions related to the issuing of assets on the Ripple network, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to adapt it for correct usage.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.50.0 (or higher) by Tuesday, 2017-02-21, when **TickSize** is expected to be activated via Amendment, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **TickSize** amendment is vetoed or does not pass, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)


## TickSize Amendment Overview

Ripple has added a new feature (called “TickSize”) to the Ripple Consensus Ledger (RCL). This feature is expected to significantly improve the performance of currency markets on RCL. Gateways (those who issue assets on the RCL) and currency traders will need to be aware of these changes as they may affect their operations.

Currently, the RCL tracks offers to trade one currency for another with fifteen digits of price precision. This high precision has been shown to cause some poor behavior in these currency markets resulting in transaction congestion and poor liquidity.

The tick size change permits the price granularity to be selectively reduced. Gateways must to enable this feature for their assets. Those who trade on RCL’s internal markets must be aware of the change in behavior.

### The problem TickSize addresses

The Ripple Consensus Ledger maintains internal order books between pairs of assets. These internal order books are used to permit cross-currency payments and to settle offers to trade assets against each other. Internally, the RCL tracks an offer’s price (that is, the rate at which the exchange takes place) with 15 digits of precision. Offers with a better price are consumed first, and offers at the same price are consumed in the order in which they were placed.

Because the precision is so high, an offer can be placed at a microscopically better price and that offer will get priority over all existing offers at a lower price. This means that there is effectively no seniority advantage to leaving an offer on the books or stacking offers near the current exchange rate.

A significant fraction of the RCL’s transactions are rapid sequences of the creation and deletion of offers. When a trader operating through a programmatic trading platform believes an existing price is too low, the trader places an offer at a higher price. But they will not make the price too high because that reduces their margin. Other traders react by topping their offer. This acts like an auction.

With RCL’s microscopic tick sizes, this acts like an auction in which you can top the existing bid by a microscopic amount. As you might expect, this results in a lot of bids. Worse, it also results in slow price discovery: while these trading bots are each topping the other by a microscopic amount, the order book price remains below the true price until the order placement stabilizes. In practice, order placement never stabilizes and the flux is constant.

### The TickSize solution

The TickSize feature permits assets issued on the RCL to configure their tick sizes. With a tick size of three, offer prices are tracked with three digits of precision. That would mean that a trader who wanted priority over an offer to charge 1.07 dollars per Euro would have to charge no more than 1.06 dollars per Euro or a trader who wanted priority over an offer to sell bitcoins at $915 each would have to charge $914 each or less.

This immediately makes price discovery much faster. Without the tick size, you might see a long string of offers with prices gradually going down from 1.08 to 1.07. And a payment processed at that time would get a rate worse than the fair rate.

The TickSize feature also protects the time priority of larger orders by securing their position at the front of what may become a large queue at a specific price point;  this effectively prevents front running by microscopically better price improvements.  When volatility of a market becomes low versus the tick size, the economic impact of this can be significant.  To the same effect, enforcing a TickSize also gives traders a larger theoretical edge versus fair value of the same asset trading on other exchanges.  

The most important long run impact of a fixed TickSize is to encourage traders to stack orders at several depths in the market in advance, with the hope of being filled when the market moves; this incentivizes traders to take inventory risk and therefore increases displayed liquidity in order books.

In addition, if there are very small changes in the fair exchange rate, as there always are, these won’t require restructuring of the order book. Until the price variance exceeds the price increment, there is no reason for an offer to change its price and removing an existing offer would mean losing its seniority, giving priority to others who placed their offers first.

### The mechanics of TickSize

The TickSize amendment adds an account property also called “TickSize”. An account can set its tick size by sending an “AccountSet” transaction with a “TickSize” property. The value of the “TickSize” property should be a decimal value between 3 and 10. To clear the tick size, set the “TickSize” to zero. The configured size applies to all assets issued by the account.

To determine an account’s configured tick size, you can use any method to get the account root (such as “account_info”). If the account has a configured tick size, there will be a “TickSize” attribute in the response.

XRP does not have a tick size. Until configured by their issuers, issued assets use the default effective tick size of 15. If an offer is placed between two assets that do not have a tick size, no tick size is enforced. If an offer is placed between two assets that have a tick size, the smaller tick size (fewer digits of precision) controls.

When an attempt to create an offer is made and there is a tick size, the tick size is enforced when the offer is placed into the order book. If the offer is a buy, the amount to buy is unchanged. If the offer is a sell, the amount to sell is unchanged. The tick size is enforced by adjusting the unlocked size of the offer in the offer placer’s favor towards the nearest tick size in the offer price.

RCL internally tracks an offer’s price as the ratio of the input currency amount to the output currency amount. The price is the ratio of the input to the output or how much currency must be paid to get one unit of currency out. Offers with lower prices from the point of view of the taker are consumed first. The rounding is performed on this price.

So, for example, if the offer at the tip of an order book were one to give 100 USD for 20 CNY, that would be internally tracked as having a price of 0.2 -- the 20 in divided by the 100 out. If the effective tick size for this order book was 4, this offer could be topped by an offer with a price of 0.1999 or less (the largest number less than 0.2 using four significant digits). So an offer to give 100.05 USD for 20 Yuan (or one to give 100 USD for 19.99 Yuan) would be needed to take the tip of the order book from the existing offer.

The tick size is expressed as the number of digits of precision kept in the price on the books. For example, if the tick size is four, the next tick after 102.3 is 102.4, the next tick after 1.023 is 1.024, and the next tick size after 10,230 is 10,240.

It is important to remember that it is the price (the ratio of input to output) that is rounded. Offers can still be placed for arbitrarily large or small amounts of currency and payments can still consume arbitrarily small pieces out of offers.

### TickSize for traders

Traders, particularly algorithmic traders, will need to be aware of how the tick size feature affects the behavior of currency markets on the RCL. We expect that gateways that opt to enable tick sizes on their assets will provide traders with reasonable notice, but traders will need to be on the lookout for those notices until the issuer of every asset they care about has published their intended policy.

Traders will want to adjust their strategies to leave their offers on the books if the pricing is off by less than the tick size. They will want to avoid trying to top another offer by less than the tick size as this will not put their order at the tip of the order book.

New strategies involving stacking offers near the current price should be possible. If the price moves in that direction, these offers will have a seniority advantage over newly-placed offers.

### TickSize for gateways

Gateways, those who issue assets on the RCL, will need to draft and publish a tick size policy. Even if a gateway opts not to set a tick size, they should still announce this intention and the amount of notice they plan to give should they ever decide to set a tick size. This will help eliminate uncertainty.

Ripple recommends that gateways set reasonable tick sizes in pretty much all cases. This will provide better price discovery for their assets as well as improving the RCL's performance for everyone by reducing transaction spam.

Tick sizes of between four and eight digits are reasonable. Four digits will provide rapid price discovery, but poor granularity. Seven digits will provide reasonable price discovery while preserving high granularity. If you do not select a tick size, you effectively have a tick size of 15. In almost all cases, five and six are reasonable, safe choices that should provide a good balance of granularity and rapid price discovery.

## Upcoming Features

The [previously announced](https://developers.ripple.com/blog/2016/rippled-0.40.0.html) Suspended Payments amendment, which introduces new transaction types to the Ripple protocol that will permit users to cryptographically escrow XRP on the RCL, will be re-introduced as an amendment simply called *Escrow*, in the next release scheduled for March.

Also, we expect additional support for [crypto-conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02), which are signature-like structures that can be used with suspended payments to support ILP integration, to be included in the next rippled release scheduled for March.

Lastly, we do not have an update on the [previously announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) changes to the hash tree structure that `rippled` uses to represent a ledger, called [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). At the time of activation, this amendment will require brief scheduled allowable unavailability while the changes to the hash tree structure are computed by the network. We will keep the community updated as we progress towards this date (TBA).
