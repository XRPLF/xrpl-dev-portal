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
    }

    if (time_interval <= 1) {
        return b.multipliedBy(BigNumber("1.05")).plus(min_bid)
    }

    const t60 = BigNumber("0.05").multipliedBy(time_interval).exponentiatedBy(60)
    return b.multipliedBy("1.05").multipliedBy(BigNumber(1).minus(t60)).plus(min_bid)
}

async function main() {
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    console.log("Connecting to Testnet...")
    await client.connect()
  
    // Get credentials from the Testnet Faucet --------------------------------
    // console.log("Requesting address from the Testnet faucet...")
    // const wallet = (await client.fundWallet()).wallet
    // console.log(`Got address ${wallet.address}.`)

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
    
    // Calculate the cost of winning the auction slot, then convert it to XRP
    const auction_price = auctionPrice(old_bid, time_interval, full_trading_fee, lpt.value)
    console.log(`Auction price: ${auction_price} LP Tokens`)
    // @@TODO: figure out how to convert auction_price from LPT to input asset.


    // Done.
    client.disconnect()
} // End of main()

main()
