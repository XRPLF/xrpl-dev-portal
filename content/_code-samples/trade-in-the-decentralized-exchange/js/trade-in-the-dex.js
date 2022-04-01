// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html

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
  //const wallet = xrpl.Wallet.fromSeed("SEED VALUE HERE") // temp for testing: don't fund every time

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
    for (const o of offers) {
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
      for (const o of offers2) {
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

  // Interpret metadata --------------------------------------------------------
  for (const affnode of result.result.meta.AffectedNodes) {
    if (affnode.hasOwnProperty("ModifiedNode")) {
      const mn = affnode.ModifiedNode
      if (mn.LedgerEntryType == "AccountRoot") {
        if (mn.FinalFields.Account == wallet.address) {
          // Found our account in the metadata
          const final_xrp_bal = mn.FinalFields.Balance
          const prev_xrp_bal = mn.PreviousFields.Balance
          if (prev_xrp_bal === undefined) {
            console.log(`Total XRP balance unchanged. This usually means the
              transaction acquired exactly enough XRP to offset the XRP burned
              as a transaction cost. Balance = ${xrpl.dropsToXrp(final_xrp_bal)} XRP`)
          } else {
            const diff_drops = BigNumber(final_xrp_bal) - BigNumber(prev_xrp_bal)
            console.log(`Changed XRP balance by ${xrpl.dropsToXrp(diff_drops)}
              to a new value of ${xrpl.dropsToXrp(final_xrp_bal)} XRP. (This
              includes the net effect of burning XRP as a transaction cost.)`)
          }
        }
      } else if (mn.LedgerEntryType == "RippleState") {
        if (mn.FinalFields.HighLimit.issuer == wallet.address ||
            mn.FinalFields.LowLimit.issuer == wallet.address) {
          // Modified a trust line we already had
          const we_are_low = (mn.FinalFields.LowLimit.issuer == wallet.address)
          const currency = mn.FinalFields.Balance.currency
          let counterparty
          if (we_are_low) {
            counterparty = mn.FinalFields.HighLimit.issuer
          } else {
            counterparty = mn.FinalFields.LowLimit.issuer
          }
          const final_token_bal = mn.FinalFields.Balance.value
          const prev_token_bal = mn.PreviousFields.Balance.value
          if (prev_token_bal === undefined) {
            console.log(`Balance of ${currency}.${counterparty} unchanged.`)
          } else {
            let final_bal = BigNumber(final_token_bal)
            let diff_tokens = final_bal - BigNumber(prev_token_bal)
            if (!we_are_low) {
              // RippleState objects store the balance from the low account's
              // perspective, so if we are the high account, we negate it to get
              // the balance from our perspective instead.
              final_bal = -final_bal
              diff_tokens = -diff_tokens
            }
            console.log(`Balance of ${currency}.${counterparty} changed by
              ${diff_tokens} to a final value of ${final_bal}.`)
          }
        }
      }
    } else if (affnode.hasOwnProperty("CreatedNode")) {
      const cn = affnode.CreatedNode
      if (cn.LedgerEntryType == "Offer") {
        console.log(`Created Offer with TakerPays=${cn.NewFields.TakerPays}
          and TakerGets=${cn.NewFields.TakerGets}.`)
      } else if (cn.LedgerEntryType == "RippleState") {
        if (cn.NewFields.HighLimit.issuer == wallet.address ||
            cn.NewFields.LowLimit.issuer == wallet.address) {
          const we_are_low = (cn.NewFields.LowLimit.issuer == wallet.address)
          let balance = cn.NewFields.Balance.value
          if (!we_are_low) {
            balance = -balance
          }
          console.log(`Created ${cn.NewFields.Balance.currency} trust line
            between ${cn.NewFields.LowLimit.issuer} and
            ${cn.NewFields.HighLimit.issuer} with starting balance
            ${balance}.`)
        }
      }
    }
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
