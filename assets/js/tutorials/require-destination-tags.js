// 1. Generate
// 2. Connect
// The code for these steps is handled by interactive-tutorial.js
$(document).ready(() => {

  // 3. Send AccountSet --------------------------------------------------------
  $("#send-accountset").click( (event) => {
    const address = get_address(event)
    if (!address) {return}

    generic_full_send(event, {
      "TransactionType": "AccountSet",
      "Account": address,
      "SetFlag": 1 // RequireDest
    })
    complete_step("Send AccountSet")
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
    let account_info = await api.request("account_info", {
        "account": address,
        "ledger_index": "validated"
    })
    console.log(account_info)
    const flags = api.parseAccountFlags(account_info.account_data.Flags)
    block.find(".loader").hide()

    block.find(".output-area").append(
        `<pre><code>${pretty_print(flags)}</code></pre>`)
    if (flags.requireDestinationTag) {
      block.find(".output-area").append(`<p><i class="fa fa-check-circle"></i>
          Require Destination Tag is enabled.</p>`)
    } else {
      block.find(".output-area").append(`<p><i class="fa fa-times-circle"></i>
          Require Destination Tag is DISABLED.</p>`)
    }

    complete_step("Confirm Settings")
  })

  // Send Test Payments --------------------------------------------------------

  // Helper to get an address to send the test payments from. Save the values
  // from the faucet in data attributes on the block so we don't have to get a
  // new sending address every time.
  async function get_test_sender(block) {
    let address = block.data("testSendAddress")
    let secret = block.data("testSendSecret")
    if (!address || !secret) {
      console.debug("First-time setup for test sender...")
      const faucet_url = $("#generate-creds-button").data("fauceturl")
      const data = await call_faucet(faucet_url)
      address = data.account.classicAddress
      block.data("testSendAddress", address)
      secret = data.account.secret
      block.data("testSendSecret", secret)
      // First time: Wait for our test sender to be fully funded, so we don't
      // get the wrong starting sequence number.
      while (true) {
        try {
          await api.request("account_info", {account: address, ledger_index: "validated"})
          break
        } catch(e) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }
    return {address, secret}
  }

  // Actual handler for the two buttons in the Send Test Payments block.
  // Gets the destination tag (or lack thereof) from their data attributes.
  $(".test-payment").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    const address = get_address(event)
    if (!address) {return}

    block.find(".loader").show()
    try {
      const test_sender = await get_test_sender(block)
      const tx_json = {
        "TransactionType": "Payment",
        "Account": test_sender.address,
        "Amount": "3152021",
        "Destination": address
      }
      const dt = $(event.target).data("dt")
      if (dt) {
        tx_json["DestinationTag"] = parseInt(dt)
      }

      const prepared = await api.prepareTransaction(tx_json)
      const signed = api.sign(prepared.txJSON, test_sender.secret)
      console.debug("Submitting test payment", prepared.txJSON)
      const prelim_result = await api.request("submit",
                                          {"tx_blob": signed.signedTransaction})

      block.find(".loader").hide()
      block.find(".output-area").append(`<p>${tx_json.TransactionType}
        ${prepared.instructions.sequence} ${(dt?"WITH":"WITHOUT")} Dest. Tag:
        <a href="https://testnet.xrpl.org/transactions/${signed.id}"
        target="_blank">${prelim_result.engine_result}</a></p>`)
    } catch(err) {
      block.find(".loader").hide()
      show_error(block, `An error occurred when sending the test payment: ${err}`)
    }


    // SCRAPPED ALT CODE: using the Faucet as a test sender.
    // // We can use the Faucet to send a payment to our existing address with a
    // // destination tag, but only if we roll it into an X-address.
    // const faucet_url = $("#generate-creds-button").data("fauceturl")
	  // const XCodec = require('xrpl-tagged-address-codec')
    // const dt = $(event.target).data("dt")
    // let dest_x_address
    // if (dt) {
    //   dest_x_address = XCodec.Encode({ account: address, tag: dt, test: true })
    // } else {
    //   dest_x_address = XCodec.Encode({ account: address, test: true })
    // }
    // call_faucet(faucet_url, dest_x_address)
    //
    // // TODO: monitor our target address and report when we receive the tx from
    // // the faucet. (including ✅ or ❌ as appropriate)
  })

})
