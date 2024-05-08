const xrpl = require('xrpl')
const BigNumber = require('bignumber.js')

/* Convert a trading fee to a value that can be multiplied
 * by a total to "subtract" the fee from the total.
 * @param tFee int {0, 1000}
 *             such that 1 = 1/100,000 and 1000 = 1% fee
 * @returns BigNumber (1 - fee) as a decimal
 */
function feeMult(tFee) {
    return BigNumber(1).minus( feeDecimal(tFee) )
}

/* Same as feeMult, but with half the trading fee.
 * @param tFee int {0, 1000}
 *             such that 1 = 1/100,000 and 1000 = 1% fee
 * @returns BigNumber (1 - (fee/2)) as a decimal
 */
function feeMultHalf(tFee) {
    return BigNumber(1).minus( feeDecimal(tFee).dividedBy(2) )
}

/* Convert a trading fee to a decimal BigNumber value,
 * for example 1000 becomes 0.01
 * @param tFee int {0, 1000}
 *             such that 1 = 1/100,000 and 1000 = 1% fee
 * @returns BigNumber(fee) as a decimal
 */
function feeDecimal(tFee) {
    const AUCTION_SLOT_FEE_SCALE_FACTOR = 100000
    return BigNumber(tFee).dividedBy(AUCTION_SLOT_FEE_SCALE_FACTOR)
}

/* Implement the AMM SwapOut formula, as defined in XLS-30 section 2.4 AMM 
 * Swap, formula 10. The asset weights WA/WB are currently always 1/1 so 
 * they're canceled out.
 * C++ source: https://github.com/XRPLF/rippled/blob/2d1854f354ff8bb2b5671fd51252c5acd837c433/src/ripple/app/misc/AMMHelpers.h#L253-L258
 * @param asset_out_bn BigNumber - The target amount to receive from the AMM.
 * @param pool_in_bn BigNumber - The amount of the input asset in the AMM's 
 *                               pool before the swap.
 * @param pool_out_bn BigNumber - The amount of the output asset in the AMM's
 *                                pool before the swap.
 * @param trading_fee int - The trading fee as an integer {0, 1000} where 1000 
 *                          represents a 1% fee.
 * @returns BigNumber - The amount of the input asset that must be swapped in 
 *                      to receive the target output amount. Unrounded, because
 *                      the number of decimals depends on if this is drops of 
 *                      XRP or a decimal amount of a token; since this is a
 *                      theoretical input to the pool, it should be rounded 
 *                      up (ceiling) to preserve the pool's constant product.
 */
function swapOut(asset_out_bn, pool_in_bn, pool_out_bn, trading_fee) {
    return ( ( pool_in_bn.multipliedBy(pool_out_bn) ).dividedBy(
                pool_out_bn.minus(asset_out_bn)
             ).minus(pool_in_bn)
           ).dividedBy(feeMult(trading_fee))
}

/* Compute the quadratic formula. Helper function for ammAssetIn.
 * Params and return value are BigNumber instances.
 */
function solveQuadraticEq(a,b,c) {
    const b2minus4ac = b.multipliedBy(b).minus( 
                            a.multipliedBy(c).multipliedBy(4) 
                       )
    return ( b.negated().plus(b2minus4ac.sqrt()) ).dividedBy(a.multipliedBy(2))
}

/* Implement the AMM single-asset deposit formula to calculate how much to
 * put in so that you receive a specific number of LP Tokens back.
 * C++ source: https://github.com/XRPLF/rippled/blob/2d1854f354ff8bb2b5671fd51252c5acd837c433/src/ripple/app/misc/impl/AMMHelpers.cpp#L55-L83
 * @param pool_in string - Quantity of input asset the pool already has
 * @param lpt_balance string - Quantity of LP Tokens already issued by the AMM
 * @param desired_lpt string - Quantity of new LP Tokens you want to receive
 * @param trading_fee int - The trading fee as an integer {0,1000} where 1000
 *                          represents a 1% fee.
 */
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

/* Calculate how much to deposit, in terms of LP Tokens out, to be able to win
 * the auction slot. This is based on the slot pricing algorithm defined in 
 * XLS-30 section 4.1.1, but factors in the increase in the minimum bid as a 
 * result of having new LP Tokens issued to you from your deposit.
 */
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


