const xrpl = require('xrpl')
const BigNumber = require('bignumber.js')
const {auctionDeposit, ammAssetIn, swapOut} = require("./amm-formulas.js")

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
