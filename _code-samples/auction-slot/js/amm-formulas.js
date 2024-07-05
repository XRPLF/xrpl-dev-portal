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

/* Same as feeMult, but with half the trading fee. Single-asset deposits and
 * withdrawals use this because half of the deposit is treated as being
 * "swapped" for the other asset in the AMM's pool.
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

/* Calculate the necessary bid to win the AMM Auction slot, per the pricing
 * algorithm defined in XLS-30 section 4.1.1, if you already hold LP Tokens.
 * 
 * NOT USED in the Auction Slot tutorial, which assumes the user does not hold
 * any LP Tokens.
 * 
 * @returns BigNumber - the minimum amount of LP tokens to win the auction slot
 */
function auctionPrice(old_bid, time_interval, trading_fee, lpt_balance) {
    const tfee_decimal = feeDecimal(trading_fee)
    const lptokens = BigNumber(lpt_balance)
    const min_bid = lptokens.multipliedBy(tfee_decimal).dividedBy(25)
    const b = BigNumber(old_bid)
    let new_bid = min_bid
    
    if (time_interval == 0) {
        new_bid = b.multipliedBy("1.05").plus(min_bid)
    } else if (time_interval <= 19) {
        const t60 = BigNumber(time_interval).multipliedBy("0.05"
                    ).exponentiatedBy(60)
        new_bid = b.multipliedBy("1.05").multipliedBy(
                      BigNumber(1).minus(t60)
                  ).plus(min_bid)
    }

    const rounded_bid = new_bid.plus(lptokens).precision(15, BigNumber.CEILING
                              ).minus(lptokens).precision(15, BigNumber.FLOOR)
    return rounded_bid
}

module.exports = {
    "auctionDeposit": auctionDeposit,
    "auctionPrice": auctionPrice,
    "ammAssetIn": ammAssetIn,
    "swapOut": swapOut,
}