async function main() {
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    console.log("Connecting to Testnet...")
    await client.connect()
  
    // // Get credentials from the faucet -------------------------------------
    console.log("Requesting test XRP from the faucet...")
    const wallet = (await client.fundWallet()).wallet
    console.log(`Got address ${wallet.address} / seed ${wallet.seed}.`)

    // Look up AMM status -----------------------------------------------------
    const from_asset = {
        "currency": "XRP"
    }
    const to_asset = {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
    const amm_info = (await client.request({
        "command": "amm_info", 
        "asset": from_asset, 
        "asset2": to_asset
    }))
    console.dir(amm_info, {depth: null})
    const lpt = amm_info.result.amm.lp_token
    // XRP is always first if the pool is token←→XRP.
    // For a token←→token AMM, you'd need to figure out which asset is first.
    const pool_drops = amm_info.result.amm.amount
    const pool_tst = amm_info.result.amm.amount2
    const full_trading_fee = amm_info.result.amm.trading_fee
    const discounted_fee = amm_info.result.amm.auction_slot.discounted_fee
    const old_bid = amm_info.result.amm.auction_slot.price.value
    const time_interval = amm_info.result.amm.auction_slot.time_interval

    // Calculate price in XRP to get 10 TST from the AMM ----------------------
    // Note, this ignores Offers from the non-AMM part of the DEX.
    const to_amount = {
        "currency": to_asset.currency,
        "issuer": to_asset.issuer,
        "value": "10.0"
    }

    // Convert values to BigNumbers with the appropriate precision.
    // Tokens always have 15 significant digits;
    // XRP is precise to integer drops, which can be as high as 10^17
    const asset_out_bn = BigNumber(to_amount.value).precision(15)
    const pool_in_bn = BigNumber(pool_drops).precision(17)
    const pool_out_bn = BigNumber(pool_tst.value).precision(15)

    if (to_amount.value > pool_out_bn) {
        console.log(`Requested ${to_amount.value} ${to_amount.currency} ` +
                    `but AMM only holds ${pool_tst.value}. Quitting.`)
        client.disconnect()
        return
    }

    // Use AMM's SwapOut formula to figure out how much XRP we have to pay
    // to receive the target amount of TST, under the current trading fee.
    const unrounded_amount = swapOut(asset_out_bn, pool_in_bn, 
                                     pool_out_bn, full_trading_fee)
    // Round XRP to integer drops. Round ceiling to make you pay in enough.
    const from_amount = unrounded_amount.dp(0, BigNumber.ROUND_CEIL)
    console.log(`Expected cost of ${to_amount.value} ${to_amount.currency}: ` +
                `${xrpl.dropsToXrp(from_amount)} XRP`)

    // Same calculation, but assume we have access to the discounted trading
    // fee from the auction slot.
    const raw_discounted = swapOut(asset_out_bn, pool_in_bn, pool_out_bn, 
                                   discounted_fee)
    const discounted_from_amount = raw_discounted.dp(0, BigNumber.ROUND_CEIL)
    console.log(`Expected cost with auction slot discount: `+
                `${xrpl.dropsToXrp(discounted_from_amount)} XRP`)
    
    // The potential savings is the difference between the necessary input 
    // amounts with the full vs discounted fee.
    const potential_savings = from_amount.minus(discounted_from_amount)
    console.log(`Potential savings: ${xrpl.dropsToXrp(potential_savings)} XRP`)

    // Calculate the cost of winning the auction slot, in LP Tokens -----------
    const auction_price = auctionDeposit(old_bid, time_interval, 
                                         full_trading_fee, lpt.value
                                         ).precision(15)
    console.log(`Auction price after deposit: ${auction_price} LP Tokens`)
    
    // Calculate how much XRP to deposit to receive that many LP Tokens -------
    const deposit_for_bid = ammAssetIn(pool_in_bn, lpt.value, auction_price, 
                                       full_trading_fee
                                       ).dp(0, BigNumber.ROUND_CEIL)
    console.log(`Auction price as XRP single-asset deposit amount: `+
                `${xrpl.dropsToXrp(deposit_for_bid)} XRP`)

    // Optional. Allow for costs to be 1% greater than estimated, in case other
    // transactions affect the same AMM during this time.
    const SLIPPAGE_MULT = BigNumber(1.01)
    const deposit_max = deposit_for_bid.multipliedBy(SLIPPAGE_MULT).dp(0)

    // Compare price of deposit+bid with potential savings. -------------------
    // Don't forget XRP burned as transaction costs.
    const fee_response = (await client.request({"command":"fee"}))
    const tx_cost_drops = BigNumber(fee_response.result.drops.minimum_fee
                                    ).multipliedBy(client.feeCushion).dp(0)
    const net_savings = potential_savings.minus(
                            tx_cost_drops.multipliedBy(2).plus(deposit_max)
                        )
    if (net_savings > 0) {
        console.log(`Estimated net savings from the auction slot: ` +
                    `${xrpl.dropsToXrp(net_savings)} XRP`)
    } else {
        console.log(`Estimated the auction slot to be MORE EXPENSIVE by `+
                    `${xrpl.dropsToXrp(net_savings.negated())} XRP. Quitting.`)
        client.disconnect()
        return
    }

    // Do a single-asset deposit to get LP Tokens to bid on the auction slot --
    const auction_bid = {
        "currency": lpt.currency,
        "issuer": lpt.issuer,
        "value": auction_price.toString()
    }
    const deposit_result = await client.submitAndWait({
        "TransactionType": "AMMDeposit",
        "Account": wallet.address,
        "Asset": from_asset,
        "Asset2": to_asset,
        "Amount": deposit_max.toString(),
        "LPTokenOut": auction_bid,
        "Flags": xrpl.AMMDepositFlags.tfOneAssetLPToken
      }, {autofill: true, wallet: wallet}
    )
    console.log("Deposit result:")
    console.dir(deposit_result, {depth: null})

    // Actually bid on the auction slot ---------------------------------------
    const bid_result = await client.submitAndWait({
        "TransactionType": "AMMBid",
        "Account": wallet.address,
        "Asset": from_asset,
        "Asset2": to_asset,
        "BidMax": auction_bid,
        "BidMin": auction_bid, // So rounding doesn't leave dust amounts of LPT
      }, {autofill: true, wallet: wallet}
    )
    console.log("Bid result:")
    console.dir(bid_result, {depth: null})

    // Trade using the discount -----------------------------------------------
    const spend_drops = discounted_from_amount.multipliedBy(SLIPPAGE_MULT
                                                            ).dp(0).toString()
    const offer_result = await client.submitAndWait({
        "TransactionType": "OfferCreate",
        "Account": wallet.address,
        "TakerPays": to_amount,
        "TakerGets": spend_drops
    }, {autofill: true, wallet: wallet})
    console.log("Offer result:")
    console.dir(offer_result, {depth: null})
    console.log("Offer balance changes summary:")
    console.dir(xrpl.getBalanceChanges(offer_result.result.meta), {depth:null})

    // Done.
    client.disconnect()
} // End of main()

main()

/// TODO: move everything below here to a separate code sample with minimal setup to make it work:

// /* Calculate the necessary bid to win the AMM Auction slot, per the pricing
//  * algorithm defined in XLS-30 section 4.1.1, if you already hold LP Tokens.
//  * Not useful in the case where you need to make a deposit to get LP Tokens,
//  * because doing so causes more LP Tokens to be issued, changing the min bid.
//  * @returns BigNumber - the minimum amount of LP tokens to win the auction slot
//  */
// function auctionPrice(old_bid, time_interval, trading_fee, lpt_balance) {
//     const tfee_decimal = feeDecimal(trading_fee)
//     const lptokens = BigNumber(lpt_balance)
//     const min_bid = lptokens.multipliedBy(tfee_decimal).dividedBy(25)
//     const b = BigNumber(old_bid)
//     let new_bid = min_bid
    
//     if (time_interval == 0) {
//         new_bid = b.multipliedBy("1.05").plus(min_bid)
//     } else if (time_interval <= 19) {
//         const t60 = BigNumber(time_interval).multipliedBy("0.05"
//                     ).exponentiatedBy(60)
//         new_bid = b.multipliedBy("1.05").multipliedBy(
//                       BigNumber(1).minus(t60)
//                   ).plus(min_bid)
//     }

//     const rounded_bid = new_bid.plus(lptokens).precision(15, BigNumber.CEILING
//                               ).minus(lptokens).precision(15, BigNumber.FLOOR)
//     return rounded_bid
// }
// 
// 
//     // The price is slightly different if you already hold LP Tokens vs if you 
//     // have to make a deposit, because the deposit causes more LP Tokens to be
//     // issued, which increases the minimum bid.
//     const lp_auction_price = auctionPrice(old_bid, time_interval, 
//         full_trading_fee, lpt.value
//         ).precision(15)
// console.log(`Auction price for current LPs: ${lp_auction_price} LP Tokens`)
