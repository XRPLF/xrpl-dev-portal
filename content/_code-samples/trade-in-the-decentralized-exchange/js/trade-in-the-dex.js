// Stand-alone code sample for "trade in the decentralized exchange" tutorial:
// https://xrpl.org/trade-in-the-decentralized-exchange.html

// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
  var BigNumber = require('bignumber.js')
}

// Connect ---------------------------------------------------------------------
async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  console.log("Connecting to Testnet...")
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting address from the Testnet faucet...")
  const wallet = (await client.fundWallet()).wallet
  console.log(`Got address ${wallet.address}.`)
  // To use existing credentials, you can load them from a seed value, for
  // example using an environment variable as follows:
  // const wallet = xrpl.Wallet.fromSeed(process.env['MY_SEED'])

  // Define the proposed trade. ------------------------------------------------
  // Technically you don't need to specify the amounts (in the "value" field)
  // to look up order books using book_offers, but for this tutorial we reuse
  // these variables to construct the actual Offer later.
  const we_want = {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "25"
  }
  const we_spend = {
    currency: "XRP",
           // 25 TST * 10 XRP per TST * 15% financial exchange (FX) cost
    value: xrpl.xrpToDrops(25*10*1.15)
  }
  // "Quality" is defined as TakerPays / TakerGets. The lower the "quality"
  // number, the better the proposed exchange rate is for the taker.
  // The quality is rounded to a number of significant digits based on the
  // issuer's TickSize value (or the lesser of the two for token-token trades.)
  const proposed_quality = BigNumber(we_spend.value) / BigNumber(we_want.value)

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
  // Note: These estimates can be thrown off by rounding if the token issuer
  // uses a TickSize setting other than the default (15). In that case, you
  // can increase the TakerGets amount of your final Offer to compensate.

  const offers = orderbook_resp.result.offers
  const want_amt = BigNumber(we_want.value)
  let running_total = BigNumber(0)
  if (!offers) {
    console.log(`No Offers in the matching book.
                 Offer probably won't execute immediately.`)
  } else {
    for (const o of offers) {
      if (o.quality <= proposed_quality) {
        console.log(`Matching Offer found, funded with ${o.owner_funds}
            ${we_want.currency}`)
        running_total = running_total.plus(BigNumber(o.owner_funds))
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
    console.log(`Total matched:
          ${Math.min(running_total, want_amt)} ${we_want.currency}`)
    if (running_total > 0 && running_total < want_amt) {
      console.log(`Remaining ${want_amt - running_total} ${we_want.currency}
            would probably be placed on top of the order book.`)
    }
  }

  if (running_total == 0) {
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
    const offered_quality = BigNumber(we_want.value) / BigNumber(we_spend.value)

    const offers2 = orderbook2_resp.result.offers
    let tally_currency = we_spend.currency
    if (tally_currency == "XRP") { tally_currency = "drops of XRP" }
    let running_total2 = 0
    if (!offers2) {
      console.log(`No similar Offers in the book. Ours would be the first.`)
    } else {
      for (const o of offers2) {
        if (o.quality <= offered_quality) {
          console.log(`Existing offer found, funded with
                ${o.owner_funds} ${tally_currency}`)
          running_total2 = running_total2.plus(BigNumber(o.owner_funds))
        } else {
          console.log(`Remaining orders are below where ours would be placed.`)
          break
        }
      }
      console.log(`Our Offer would be placed below at least
            ${running_total2} ${tally_currency}`)
      if (running_total > 0 && running_total < want_amt) {
        console.log(`Remaining ${want_amt - running_total} ${tally_currency}
              will probably be placed on top of the order book.`)
      }
    }
  }

  // Send OfferCreate transaction ----------------------------------------------

  // For this tutorial, we already know that TST is pegged to
  // XRP at a rate of approximately 10:1 plus spread, so we use
  // hard-coded TakerGets and TakerPays amounts.

  const offer_1 = {
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerPays": we_want,
    "TakerGets": we_spend.value // since it's XRP
  }

  const prepared = await client.autofill(offer_1)
  console.log("Prepared transaction:", JSON.stringify(prepared, null, 2))
  const signed = wallet.sign(prepared)
  console.log("Sending OfferCreate transaction...")
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded:
          https://testnet.xrpl.org/transactions/${signed.hash}`)
  } else {
    throw `Error sending transaction: ${result}`
  }

  // Check metadata ------------------------------------------------------------
  // In JavaScript, you can use getBalanceChanges() to help summarize all the
  // balance changes caused by a transaction.
  const balance_changes = xrpl.getBalanceChanges(result.result.meta)
  console.log("Total balance changes:", JSON.stringify(balance_changes, null,2))

  // Helper to convert an XRPL amount to a string for display
  function amt_str(amt) {
    if (typeof amt == "string") {
      return `${xrpl.dropsToXrp(amt)} XRP`
    } else {
      return `${amt.value} ${amt.currency}.${amt.issuer}`
    }
  }

  let offers_affected = 0
  for (const affnode of result.result.meta.AffectedNodes) {
    if (affnode.hasOwnProperty("ModifiedNode")) {
      if (affnode.ModifiedNode.LedgerEntryType == "Offer") {
        // Usually a ModifiedNode of type Offer indicates a previous Offer that
        // was partially consumed by this one.
        offers_affected += 1
      }
    } else if (affnode.hasOwnProperty("DeletedNode")) {
      if (affnode.DeletedNode.LedgerEntryType == "Offer") {
        // The removed Offer may have been fully consumed, or it may have been
        // found to be expired or unfunded.
        offers_affected += 1
      }
    } else if (affnode.hasOwnProperty("CreatedNode")) {
      if (affnode.CreatedNode.LedgerEntryType == "RippleState") {
        console.log("Created a trust line.")
      } else if (affnode.CreatedNode.LedgerEntryType == "Offer") {
        const offer = affnode.CreatedNode.NewFields
        console.log(`Created an Offer owned by ${offer.Account} with
          TakerGets=${amt_str(offer.TakerGets)} and
          TakerPays=${amt_str(offer.TakerPays)}.`)
      }
    }
  }
  console.log(`Modified or removed ${offers_affected} matching Offer(s)`)

  // Check balances ------------------------------------------------------------
  console.log("Getting address balances as of validated ledger...")
  const balances = await client.request({
    command: "account_lines",
    account: wallet.address,
    ledger_index: "validated"
    // You could also use ledger_index: "current" to get pending data
  })
  console.log(JSON.stringify(balances.result, null, 2))

  // Check Offers --------------------------------------------------------------
  console.log(`Getting outstanding Offers from ${wallet.address} as of validated ledger...`)
  const acct_offers = await client.request({
    command: "account_offers",
    account: wallet.address,
    ledger_index: "validated"
  })
  console.log(JSON.stringify(acct_offers.result, null, 2))

  client.disconnect()
} // End of main()

main()
