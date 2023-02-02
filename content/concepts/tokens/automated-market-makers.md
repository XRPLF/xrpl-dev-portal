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

Automated Market Makers (AMMs) are smart contracts that provide liquidity in the XRP Ledger's decentralized exchange. Each AMM holds a pool of two assets and enables users to swap between them at an exchange rate set by a formula.

For any given pair of assets, there can be up to one AMM in the ledger. Anyone can create the AMM for an asset pair if it doesn't exist yet, or deposit to an existing AMM. Those who deposit assets into an AMM are called _liquidity providers_ (LPs) and receive "LP Tokens" from the AMM. LP Tokens enable liquidity providers to:

- Redeem their LP Tokens for a share of the assets in the AMM's pool, including fees collected.
- Vote to change the AMM's fee settings. The votes are weighted based on how many LP Tokens the voters hold.
- Bid some of their LP Tokens to receive a temporary discount on the AMM's trading fees.

When the flow of funds between the two assets in a pool is relatively active and balanced, the fees provide a source of passive income for liquidity providers. However, when the relative price between the assets shifts, the liquidity providers can take a loss on the [currency risk](https://www.investopedia.com/terms/c/currencyrisk.asp).

## How the AMM Works

An AMM holds two different assets: at most one of these can be XRP, and one or both of them can be [tokens](tokens.html). Tokens with different issuers are considered different assets for this purpose. This means that there can be an AMM for two tokens with the same currency code but different issuers ("FOO issued by WayGate" is different than "FOO issued by StableFoo"), or the same issuer but different currency codes. The order does not matter; the AMM for FOO.WayGate to XRP is the same as for XRP to FOO.WayGate.

When users want to trade in the decentralized exchange, their [Offers](offers.html) and [Cross-Currency Payments](cross-currency-payments.html) can automatically use AMMs to complete the trade. A single transaction might execute by matching Offers, AMMs, or a mix of both, depending on what's cheaper.

An AMM sets its exchange rate based on the balance of assets in the pool. When you trade against an AMM, the exchange rate adjusts based on how much your trade shifts the balance of assets the AMM holds. As its supply of one asset goes down, the price of that asset goes up; as its supply of an asset goes up, the price of that asset goes down. An AMM gives generally better exchange rates when it has larger overall amounts in its pool. This is because any given trade causes a smaller shift in the balance of the AMM's assets. The more a trade unbalances the AMM's supply of the two assets, the more extreme the exchange rate becomes.

The AMM also charges a percentage trading fee on top of the exchange rate.

The XRP Ledger's implements a _geometric mean_ AMM with a weight parameter of 0.5, so it functions like a _constant product_ market maker. For a detailed explanation of the _constant product_ AMM formula and the economics of AMMs in general, see [Kris Machowski's Introduction to Automated Market Makers](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/).


## LP Tokens
<!-- TODO: add diagrams showcasing flow of funds -->
Whoever creates the AMM becomes the first liquidity provider, and receives LP Tokens that represent 100% ownership of assets in the AMM's pool. They can redeem some or all of those LP Tokens to withdraw assets from the AMM in proportion to the amounts currently there. (The proportions shift over time as people trade against the AMM.) The AMM does not charge a fee when withdrawing both assets.

For example, if you created an AMM with 5 ETH and 5 USD, and then someone exchanged 1.26 USD for 1 ETH, the pool now has 4 ETH and 6.26 USD in it. You can spend half your LP Tokens to withdraw 2 ETH and 3.13 USD.

Anyone can deposit assets to an existing AMM. When they do, they receive new LP Tokens based on how much they deposited. The amount that a liquidity provider can withdraw from an AMM is based on the proportion of the AMM's LP Tokens they hold compared to the total number of LP Tokens outstanding.

