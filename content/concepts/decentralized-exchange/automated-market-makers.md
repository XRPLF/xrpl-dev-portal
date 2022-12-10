---
html: automated-market-makers.html
parent: decentralized-exchange.html
blurb: Automated Market Makers (AMMs) provide liquidity between asset pairs, complemeting the order books in the decentralized exchange while providing passive income for their liquidity providers.
status: not_enabled
labels:
  - XRP
  - Decentralized Exchange
  - AMM
---
# Automated Market Makers

An Automated Market Maker (AMM) is a type of smart contract, built into the XRP Ledger, that provides liquidity in the decentralized exchange. An AMM holds a pool of two fungible assets, which can be XRP or [tokens](tokens.html), and allows users to swap between them for a fee. [Offers](offers.html) and [Cross-Currency Payments](cross-currency-payments.html) automatically use a combination of Offers and AMMs to achieve cost-effective exchanges between assets.

{% include '_snippets/amm-disclaimer.md' %}

For any given pair of assets, there can be up to one AMM in the ledger. Anyone can create an AMM for an asset pair if it doesn't exist yet, or deposit to an existing AMM's pools. Those who deposit assets into an AMM are called _liquidity providers_ (LPs) and receive "LP Tokens" from the AMM in proportion to the amounts of assets they deposit. LP Tokens are like other fungible tokens in the XRP Ledger, except that they also give special privileges for the AMM that issues them:

- Liquidity providers can redeem their LP Tokens to withdraw a corresponding share of the assets in the AMM's pool, including fees collected.
- Liquidity providers can vote to change the AMM's fee settings. The votes are weighted based on how many LP Tokens the voters hold.
- Liquidity providers can bid some of their LP Tokens to receive a temporary discount on the AMM's trading fees.

