const xrpl = require('xrpl')
const BigNumber = require('bignumber.js')

/*
 * Convert a trading fee to a value that can be multiplied
 * by a total to "subtract" the fee from the total.
 * @param tFee int {0, 1000}
 *             such that 1 = 1/100,000 and 1000 = 1% fee
 * @returns BigNumber (1 - fee) as a decimal
 */
function feeMult(tFee) {
    return BigNumber(1).minus( feeDecimal(tFee) )
}

/*
 * Same as feeMult, but with half the trading fee.
 * @param tFee int {0, 1000}
 *             such that 1 = 1/100,000 and 1000 = 1% fee
 * @returns BigNumber (1 - (fee/2)) as a decimal
 */
function feeMultHalf(tFee) {
    return BigNumber(1).minus( feeDecimal(tFee).dividedBy(2) )
}

/*
 * Convert a trading fee to a decimal BigNumber value,
 * for example 1000 becomes 0.01
 * @param tFee int {0, 1000}
 *             such that 1 = 1/100,000 and 1000 = 1% fee
 * @returns BigNumber(fee) as a decimal
 */
function feeDecimal(tFee) {
    const AUCTION_SLOT_FEE_SCALE_FACTOR = 100000
    return BigNumber(tFee).dividedBy(AUCTION_SLOT_FEE_SCALE_FACTOR)
}

/*
 * Implements the AMM SwapOut formula, as defined in XLS-30 section 2.4 AMM 
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

/*
 * Computes the quadratic formula. Helper function for ammAssetIn.
 * Params and return value are BigNumber instances.
 */
function solveQuadraticEq(a,b,c) {
    const b2minus4ac = b.multipliedBy(b).minus( a.multipliedBy(c).multipliedBy(4) )
    return ( b.negated().plus(b2minus4ac.sqrt()) ).dividedBy(a.multipliedBy(2));
}

/*
 * Implements the AMM single-asset deposit formula to calculate how much to
 * put in so that you receive a specific number of LP Tokens back.
 * C++ source: https://github.com/XRPLF/rippled/blob/2d1854f354ff8bb2b5671fd51252c5acd837c433/src/ripple/app/misc/impl/AMMHelpers.cpp#L55-L83
 * @param pool_in string - Quantity of input asset the pool already has
 * @param lpt_balance string - Quantity of LP Tokens already issued by the AMM
 * @param desired_lpt string - Quantity of new LP Tokens you want to receive
 * @param trading_fee int - The trading fee as an integer {0,1000} where 1000
 *                          represents a 1% fee.
 */
function ammAssetIn(pool_in, lpt_balance, desired_lpt, trading_fee) {
    // TODO: refactor to take pool_in as a BigNumber so precision can be set based on XRP/drops?
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
    const b = BigNumber(2).multipliedBy(d).dividedBy(t2).minus( BigNumber(1).dividedBy(f1) )
    const c = d.multipliedBy(d).minus( f2.multipliedBy(f2) )
    return asset1Balance.multipliedBy(solveQuadraticEq(a,b,c))
}

/*
 * Calculates the necessary bid to win the AMM Auction slot, per the pricing
 * algorithm defined in XLS-30 section 4.1.1.
 * @returns BigNumber - the minimum amount of LP tokens to win the auction slot
 */
function auctionPrice(old_bid, time_interval, trading_fee, lpt_balance) {
    const tfee_decimal = feeDecimal(trading_fee)
    const min_bid = BigNumber(lpt_balance).multipliedBy(tfee_decimal).dividedBy(25)
    const b = BigNumber(old_bid)
    if (time_interval >= 20) {
        return min_bid

    } else if (time_interval > 1) {
        const t60 = BigNumber("0.05").multipliedBy(time_interval).exponentiatedBy(60)
        return b.multipliedBy("1.05").multipliedBy(BigNumber(1).minus(t60)).plus(min_bid)

    } else { // time_interval <= 1
        return b.multipliedBy(BigNumber("1.05")).plus(min_bid)
    }

}

