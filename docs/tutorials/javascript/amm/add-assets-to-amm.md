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

1. Deposit `XRP` and issued tokens to an AMM and receive LP tokens.
2. Vote on AMM trading fees.
3. Check the value of your LP tokens.
4. Redeem LP Tokens for assets.

[![Add assets to AMM test harness](/docs/img/quickstart-add-to-amm1.png)](/docs/img/quickstart-add-to-amm1.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/)<!-- {.github-code-download} --> archive to try each of the samples in your own browser.

{% admonition type="note" name="Note" %}
Without the Quickstart Samples, you will not be able to try the examples that follow.
{% /admonition %}


## Usage

### Get Accounts

1. Open `12.add-to-amm.html` in a browser.
2. Select **Testnet** or **Devnet**
3. Get test accounts.
   - If you have existing account seeds:
     1. Paste account seeds in the **Seeds** field.
     2. Click **Get Accounts from Seeds**.
   - If you don't have account seeds:
     1. Click **Get New Standby Account**.
     2. Click **Get New Operational Account**.

[![Get account results](/docs/img/quickstart-add-to-amm2.png)](/docs/img/quickstart-add-to-amm2.png)


### Add Assets to an Existing AMM

Choose the amount of assets to add to the AMM. You can deposit either one or both assets, but deposting only one asset reduces the amount of LP tokens you receive. In the standby account fields:

1. Enter how much XRP to add in the **XRP Balance** field.
2. Enter how many issued tokens to add in the **Amount** field.
3. Enter the token issuer address in the **Destination** field.
4. Click **Add to AMM**.

[![Add assets to AMM results](/docs/img/quickstart-add-to-amm3.png)](/docs/img/quickstart-add-to-amm3.png)


### Vote on trading fees

1. Enter a value in the **Trading Fee** field. The proposed fee is in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee.
2. Click **Vote on Fee**.

[![Vote on trading fees results](/docs/img/quickstart-add-to-amm4.png)](/docs/img/quickstart-add-to-amm4.png)


### Check LP Token Value

1. Enter a value in the **LP Tokens** field.
2. Click **Get LP Value**.

[![Get LP token value results](/docs/img/quickstart-add-to-amm5.png)](/docs/img/quickstart-add-to-amm5.png)


### Redeem Your LP Tokens

1. Enter a value in the **LP Tokens** field.
2. Click **Redeem LP**.

[![Get LP token value results](/docs/img/quickstart-add-to-amm6.png)](/docs/img/quickstart-add-to-amm6.png)


## Code Walkthrough

You can open `ripplex12-add-to-amm.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code.


### Add Assets to an Existing AMM

This code checks if you're trying to add one or both assets, and then modifies the `AMMDeposit` transaction to be either a single or double-asset deposit.

The function to update LP balance checks the AMM to get the unique AMM account, which acts as its own issuer of LP tokens. It then checks your wallet balance and gets the LP token value by matching it with the AMM issuer.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Deposit assets to existing AMM." before="// Vote on AMM trading fees" language="js" /%}


### Vote on Trading Fees

Trading fees are applied to any transaction that interacts with the AMM. The act of voting is straightforward and only requires you to hold the AMM LP tokens before submitting a vote.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Vote on AMM trading fees" before="// Calculate the value of your LP tokens." language="js" /%}


### Calculate Value of LP Tokens

There isn't a dedicated method to calculate how much you can redeem your LP tokens for, but the math isn't too complicated. The percentage of the total LP tokens in circulation that you own qualifies you for the same percentage of the total assets in the AMM.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Calculate the value of your LP tokens." before="// Withdraw by redeeming LP tokens." language="js" /%}


### Redeem Your LP Tokens

Redeeming your LP tokens requires you to get the LP token issuer and currency code, both of which you can check using the `amm_info` method.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Withdraw by redeeming LP tokens." language="js" /%}
