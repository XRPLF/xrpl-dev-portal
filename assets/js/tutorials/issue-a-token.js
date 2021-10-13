// Variant setup for generate creds button from interactive-tutorial.js.
// This version generates two sets of creds, one for the issuer and one for
// the hot wallet / receiver

const EXAMPLE_COLD_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
const EXAMPLE_COLD_SECRET = "sIss█████████████████████████"
function setup_2x_generate_step() {

  $("#generate-2x-creds-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").html("")
    block.find(".loader").show()
    // Get faucet URL (Testnet/Devnet/etc.)
    const faucet_url = $("#generate-2x-creds-button").data("fauceturl")

    try {
      const data = await call_faucet(faucet_url)
      const data2 = await call_faucet(faucet_url)

      block.find(".loader").hide()
      block.find(".output-area").html(`<div class="row">
        <div class="col-xl-6 p-3">
          <div><strong>${tl("Cold Address:")}</strong>
          <span id="cold-use-address">${data.account.address}</span></div>
          <div><strong>${tl("Cold Secret:")}</strong>
          <span id="cold-use-secret">${data.account.secret}</span></div>
          <strong>${tl("XRP Balance:")}</strong>
          ${Number(data.balance).toLocaleString(current_locale)} XRP
        </div>
        <div class="col-xl-6 p-3">
          <div><strong>${tl("Hot Address:")}</strong>
          <span id="hot-use-address">${data2.account.address}</span></div>
          <div><strong>${tl("Hot Secret:")}</strong>
          <span id="hot-use-secret">${data2.account.secret}</span></div>
          <strong>${tl("XRP Balance:")}</strong>
          ${Number(data2.balance).toLocaleString(current_locale)} XRP
        </div>
      </div>`)

      // TODO: Automatically populate all examples in the page with the
      // generated credentials...
      // $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
      //   let eltext = $(this).text()
      //   $(this).text( eltext.replace(EXAMPLE_ADDR, data.account.address) )
      // })
      // $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
      //   let eltext = $(this).text()
      //   $(this).text( eltext.replace(EXAMPLE_SECRET, data.account.secret) )
      // })
      //
      // block.find(".output-area").append(`<p>${tl("Populated this page's examples with these credentials.")}</p>`)

      complete_step("Generate")

    } catch(err) {
      block.find(".loader").hide()
      block.find(".output-area").html(
        `<p class="devportal-callout warning"><strong>${tl("Error:")}</strong>
        ${tl("There was an error connecting to the Faucet. Please try again.")}
        </p>`)
      return
    }
  })
}

function get_wallet_2(event, which_one) {
  // which_one should be either "cold" or "hot" (case-sensitive)
  const secret = $(`#${which_one}-use-secret`).text()
  if (!secret) {
    const block = $(event.target).closest(".interactive-block")
    if (!block.length) {return}
    show_error(block, tl("Couldn't get a valid address/secret value. Check that the previous steps were completed successfully."))
  }
  return xrpl.Wallet.fromSeed(secret)
}

// Get the hexadecimal ASCII representation of a domain name string.
// Note: if the provided string isn't compatible with 7-bit ASCII, this won't
// work. So if you want to use an IDN, you'd need to convert to punycode first.
function domain_to_hex(s) {
  result = ""
  for (let i=0; i<s.length; i++) {
    result += s.charCodeAt(i).toString(16)
  }
  return result.toUpperCase()
}

