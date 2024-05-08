# Use the AMM Auction Slot for Lower Fees

When trading on the XRP Ledger's decentralized exchange (DEX), you can sometimes save on trading fees by buying the auction slot built into an [Automated Market Maker (AMM)](../../../concepts/tokens/decentralized-exchange/automated-market-makers.md). This tutorial shows how to identify when the auction slot can save you money and what transactions to send to use it, with example code in JavaScript.

For a simpler example of trading currencies in the XRP Ledger's DEX, see [Trade in the Decentralized Exchange](../../how-tos/use-tokens/trade-in-the-decentralized-exchange.md).

This tutorial does not exhaustively cover all possible market conditions and circumstances. Always exercise caution and trade at your own risk.

## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with basic usage of the [xrpl.js client library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../build-apps/get-started.md) for setup steps.
- The AMM for the asset pair you want to trade must already exist in the ledger. This tutorial uses an AMM on Testnet which has been set up in advance. For instructions on creating an AMM for a different currency pair, see [Create an Automated Market Maker](../../how-tos/use-tokens/create-an-automated-market-maker.md).


## Background

This tutorial uses an AMM instance that has been set up on the XRP Ledger Testnet in advance, connecting the following assets:

| Currency Code | Issuer | Notes |
|---|---|---|
| XRP | N/A | Testnet XRP is functionally similar to XRP, but holds no real-world value. You can get it for free from a [faucet](/resources/dev-tools/xrp-faucets).
| TST | `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd` | A test token pegged to XRP at a rate of approximately 10 XRP per 1 TST. The issuer has existing Offers on the XRP Ledger Testnet to buy and sell these tokens. This token has no [transfer fee](../../../concepts/tokens/transfer-fees.md) or [Tick Size](../../../concepts/tokens/decentralized-exchange/ticksize.md) set. |


## Steps

At a high level, the steps involved in using an AMM auction slot to save money on trading are as follows:

1. Check the current XRP Ledger state to estimate how much your desired trade would cost in AMM trading fees.
2. Compare against the cost to win the current auction slot.
3. If winning the auction slot is cheaper, use AMMDeposit to acquire some LPTokens and then use AMMBid to spend those tokens on winning the auction slot.
4. Make the intended trade using an OfferCreate transaction. (You could also use a cross-currency Payment transaction, but this tutorial uses OfferCreate.)

For simplicity, this tutorial assumes that you have XRP, you want to acquire a fixed amount of TST in a single trade, and that the entire trade will execute using the AMM. Real-life situations are more complicated. For example, part of your trade may execute by consuming Offers rather than using the AMM, or you may want to do a series of trades over a period of time. If one or both of the assets you are trading has a transfer fee or tick size set, those details can also affect the calculations.


### 1. Setup

For this use case, you need a high-precision number library such as Bignumber.js for correctly performing calculations on currency amounts you may find in the ledger.

The following `package.json` file lists the necessary dependencies:

{% code-snippet file="/_code-samples/auction-slot/js/package.json" language="json" /%}

After copying this file, run `npm install` from the same folder to download the appropriate dependencies.

