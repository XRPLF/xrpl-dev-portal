// 1. Generate
// 2. Connect
// The code for these steps is handled by interactive-tutorial.js
$(document).ready(() => {

  // 3. Send AccountSet --------------------------------------------------------
  $("#send-accountset").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}

    try {
      await generic_full_send(event, {
        "TransactionType": "AccountSet",
        "Account": address,
        "SetFlag": xrpl.AccountSetAsfFlags.asfNoFreeze
      })
      complete_step("Send AccountSet")
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
    if (flags.lsfNoFreeze) {
      block.find(".output-area").append(`<p><i class="fa fa-check-circle"></i>
          No Freeze flag is enabled.</p>`)
    } else {
      block.find(".output-area").append(`<p><i class="fa fa-times-circle"></i>
          No Freeze flag is DISABLED.</p>`)
    }

    complete_step("Confirm Settings")
  })

})