LP Tokens are like other tokens in the XRP Ledger, so you can use them in many [types of payments](payment-types.html), trade them in the decentralized exchange, or even deposit them as assets for new AMMs. (To receive LP Tokens as payment, you must set up a [trust line](trust-lines-and-issuing.html) with a nonzero limit with the AMM Account as the issuer.) However, you can _only_ send LP Tokens directly to the AMM (redeeming them) using the `AMMWithdraw` transaction type, not through other types of payments. Similarly, you can only send assets to the AMM's pool through the `AMMDeposit` transaction type.

The AMM is designed so that an AMM's asset pool is empty if and only if the AMM has no outstanding LP Tokens. This situation can only occur as the result of an `AMMWithdraw` transaction; when it does, the AMM is automatically deleted.

### LP Token Currency Codes

LP Tokens use a special type of currency code in the 160-bit hexadecimal ["non-standard" format](currency-formats.html#nonstandard-currency-codes). These codes have the first 8 bits `0x03`. The remainder of the code is a SHA-512 hash, truncated to the first 152 bits, of the two assets' currency codes and their issuers. (The assets are placed in a "canonical order" with the numerically lower currency+issuer pair first.) As a result, the LP Tokens for a given asset pair's AMM have a predictable, consistent currency code.


## Trading Fees

Trading fees are a source of passive income for liquidity providers, and they offset the currency risk of letting others trade against the pool's assets. Trading fees are paid to the AMM, not directly to liquidity providers, but liquidity providers benefit because their LP Tokens can be redeemed for a percentage of the AMM's pool.

Liquidity providers can vote to set the fee from 0% to 1%, in increments of 0.001%. Liquidity providers have an incentive to set trading fees at an appropriate rate: if fees are too high, trades will use order books to get a better rate instead; if fees are too low, liquidity providers don't get any benefit for contributing to the pool. <!-- STYLE_OVERRIDE: will --> Each AMM gives its liquidity providers the power to vote on its fees, in proportion to the amount of LP Tokens those liquidity providers hold.

To vote, a liquidity provider sends an `AMMVote` transaction. Whenever anyone places a new vote, the AMM recalculates its fee to be an average of the latest votes weighted by how many LP Tokens those voters hold. Up to 8 liquidity providers' votes can be counted this way; if more liquidity providers try to vote then only the top 8 votes (by most LP Tokens held) are counted. Even though liquidity providers' share of LP Tokens can shift rapidly for many reasons (such as trading those tokens using [Offers](offers.html)), the trading fees are only recalculated whenever someone places a new vote (even if that vote is not one of the top 8).

### Auction Slot

Unlike any previous Automated Market Makers, the XRP Ledger's AMM design has an _auction slot_ that a liquidity provider can bid on to get a discount on the trading fee for a 24-hour period. The bid must be paid in LP Tokens, which are returned to the AMM. No more than one account can hold the auction slot at a time, but the bidder can name up to 4 more accounts to also receive the discount. There is no minimum bid, but if the slot is currently occupied then you must outbid the current slot holder to displace them. If someone displaces you, you get part of your bid back depending on how much time remains. As long as you hold an active auction slot, you pay a discounted trading fee of 0% when making trades against that AMM.

With any AMM, when the price of its assets shifts significantly in external markets, traders can use arbitrage to profit off the AMM, which results in a loss for liquidity providers. The auction mechanism is intended to return more of that value to liquidity providers and more quickly bring the AMM's prices back into balance with external markets.


## Representation in the Ledger

In the ledger's state data, an AMM consists of multiple [ledger entries](ledger-object-types.html):

- An `AMM` object describing the automated market maker itself.

- A special `AccountRoot` object that issues the AMM's LP Tokens, and holds the AMM's XRP (if it has any).
    
    The address of this AccountRoot is chosen somewhat randomly when the AMM is created, and it is different if the AMM is deleted and re-created. This is to prevent people from funding the AMM account with excess XRP in advance.

- [Trust lines](trust-lines-and-issuing.html) to the special AMM Account for the tokens in the AMM's pool.

These objects are not owned by any account, so the [reserve requirement](reserves.html) does not apply to them. However, to prevent spam, the transaction to create an AMM has a special [transaction cost](transaction-cost.html) that requires the sender to burn a larger than usual amount of XRP.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
