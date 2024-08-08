---
seo:
    description: Provide liquidity for an Automated Market Maker (AMM) and earn income from trading fees.
labels:
  - Decentralized Exchange
  - Tokens
  - AMM
---
# Add Assets to an AMM

This example shows how to:

1. Purchase `FOO` tokens from an AMM.
2. Deposit `XRP` and `FOO` to the AMM and receive LP tokens.
3. Vote on AMM trading fees.
4. Redeem LP Tokens for assets.


## Usage

![Test harness to create AMM](/docs/img/add-assets-to-amm.png)

Download the [AMM Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/amm/js/) to use the AMM test harness in your browser and follow along in this tutorial.

### Set up an AMM

1. Click **Get New Devnet Account**.
2. Click **Issue FOO Tokens**.
3. Click **Create AMM**. You can view the AMM pool info in the `AMM Info` box.


### Buy FOO tokens

Buy `FOO` tokens from the established AMM in order to interact with the pool.

1. Click **Get Second Devnet Account**.
2. Click **Buy FOO Tokens**. To simplify this tutorial, this purchases 250 `FOO`. The AMM starts with a ratio of 10:1 `FOO`:`XRP`. This doesn't translate to a direct 25 `XRP` spend, since the AMM will adjust the cost of `FOO` to be more expensive as you buy more from it.


### Add Assets to the AMM

Add a value in the `XRP` and `FOO` fields, then click **Add Assets**. You can deposit either one or both assets, but depositing only one asset will reduce the amount of LP tokens you receive.


### Vote on trading fees

Add a value in the `Fee` field, then click **Add Vote**. You can view the updated AMM info after doing so and see your submission under trading fees.

The proposed fee is in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee.


### Redeem your LP tokens

1. Click **Calculate LP Value**.
2. Click **Withdraw LP**. This tutorial redeems all your LP tokens to withdraw both assets, but AMM withdrawals can be either both or one, depending on the fields specified in the transaction.


## Code Walkthrough


### Buy FOO tokens

Purchases 250 `FOO` tokens by creating an offer on the XRPL DEX. Since the AMM created in the test harness is the only available source of `FOO`, it takes the offer.

{% code-snippet file="/_code-samples/amm/js/2.add-assets-to-amm.js" language="js" from="// Buy FOO tokens from the XRP/FOO AMM." before="// Deposit assets to AMM." /%}


### Deposit assets

This code checks if you're trying to add one or both assets, and then modifies the `AMMDeposit` transaction to be either a single or double-asset deposit.

The function to update LP balance checks the AMM to get the unique AMM account, which acts as its own issuer of LP tokens. It then checks your wallet balance and gets the LP token value by matching it with the AMM issuer.

{% code-snippet file="/_code-samples/amm/js/2.add-assets-to-amm.js" language="js" from="// Deposit assets to AMM." before="// Vote on fees." /%}


### Vote on trading fees

Trading fees are applied to any transaction that interacts with the AMM. The act of voting is straightforward and only requires you to hold the AMM LP tokens before submitting a vote.

{% code-snippet file="/_code-samples/amm/js/2.add-assets-to-amm.js" language="js" from="// Vote on fees." before="// Calculate the value of LP tokens." /%}


### Calculate value of LP tokens

There isn't a dedicated method to calculate how much you can redeem your LP tokens for, but the math isn't too complicated. The percentage of the total LP tokens you own qualifies you for the same percentage of the total assets in the AMM.

{% code-snippet file="/_code-samples/amm/js/2.add-assets-to-amm.js" language="js" from="// Calculate the value of LP tokens." before="// Withdraw by redeeming LP tokens." /%}


### Redeem your LP tokens

Redeeming your LP tokens requires you to get the LP token issuer and currency code, both of which you can check using the `amm_info` method. This code redeems assets using all your LP tokens, but you can also specify withdrawals by the amount of an asset you want to take out.

{% code-snippet file="/_code-samples/amm/js/2.add-assets-to-amm.js" language="js" from="// Withdraw by redeeming LP tokens." /%}
