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

1. Deposit assets to an existing AMM and receive LP tokens.
2. Vote on AMM trading fees.
3. Check the value of your LP tokens.
4. Redeem LP tokens for assets in the AMM pair.

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


### Get the AMM

1. Enter a [currency code](/docs/references/protocol/data-types/currency-formats.md#currency-codes) in the **Asset 1 Currency** field. For example, `TST`.
2. (Optional) If you entered a currency code other than `XRP`, also enter the token issuer in the **Asset 1 Issuer** field.
3. Enter a second currency code in the **Asset 2 Currency** field.
4. (Optional) If you entered a second currency code other than `XRP`, also enter the token issuer in the **Asset 2 Issuer** field.
5. Click **Check AMM**.

[![Add assets to AMM results](/docs/img/quickstart-add-to-amm3.png)](/docs/img/quickstart-add-to-amm3.png)


### (Optional) Acquire More Assets

If you need more assets, you can:

- Fund a new wallet with `XRP` by clicking **Get New Standby Account**.
- Get more tokens from the token issuer in the AMM pair. See: [Create an AMM](/docs/tutorials/javascript/amm/create-an-amm) 

### Add Assets to the AMM

Choose the amount of assets to add to the AMM. You can deposit either one or both assets, but deposting only one reduces the amount of LP tokens you receive.

1. Click **Get Balances** to verify how many tokens you have.
2. Enter a value in the **Asset 1 Amount** field.
3. (Optional) Enter a value in the **Asset 2 Amount** field.
4. Click **Add to AMM**.

[![Add assets to AMM results](/docs/img/quickstart-add-to-amm3.png)](/docs/img/quickstart-add-to-amm3.png)


### Vote on trading fees

1. Enter a value in the **Trading Fee** field. The proposed fee is in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee.
2. Click **Vote on Fee**.

[![Vote on trading fees results](/docs/img/quickstart-add-to-amm4.png)](/docs/img/quickstart-add-to-amm4.png)


### Redeem Your LP Tokens

1. Click **Get LP Value**.
2. Enter a value in the **LP Tokens** field.
3. Click **Redeem LP**.

[![Get LP token value results](/docs/img/quickstart-add-to-amm5.png)](/docs/img/quickstart-add-to-amm5.png)


## Code Walkthrough

You can open `ripplex12-add-to-amm.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code.


### Add Assets to an Existing AMM

This code checks if you're trying to add one or both assets, and then modifies the `AMMDeposit` transaction to be either a single or double-asset deposit.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Deposit assets to existing AMM." before="// Vote on AMM trading fees" language="js" /%}


### Vote on Trading Fees

Trading fees are applied to any transaction that interacts with the AMM. As with the `addAssets()` function, this one checks the combination of assets provided to modifty the `ammVote` transaction.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Vote on AMM trading fees" before="// Calculate the value of your LP tokens." language="js" /%}


### Redeem Your LP Tokens

The `calculateLP()` function gets the AMM account, which acts as its own issuer of LP tokens. It then checks your wallet balance and gets your LP token balance by matching it with the AMM issuer. Although there isn't a dedicated method to calculate what you can redeem your LP tokens for, the math to do so is simple. The function checks the percentage of LP tokens in circulation that you own, and then applies that same percentage to the total assets in the AMM to give you their redemption value.

The code to redeem the LP tokens checks how many tokens you want to redeem, as well as the combination of assets to format `amm_info` and `AMMWithdraw`.

{% code-snippet file="/_code-samples/quickstart/js/ripplex12-add-to-amm.js" from="// Calculate the value of your LP tokens." language="js" /%}
