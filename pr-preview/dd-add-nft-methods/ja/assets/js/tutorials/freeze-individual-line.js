// 1. Generate
// 2. Connect
// The code for these steps is handled by interactive-tutorial.js
const CURRENCY_TO_FREEZE = "FOO"

// Helper to get a Wallet instance for the peer wallet
function get_peer_wallet(event) {
  let peer_seed
  try {
    peer_seed = $("#peer-seed").val()
  } catch(e) {
    show_error(block, err)
    return
  }
  if (!peer_seed) {
    const block = $(event.target).closest(".interactive-block")
    if (!block.length) {return}
    show_error(block, "Couldn't get information on the peer account. Check that the previous steps were completed successfully.")
    return
  }
  return xrpl.Wallet.fromSeed(peer_seed)
}

let trust_line_setup_done = false
window.after_connect = window.after_connect || [];
window.after_connect.push(async () => {
  // 2.5. One-time setup on connect to create an incoming trust line after
  // the "api" instance has been created by the connect handler.
  if (trust_line_setup_done) {return} // Don't repeat if we disconnect/reconnect
  console.log("Setting up an incoming trust line so our test address has something to freeze...")
  $("#trust-line-setup-loader").show()
  const address = get_address()
  const peer = (await api.fundWallet()).wallet
  const tx_json = {
    "TransactionType": "TrustSet",
    "Account": peer.address,
    "LimitAmount": {
      "currency": CURRENCY_TO_FREEZE,
      "issuer": address,
      "value": "123456.789" // arbitrary limit
    }
  }
  try {
    const submitted = await api.submitAndWait(tx_json, {wallet: peer})
    console.log("Set up incoming trust line result:", submitted)
  } catch(e) {
    const block = $("#trust-line-setup-loader").closest(".interactive-block")
    show_err(block, e)
    $("#trust-line-setup-loader").hide()
    return
  }
  $("#trust-line-setup-loader").hide()
  $("#look-up-trust-lines").prop("disabled", false).prop("title", "")
  $("#peer-seed").val(peer.seed)
  trust_line_setup_done = true
})

$(document).ready(() => {



  // 3. Choose Trust Line ------------------------------------------------------
  $("#look-up-trust-lines").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").html("")
    const address = get_address(event)
    if (!address) {return}
    const peer = get_peer_wallet(event)
    if (!peer) {return}

    block.find(".loader-looking").show()
    let account_lines
    try {
      account_lines = await api.request({
        "command": "account_lines",
        "account": address,
        "peer": peer.address,
        "ledger_index": "validated"
      })
    } catch(err) {
      show_error(block, err)
    }

    block.find(".loader-looking").hide()
    block.find(".output-area").append(
      `<p>Found trust line(s) between ${address} and ${peer.address}:</p>
      <pre><code>${pretty_print(account_lines.result.lines)}</code></pre>
      <p>Choosing ${CURRENCY_TO_FREEZE} trust line.</p>`)
    complete_step("Choose Trust Line")
  })

  // 4. Send TrustSet to Freeze ------------------------------------------------
  // also 7. Send TrustSet to End the Freeze
  $(".send-trustset").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}
    const peer = get_peer_wallet(event)
    if (!peer) {return}

    let tstx = {
      "TransactionType": "TrustSet",
      "Account": address,
      "LimitAmount": {
        "currency": CURRENCY_TO_FREEZE,
        "issuer": peer.address,
        "value": "0"
      }
    }

    let step_name
    if ($(event.target).data("action") === "start_freeze") {
      tstx["Flags"] = xrpl.TrustSetFlags.tfSetFreeze
      step_name = "Send TrustSet to Freeze"
    } else if ($(event.target).data("action") === "end_freeze") {
      tstx["Flags"] = xrpl.TrustSetFlags.tfClearFreeze
      step_name = "Send TrustSet to End Freeze"
    } else {
      show_error(block, "There was an error with this tutorial: the button clicked must have data-action defined.")
    }

    try {
      await generic_full_send(event, tstx)
      complete_step(step_name)
    } catch(err) {
      block.find(".loader").hide()
      show_error(block, err)
    }
  })

  // 5. Wait for Validation: handled by interactive-tutorial.js and by the
  // generic full send in the previous step. -----------------------------------

  // 6. Check Trust Line Freeze Status
  $("#confirm-settings").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}
    const peer = get_peer_wallet(event)
    if (!peer) {return}

    block.find(".output-area").html("")
    block.find(".loader").show()
    const account_lines = await api.request({
        "command": "account_lines",
        "account": address,
        "peer": peer.address,
        "ledger_index": "validated"
    })
    console.log(account_lines)
    block.find(".loader").hide()

    const trustlines = account_lines.result.lines
    for (let i = 0; i < trustlines.length; i++) {
      if(trustlines[i].currency === CURRENCY_TO_FREEZE) {
        const line = trustlines[i]
        block.find(".output-area").append(
            `<p>Status of ${CURRENCY_TO_FREEZE} line between ${address} and ${peer.address}:</p>
            <pre><code>${pretty_print(line)}</code></pre>`)
        if (line.freeze === true) {
            block.find(".output-area").append(`<p><i class="fa fa-check-circle"></i>
                Line is frozen.`)
        } else {
          block.find(".output-area").append(`<p><i class="fa fa-times-circle"></i>
              Line is NOT FROZEN.</p>`)
        }
        complete_step("Check Freeze Status")
        return
      }
    }

    show_error(block, `Couldn't find a ${CURRENCY_TO_FREEZE} line between ${address} and ${peer.address}`)
  })

  // 7. Send TrustSet to End the Freeze: same handler as step 4

})