Start your JavaScript file with the following code to import dependencies:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" before="/* Convert" /%}

After that, you should connect to the network and set up a `Wallet` instance in the usual way. For example:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="async function main()" before="// Look up AMM status" /%}


### 2. Look Up AMM Status

To determine if your trade could benefit from the reduced fees of the AMM auction slot, you must first look up the current state of the AMM. To get the latest information, use the `amm_info` method and query the `current` (pending) ledger version.

**Caution:** The `current` ledger incorporates recently-sent transactions that are likely to be confirmed; it is the most up-to-date picture of the ledger state, but the details may change when the ledger is validated. You can also use the `validated` ledger, which returns only the latest confirmed data.

The following code snippet reads the `amm_info` result and saves some of the details for later use:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Look up AMM status" before="// Calculate price in XRP" /%}

### 3. Estimate the cost of AMM trading fees

Estimating the cost of AMM trading fees can be tricky and the details vary depending on the type of trade you are performing. For example, a "buy" trade that stops after receiving a target amount of an asset should be calculated differently than a "sell" trade, which continues until a target amount of an asset has been spent.

This tutorial shows how to estimate the cost, in XRP, to buy TST using the AMM. First, define the target amount and check that the AMM can even fulfill the trade:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Calculate price in XRP" before="// Use AMM's SwapOut formula" /%}

Then, you use the _Swap Out_ formula, defined in the XRPL-0030 specification as formula 10, to estimate how much of one asset you have to swap in to the AMM to receive a target amount out of the other asset. The following function implements the formula:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="/* Implement the AMM SwapOut formula" before="/* Compute the quadratic formula" /%}

The following helper functions are also needed for Swap Out and other formulas later in the tutorial:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="/* Convert a trading fee to a value that" before="/* Implement the AMM SwapOut formula" /%}

Then, to estimate the cost of trading fees, calculate the Swap Out value twice: once with the full fee, and once with the discounted fee of the auction slot. The difference between the two results represents the maximum possible savings from the auction slot for this trade, not including the costs of winning the auction slot.

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Use AMM's SwapOut formula" before="// Calculate the cost of winning" /%}

**Note:** For illustrative purposes, this code assumes that the entire trade will execute using the AMM and not by consuming Offers. In reality, a trade can use both in combination to achieve a better rate.


### 4. Calculate the cost of winning the auction slot

The cost to win the auction slot depends on how long the current holder has held it and how much they paid, but it's always denominated in LP tokens. If you currently only have XRP and you want to win the auction slot, you must first deposit some of your XRP to get LP Tokens.

The price of winning the auction slot is defined in XLS-0030 section 4.1.1. However, the minimum bid scales with the number of LP Tokens issued. If you calculate the auction price and _then_ deposit exactly enough to pay for it, the auction price increases proportionally to the new LP Tokens you gained, so you need to invert the formula.

This is similar to cases where you want to deliver exactly $100 after subtracting a 3% fee. If you calculate $100 + (0.03 * $100) = $103, only $99.91 will arrive because the extra $3 is also subject to the fee. Instead, you divide 100 ÷ 0.97 ≈ $103.10 (rounding up to make sure).

The following function represents the inverted formula, which calculates the total amount of LP Tokens you need to receive to match the auction price:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="/* Calculate how much to deposit" before="async function main()" /%}

Then, you call the function like this:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Calculate the cost of winning the auction slot" before="// Calculate how much XRP to deposit" /%}

### 5. Compare the costs and savings

The previous step gives a cost for the auction slot in the form of LP Tokens. To compare against your potential savings, you need to convert this to the XRP cost of the deposit. If the XRP cost of making the deposit and winning the auction slot is greater than your savings, then you should not go through with it.

To do the conversion, you use the AMM _Asset In_ formula, which is implemented as follows:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="/* Implement the AMM single-asset deposit" before="/* Calculate the necessary bid" /%}

In addition to the `feeMult(t)` and `feeMultHalf(t)` helper functions defined earlier, this formula needs to solve the quadratic equation. (You may remember the quadratic formula from high-school mathematics.) The following code implements a helper function for this:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="/* Compute the quadratic formula." before="/* Implement the AMM single-asset deposit" /%}

The following code uses the Asset In formula to estimate the cost of the deposit:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Calculate how much XRP to deposit" before="// Optional. Allow for costs" /%}

Since the XRP Ledger's decentralized exchange is always open to other traders using it too, new transactions can change the current state at the same time that you are doing these calculations and sending your own transactions. You should allow for some amount of _slippage_, the change in rates between when you checked them and when your transaction executes. The following example allows up to 1% slippage:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Optional. Allow for costs" before="// Compare price of deposit+bid" /%}

Finally, you take the slippage-adjusted cost in XRP, add the transaction costs in XRP burned for sending two transactions, and compare that total to the potential savings calculated back in step 3. If the total cost is higher than the savings, you won't save money using the auction slot, so you stop here.

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Compare price of deposit+bid" before="// Do a single-asset deposit" /%}

**Tip:** You may still be able to save money if you plan to do additional trades for a larger total amount. Also, if the auction slot is currently occupied, the cost of outbidding the current slot holder decreases over 24 hours, so you can wait and try again later.

### 6. Send an AMMDeposit transaction to get LP Tokens

Assuming you determined that you could make money, it's now time to send actual transactions to the XRP Ledger, starting with an [AMMDeposit transaction][] to get the LP Tokens that you'll bid on the auction slot.

The "One Asset LP Token" deposit type is most convenient here since you can specify exactly how many LP Tokens you want to receive, and you only need to deposit XRP. The following code creates and sends the transaction:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Do a single-asset deposit" before="// Actually bid" /%}

After the transaction is (or isn't) confirmed by the consensus process, the code displays the results to the console.

### 7. Send an AMMBid transaction to win the auction slot

Assuming the previous transaction was successful, the next step is to use the LP Tokens to bid on the auction slot. To do this, you send an [AMMBid transaction][] with the slippage-adjusted bid amount you calculated earlier in the `BidMax` field, as in the following code:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Actually bid" before="// Trade using the discount" /%}

**Tip:** The amounts that LP Tokens get rounded can be surprising. If you don't plan on holding LP Tokens after bidding, you should set `BidMin` to the same as `BidMax` so that you aren't left with a trust line that contains a very tiny amount of LP Tokens that weren't spent on the auction price, and you don't have to meet the XRP reserve for that trust line.

### 8. Trade using the discount

If your previous transaction was successful, you should now be the auction slot holder until you are outbid or 24 hours have passed, whichever comes first. You can immediately use this opportunity to make the XRP for TST trade that you wanted to make in the first place. There are several ways to make trades in the XRP Ledger, but sending an OfferCreate transaction is the most conventional, as in the following code:

{% code-snippet file="/_code-samples/auction-slot/js/auction-slot.js" language="js" from="// Trade using the discount" before="// Done" /%}

**Tip:** If you are outbid before the auction slot expires, you'll get some of your LP Tokens refunded based on how much time you had left. You can use an [AMMWithdraw transaction][] to convert those to additional XRP, TST, or both as desired.

## Conclusion

Trading assets is never risk-free, and Automated Market Makers are no exception. However, the XRP Ledger's fast, low-cost transactions can be helpful in reducing the costs and fees associated with currency exchange. This tutorial demonstrates a minimal approach to using the auction slot to save money, but of course more creative uses are possible.

The details depend on your specific circumstances and the types of trades you are doing, or expect to do in the future, as well as the state of the market, the XRP Ledger network, and the AMM instances in particular. See the [Code Samples](/resources/code-samples) for additional related use cases, and feel free to contribute your own samples as well to show the community what can be done on the XRP Ledger.


{% raw-partial file="/docs/_snippets/common-links.md" /%}
