// 1. Generate -----------------------------------------------------------------
// The code for this step is provided by the "generate-step.md" snippet

$(document).ready(() => {
// 2. Connect ------------------------------------------------------------------
                          // TODO: switch to Testnet when Tickets enabled there
api = new ripple.RippleAPI({server: 'wss://s.devnet.rippletest.net:51233'})
api.on('connected', async function() {
  $("#connection-status").text("Connected")
  $("#connect-button").prop("disabled", true)
  $("#loader-connect").hide()

  // Update breadcrumbs & activate next step
  complete_step("Connect")
  $("#check-sequence").prop("disabled", false)
  $("#check-sequence").prop("title", "")
})
api.on('disconnected', (code) => {
  $("#connection-status").text( "Disconnected ("+code+")" )
  $("#connect-button").prop("disabled", false)
  $(".connection-required").prop("disabled", true)
  $(".connection-required").prop("title", "Connection to Devnet required")
})
$("#connect-button").click(() => {
  $("#connection-status").text( "Connecting..." )
  $("#loader-connect").show()
  api.connect()
})

// 3. Check Sequence Number
$("#check-sequence").click( async function() {
  const address = $("#use-address").text()

  if (!address) {
    $("#check-sequence-output").html(
      `<p class="devportal-callout warning"><strong>Error:</strong>
      No address. Make sure you <a href="#1-get-credentials">Get Credentials</a> first.</p>`)
    return;
  }

  // Wipe previous output
  $("#check-sequence-output").html("")
  const account_info = await api.request("account_info", {"account": address})

  $("#check-sequence-output").append(
    `<p>Current sequence:
    <code id="current_sequence">${account_info.account_data.Sequence}</code>
    </p>`)


  // Update breadcrumbs & activate next step
  complete_step("Check Sequence")
  $("#prepare-and-sign").prop("disabled", false)
  $("#prepare-and-sign").prop("title", "")
})

// 4. Prepare and Sign TicketCreate --------------------------------------------
$("#prepare-and-sign").click( async function() {
  const address = $("#use-address").text()
  const secret = $("#use-secret").text()
  let current_sequence;
  try {
    current_sequence = parseInt($("#current_sequence").text())
  } catch (e) {
    current_sequence = null
  }

  // Wipe previous output
  $("#prepare-and-sign-output").html("")

  if (!address || !secret || !current_sequence) {
    $("#prepare-and-sign-output").html(
      `<p class="devportal-callout warning"><strong>Error:</strong>
      Couldn't get a valid address/secret/sequence value. Check that the
      previous steps were completed successfully.</p>`)
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

  $("#prepare-and-sign-output").append(
    `<p>Prepared transaction:</p>
    <pre><code>${pretty_print(prepared.txJSON)}</code></pre>`)
  $("#lastledgersequence").html(
    `<code>${prepared.instructions.maxLedgerVersion}</code>`)

  let signed = api.sign(prepared.txJSON, secret)
  $("#prepare-and-sign-output").append(
    `<p>Transaction hash: <code id="tx_id">${signed.id}</code></p>`)
  $("#waiting-for-tx").text(signed.id)

  // Reset the "Wait" step to prevent mixups
  $("#earliest-ledger-version").text("(Not submitted)")
  $("#tx-validation-status").html("<th>Final Result:</th><td></td>")

  let tx_blob = signed.signedTransaction
  $("#prepare-and-sign-output").append(
    `<pre style="visibility: none"><code id="tx_blob">${tx_blob}</code></pre>`)

  // Update breadcrumbs & activate next step
  complete_step("Prepare & Sign")
  $("#ticketcreate-submit").prop("disabled", false)
  $("#ticketcreate-submit").prop("title", "")

})

// 5. Submit TicketCreate ------------------------------------------------------
$("#ticketcreate-submit").click( async function() {
  const tx_blob = $("#tx_blob").text()
  // Wipe previous output
  $("#ticketcreate-submit-output").html("")

  waiting_for_tx = $("#tx_id").text() // next step uses this
  let prelim_result = await api.request("submit", {"tx_blob": tx_blob})
  $("#ticketcreate-submit-output").append(
    `<p>Preliminary result:</p>
    <pre><code>${pretty_print(prelim_result)}</code></pre>`)

  if ( $("#earliest-ledger-version").text() == "(Not submitted)" ) {
    // This is the first time we've submitted this transaction, so set the
    // minimum ledger index for this transaction. Don't overwrite this if this
    // isn't the first time the transaction has been submitted!
    $("#earliest-ledger-version").text(prelim_result.validated_ledger_index)
  }

  // Update breadcrumbs
  complete_step("Submit")
})


// 6. Wait for Validation
let waiting_for_tx = null;
api.on('ledger', async (ledger) => {
  $("#current-ledger-version").text(ledger.ledgerVersion)

  let tx_result;
  let min_ledger = parseInt($("#earliest-ledger-version").text())
  let max_ledger = parseInt($("#lastledgersequence").text())
  if (min_ledger > max_ledger) {
    console.warn("min_ledger > max_ledger")
    min_ledger = 1
  }
  if (waiting_for_tx) {
    try {
      tx_result = await api.request("tx", {
          "transaction": waiting_for_tx,
          "min_ledger": min_ledger,
          "max_ledger": max_ledger
      })
      if (tx_result.validated) {
        $("#tx-validation-status").html(
          `<th>Final Result:</th><td>${tx_result.meta.TransactionResult}
          (<a href="https://devnet.xrpl.org/transactions/${waiting_for_tx}"
          target="_blank">Validated</a>)</td>`)
        waiting_for_tx = null;

        if ( $(".breadcrumb-item.bc-wait").hasClass("active") ) {
          complete_step("Wait")
          $("#check-tickets").prop("disabled", false)
          $("#check-tickets").prop("title", "")
          $("#intermission-payment").prop("disabled", false)
          $("#intermission-payment").prop("title", "")
          $("#intermission-escrowcreate").prop("disabled", false)
          $("#intermission-escrowcreate").prop("title", "")
          $("#intermission-accountset").prop("disabled", false)
          $("#intermission-accountset").prop("title", "")
        }
      }
    } catch(e) {
      if (e.data.error == "txnNotFound" && e.data.searched_all) {
        $("#tx-validation-status").html(
          `<th>Final Result:</th><td>Failed to achieve consensus (final)</td>`)
        waiting_for_tx = null;
      } else {
        $("#tx-validation-status").html(
          `<th>Final Result:</th><td>Unknown</td>`)
      }
    }
  }

})

// Intermission ----------------------------------------------------------------
async function intermission_submit(tx_json) {
  const secret = $("#use-secret").text()
  let prepared = await api.prepareTransaction(tx_json)
  let signed = api.sign(prepared.txJSON, secret)
  let prelim_result = await api.request("submit",
                                        {"tx_blob": signed.signedTransaction})

  $("#intermission-output").append(`<p>${tx_json.TransactionType}
    ${prepared.instructions.sequence}:
    <a href="https://devnet.xrpl.org/transactions/${signed.id}"
    target="_blank">${prelim_result.engine_result}</a></p>`)
}

$("#intermission-payment").click( async function() {
  const address = $("#use-address").text()

  intermission_submit({
    "TransactionType": "Payment",
    "Account": address,
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", // TestNet Faucet
    "Amount": api.xrpToDrops("201")
  })

  // Update breadcrumbs; though, this step is optional,
  // so the previous step already enabled the step after this.
  complete_step("Intermission")
})

$("#intermission-escrowcreate").click( async function() {
  const address = $("#use-address").text()

  intermission_submit({
    "TransactionType": "EscrowCreate",
    "Account": address,
    "Destination": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", // Genesis acct
    "Amount": api.xrpToDrops("0.13"), // Arbitrary amount
    "FinishAfter": api.iso8601ToRippleTime(Date()) + 30 // 30 seconds from now
  })

  // Update breadcrumbs; though this step is optional,
  // so the previous step already enabled the step after this.
  complete_step("Intermission")
})

$("#intermission-accountset").click( async function() {
  const address = $("#use-address").text()

  intermission_submit({
    "TransactionType": "AccountSet",
    "Account": address
  })

  // Update breadcrumbs; though this step is optional,
  // so the previous step already enabled the step after this.
  complete_step("Intermission")
})

// 7. Check Available Tickets --------------------------------------------------
$("#check-tickets").click( async function() {
  const address = $("#use-address").text()
  // Wipe previous output
  $("#check-tickets-output").html("")

  let response = await api.request("account_objects", {
      "account": address,
      "type": "ticket"
    })
  $("#check-tickets-output").html(
    `<pre><code>${pretty_print(response)}</code></pre>`)

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


  // Update breadcrumbs & activate next step
  complete_step("Check Tickets")
  $("#prepare-ticketed-tx").prop("disabled", false)
  $("#prepare-ticketed-tx").prop("title", "")
})

// 8. Prepare Ticketed Transaction ---------------------------------------------
$("#prepare-ticketed-tx").click(async function() {
  const use_ticket = parseInt($('input[name="ticket-radio-set"]:checked').val())
  if (!use_ticket) {
    $("#prepare-ticketed-tx-output").append(
      `<p class="devportal-callout warning"><strong>Error</strong>
      You must choose a ticket first.</p>`)
    return
  }

  const address = $("#use-address").text()
  const secret = $("#use-secret").text()

  let prepared_t = await api.prepareTransaction({
    "TransactionType": "AccountSet",
    "Account": address,
    "TicketSequence": use_ticket,
    "Sequence": 0
  }, {
    maxLedgerVersionOffset: 20
  })
  $("#prepare-ticketed-tx-output").html("")

  $("#prepare-ticketed-tx-output").append(
    `<p>Prepared transaction:</p>
    <pre><code>${pretty_print(prepared_t.txJSON)}</code></pre>`)
  $("#lastledgersequence_t").html( //REMEMBER
    `<code>${prepared_t.instructions.maxLedgerVersion}</code>`)

  let signed_t = api.sign(prepared_t.txJSON, secret)
  $("#prepare-ticketed-tx-output").append(
    `<p>Transaction hash: <code id="tx_id_t">${signed_t.id}</code></p>`)

  let tx_blob_t = signed_t.signedTransaction
  $("#prepare-ticketed-tx-output").append(
    `<pre style="visibility: none">
    <code id="tx_blob_t">${tx_blob_t}</code></pre>`)

  // Update breadcrumbs & activate next step
  complete_step("Prepare Ticketed Tx")
  $("#ticketedtx-submit").prop("disabled", false)
  $("#ticketedtx-submit").prop("title", "")
})

// 9. Submit Ticketed Transaction ----------------------------------------------
$("#ticketedtx-submit").click( async function() {
  const tx_blob = $("#tx_blob_t").text()
  // Wipe previous output
  $("#ticketedtx-submit-output").html("")

  waiting_for_tx_t = $("#tx_id_t").text() // next step uses this
  let prelim_result = await api.request("submit", {"tx_blob": tx_blob})
  $("#ticketedtx-submit-output").append(
    `<p>Preliminary result:</p>
    <pre><code>${pretty_print(prelim_result)}</code></pre>`)
  $("#earliest-ledger-version_t").text(prelim_result.validated_ledger_index)

  // Update breadcrumbs
  complete_step("Submit Ticketed Tx")
})

// 10. Wait for Validation (again) ---------------------------------------------
let waiting_for_tx_t = null;
api.on('ledger', async (ledger) => {
  $("#current-ledger-version_t").text(ledger.ledgerVersion)

  let tx_result;
  if (waiting_for_tx_t) {
    try {
      tx_result = await api.request("tx", {
          "transaction": waiting_for_tx_t,
          "min_ledger": parseInt($("#earliest-ledger-version_t").text()),
          "max_ledger": parseInt($("#lastledgersequence_t").text())
      })
      console.log(tx_result)
      if (tx_result.validated) {
        $("#tx-validation-status_t").html(
          `<th>Final Result:</th><td>${tx_result.meta.TransactionResult}
          (<a href="https://devnet.xrpl.org/transactions/${waiting_for_tx_t}"
          target="_blank">Validated</a>)</td>`)
        waiting_for_tx_t = null;

        if ( $(".breadcrumb-item.bc-wait_again").hasClass("active") ) {
          complete_step("Wait Again")
        }
      }
    } catch(e) {
      if (e.data.error == "txnNotFound" && e.data.searched_all) {
        $("#tx-validation-status_t").html(
          `<th>Final Result:</th><td>Failed to achieve consensus (final)</td>`)
        waiting_for_tx_t = null;
      } else {
        $("#tx-validation-status_t").html(
          `<th>Final Result:</th><td>Unknown</td>`)
      }
    }
  }
})
})
