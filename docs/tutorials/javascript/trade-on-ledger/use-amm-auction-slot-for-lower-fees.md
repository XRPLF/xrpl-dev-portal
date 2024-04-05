# Use the AMM Auction Slot for Lower Fees

When trading on the XRP Ledger's decentralized exchange (DEX), you can sometimes save on trading fees by buying the auction slot built into an [Automated Market Maker (AMM)](../../../concepts/tokens/decentralized-exchange/automated-market-makers.md). This tutorial shows how to identify when the auction slot can save you money and what transactions to send to use it, with example code in JavaScript.

For a simpler example of trading currencies in the XRP Ledger's DEX, see [Trade in the Decentralized Exchange](../../how-tos/use-tokens/trade-in-the-decentralized-exchange.md).

This tutorial does not exhaustively cover all possible market conditions and circumstances. Always exercise caution and trade at your own risk.

## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with basic usage of the [xrpl.js client library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../build-apps/get-started.md) for setup steps.
- The AMM for the asset pair you want to trade must already be created. This tutorial uses an AMM on Testnet which has been set up in advance. For instructions on creating an AMM for a different currency pair, see [Create an Automated Market Maker](../../how-tos/use-tokens/create-an-automated-market-maker.md).


## Background

This tutorial uses an AMM instance that has been set up on the XRP Ledger Testnet in advance, connecting the following assets:

| Currency Code | Issuer | Notes |
|---|---|---|
| XRP | N/A | Testnet XRP is functionally similar to XRP, but holds no real-world value. You can get it for free from a [faucet](/resources/dev-tools/xrp-faucets).
| TST | `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd` | A test token pegged to XRP at a rate of approximately 10 XRP per 1 TST. The issuer has existing Offers on the XRP Ledger Testnet to buy and sell these tokens.  |

TST can be issued and redeemed through _backstop_ Offers, managed by its issuer, in the order book part of the DEX. The backstop offers have a spread of ±15%, meaning that it takes 11.5 XRP to buy 1 TST, but it takes 1.15 TST to buy back 10 XRP. The backstop offers have very large quantity, so they are unlikely to be used up, meaning that these represent the worst case scenario exchange rate between these two assets. Also, rP9j... does not have a [Tick Size](../../../concepts/tokens/decentralized-exchange/ticksize.md) set, so exchange rates can use the full 15 digits of precision. If one were set, you would have to do more rounding when calculating what exchange rate you would get.

## Steps

At a high level, the steps involved in using an AMM auction slot to save money on trading are as follows:

1. Check the current XRP Ledger state to estimate how much your desired trade would cost in AMM trading fees.
2. Compare against the cost to win the current auction slot.
3. If winning the auction slot is cheaper, use AMMDeposit to acquire some LPTokens and then use AMMBid to spend those tokens on winning the auction slot.
4. Make the intended trade using an OfferCreate transaction. (You could also use a cross-currency Payment transaction, but this tutorial uses OfferCreate.)

This tutorial assumes that you have XRP and want to acquire a fixed amount of TST. The details of the steps will vary in other scenarios, such as if you want to spend a fixed amount of XRP to acquire as much TST as you can, or if a token you are buying or selling has a [transfer fee](../../../concepts/tokens/transfer-fees.md).

### 1. Setup

The following code imports necessary libraries, connects to the ledger, and instantiates an XRP Ledger wallet. For this use case, you need a high-precision number library such as Bignumber.js for correctly performing calculations on currency amounts you may find in the ledger.

@@TODO

### 2. Estimate the cost of AMM trading fees

Estimating the cost of AMM trading fees can be tricky and the details vary depending on the type of trade you are performing. For example, a "buy" trade that stops after receiving a target amount of an asset should be calculated differently than a "sell" trade, which continues until a target amount of an asset has been spent. Similarly, options such as immediate-or-cancel or limit quality may affect your calculations.

Also, the XRP Ledger's decentralized exchange is always open to other traders using it too, so new transactions can change the current state at the same time that you are doing these calculations and sending your transactions. You must always allow for some amount of _slippage_ (the change in rates between when you checked them and when your transaction executes) as well as the possibility that your transactions may not succeed at all. (For example, someone else might bid a higher amount for the auction slot right as you place your bid.)

The following code estimates the amount that would be paid to an AMM's trading fee for a specific trade (selling XRP, buying TST.rP9j...):

@@TODO:
    1. Calculate how much of the trade will use the AMM (as opposed to CLOB DEX)
    2. Calculate how much will be swapped into the AMM
    3. Calculate the full trading fee for the amount to be swapped in
    4. Calculate the reduced trading fee for the amount to be swapped in if you hold the auction slot
    5. Calculate the difference between the full trading fee and the reduced trading fee, in other words your potential savings

### 3. Compare with the cost of winning the auction slot

The cost to win the auction slot depends on how long the current holder has held it and how much they paid, but it's always denominated in LP tokens. To win the auction slot if you currently only have XRP, you'll have to make a single-asset deposit to get LP Tokens. So, the comparison we want to make here is:

@@TODO
    1. Calculate quantity of LP Tokens needed to win the auction slot
    2. Calculate single-asset amount needed to deposit to receive that many LP Tokens
    3. Compare the cost of winning the auction slot vs potential savings calculated in the previous step
