# Trade with an AMM Auction Slot

Follow the steps from the [Create an AMM](/docs/tutorials/javascript/amm/create-an-amm/) tutorial before proceeding.

This example shows how to:

1. Calculate the exact cost of swapping one token for another in an [AMM](/docs/concepts/tokens/decentralized-exchange/automated-market-makers) pool.
2. Check the difference in trading fees with and without an auction slot.
3. Bid on an auction slot with LP tokens.
4. Create an offer to swap tokens with the AMM.

[![Trade with Auction Slot Test Harness](/docs/img/quickstart-trade-auction-slot1.png)](/docs/img/quickstart-trade-auction-slot1.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) archive to try each of the samples in your own browser.

{% admonition type="info" name="Note" %}
Without the Quickstart Samples, you will not be able to try the examples that follow.
{% /admonition %}


## Usage

### Get Accounts

1. Open `13.trade-with-auction-slot.html` in a browser.
2. Select **Testnet** or **Devnet**
3. Get test accounts.
   - If you have existing account seeds:
     1. Paste account seeds in the **Seeds** field.
     2. Click **Get Accounts from Seeds**.
   - If you don't have account seeds:
     1. Click **Get New Standby Account**.
     2. Click **Get New Operational Account**.

[![Get account results](/docs/img/quickstart-trade-auction-slot2.png)](/docs/img/quickstart-trade-auction-slot2.png)


### Get the AMM

