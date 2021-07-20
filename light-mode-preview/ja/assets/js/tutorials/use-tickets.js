// 1. Generate
// 2. Connect
// The code for these steps is handled by interactive-tutorial.js
$(document).ready(() => {

// 3. Check Sequence Number
$("#check-sequence").click( async function(event) {
  const block = $(event.target).closest(".interactive-block")
  const address = get_address(event)
  if (!address) {return}

  // Wipe previous output
  block.find(".output-area").html("")
  block.find(".loader").show()
  const account_info = await api.request("account_info", {"account": address})
  block.find(".loader").hide()

  block.find(".output-area").append(
    `<p>Current sequence:
    <code id="current_sequence">${account_info.account_data.Sequence}</code>
    </p>`)

  complete_step("Check Sequence")
})

// 4. Prepare and Sign TicketCreate --------------------------------------------
$("#prepare-and-sign").click( async function(event) {
  const block = $(event.target).closest(".interactive-block")
  const address = get_address(event)
  if (!address) {return}
  const secret = get_secret(event)
  if (!secret) {return}
  let current_sequence
  try {
    current_sequence = parseInt($("#current_sequence").text())
  } catch (e) {
    current_sequence = null
  }

  // Wipe previous output
  block.find(".output-area").html("")

  if (!current_sequence) {
    show_error(block,
      `Couldn't get a valid sequence value. Check that the
      previous steps were completed successfully.`)
    return;
  }

  let prepared = await api.prepareTransaction({
    "TransactionType": "TicketCreate",
    "Account": address,
    "TicketCount": 10,
    "Sequence": current_sequence
  }, {
    maxLedgerVersionOffset: 20
  })

  block.find(".output-area").append(
    `<p>Prepared transaction:</p>
    <pre><code>${pretty_print(prepared.txJSON)}</code></pre>`)

  let signed = api.sign(prepared.txJSON, secret)
  block.find(".output-area").append(
    `<p>Transaction hash: <code id="tx_id">${signed.id}</code></p>`)

  let tx_blob = signed.signedTransaction
  block.find(".output-area").append(
    `<p>Signed blob:</p><pre class="tx-blob"><code id="tx_blob">${tx_blob}</code></pre>`)

  complete_step("Prepare & Sign")

})

// 5. Submit TicketCreate ------------------------------------------------------
$("#ticketcreate-submit").click( submit_handler )

// 6. Wait for Validation: handled by interactive-tutorial.js and by the
// generic submit handler in the previous step. --------------------------------

// Intermission ----------------------------------------------------------------
async function intermission_submit(event, tx_json) {
  const secret = get_secret(event)
  if (!secret) {return}
  const block = $(event.target).closest(".interactive-block")
  let prepared = await api.prepareTransaction(tx_json)
  let signed = api.sign(prepared.txJSON, secret)
  let prelim_result = await api.request("submit",
                                        {"tx_blob": signed.signedTransaction})

  block.find(".output-area").append(`<p>${tx_json.TransactionType}
    ${prepared.instructions.sequence}:
    <a href="https://devnet.xrpl.org/transactions/${signed.id}"
    target="_blank">${prelim_result.engine_result}</a></p>`)
}

$("#intermission-payment").click( async function(event) {
  const address = get_address(event)
  if (!address) {return}

  intermission_submit(event, {
    "TransactionType": "Payment",
    "Account": address,
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", // Testnet Faucet
    "Amount": api.xrpToDrops("201")
  })

  complete_step("Intermission")
})

$("#intermission-escrowcreate").click( async function(event) {
  const address = get_address(event)
  if (!address) {return}

  intermission_submit(event, {
    "TransactionType": "EscrowCreate",
    "Account": address,
    "Destination": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", // Genesis acct
    "Amount": api.xrpToDrops("0.13"), // Arbitrary amount
    "FinishAfter": api.iso8601ToRippleTime(Date()) + 30 // 30 seconds from now
  })

  complete_step("Intermission")
})

$("#intermission-accountset").click( async function(event) {
  const address = get_address(event)
  if (!address) {return}

  intermission_submit(event, {
    "TransactionType": "AccountSet",
    "Account": address
  })

  complete_step("Intermission")
})

// 7. Check Available Tickets --------------------------------------------------
$("#check-tickets").click( async function(event) {
  const block = $(event.target).closest(".interactive-block")
  const address = get_address(event)
  if (!address) {return}
  // Wipe previous output
  block.find(".output-area").html("")
  block.find(".loader").show()

  let response = await api.request("account_objects", {
      "account": address,
      "type": "ticket"
    })
  block.find(".output-area").html(
    `<pre><code>${pretty_print(response)}</code></pre>`)

  block.find(".loader").hide()

  // Reset the next step's form & add these tickets
  $("#ticket-selector .form-area").html("")
  response.account_objects.forEach((ticket, i) => {
      $("#ticket-selector .form-area").append(
        `<div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" id="ticket${i}"
        name="ticket-radio-set" value="${ticket.TicketSequence}">
        <label class="form-check-label"
        for="ticket${i}">${ticket.TicketSequence}</label></div>`)
    })

  complete_step("Check Tickets")
})

// 8. Prepare Ticketed Transaction ---------------------------------------------
$("#prepare-ticketed-tx").click(async function(event) {
  const address = get_address(event)
  if (!address) {return}
  const secret = get_secret(event)
  if (!secret) {return}

  const block = $(event.target).closest(".interactive-block")
  block.find(".output-area").html("")
  const use_ticket = parseInt($('input[name="ticket-radio-set"]:checked').val())
  if (!use_ticket) {
    show_error(block, "You must choose a ticket first.")
    return
  }

  let prepared_t = await api.prepareTransaction({
    "TransactionType": "AccountSet",
    "Account": address,
    "TicketSequence": use_ticket,
    "Sequence": 0
  }, {
    maxLedgerVersionOffset: 20
  })

  block.find(".output-area").append(
    `<p>Prepared transaction:</p>
    <pre><code>${pretty_print(prepared_t.txJSON)}</code></pre>`)

  let signed_t = api.sign(prepared_t.txJSON, secret)
  block.find(".output-area").append(
    `<p>Transaction hash: <code id="tx_id_t">${signed_t.id}</code></p>`)

  let tx_blob_t = signed_t.signedTransaction
  block.find(".output-area").append(
    `<pre style="visibility: none">
    <code id="tx_blob_t">${tx_blob_t}</code></pre>`)

  // Update breadcrumbs & activate next step
  complete_step("Prepare Ticketed Tx")
})

// 9. Submit Ticketed Transaction ----------------------------------------------
$("#ticketedtx-submit").click( submit_handler )

// 10. Wait for Validation (Again): handled by interactive-tutorial.js and by
// the generic submit handler in the previous step. --------------------------------

})