$(document).ready(() => {
  setup_2x_generate_step()

  $("#cold-domain-text").keyup( (event) => {
    $("#cold-domain-hex").text(domain_to_hex($("#cold-domain-text").val()))
  })
  $("#hot-domain-text").keyup( (event) => {
    $("#hot-domain-hex").text(domain_to_hex($("#hot-domain-text").val()))
  })

  function update_currency_code(event) {
    let currency_code
    if ($("#use-std-code").prop("checked")) {
      const std_code = $("#currency-code-std")
      currency_code = std_code.val().trim()
      // std_code.prop("disabled", false).removeClass("disabled")
      // $("#currency-code-hex").prop("disabled", true).addClass("disabled")

    } else {
      const hex_code = $("#currency-code-hex")
      currency_code = hex_code.val().trim()
      // hex_code.prop("disabled", false).removeClass("disabled")
      // $("#currency-code-std").prop("disabled", true).addClass("disabled")
    }
    $("#send-currency-code").text(currency_code)
  }
  $("#currency-code-std").keyup(update_currency_code)
  $("#currency-code-hex").keyup(update_currency_code)
  $("#use-std-code").change(update_currency_code)
  $("#use-hex-code").change(update_currency_code)
  // run once on load because some browsers pre-fill values from previous
  // pageviews.
  update_currency_code()


  // Configure Issuer Settings handler -----------------------------------------
  $("#config-issuer-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").empty()
    const cold_wallet = get_wallet_2(event, "cold")

    let flags = 0
    if ($("#cold-require-dest").prop("checked")) {
      flags |= xrpl.AccountSetTfFlags.tfRequireDestTag
    }
    if ($("#cold-disallow-xrp").prop("checked")) {
      flags |= xrpl.AccountSetTfFlags.tfDisallowXRP
    }

    const tick_size = parseInt($("#cold-tick-size").val(), 10)
    if (Number.isNaN(tick_size) || tick_size < 0 || tick_size > 15) {
      show_error(block, "TickSize must be an integer from 0 to 15.")
      return
    }

    // Convert transfer fee % to transferrate integer (e.g. 0.5% fee = 1005000000)
    const transfer_fee = parseFloat($("#cold-transfer-fee").val())
    let transfer_rate = (transfer_fee * 10000000) + 1000000000
    if (transfer_rate == 1000000000) {
      transfer_rate = 0
    }

    const domain = $("#cold-domain-hex").text().trim()

    block.find(".loader").show()
    try {
      const cold_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": cold_wallet.address,
        "TransferRate": transfer_rate,
        "TickSize": tick_size,
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
        "Domain": domain,
        "Flags": flags
      }

      await generic_full_send(event, cold_settings_tx, cold_wallet)
      complete_step("Configure Issuer")

    } catch(err) {
      block.find(".loader").hide()
      show_error(block, `An error occurred with the transaction: ${err}`)
    }

  })

  // Configure Hot Address Settings handler ------------------------------------
  $("#config-hot-address-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").empty()
    const hot_wallet = get_wallet_2(event, "hot")

    let flags = 0
    if ($("#hot-require-dest").prop("checked")) {
      flags |= xrpl.AccountSetTfFlags.tfRequireDestTag
    }
    if ($("#hot-disallow-xrp").prop("checked")) {
      flags |= xrpl.AccountSetTfFlags.tfDisallowXRP
    }

    const domain = $("#hot-domain-hex").text().trim()

    block.find(".loader").show()
    try {
      const hot_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": hot_wallet.address,
        // Require Auth so we can't accidentally issue from the hot address
        "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
        "Domain": domain,
        "Flags": flags
      }

      await generic_full_send(event, hot_settings_tx, hot_wallet)
      complete_step("Configure Hot Address")

    } catch(err) {
      block.find(".loader").hide()
      show_error(block, `An error occurred with the transaction: ${err}`)
    }
  })

  // Create Trust Line handler -------------------------------------------------
  $("#create-trust-line-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").empty()
    const cold_address = get_wallet_2(event, "cold").address
    const hot_wallet = get_wallet_2(event, "hot")

    let currency_code
    if ($("#use-std-code").prop("checked")) {
      currency_code = $("#currency-code-std").val().trim()
      if (!currency_code.match(/[A-Za-z0-9?!@#$%*(){}|\x26\x3c\x3e]{3}/)) {
        show_error(block, "<a href='currency-formats.html#standard-currency-codes'>Standard currency code</a> must be 3 valid characters.")
      }
    } else {
      currency_code = $("#currency-code-hex").val().trim()
      if (!currency_code.match(/^[0-9A-Fa-f]{40}$/)) {
        show_error(block, "<a href='currency-formats.html#nonstandard-currency-codes'>Nonstandard currency code</a> must be 40 hexadecimal characters.")
        return
      }
    }

    const limit = $("#trust-limit").val() // limit is a string

    block.find(".loader").show()
    try {
      const trust_set_tx = {
        "TransactionType": "TrustSet",
        "Account": hot_wallet.address,
        "LimitAmount": {
          "currency": currency_code,
          "issuer": cold_address,
          "value": limit
        }
      }
      await generic_full_send(event, trust_set_tx, hot_wallet)
      complete_step("Make Trust Line")

    } catch(err) {
      block.find(".loader").hide()
      show_error(block, `An error occurred with the transaction: ${err}`)
    }
  })

  // Send Token handler --------------------------------------------------------
  $("#send-token-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").empty()
    const hot_address = get_wallet_2(event, "hot").address
    const cold_wallet = get_wallet_2(event, "cold")

    const currency_code = $("#send-currency-code").text().trim()
    const issue_quantity = $("#send-amount").val().trim()

    const use_dest_tag = $("#use-dest-tag").prop("checked")
    let dest_tag
    if (use_dest_tag) {
      dest_tag = parseInt($("#dest-tag").val(), 10)
      if (Number.isNaN(dest_tag) || dest_tag < 0 || dest_tag > 4294967295) {
        show_error(block, "Destination Tag must be a valid 32-bit integer.")
        return
      }
    }

    block.find(".loader").show()
    try {
      const send_token_tx = {
        "TransactionType": "Payment",
        "Account": cold_wallet.address,
        "Amount": {
          "currency": currency_code,
          "value": issue_quantity,
          "issuer": cold_wallet.address
        },
        "Destination": hot_address
      }
      if (use_dest_tag) {
        send_token_tx["DestinationTag"] = dest_tag
      }
      await generic_full_send(event, send_token_tx, cold_wallet)
      complete_step("Send Token")

    } catch(err) {
      block.find(".loader").hide()
      show_error(block, `An error occurred with the transaction: ${err}`)
    }

  })

  // Confirm Balances handler --------------------------------------------------
  $("#confirm-balances-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").empty()
    const hot_address = get_wallet_2(event, "hot").address
    const cold_address = get_wallet_2(event, "cold").address

    block.find(".loader").show()
    try {
      const hot_balances = await api.request({
        "command": "account_lines",
        "account": hot_address,
        "ledger_index": "validated"
      })
      block.find(".output-area").append(`
        <p>Hot address (<a href="https://testnet.xrpl.org/accounts/${hot_address}">${hot_address}</a>) account_lines result:</p>
        <pre><code>${pretty_print(hot_balances.result)}</code></pre>
      `)

      const cold_balances = await api.request({
        "command": "gateway_balances",
        "account": cold_address,
        "ledger_index": "validated",
        "hotwallet": [hot_address]
      })
      block.find(".output-area").append(`
        <p>Issuer (<a href="https://testnet.xrpl.org/accounts/${cold_address}">${cold_address}</a>) gateway_balances result:</p>
        <pre><code>${pretty_print(cold_balances.result)}</code></pre>
      `)

      block.find(".loader").hide()
      complete_step("Confirm Balances")
    } catch(err) {
      block.find(".loader").hide()
      show_error(block, `Error looking up balances: ${err}`)
    }

  })
})