async function main() {
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
    console.log("Connecting to Testnet...")
    await client.connect()
  
    // Get credentials from the Testnet Faucet --------------------------------
    console.log("Requesting address from the Testnet faucet...")
    const wallet = (await client.fundWallet()).wallet
    console.log(`Got address ${wallet.address}.`)

    // Look up the AMM
    const from_asset = {
        "currency": "XRP"
    }
    const to_asset = {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
    
    const amm_info = (await client.request({"command": "amm_info", "asset": from_asset, "asset2": to_asset}))
    console.dir(amm_info, {depth: null})
    const amm_account = amm_info.result.amm.account
    const lpt = amm_info.result.amm.lp_token
    const pool_drops = amm_info.result.amm.amount // XRP is always first if the pool is token←→XRP
    const pool_tst = amm_info.result.amm.amount2
    const full_trading_fee = amm_info.result.amm.trading_fee
    const discounted_trading_fee = amm_info.result.amm.auction_slot.discounted_fee
    const old_bid = amm_info.result.amm.auction_slot.price.value
    const time_interval = amm_info.result.amm.auction_slot.time_interval

    // Calculate price in XRP to get 10 TST from the AMM ----------------------
    // TODO: first calculate how much will be fulfilled by the order book before getting to the AMM.

    const to_amount = {
        "currency": to_asset.currency,
        "issuer": to_asset.issuer,
        "value": "10.0"
    }

    // Convert values to BigNumbers with the appropriate precision ------------
    // Tokens always have 15 significant digits;
    // XRP is precise to integer drops, which can be as high as 10^17
    const asset_out_bn = BigNumber(to_amount.value).precision(15)
    const pool_in_bn = BigNumber(pool_drops).precision(17)
    const pool_out_bn = BigNumber(pool_tst.value).precision(15)
    
    // Use AMM's SwapOut formula to figure out how much XRP we have to pay
    // to receive the target amount of TST, under the current trading fee.
    const unrounded_amount = swapOut(asset_out_bn, pool_in_bn, pool_out_bn, full_trading_fee)
    const from_amount = unrounded_amount.dp(0, BigNumber.ROUND_CEIL) // Round XRP to integer drops.
    console.log(`Expected cost of ${to_amount.value} ${to_amount.currency}: ${xrpl.dropsToXrp(from_amount)} XRP`)

    // Same calculation, but assume we have access to the discounted trading
    // fee from the auction slot.
    const unrounded_amount_discounted = swapOut(asset_out_bn, pool_in_bn, pool_out_bn, discounted_trading_fee)
    const discounted_from_amount = unrounded_amount_discounted.dp(0, BigNumber.ROUND_CEIL)
    console.log(`Expected cost with auction slot discount: ${xrpl.dropsToXrp(discounted_from_amount)} XRP`)
    
    // The potential savings is the difference between the necessary input 
    // amounts with the full vs discounted fee.
    const potential_savings = from_amount - discounted_from_amount
    console.log(`Potential savings: ${xrpl.dropsToXrp(potential_savings)} XRP`)
    
    // Calculate the cost of winning the auction slot, in LP Tokens
    const auction_price = auctionPrice(old_bid, time_interval, full_trading_fee, lpt.value).precision(15)
    console.log(`Auction price: ${auction_price} LP Tokens`)
    // Figure out how much XRP we need to deposit to receive the auction price
    const deposit_for_bid = ammAssetIn(pool_in_bn, lpt.value, auction_price, full_trading_fee).dp(0, BigNumber.ROUND_CEIL)
    console.log(`Auction price as XRP single-asset deposit amount: ${xrpl.dropsToXrp(deposit_for_bid)} XRP`)

    const SLIPPAGE_MULT = BigNumber(1.01) // allow up to 1% more than estimated amounts. TODO: also allow slippage on auction price?
    const deposit_max = deposit_for_bid.multipliedBy(SLIPPAGE_MULT).dp(0).toString()

    // TODO: compare price of deposit+bid with potential savings. Don't forget XRP burned as transaction costs

    const auction_bid = {
        "currency": lpt.currency,
        "issuer": lpt.issuer,
        "value": auction_price.toString()
    }
    // Do a single-asset deposit to get LP Tokens to bid on the auction slot
    const deposit_result = await client.submitAndWait({
    // const deposit_autofill = await client.autofill({
        "TransactionType": "AMMDeposit",
        "Account": wallet.address,
        "Asset": from_asset,
        "Asset2": to_asset,
        "Amount": deposit_max,
        "LPTokenOut": auction_bid,
        "Flags": xrpl.AMMDepositFlags.tfOneAssetLPToken
      }, {autofill: true, wallet: wallet}
    )
    console.log("Deposit result:")
    console.dir(deposit_result, {depth: null})


    // Bid on the auction slot
    const bid_result = await client.submitAndWait({
        "TransactionType": "AMMBid",
        "Account": wallet.address,
        "Asset": from_asset,
        "Asset2": to_asset,
        "BidMax": auction_bid // TODO: try w/ BidMin + BidMax w/ slippage
      }, {autofill: true, wallet: wallet}
    )
    console.log("Bid result:")
    console.dir(bid_result, {depth: null})

    // Done.
    client.disconnect()
} // End of main()

main()
