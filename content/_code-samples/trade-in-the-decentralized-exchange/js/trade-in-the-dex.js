// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Connect ---------------------------------------------------------------------
async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  console.log("Connecting to Testnet...")
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  // console.log("Requesting address from the Testnet faucet...")
  // const wallet = (await client.fundWallet()).wallet
  // console.log(`Got address ${wallet.address}.`)
  const wallet = xrpl.Wallet.fromSeed("SEED VALUE HERE") // temp for testing: don't fund every time

  // Define the proposed trade.
  const we_want = {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "25"}

                              // 250 TST * 10 XRP per TST * 1.15 fx cost
  const we_spend = {currency: "XRP", value: xrpl.xrpToDrops(25*10*1.15)}
  // "Quality" is defined as TakerPays ÷ TakerGets. The lower the "quality"
  // number, the better the proposed exchange rate is for the taker.
  const proposed_quality = Number(we_spend.value / we_want.value)

  // Look up Offers. -----------------------------------------------------------
  // To buy TST, look up Offers where "TakerGets" is TST:
  const orderbook_resp = await client.request({
    "command": "book_offers",
    "taker": wallet.address,
    "ledger_index": "current",
    "taker_gets": we_want,
    "taker_pays": we_spend
  })
  console.log(JSON.stringify(orderbook_resp.result, null, 2))

  // Estimate whether a proposed Offer would execute immediately, and...
  // If so, how much of it? (Partial execution is possible)
  // If not, how much liquidity is above it? (How deep in the order book would
  //    other Offers have to go before ours would get taken?)
  // Note: these estimates can be thrown off by rounding if the token issuer
  // uses a TickSize setting other than the default (15). In that case, you
  // can increase the TakerGets amount of your final offer just a little bit to
  // compensate.

  const offers = orderbook_resp.result.offers
  const want_amt = Number(we_want.value)
  let running_total = 0
  if (!offers) {
    console.log(`No Offers in the matching book.
                 Offer probably won't execute immediately.`)
  } else {
    for (o of offers) {
      if (o.quality <= proposed_quality) {
        console.log(`Matching Offer found, funded with ${o.owner_funds}`)
        running_total += Number(o.owner_funds)
        if (running_total >= want_amt) {
          console.log("Full Offer will probably fill")
          break
        }
      } else {
        // Offers are in ascending quality order, so no others after this
        // will match, either
        console.log(`Remaining orders too expensive.`)
        break
      }
    }
    console.log(`Total matched: ${Math.min(running_total, want_amt)}`)
    if (running_total > 0 && running_total < want_amt) {
      console.log(`Remaining ${want_amt - running_total} would probably be
                   placed on top of the order book.`)
    }
  }

  if (running_total = 0) {
    // If part of the Offer was expected to cross, then the rest would be placed
    // at the top of the order book. If none did, then there might be other
    // Offers going the same direction as ours already on the books with an
    // equal or better rate. This code counts how much liquidity is likely to be
    // above ours.

    // Unlike above, this time we check for Offers going the same direction as
    // ours, so TakerGets and TakerPays are reversed from the previous
    // book_offers request.
    const orderbook2_resp = await client.request({
      "command": "book_offers",
      "taker": wallet.address,
      "ledger_index": "current",
      "taker_gets": we_spend,
      "taker_pays": we_want
    })
    console.log(JSON.stringify(orderbook2_resp.result, null, 2))

    // Since TakerGets/TakerPays are reversed, the quality is the inverse.
    // You could also calculate this as 1/proposed_quality.
    const offered_quality = Number(we_want.value / we_spend.value)

    const offers2 = orderbook2_resp.result.offers
    let running_total2 = 0
    if (!offers2) {
      console.log(`No similar Offers in the book. Ours would be the first.`)
    } else {
      for (o of offers2) {
        if (o.quality <= offered_quality) {
          console.log(`Existing offer found, funded with ${o.owner_funds}`)
          running_total2 += Number(o.owner_funds)
        } else {
          console.log(`Remaining orders are below where ours would be placed.`)
          break
        }
      }
      console.log(`Our Offer would be placed below at least ${running_total2} ${we_spend.currency}`)
      if (running_total > 0 && running_total < want_amt) {
        console.log(`Remaining ${want_amt - running_total} will probably be
                     placed on top of the order book.`)
      }
    }
  }


  // Depending on your use case, you may want to present options to the user
  // here with estimates of the cost to buy (or proceeds from selling) the
  // assets involved. For this tutorial, we already know that TST is pegged to
  // XRP at a rate of approximately 10:1 plus spread, so we can use a
  // hard-coded TakerGets amount.

  // Send OfferCreate transaction ----------------------------------------------
  const offer_1 = {
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerPays": we_want,
    "TakerGets": we_spend.value // since it's XRP
  }

  const prepared = await client.autofill(offer_1)
  console.log("Prepared transaction:", JSON.stringify(prepared, null, 2))
  //throw "BREAK"
  const signed = wallet.sign(prepared)
  console.log("Sending OfferCreate transaction...")
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`)
  } else {
    throw `Error sending transaction: ${result}`
  }

  // Check balances ------------------------------------------------------------
  console.log("Getting address balances...")
  const balances = await client.request({
    command: "account_lines",
    account: wallet.address,
    ledger_index: "validated"
  })
  console.log(balances.result)

  client.disconnect()
} // End of main()

main()