When the flow of funds between the two assets in a pool is relatively active and balanced, the fees provide a source of passive income for liquidity providers. However, when the relative price between the assets shifts, the liquidity providers can take a loss on the [currency risk](https://www.investopedia.com/terms/c/currencyrisk.asp).

## How the AMM Works

[Kris Machowski's Introduction to Automated Market Makers](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/) is a good in-depth explanation on the economics and principles of AMMs in general. The XRP Ledger implements a _constant product_ AMM, where the cost of trading between the two assets in its pool scales so that multiplying the amounts of the two pools together always comes out to the same value. For example, if the AMM holds 5 ETH and 5 USD, the "constant product" value is 5×5=25. To buy 1 ETH, you'd have to spend 1.25 USD, because after removing 1 ETH from the pool and adding 1.25 USD, the constant product value is 4×6.25=25. The AMM also charges a configurable trading fee, which can be as low as 0 or as high as 1%, so you would have to pay a little more for that as well.

**Note:** The XRP Ledger's AMM is designed to be extensible so that, with future protocol amendments, it would be possible to create an AMM where the pools are be weighted unevenly, which would make it a more general _geometric mean market maker_. However, the current implementation always uses a weight parameter of 0.5, so it functions like a constant product AMM.

Due to the way the constant product rule works, the bigger a proportion of the AMM's pools a trade involves, the higher the costs. This also means that, the larger the amounts in the AMM's pools, the lower the cost of making a specific trade. For example, trading 5 USD through an AMM that only holds 10 USD is more expensive than trading 5 USD through an AMM that holds 1000 USD. This is separate from the trading fee, which is always strictly a percentage of the amounts involved.

An AMM can hold two assets: at most one of these can be XRP, and one or both of them can be [tokens](tokens.html). Tokens with different issuers are considered different assets for this purpose. This means that there can be an AMM for two tokens with the same currency code but different issuers ("FOO issued by WayGate" is different than "FOO issued by StableFoo"), or the same issuer but different currency codes. The order does not matter; the AMM for FOO.WayGate to XRP is the same as for XRP to FOO.WayGate.


## Flow of Funds

Whoever creates the AMM becomes the first liquidity provider, and receives LP Tokens that represent 100% ownership of assets in the AMM's pool. They can redeem some or all of those LP Tokens to withdraw assets from the AMM in proportion to the amounts currently there. (The proportions shift over time as people trade against the AMM.) The AMM does not charge a fee when withdrawing both assets.

For example, if you created an AMM with 5 ETH and 5 USD, then someone bought 1 ETH by spending 1.25 USD, the pool has 4 ETH and 6.25 USD in it. You can spend half your LP Tokens to withdraw 2 ETH and 3.125 USD.

Anyone can deposit assets to an existing AMM. When they do, they receive new LP Tokens based on how much they deposited. The amount that a liquidity provider can withdraw from an AMM is based on the proportion of the AMM's LP Tokens they hold compared to the total number of LP Tokens outstanding.

LP Tokens are like other tokens in the XRP Ledger, so you can use them in many [types of payments](payment-types.html), trade them in the decentralized exchange, or even deposit them as assets for new AMMs. (To receive LP Tokens as payment, you must set up a trust line with a nonzero limit with the AMM Account as the issuer.) However, you can _only_ send LP Tokens directly to the AMM (redeeming them) using the [AMMWithdraw][] transaction type, not through other types of payments. Similarly, you can only send assets to the AMM's pool through the [AMMDeposit][] transaction type.

The AMM is designed so that an AMM's asset pool is empty if and only if the AMM has no outstanding LP Tokens. This situation can only occur as the result of an [AMMWithdraw][] transaction; when it does, the AMM is automatically deleted.

### LP Token Currency Codes

LP Tokens use a special type of currency code that use the 160-bit hexadecimal ["non-standard" format](currency-formats.html#nonstandard-currency-codes). These codes have the first 8 bits `0x03`. The remainder of the code is a SHA-512 hash, truncated to the first 152 bits, of the two assets' currency codes and their issuers. (The assets are placed in a "canonical order" with the numerically lower currency+issuer pair first.)


## Representation in the Ledger

In the ledger's state data, an AMM consists of two [ledger entries](ledger-object-types.html):

- An [AMM object][] describing the automated market maker itself.
- A special [AccountRoot object][] that holds the AMM's funds and issues LP Tokens.
    
    The address of this AccountRoot is chosen somewhat randomly when the AMM is created, and it is different if the AMM is deleted and re-created. This is to prevent people from funding the AMM account with excess XRP in advance.

There are also [trust lines](trust-lines-and-issuing.html) for the tokens in the AMM's pool as well as the LP Tokens it issues.

These objects are not owned by any account, so the [reserve requirement](reserves.html) does not apply to them. However, to prevent spam, the transaction to create an AMM has a special [transaction cost](transaction-cost.html) that requires the sender to burn a larger than usual amount of XRP.


## Trading Fees

The trading fee is charged on top of the implicit exchange rate between the assets in the AMM's pool. The exchange rate changes dynamically based on the balance of assets in the pool, but the trading fees only change as the result of voting. Trading fees are a source of passive income for liquidity providers, and they offset the currency risk of letting others trade against the pool's assets.

Liquidity providers have an incentive to set to set trading fees at an appropriate rate: if fees are too high, trades will use order books to get a better rate instead; if fees are too low, liquidity providers don't get any benefit for contributing to the pool. <!-- STYLE_OVERRIDE: will --> Each AMM gives its liquidity providers the power to vote on its fees, in proportion to the amount of LP Tokens those liquidity providers hold.

Liquidity providers can vote to set the fee from 0% to 1%, in increments of 0.001%, using the [AMMVote transaction type][]. Whenever anyone places a new vote, the AMM recalculates its fee to be an average of the latest votes weighted by how many LP Tokens those voters hold. Up to 8 liquidity providers' votes can be counted this way; if more liquidity providers try to vote then only the top 8 votes (by most LP Tokens held) are counted. Even though liquidity providers' share of LP Tokens can shift rapidly for many reasons (such as trading those tokens using [Offers](offers.html)), the trading fees are only recalculated whenever someone places a new vote (even if that vote is not one of the top 8).

### Auction Slot

Unlike any previous Automated Market Makers, the XRP Ledger's AMM design has an _auction slot_ that a liquidity provider can bid on to get a discount on the trading fee for a 24-hour period. The bid must be paid in LP Tokens, which are returned to the AMM. No more than one account hold the auction slot at a time, but the bidder can name up to 4 additional accounts to also receive the discount. There is a minimum bid of 0.001% of the AMM's total outstanding LP Tokens, and if the slot is currently occupied then you must bid more to displace the current slot holder. If someone displaces you, you get part of your bid back depending on how much time remains. As long as you hold an active auction slot, you pay a discounted trading fee of 0% when making trades against that AMM.

**Caution:** The minimum bid value is a placeholder and may change before the AMM feature becomes finalized.

With any AMM, when the price of its assets shifts significantly in external markets shifts significantly, traders can use arbitrage to profit off the AMM, which results in a loss for liquidity providers. The auction mechanism is intended to return more of that value to liquidity providers and more quickly bring the AMM's prices back into balance with external markets.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
