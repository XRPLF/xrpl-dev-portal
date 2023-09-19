// 1. Generate
// 2. Connect
// The code for these steps is handled by interactive-tutorial.js
$(document).ready(() => {

  // 3. Send AccountSet to Start the Freeze ------------------------------------
  // also 6. Send AccountSet to End the Freeze.
  $(".send-accountset").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}

    let astx = {
      "TransactionType": "AccountSet",
      "Account": address
    }
    let step_name
    if ($(event.target).data("action") === "start_freeze") {
      astx["SetFlag"] = xrpl.AccountSetAsfFlags.asfGlobalFreeze
      step_name = "Send AccountSet (Start Freeze)"
    } else if ($(event.target).data("action") === "end_freeze") {
      astx["ClearFlag"] = xrpl.AccountSetAsfFlags.asfGlobalFreeze
      step_name = "Send AccountSet (End Freeze)"
    } else {
      show_error(block, "There was an error with this tutorial: the button clicked must have data-action defined.")
    }

    try {
      block.find(".loader").show()
      await generic_full_send(event, astx)
      complete_step(step_name)
    } catch(err) {
      block.find(".loader").hide()
      show_error(block, err)
    }
  })

  // 4. Wait for Validation: handled by interactive-tutorial.js and by the
  // generic full send in the previous step. -----------------------------------

  // 5. Confirm Account Settings -----------------------------------------------
  $("#confirm-settings").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}

    block.find(".output-area").html("")
    block.find(".loader").show()
    const account_info = await api.request({
        "command": "account_info",
        "account": address,
        "ledger_index": "validated"
    })
    console.log(account_info)
    const flags = xrpl.parseAccountRootFlags(account_info.result.account_data.Flags)
    block.find(".loader").hide()

    block.find(".output-area").append(
        `<p>Got settings for address ${address}:</p>
        <pre><code>${pretty_print(flags)}</code></pre>`)
    if (flags.lsfGlobalFreeze) {
      block.find(".output-area").append(`<p><i class="fa fa-check-circle"></i>
          Global Freeze flag is enabled.</p>`)
    } else {
      block.find(".output-area").append(`<p><i class="fa fa-times-circle"></i>
          Global Freeze flag is DISABLED.</p>`)
    }

    complete_step("Confirm Settings")
  })

  // 6. Send AccountSet to End the Freeze: same handler as step 3.

  // 7. Wait for Validation: handled by generic full send as before.

  // 8. Confirm Account Settings (Freeze Ended)
  $("#confirm-settings-end").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}

    block.find(".output-area").html("")
    block.find(".loader").show()
    const account_info = await api.request({
        "command": "account_info",
        "account": address,
        "ledger_index": "validated"
    })
    console.log(account_info)
    const flags = xrpl.parseAccountRootFlags(account_info.result.account_data.Flags)
    block.find(".loader").hide()

    block.find(".output-area").append(
        `<p>Got settings for address ${address}:</p>
        <pre><code>${pretty_print(flags)}</code></pre>`)
    if (flags.lsfGlobalFreeze) {
      block.find(".output-area").append(`<p><i class="fa fa-times-circle"></i>
          Global Freeze is ENABLED (still active).</p>`)
    } else {
      block.find(".output-area").append(`<p><i class="fa fa-check-circle"></i>
          Global Freeze Tag is disabled.</p>`)
    }

    complete_step("Confirm Settings")
  })


})
