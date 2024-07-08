---
seo:
    description: Provide liquidity for an Automated Market Maker (AMM) and earn income from trading fees.
labels:
  - Decentralized Exchange
  - Tokens
  - AMM
---
# Earn Passive Income as a Liquidity Provider

Providing liquidity for an [Automated Market Maker (AMM)](../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) can be a great way to earn passive income. By depositing assets into an AMM pool, you'll earn a percentage of the trading fees generated. This tutorial shows how to deposit assets, vote on fees, and withdraw assets.


## Prerequisites

- You should be familiar with basic usage of the [xrpl.js client library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../build-apps/get-started.md) for setup steps.
- The AMM for the asset pair you want to trade must already exist in the ledger. This tutorial uses an AMM on Testnet which has been set up in advance, connecting the following assets:

| Currency Code | Issuer | Notes |
|---|---|---|
| XRP | N/A | Testnet XRP is functionally similar to XRP, but holds no real-world value. You can get it for free from a [faucet](/resources/dev-tools/xrp-faucets).
| TST | `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd` | A test token pegged to XRP at a rate of approximately 10 XRP per 1 TST. The issuer has existing Offers on the XRP Ledger Testnet to buy and sell these tokens. This token has no [transfer fee](../../../concepts/tokens/transfer-fees.md) or [Tick Size](../../../concepts/tokens/decentralized-exchange/ticksize.md) set. |

For instructions on creating an AMM for a different currency pair, see [Create an Automated Market Maker](../../how-tos/use-tokens/create-an-automated-market-maker.md).


## Source Code

See {% repo-link path="_code-samples/add-amm-lp/js/" %}Code Samples: Add AMM LP{% /repo-link %} for the full source code for this tutorial.


## Steps

### 1. Connect to the network and generate credentials

{% code-snippet file="/_code-samples/add-amm-lp/js/add-amm-lp.js" language="js" from="// Define the network client" before="// Acquire TST tokens" /%}


### 2. Acquire TST tokens

{% code-snippet file="/_code-samples/add-amm-lp/js/add-amm-lp.js" language="js" from="// Acquire TST tokens" before="// Deposit assets into AMM" /%}


### 3. Deposit assets to the AMM

You can contribute either one or both assets to an AMM pool. Contributing just one asset can be easier, but incurs a fee that is debited from the LP Tokens paid out. If you contribute both assets in the pool, you aren't charged a fee.

{% code-snippet file="/_code-samples/add-amm-lp/js/add-amm-lp.js" language="js" from="// Deposit assets into AMM" before="// Vote on fees" /%}


### 4. Vote on trading fees

This step is optional, but you're encouraged to submit a vote for a fee structure you believe makes sense.

{% code-snippet file="/_code-samples/add-amm-lp/js/add-amm-lp.js" language="js" from="// Vote on fees" before="// Get LP tokens value" /%}


### 5. Wait for your LP Tokens to accrue value

This step is optional, but is useful for checking on your LP token values without withdrawing the assets.

{% code-snippet file="/_code-samples/add-amm-lp/js/add-amm-lp.js" language="js" from="// Get LP tokens value" before="// Withdraw by redeeming LP tokens" /%}

### 6. Withdraw assets from the AMM

Similar to depositing assets, you can withdraw either one or both assets from the AMM pool. Withdrawing a single asset incurs a fee, while withdrawing both does not. When you withdraw by redeeming LP Tokens, you are paid out in both assets.

{% code-snippet file="/_code-samples/add-amm-lp/js/add-amm-lp.js" language="js" from="// Withdraw by redeeming LP tokens" before="// Disconnect when done" /%}
