// Source for interactive examples in the "Trade in the Decentralized Exchange"
// tutorial.

// Get Credentials, Connect steps handled by the snippet

$(document).ready(() => {

// Look Up Offers --------------------------------------------------------------

function update_exchange_rate(event) {
  const tpa = $("#taker-pays-amount-1").val()
  const tga = $("#taker-gets-amount-1").val()
  const exchange_rate = BigNumber(tga) / BigNumber(tpa)
  $("#exchange-rate-1").val(`${exchange_rate}`)
}
$("#taker-pays-amount-1").change(update_exchange_rate)
$("#taker-gets-amount-1").change(update_exchange_rate)

$("#look-up-offers").click( async (event) => {
  const block = $(event.target).closest(".interactive-block")
  block.find(".output-area").html("")
  const address = get_address(event)
  if (!address) {return}

  const we_want = {
    "currency": $("#taker-pays-currency-1").val(),
    "issuer": $("#taker-pays-issuer-1").val(),
    "value": $("#taker-pays-amount-1").val()
  }
  const we_spend = {
    "currency": "XRP",
    "value": xrpl.xrpToDrops($("#taker-gets-amount-1").val())
  }
  const proposed_quality = BigNumber(we_spend.value) / BigNumber(we_want.value)
  let orderbook_resp
  try {
    orderbook_resp = await api.request({
      "command": "book_offers",
      "taker": address,
      "ledger_index": "current",
      "taker_gets": we_want,
      "taker_pays": we_spend
    })
    block.find(".output-area").append(
      `<pre><code>${pretty_print(orderbook_resp.result)}`)
  } catch(err) {
    show_error(block, err)
    block.find(".loader").hide()
    return
  }

  // Estimate whether a proposed Offer would execute immediately, and...
  // If so, how much of it? (Partial execution is possible)
  // If not, how much liquidity is above it? (How deep in the order book would
  //    other Offers have to go before ours would get taken?)
  // Note: these estimates can be thrown off by rounding if the token issuer
  // uses a TickSize setting other than the default (15). In that case, you
  // can increase the TakerGets amount of your final offer just a little bit to
  // compensate.

  const offers = orderbook_resp.result.offers
  const want_amt = BigNumber(we_want.value)
  let running_total = BigNumber(0)
  if (!offers) {
    block.find(".output-area").append(`<p>No Offers in the matching book.
                 Offer probably won't execute immediately.</p>`)
  } else {
    for (const o of offers) {
      if (o.quality <= proposed_quality) {
        block.find(".output-area").append(
            `<p>Matching Offer found, funded with
            ${o.owner_funds} ${we_want.currency}</p>`)
        running_total = running_total.plus(BigNumber(o.owner_funds))
        if (running_total >= want_amt) {
          block.find(".output-area").append("<p>Full Offer will probably fill.</p>")
          break
        }
      } else {
        // Offers are in ascending quality order, so no others after this
        // will match, either
        block.find(".output-area").append(`<p>Remaining orders too expensive.</p>`)
        break
      }
    }
    block.find(".output-area").append(`<p>Total matched:
          ${Math.min(running_total, want_amt)} ${we_want.currency}</p>`)
    if (running_total > 0 && running_total < want_amt) {
      block.find(".output-area").append(`<p>Remaining
            ${want_amt - running_total} ${we_want.currency} would probably be
            placed on top of the order book.</p>`)
    }
  }

  if (running_total == 0) {
    // If the Offer would be partly filled, then the rest would be placed
    // at the top of the order book. If no part is filled, then there might be
    // other Offers going the same direction as ours already on the books with
    // an equal or better rate. This code counts how much liquidity is likely to
    // be above ours.

    // Unlike above, this looks for Offers going the same direction as the
    // proposed Offer, so TakerGets and TakerPays are reversed from the previous
    // book_offers request.
    let orderbook2_resp
    try {
      orderbook2_resp = await api.request({
        "command": "book_offers",
        "taker": address,
        "ledger_index": "current",
        "taker_gets": we_spend,
        "taker_pays": we_want
      })
      block.find(".output-area").append(
        `<pre><code>${pretty_print(orderbook2_resp.result)}`)
    } catch(err) {
      show_error(block, err)
      block.find(".loader").hide()
      return
    }

    // Since TakerGets/TakerPays are reversed, the quality is the inverse.
    // You could also calculate this as 1/proposed_quality.
    const offered_quality = BigNumber(we_want.value) / BigNumber(we_spend.value)

    const offers2 = orderbook2_resp.result.offers
    let tally_currency = we_spend.currency
    if (tally_currency == "XRP") { tally_currency = "drops of XRP" }
    let running_total2 = BigNumber(0)
    if (!offers2) {
      block.find(".output-area").append(`<p>No similar Offers in the book.
          Ours would be the first.</p>`)
    } else {
      for (const o of offers2) {
        if (o.quality <= offered_quality) {
          block.find(".output-area").append(`<p>Existing offer found, funded
                with ${o.owner_funds} ${tally_currency}</p>`)
          running_total2 = running_total2.plus(BigNumber(o.owner_funds))
        } else {
          block.find(".output-area").append(`<p>Remaining orders are below where
                ours would be placed.</p>`)
          break
        }
      }
      block.find(".output-area").append(`<p>Our Offer would be placed below at
            least ${running_total2} ${tally_currency}</p>`)
      if (running_total > 0 && running_total < want_amt) {
        block.find(".output-area").append(`<p>Remaining
              ${want_amt - running_total} ${tally_currency} will probably be
              placed on top of the order book.</p>`)
      }
    }
  }

  block.find(".loader").hide()
  complete_step("Look Up Offers")
})


// Send OfferCreate Transaction ------------------------------------------------
$("#send-offercreate").click( async (event) => {
  const block = $(event.target).closest(".interactive-block")
  const address = get_address(event)
  if (!address) {return}
  block.find(".output-area").html("")

  const we_want = {
    "currency": $("#taker-pays-currency-1").val(),
    "issuer": $("#taker-pays-issuer-1").val(),
    "value": $("#taker-pays-amount-1").val()
  }
  const we_spend = {
    "currency": "XRP",
    "value": xrpl.xrpToDrops($("#taker-gets-amount-1").val())
  }

  const tx = {
    "TransactionType": "OfferCreate",
    "Account": address,
    "TakerPays": {
      "currency": $("#taker-pays-currency-1").val(),
      "issuer": $("#taker-pays-issuer-1").val(),
      "value": $("#taker-pays-amount-1").val()
    },
    "TakerGets": we_spend.value // since it's XRP
  }

  try {
    await generic_full_send(event, tx)
    complete_step("Send OfferCreate")
  } catch(err) {
    block.find(".loader").hide()
    show_error(block, err)
  }
})

// Wait for Validation: handled by interactive-tutorial.js and by the
// generic full send in the previous step. -------------------------------------

// Check Metadata --------------------------------------------------------------
$("#check-metadata").click(async (event) => {
  const block = $(event.target).closest(".interactive-block")
  block.find(".loader").show()
  block.find(".output-area").html("")

  const txid = $(`#interactive-wait`).find(".waiting-for-tx").text().trim()
  let result
  try {
    result = await api.request({"method": "tx", "transaction": txid})
  } catch(err) {
    show_err(err)
    block.find(".loader").hide()
    return
  }
  const balance_changes = xrpl.getBalanceChanges(result.result.meta)
  block.find(".output-area").append(`<p>Total balance changes:</p>
    <pre><code>${pretty_print(balance_changes)}</code></pre>`)

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
        block.find(".output-area").append("<p>Created a trust line.</p>")
      } else if (affnode.CreatedNode.LedgerEntryType == "Offer") {
        const offer = affnode.CreatedNode.NewFields
        block.find(".output-area").append(`<p>Created an Offer owned by ${offer.Account} with
          TakerGets=${amt_str(offer.TakerGets)} and
          TakerPays=${amt_str(offer.TakerPays)}.</p>`)
      }
    }
  }
  block.find(".output-area").append(`<p>Modified or removed ${offers_affected} matching Offer(s).</p>`)
  block.find(".loader").hide()
  complete_step("Check Metadata")
})

// Check Balances and Offers
$("#check-balances-and-offers").click( async (event) => {
  const block = $(event.target).closest(".interactive-block")
  const address = get_address(event)
  if (!address) {return}

  block.find(".loader").show()
  try {
    block.find(".output-area").append("<p>Getting address balances as of validated ledger...</p>")
    const balances = await api.request({
      command: "account_lines",
      account: address,
      ledger_index: "validated"
      // You could also use ledger_index: "current" to get pending data
    })
    block.find(".output-area").append(`<pre><code>${pretty_print(balances.result)}</code></pre>`)

    block.find(".output-area").append(`<p>Getting outstanding Offers from ${address} as of validated ledger...</p>`)
    const acct_offers = await api.request({
      command: "account_offers",
      account: address,
      ledger_index: "validated"
    })
    block.find(".output-area").append(`<pre><code>${pretty_print(acct_offers.result)}</code></pre>`)
    block.find(".loader").hide()
  } catch(err) {
    show_error(block, err)
    block.find(".loader").hide()
  }
})

}) // end of $(document).ready()