Use the information from either the XRP/Token or Token/Token AMM you created in [Create an AMM](/docs/tutorials/javascript/amm/create-an-amm/#create-an-xrp/token-amm).

1. Enter a [currency code](/docs/references/protocol/data-types/currency-formats.md#currency-codes) in the **Asset 1 Currency** field. For example, `XRP`.
2. Enter a second currency code in the **Asset 2 Currency** field. For example, `TST`.
3. Enter the operational account address in the **Asset 2 Issuer** field.
4. Click **Check AMM**.

[![Get AMM results](/docs/img/quickstart-trade-auction-slot3.png)](/docs/img/quickstart-trade-auction-slot3.png)


### Estimate Costs

Get a new standby account to ensure you aren't using an account with an auction slot already.

1. Click **Get New Standby Account**.
2. Under the **Taker Pays** column:
   - Enter a currency code in the **Currency** field. For example, `TST`.
   - Enter the operational account address in the **Issuer** field.
   - Enter an **Amount**. For example, `10`.
3. Under the **Taker Gets** column, enter a currency code in the **Currency** field. For example, `XRP`.
4. Click **Estimate Cost**.
5. Save the values given by the estimate.

[![Estimate costs results](/docs/img/quickstart-trade-auction-slot4.png)](/docs/img/quickstart-trade-auction-slot4.png)


### Bid for the Auction Slot

Make a single-asset deposit to the AMM to receive the required LP tokens for the auction slot bid. You can deposit either asset from the cost estimator.

1. Enter the estimated deposit amount in either **Asset 1 Amount** or **Asset 2 Amount**. For example, `0.004012` in **Asset 1 Amount**.
2. Click **Add to AMM**.
3. Enter the estimated bid amount in the **LP Tokens** field. For example, `6.326`.
4. Click **Bid Auction Slot**.

[![Bid auction slot results](/docs/img/quickstart-trade-auction-slot5.png)](/docs/img/quickstart-trade-auction-slot5.png)


### Swap Tokens with the AMM

Get a new estimate to update the expected cost for swapping tokens.

1. Click **Estimate Cost**.
2. Under the **Taker Gets Column**, enter an **Amount**. Use the expected cost with an auction slot from the estimate. For example, `1.112113`.
3. Click **Swap Tokens**.

[![Swap tokens with AMM results](/docs/img/quickstart-trade-auction-slot6.png)](/docs/img/quickstart-trade-auction-slot6.png)


## Code Walkthrough (ripplex13a-trade-with-auction-slot.js)

You can open `ripplex13a-trade-with-auction-slot.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code.


### Estimate AMM Costs

This function checks the cost of interactions with the AMM, such as deposits, auction slot bids, and token swaps.

```javascript
async function estimateCost() {
```

Connect to the XRP Ledger.

```javascript
    let net = getNet()

    const client = new xrpl.Client(net)
    results = `\n\nConnecting to ${getNet()} ...`
    standbyResultField.value = results

    await client.connect()
    results += '\n\nConnected.'
    standbyResultField.value = results
```

Format the `amm_info` command and get the AMM information. This code is wrapped in a `try-catch` block to handle any errors.

```javascript
    try {

        const asset1_currency = asset1CurrencyField.value
        const asset1_issuer = asset1IssuerField.value

        const asset2_currency = asset2CurrencyField.value
        const asset2_issuer = asset2IssuerField.value


        // Look up AMM info

        let asset1_info = null
        let asset2_info = null

        if ( asset1_currency == 'XRP' ) {
            asset1_info = {
                "currency": "XRP"
            }
        } else {
            asset1_info = {
                "currency": asset1_currency,
                "issuer": asset1_issuer
            }
        }

        if ( asset2_currency == 'XRP' ) {
            asset2_info = {
                "currency": "XRP"
            }
        } else {
            asset2_info = {
                "currency": asset2_currency,
                "issuer": asset2_issuer
            }
        }

        const amm_info = (await client.request({
            "command": "amm_info", 
            "asset": asset1_info,
            "asset2": asset2_info
        }))

        // Save relevant AMM info for calculations

        const lpt = amm_info.result.amm.lp_token
        const pool_asset1 = amm_info.result.amm.amount
        const pool_asset2 = amm_info.result.amm.amount2
        const full_trading_fee = amm_info.result.amm.trading_fee
        const discounted_fee = amm_info.result.amm.auction_slot.discounted_fee
        const old_bid = amm_info.result.amm.auction_slot.price.value
        const time_interval = amm_info.result.amm.auction_slot.time_interval

        results += `\n\nTrading Fee: ${full_trading_fee/1000}%\nDiscounted Fee: ${discounted_fee/1000}%`
```

Save the taker pays and taker gets fields; use these values to get the total amount of each asset in the AMM pool, using large significant digits for precise calculations. This also checks if the requested token amount is larger than what is available in the AMM pool, stopping the code if `true`.

```javascript
        // Save taker pays and gets values.
        
        const takerPays = {
            "currency": standbyTakerPaysCurrencyField.value,
            "issuer": standbyTakerPaysIssuerField.value,
            "amount": standbyTakerPaysAmountField.value
        }

        const takerGets = {
            "currency": standbyTakerGetsCurrencyField.value,
            "issuer": standbyTakerGetsIssuerField.value,
            "amount": standbyTakerGetsAmountField.value
        }

        // Get amount of assets in the pool.
        // Convert values to BigNumbers with the appropriate precision.
        // Tokens always have 15 significant digits;
        // XRP is precise to integer drops, which can be as high as 10^17

        let asset_out_bn = null
        let pool_in_bn = null
        let pool_out_bn = null
        let isAmmAsset1Xrp = false
        let isAmmAsset2Xrp = false

        if ( takerPays.currency == 'XRP' ) {
            asset_out_bn = BigNumber(xrpl.xrpToDrops(takerPays.amount)).precision(17)
        } else {
            asset_out_bn = BigNumber(takerPays.amount).precision(15)
        }

        if ( takerGets.currency == 'XRP' && asset1_currency == 'XRP' ) {
            pool_in_bn = BigNumber(pool_asset1).precision(17)
            isAmmAsset1Xrp = true
        } else if ( takerGets.currency == 'XRP' && asset2_currency == 'XRP' ) {
            pool_in_bn = BigNumber(pool_asset2).precision(17)
            isAmmAsset2Xrp = true
        } else if ( takerGets.currency == asset1_currency ) {
            pool_in_bn = BigNumber(pool_asset1.value).precision(15)
        } else {
            pool_in_bn = BigNumber(pool_asset2.value).precision(15)
        }

        if (takerPays.currency == 'XRP' && asset1_currency == 'XRP' ) {
            pool_out_bn = BigNumber(pool_asset1).precision(17)
        } else if ( takerPays.currency == 'XRP' && asset2_currency == 'XRP' ) {
            pool_out_bn = BigNumber(pool_asset2).precision(17)
        } else if ( takerPays.currency == asset1_currency ) {
            pool_out_bn = BigNumber(pool_asset1.value).precision(15)
        } else {
            pool_out_bn = BigNumber(pool_asset2.value).precision(15)
        }

        if ( takerPays.currency == 'XRP' && parseFloat(takerPays.amount) > parseFloat(xrpl.dropsToXrp(pool_out_bn)) ) {
            results += `\n\nRequested ${takerPays.amount} ${takerPays.currency}, but AMM only holds ${xrpl.dropsToXrp(pool_out_bn)}. Quitting.`
            standbyResultField.value = results
            client.disconnect()
            return
        } else if ( parseFloat(takerPays.amount) > parseFloat(pool_out_bn) ) {
            results += `\n\nRequested ${takerPays.amount} ${takerPays.currency}, but AMM only holds ${pool_out_bn}. Quitting.`
            standbyResultField.value = results
            client.disconnect()
            return
        }
```

Implement [AMM formulas](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/misc/detail/AMMHelpers.cpp) to estimate values for:

- Cost to swap token without an auction slot.
- Cost to swap token with an auction slot.
- LP tokens to win an auction slot. This value factors the increase in the minimum bid of having new LP tokens issued to you from your deposit.
- The amount of tokens for single-asset deposits to get the required LP tokens to win the auction slot.

```javascript
        // Use AMM's SwapOut formula to figure out how much of the takerGets asset
        // you have to pay to receive the target amount of takerPays asset
        const unrounded_amount = swapOut(asset_out_bn, pool_in_bn, pool_out_bn, full_trading_fee)
        // Drop decimal places and round ceiling to ensure you pay in enough.
        const swap_amount = unrounded_amount.dp(0, BigNumber.ROUND_CEIL)

        // Helper function to convert drops to XRP in log window
        function convert(currency, amount) {
            if ( currency == 'XRP' ) {
                amount = xrpl.dropsToXrp(amount)
            }
            return amount
        }

        results += `\n\nExpected cost for ${takerPays.amount} ${takerPays.currency}: ${convert(takerGets.currency, swap_amount)} ${takerGets.currency}`

        // Use SwapOut to calculate discounted swap amount with auction slot
        const raw_discounted = swapOut(asset_out_bn, pool_in_bn, pool_out_bn, discounted_fee)
        const discounted_swap_amount = raw_discounted.dp(0, BigNumber.ROUND_CEIL)    
        results += `\n\nExpected cost with auction slot for ${takerPays.amount} ${takerPays.currency}: ${convert(takerGets.currency, discounted_swap_amount)} ${takerGets.currency}`

        // Calculate savings by using auction slot
        const potential_savings = swap_amount.minus(discounted_swap_amount)
        results += `\nPotential savings: ${convert(takerGets.currency, potential_savings)} ${takerGets.currency}`

        // Calculate the cost of winning the auction slot, in LP Tokens.
        const auction_price = auctionDeposit(old_bid, time_interval, full_trading_fee, lpt.value).dp(3, BigNumber.ROUND_CEIL)
        results += `\n\nYou can win the current auction slot by bidding ${auction_price} LP Tokens.`

        // Calculate how much to add for a single-asset deposit to receive the target LP Token amount
        let deposit_for_bid_asset1 = null
        let deposit_for_bid_asset2 = null

        if ( isAmmAsset1Xrp == true ) {
            deposit_for_bid_asset1 = xrpl.dropsToXrp(ammAssetIn(pool_asset1, lpt.value, auction_price, full_trading_fee).dp(0, BigNumber.ROUND_CEIL))
        } else {
            deposit_for_bid_asset1 = ammAssetIn(pool_asset1.value, lpt.value, auction_price, full_trading_fee).dp(15, BigNumber.ROUND_CEIL)
        }

        if ( isAmmAsset2Xrp == true ) {
            deposit_for_bid_asset2 = xrpl.dropsToXrp(ammAssetIn(pool_asset2, lpt.value, auction_price, full_trading_fee).dp(0, BigNumber.ROUND_CEIL))
        } else {
            deposit_for_bid_asset2 = ammAssetIn(pool_asset2.value, lpt.value, auction_price, full_trading_fee).dp(15, BigNumber.ROUND_CEIL)
        }

        if ( isAmmAsset1Xrp == true ) {
            results += `\n\nMake a single-asset deposit to the AMM of ${deposit_for_bid_asset1} XRP or ${deposit_for_bid_asset2} ${pool_asset2.currency} to get the required LP Tokens.`
        } else if ( isAmmAsset2Xrp == true ) {
            results += `\n\nMake a single-asset deposit to the AMM of ${deposit_for_bid_asset1} ${pool_asset1.currency} or ${deposit_for_bid_asset2} XRP to get the required LP Tokens.`
        } else {
            results += `\n\nMake a single-asset deposit to the AMM of ${deposit_for_bid_asset1} ${pool_asset1.currency} or ${deposit_for_bid_asset2} ${pool_asset2.currency} to get the required LP Tokens.`
        }

    } catch (error) {
        results += `\n\n${error.message}`
    }
```

Report the estimated values and close the client connection.

```javascript
    standbyResultField.value = results

    client.disconnect()

}
```


### Bid on the Auction Slot

This function bids on the AMM auction slot, using LP tokens.

```javascript
async function bidAuction() {
```

Connect to the ledger.

```javascript
    let net = getNet()

    const client = new xrpl.Client(net)
    results = `\n\nConnecting to ${getNet()} ...`
    standbyResultField.value = results

    await client.connect()
    results += '\n\nConnected.'
    standbyResultField.value = results
```

Format the asset values, depending on if it's `XRP` or a token. Wrap the code in a `try-catch` block to handle any errors.

```javascript
    try {

        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)

        const asset1_currency = asset1CurrencyField.value
        const asset1_issuer = asset1IssuerField.value

        const asset2_currency = asset2CurrencyField.value
        const asset2_issuer = asset2IssuerField.value
        const valueLPT = standbyLPField.value

        // Look up AMM info

        let asset1_info = null
        let asset2_info = null

        if ( asset1_currency == 'XRP' ) {
            asset1_info = {
                "currency": "XRP"
            }
        } else {
            asset1_info = {
                "currency": asset1_currency,
                "issuer": asset1_issuer
            }
        }

        if ( asset2_currency == 'XRP' ) {
            asset2_info = {
                "currency": "XRP"
            }
        } else {
            asset2_info = {
                "currency": asset2_currency,
                "issuer": asset2_issuer
            }
        }

        const amm_info = (await client.request({
            "command": "amm_info", 
            "asset": asset1_info,
            "asset2": asset2_info
        }))

        // Save relevant AMM info for calculations

        const lpt = amm_info.result.amm.lp_token

        results += '\n\nBidding on auction slot ...'
        standbyResultField.value = results
```

Submit the `AMMBid` transaction.

```javascript
        const bid_result = await client.submitAndWait({
            "TransactionType": "AMMBid",
            "Account": standby_wallet.address,
            "Asset": asset1_info,
            "Asset2": asset2_info,
            "BidMax": {
                "currency": lpt.currency,
                "issuer": lpt.issuer,
                "value": valueLPT
            },
            "BidMin": {
                "currency": lpt.currency,
                "issuer": lpt.issuer,
                "value": valueLPT
            } // So rounding doesn't leave dust amounts of LPT
            }, {autofill: true, wallet: standby_wallet})
    
        if (bid_result.result.meta.TransactionResult == "tesSUCCESS") {
            results += `\n\nTransaction succeeded.`
            checkAMM()
        } else {
            results += `\n\nError sending transaction: ${JSON.stringify(bid_result.result.meta.TransactionResult, null, 2)}`
        }        
    } catch (error) {
        results += `\n\n${error.message}`
    }
```

Report the results.

```javascript
    standbyResultField.value = results

    client.disconnect()

}
```


### Swap AMM Tokens

This function submits an `OfferCreate` transaction, using precise values to format the transaction and have the AMM completely consume the offer.

```javascript
async function swapTokens() {
```

Connect to the XRP Ledger.

```javascript
    let net = getNet()

    const client = new xrpl.Client(net)
    results = `\n\nConnecting to ${getNet()} ...`
    standbyResultField.value = results

    await client.connect()
    results += '\n\nConnected.'
    standbyResultField.value = results
```

Get the taker pays and taker gets fields and format the amounts depending on if it's `XRP` or a custom token. Wrap the code in a `try-catch` block to handle any errors.

```javascript
    try {

        const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)

        const takerPaysCurrency = standbyTakerPaysCurrencyField.value
        const takerPaysIssuer = standbyTakerPaysIssuerField.value
        const takerPaysAmount = standbyTakerPaysAmountField.value

        const takerGetsCurrency = standbyTakerGetsCurrencyField.value
        const takerGetsIssuer = standbyTakerGetsIssuerField.value
        const takerGetsAmount = standbyTakerGetsAmountField.value

        let takerPays = null
        let takerGets = null

        if ( takerPaysCurrency == 'XRP' ) {
            takerPays = xrpl.xrpToDrops(takerPaysAmount)
        } else {
            takerPays = {
                "currency": takerPaysCurrency,
                "issuer": takerPaysIssuer,
                "value": takerPaysAmount
            }
        }

        if ( takerGetsCurrency == 'XRP' ) {
            takerGets = xrpl.xrpToDrops(takerGetsAmount)
        } else {
            takerGets = {
                "currency": takerGetsCurrency,
                "issuer": takerGetsIssuer,
                "value": takerGetsAmount
            }
        }

        results += '\n\nSwapping tokens ...'
        standbyResultField.value = results
```

Submit the `OfferCreate` transaction.

```javascript
        const offer_result = await client.submitAndWait({
            "TransactionType": "OfferCreate",
            "Account": standby_wallet.address,
            "TakerPays": takerPays,
            "TakerGets": takerGets
        }, {autofill: true, wallet: standby_wallet})
        
        if (offer_result.result.meta.TransactionResult == "tesSUCCESS") {
            results += `\n\nTransaction succeeded.`
            checkAMM()
        } else {
            results += `\n\nError sending transaction: ${JSON.stringify(offer_result.result.meta.TransactionResult, null, 2)}`
        }        
    } catch (error) {
        results += `\n\n${error.message}`
    }
```

Report the results.

```javascript
    standbyResultField.value = results

    client.disconnect()

}
```


## Code Walkthrough (ripplex13b-amm-formulas.js) 

You can open `ripplex13b-amm-formulas.js` from the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) to view the source code. This code implements several core [AMM formulas](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/misc/detail/AMMHelpers.cpp) defined by the protocol.


### swapOut()

The `swapOut()` function calculates how much of an asset you must deposit into an AMM to receive a specified amount of the paired asset. The input asset is what you're adding to the pool (paying), and the output asset is what you're receiving from the pool (buying).

The formula used is based on [AMM Swap](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0030-automated-market-maker#25-amm-swap), defined in XLS-30.

| Parameter | Type | Description |
|-----------|------|-------------|
| asset_out_bn | BigNumber | The target amount to receive from the AMM. |
| pool_in_bn | BigNumber | The amount of the input asset in the AMM's pool before the swap. |
| pool_out_bn | BigNumber | The amount of the output asset in the AMM's pool before the swap. |
| trading_fee | int | The trading fee as an integer {0, 1000} where 1000 represents a 1% fee. |

| Returns | Type | Description |
|---------|------|-------------|
| Return Value | BigNumber | The amount of the input asset that must be swapped in to receive the target output amount. Unrounded, because the number of decimals depends on if this is drops of XRP or a decimal amount of a token; since this is a theoretical input to the pool, it should be rounded up (ceiling) to preserve the pool's constant product. |

```javascript
function swapOut(asset_out_bn, pool_in_bn, pool_out_bn, trading_fee) {
    return ( ( pool_in_bn.multipliedBy(pool_out_bn) ).dividedBy(
                pool_out_bn.minus(asset_out_bn)
             ).minus(pool_in_bn)
           ).dividedBy(feeMult(trading_fee))
}
```

### auctionDeposit()

The `auctionDeposit()` calculates how many LP tokens you need to spend to win the auction slot. The formula assumes you don't have any LP tokens and factors in the increase in LP tokens issued when you deposit assets. If you already have LP tokens, you can use the `auctionPrice()` function instead.

The formula used is based on the [slot pricing algorithm](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0030-automated-market-maker#411-slot-pricing) defined in XLS-30.

```javascript
function auctionDeposit(old_bid, time_interval, trading_fee, lpt_balance) {
    const tfee_decimal = feeDecimal(trading_fee)
    const lptokens = BigNumber(lpt_balance)
    const b = BigNumber(old_bid)
    let outbidAmount = BigNumber(0) // This is the case if time_interval >= 20
    if (time_interval == 0) {
        outbidAmount = b.multipliedBy("1.05")
    } else if (time_interval <= 19) {
        const t60 = BigNumber(time_interval).multipliedBy("0.05").exponentiatedBy(60)
        outbidAmount = b.multipliedBy("1.05").multipliedBy(BigNumber(1).minus(t60))
    }

    const new_bid = lptokens.plus(outbidAmount).dividedBy(
                            BigNumber(25).dividedBy(tfee_decimal).minus(1)
                          ).plus(outbidAmount)
    
    // Significant digits for the deposit are limited by total LPTokens issued
    // so we calculate lptokens + deposit - lptokens to determine where the
    // rounding occurs. We use ceiling/floor to make sure the amount we receive
    // after rounding is still enough to win the auction slot.
    const rounded_bid = new_bid.plus(lptokens).precision(15, BigNumber.CEILING
                              ).minus(lptokens).precision(15, BigNumber.FLOOR)
    return rounded_bid
}
```

### ammAssetIn()

The `ammAssetIn()` function calculates how much to add in a single-asset deposit to receive a specified amount of LP tokens.

| Parameter | Type | Description |
|-----------|------|-------------|
| pool_in | string | The quantity of the input asset the pool already has. |
| lpt_balance | string | The quantity of LP tokens already issued by the AMM. |
| desired_lpt | string | The quantity of new LP tokens you want to receive. |
| trading_fee | int | The trading fee as an integer {0, 1000} where 1000 represents a 1% fee. |

```javascript
function ammAssetIn(pool_in, lpt_balance, desired_lpt, trading_fee) {
    // convert inputs to BigNumber
    const lpTokens = BigNumber(desired_lpt)
    const lptAMMBalance = BigNumber(lpt_balance)
    const asset1Balance = BigNumber(pool_in)

    const f1 = feeMult(trading_fee)
    const f2 = feeMultHalf(trading_fee).dividedBy(f1)
    const t1 = lpTokens.dividedBy(lptAMMBalance)
    const t2 = t1.plus(1)
    const d = f2.minus( t1.dividedBy(t2) )
    const a = BigNumber(1).dividedBy( t2.multipliedBy(t2))
    const b = BigNumber(2).multipliedBy(d).dividedBy(t2).minus( 
                    BigNumber(1).dividedBy(f1)
              )
    const c = d.multipliedBy(d).minus( f2.multipliedBy(f2) )
    return asset1Balance.multipliedBy(solveQuadraticEq(a,b,c))
}
```

Compute the quadratic formula. This is a helper function for `ammAssetIn()`. Parameters and return value are `BigNumber` instances.

```javascript
function solveQuadraticEq(a,b,c) {
    const b2minus4ac = b.multipliedBy(b).minus( 
                            a.multipliedBy(c).multipliedBy(4) 
                       )
    return ( b.negated().plus(b2minus4ac.sqrt()) ).dividedBy(a.multipliedBy(2))
}
```
