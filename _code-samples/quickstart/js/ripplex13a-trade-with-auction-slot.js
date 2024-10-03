// Function to estimate cost to swap for specified token value.

async function estimateCost() {

    let net = getNet()

    const client = new xrpl.Client(net)
    results = `\n\nConnecting to ${getNet()} ...`
    standbyResultField.value = results

    await client.connect()
    results += '\n\nConnected.'
    standbyResultField.value = results

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

    standbyResultField.value = results

    client.disconnect()

}

// Bid on the auction slot

async function bidAuction() {
    let net = getNet()

    const client = new xrpl.Client(net)
    results = `\n\nConnecting to ${getNet()} ...`
    standbyResultField.value = results

    await client.connect()
    results += '\n\nConnected.'
    standbyResultField.value = results

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

    standbyResultField.value = results

    client.disconnect()

}

// Swap tokens with AMM
async function swapTokens() {
    let net = getNet()

    const client = new xrpl.Client(net)
    results = `\n\nConnecting to ${getNet()} ...`
    standbyResultField.value = results

    await client.connect()
    results += '\n\nConnected.'
    standbyResultField.value = results

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

    standbyResultField.value = results

    client.disconnect()

}
