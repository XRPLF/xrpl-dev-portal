// Helper functions for interactive tutorials

// Locale strings. TODO: maybe move these out to their own file.
LOCALES = {
  "en": {
    // Leave empty, use the keys provided (in English) by default
  },
  "ja": {
    "Address:": "アドレス：",
    "Secret:": "シード：",
    "Balance:": "残高：",
    "Complete all previous steps first": "前の手順をすべて完了して下さい",
    "Connection to the XRP Ledger required": "XRP Ledgerの接続が必要です",
    "Error:": "エラー：",
    "Populated this page's examples with these credentials.": "このページの例にこのアドレスとシードを入力しました。",
    "There was an error connecting to the Faucet. Please try again.": "テストネットワークFaucetにエラーが発生しました。もう一度試してください。",
    "Connecting...": "接続しています...",
    "Connection required": "接続が必要です",
    "Connected": "接続されました",
    "Faucet returned an error:": "テストネットワークFaucetがこのエラーを返しました：",
    "Validated": "検証済み",
    "Final Result:": "確定結果：",
    "(Still pending...)": "（まだ未決…）",
    "(None)": "（無）",
    "Prepared transaction:": "準備済みトランザクション：",
    "Failed to achieve consensus (final)": "検証済みレジャーには含まれません（決定結果）",
    "Preliminary result:": "予備結果：",
    "Unknown": "不明",
    "Couldn't get a valid address/secret value. Check that the previous steps were completed successfully.": "有効なアドレスかシードの取得出来ませんでした。前の手順が完了しましたことを確認して下さい。",
    "Transaction hash:": "トランザクションハッシュ："
  }
}

/**
 * Quick-n-dirty localization function. TODO: migrate to a real localization
 * library, such as https://github.com/wikimedia/jquery.i18n
 * @param {String} key The string to translate into this page's locale
 * @return {String} The translated string, if one is available, or the provided
 *                  key value if no translation is available.
 */
function tl(key) {
  let current_locale = $("html").prop("lang").substring(0,2)
  if (!(current_locale in LOCALES)) {
    console.warn("Interactive tutorials don't have translations for locale:", current_locale)
    current_locale = "en"
  }
  let mesg = LOCALES[current_locale][key]
  if (typeof mesg === "undefined") {
    mesg = key
  }
  return mesg
}

/**
 * Convert a string of text into a "slug" form that is appropriate for use in
 * URLs, HTML id and class attributes, and similar. This matches the equivalent
 * function in @theme/helpers.js so that IDs can be found consistently.
 * This version is more Unicode-friendly than the old version ('slugify')
 * @param {String} s The text (step_name or similar) to convert into a
 * @return {String} The "slug" version of the text, lowercase with no whitespace
 *                  and with most non-alphanumeric characters removed.
 */
function idify(s) {
 // s = s.replace(/[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]/gu, '').trim().toLowerCase()
 s = s.replace(/([^\w]|[\s-])/gu, '').trim().toLowerCase()
 s = s.replace(/[\s-]+/gu, '-')
  if (!s) {
    s = "_";
  }
  return s
}


/**
 * Check whether a given step has been marked completed already.
 * @param {String} step_name The exact name of the step, as defined in the
 *                           start_step(step_name) function in the MD file.
 * @return {Boolean}         Whether or not this step has been marked complete.
 */
function is_complete(step_name) {
  return is_complete_by_id(idify(step_name))
}

/**
 * Helper for is_complete. Also called directly in cases where we only have
 * the step_id and not the step_name (since that's a one-way conversion).
 * @param {String} step_id The slugified name of the step.
 * @return {Boolean}       Whether or not this step has been marked complete.
 */
function is_complete_by_id(step_id) {
  return $(".bc-"+step_id).hasClass("done")
}

/**
 * Mark a step as done in the breadcrumbs, mark the following step as active,
 * and enable buttons and such in the following step that have the
 * "previous-steps-required" class.
 * @param {String} step_name The exact name of the step, as defined in the
 *                           start_step(step_name) function in the MD file.
 */
function complete_step(step_name) {
  complete_step_by_id(idify(step_name))
}

/**
 * Helper for complete_step. Also called directly in cases where we only have
 * the step_id and not the step_name (since that's a one-way conversion).
 * @param {String} step_id The slugified name of the step.
 */
function complete_step_by_id(step_id) {
  $(".bc-"+step_id).removeClass("active").addClass("done")
  $(".bc-"+step_id).next().removeClass("disabled").addClass("active")

  // Enable follow-up steps that require this step to be done first
  const next_ui = $(`#interactive-${step_id}`).nextAll(
                    ".interactive-block").eq(0).find(".previous-steps-required")
  next_ui.prop("title", "")
  next_ui.prop("disabled", false)
  next_ui.removeClass("disabled")
}

/**
 * Get the step_id of the interactive block that contains a given element.
 * @param {jQuery} jEl The jQuery result representing a single HTML element in
 *                     an interactive block.
 * @return {String}    The step_id of the block that contains jEl.
 */
function get_block_id(jEl) {
  // Traverse up, then slice "interactive-" off the block's HTML ID
  return jEl.closest(".interactive-block").prop("id").slice(12)
}

/**
 * Pretty-print JSON with standard indentation.
 * @param {String, Object} j Either a JSON/JSON-like object, or a string
                             containing JSON.
 */
function pretty_print(j) {
  try {
    return JSON.stringify(JSON.parse(j),null,2)
  } catch (e) {
    // probably already decoded JSON
    return JSON.stringify(j,null,2)
  }
}

/**
 * Disable buttons and such with the "previous-steps-required" class, and give
 * them an appropriate tooltip message.
 */
function disable_followup_steps() {
  $(".previous-steps-required").prop("title", tl("Complete all previous steps first"))
  $(".previous-steps-required").prop("disabled", true).addClass("disabled")
  $(".connection-required").prop("title", tl("Conection to the XRP Ledger required"))
  $(".connection-required").prop("disabled", true).addClass("disabled")
}

/**
 * Output an error message in the given area.
 * @param {jQuery} block The block where this error message should go. This
 *                       should be a parent element containing an element with
 *                       the "output-area" class.
 * @param {String} message The HTML contents to put inside the message.
 */
function show_error(block, message) {
  block.find(".output-area").html(
    `<p class="devportal-callout warning"><strong>${tl("Error:")}</strong>
    ${message}</p>`)
}

/**
 * To be used with _snippets/interactive/tutorials/generate-step.md.
 * Adds an event to the "Generate" button to call the appropriate faucet
 * (Testnet or Devnet) and write the credentials to elements that later steps
 * can use in their examples. Also updates code samples in the current page to
 * use the generated credentials instead of the placeholder EXAMPLE_ADDR and
 * EXAMPLE_SECRET.
 */
var EXAMPLE_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
var EXAMPLE_SECRET = "s████████████████████████████"
function setup_generate_step() {

  $("#generate-creds-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").html("")
    block.find(".loader").show()
    // Get faucet URL (Testnet/Devnet/etc.)
    const faucet_url = $("#generate-creds-button").data("fauceturl")

    try {
      const wallet = xrpl.Wallet.generate("ed25519")
      const data = await call_faucet(faucet_url, wallet.address, event)

      block.find(".loader").hide()
      block.find(".output-area").html(`<div><strong>${tl("Address:")}</strong>
          <span id="use-address">${data.account.address}</span></div>
          <div><strong>${tl("Secret:")}</strong>
          <span id="use-secret">${wallet.seed}</span></div>`)
      if (data.balance) {
        block.find(".output-area").append(`<div><strong>${tl("Balance:")}</strong>
        ${data.balance} XRP</div>`)
      }

      // Automatically populate all examples in the page with the
      // generated credentials...
      let creds_updated = false;
      $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
        creds_updated = true
        let eltext = $(this).text()
        $(this).text( eltext.replace(EXAMPLE_ADDR, data.account.address) )
      })
      $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
        creds_updated = true
        let eltext = $(this).text()
        $(this).text( eltext.replace(EXAMPLE_SECRET, data.account.secret) )
      })

      if (creds_updated) {
        block.find(".output-area").append(`<p>${tl("Populated this page's examples with these credentials.")}</p>`)
      }

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

/**
 * Get the address from the Generate step (snippet), or display an error in
 * the relevant interactive block if it fails—usually because the user hasn't
 * clicked the "Get Credentials" button yet.
 * @return {String, undefined} The address, if available, or undefined if not
 */
function get_address(event) {
  const address = $("#use-address").text()
  if (!address) {
    const block = $(event.target).closest(".interactive-block")
    if (!block.length) {return}
    show_error(block, tl("Couldn't get a valid address/secret value. Check that the previous steps were completed successfully."))
  }
  return address
}

/**
 * Get the Wallet from the Generate step (snippet), or display an error in
 * the relevant interactive block if it fails—usually because the user hasn't
 * clicked the "Get Credentials" button yet.
 * @return {Wallet, undefined} The Wallet instance, if available, or undefined if not
 */
function get_wallet(event) {
  const secret = $("#use-secret").text()
  if (!secret) {
    const block = $(event.target).closest(".interactive-block")
    if (!block.length) {return}
    show_error(block, tl("Couldn't get a valid address/secret value. Check that the previous steps were completed successfully."))
  }
  if (secret == EXAMPLE_SECRET) {
    const block = $(event.target).closest(".interactive-block")
    if (!block.length) {return}
    show_error(block, tl("Can't use the example secret here. Check that the previous steps were completed successfully."))
    return
  }
  return xrpl.Wallet.fromSeed(secret)
}

/**
 * Helper for calling the Testnet/Devnet faucet.
 * @param {String} faucet_url The URL of the faucet to call, for example:
 *                            https://faucet.altnet.rippletest.net/accounts
 * @param {String} destination The account to fund, if undefined, the faucet will create one
 * @param {Object} event The event object to get memo data from
 * */
async function call_faucet(faucet_url, destination, event) {
  // Future feature: support the Faucet's optional xrpAmount param
  const block = $(event.target).closest(".interactive-block");

  const tutorial_info = {
    path: window.location.pathname,
    button: event.target.id,
    step: block.data("stepnumber"),
    totalsteps: block.data("totalsteps"),
  };
  //pass in plain text instead of HEX- the API will encode.
  const memo = {
    data: JSON.stringify(tutorial_info, null, 0),
    format: "application/json", // application/json
    // The MemoType decodes to a URL that explains the format of this memo type:
    // https://github.com/XRPLF/xrpl-dev-portal/blob/master/tool/INTERACTIVE_TUTORIALS_README.md
    type: "https://github.com/XRPLF/xrpl-dev-portal/blob/master/tool/INTERACTIVE_TUTORIALS_README.md",
  };

  const body = {};
  body["destination"] = destination;
  body["memos"] = [memo];

  const response = await fetch(faucet_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  })
  const data = await response.json()

  if (!response.ok) {
    throw `${tl("Faucet returned an error:")} ${data.error}`
  }
  return data
}

/**
 * Tutorials' scripts should push functions to this array to have them run
 * automatically after connecting to the network. The scopes don't work out
 * right to use api.on("connect", callback) directly from the tutorials' unique
 * scripts because the api instance (specific to the network) is instantiated
 * by the setup_connect_step() in this file, below.
 */
window.after_connect = window.after_connect || [];


/**
 * To be used with _snippets/interactive-tutorials/connect-step.md
 * Adds an event to the "Connect" button to connect to the appropriate
 * WebSocket server (Testnet, Devnet, maybe Mainnet for some cases).
 * Also adds an event to re-disable following steps if we get disconnected.
 */
function setup_connect_step() {
  if (!$("#connect-button").length) {
    console.debug("Connect step not included. Skipping related setup.")
    return
  }
  const ws_url = $("#connect-button").data("wsurl")
  if (!ws_url) {
    console.error("Interactive Tutorial: WS URL not found. Did you set use_network?")
    return
  }
  const block = $("#connect-button").closest(".interactive-block");
  api = new xrpl.Client(ws_url)
  api.on('connected', async function() {
    $("#connection-status").text(tl("Connected"))
    $("#connect-button").prop("disabled", true)
    block.find(".loader").hide()
    $(".connection-required").prop("disabled", false)
    $(".connection-required").prop("title", "")

    // Subscribe to ledger close events
    api.request({command: "subscribe", streams: ["ledger"]})

    complete_step("Connect")
  })
  api.on('disconnected', (code) => {
    $("#connection-status").text( tl("Disconnected") +" ("+code+")" )
    $("#connect-button").prop("disabled", false)
    $(".connection-required").prop("disabled", true)
    $(".connection-required").prop("title", tl("Connection required"))

    disable_followup_steps()
  })
  $("#connect-button").click(async (event) => {
    $("#connection-status").text( tl("Connecting...") )
    block.find(".loader").show()
    await api.connect()

    for (const fn of after_connect) {
      fn()
    }
  })
}

/**
 * To be used with _snippets/interactive-tutorials/wait-step.md
 * For each wait step in the page, set up a listener that checks for the
 * transaction shown in that step's "waiting-for-tx" field, as long as that
 * step's "tx-validation-status" field doesn't have a final result set.
 * These listeners do very little (just updating the latest validated ledger
 * index) until you activate one with activate_wait_step(step_name).
 * Requires xrpl.js to be loaded and instantiated as "api" first.
 */
function setup_wait_steps() {
  const wait_steps = $(".wait-step")

  wait_steps.each(async (i, el) => {
    const wait_step = $(el)
    const explorer_url = wait_step.data("explorerurl")
    const status_box = wait_step.find(".tx-validation-status")
    api.on('ledgerClosed', async (ledger) => {
      // Update the latest validated ledger index in this step's table
      wait_step.find(".validated-ledger-version").text(ledger.ledger_index)
      if (!status_box.data("status_pending")) {
        // Before submission or after a final result.
        // Either way, nothing more to do here.
        return
      }

      const transaction = wait_step.find(".waiting-for-tx").text().trim()
      const min_ledger = parseInt(wait_step.find(".earliest-ledger-version").text())
      const max_ledger = parseInt(wait_step.find(".lastledgersequence").text())
      let tx_response
      try {
        tx_response = await api.request({
          command: "tx",
          transaction,
          min_ledger,
          max_ledger
        })

        if (tx_response.result.validated) {
          status_box.html(
          `<th>${tl("Final Result:")}</th><td>${tx_response.result.meta.TransactionResult}
          (<a href="${explorer_url}/transactions/${transaction}"
          target="_blank">${tl("Validated")}</a>)</td>`)

          const step_id = get_block_id(wait_step)
          if (!is_complete_by_id(step_id)) {
            status_box.data("status_pending", false)
            complete_step_by_id(step_id)
          }
        } else {
          status_box.html(
            `<th>${tl("Final Result:")}</th>
            <td><img class="throbber" src="/img/xrp-loader-96.png">
            ${tl("(Still pending...)")}</td>`)
        }

      } catch(e) {
        if (e.data.error == "txnNotFound" && e.data.searched_all) {
          status_box.html(
            `<th>${tl("Final Result:")}</th><td>${tl("Failed to achieve consensus (final)")}</td>`)
        } else {
          status_box.html(
            `<th>${tl("Final Result:")}</th><td>${tl("Unknown")}</td>`)
        }
      }
    }) // end 'ledger' event handler
  }) // end "each" wait_step
}

/**
 * To be used with _snippets/interactive-tutorials/wait-step.md
 * Populate the table of the wait step with the relevant transaction details
 * and signal this step's listener to look up the relevant transaction.
 * This function is called by the generic submit handlers that
 * make_submit_handler() creates.
 * @param {String} step_name The exact name of the "Wait" step to activate, as
 *                           defined in the start_step(step_name) function in
 *                           the MD file.
 * @param {Object} prelim The (resolved) return value of submitting a
 *                           transaction blob via api.request({command: "submit", opts})
 */
async function activate_wait_step(step_name, prelim) {
  const step_id = idify(step_name)
  const wait_step = $(`#interactive-${step_id} .wait-step`)
  const status_box = wait_step.find(".tx-validation-status")
  const tx_id = prelim.result.tx_json.hash
  const lls = prelim.result.tx_json.LastLedgerSequence || tl("(None)")

  if (wait_step.find(".waiting-for-tx").text() == tx_id) {
    // Re-submitting the same transaction? Don't update min_ledger.
  } else {
    wait_step.find(".waiting-for-tx").text(tx_id)
    wait_step.find(".earliest-ledger-version").text(
      prelim.result.validated_ledger_index
    )
  }
  wait_step.find(".lastledgersequence").text(lls)
  status_box.html("")
  status_box.data("status_pending", true)
}


/**
 * Get the hexadecimal ASCII representation of a string (must contain only
 * 7-bit ASCII characters).
 * @param {String} s The string to encode.
 * @return {String} The uppercase hexadecimal representation of the string.
 */
function text_to_hex(s) {
  result = ""
  for (let i=0; i<s.length; i++) {
    result += s.charCodeAt(i).toString(16)
  }
  return result.toUpperCase()
}

/**
 * Add a memo to transaction instructions (before signing) to indicate that this
 * transaction was generated by an interactive tutorial. This allows anyone to
 * observe transactions on Testnet/Devnet to see which ones originate from which
 * interactive tutorials. For privacy reasons, the memo does not and MUST NOT
 * include personally identifying information about the user or their browser.
 * @param {Object} event The click event that caused this transaction to be sent
 * @param {Object} tx_json The JSON transaction instructions to have the memo
 *                         added to them (in-place).
 */
function add_memo(event, tx_json) {
  const block = $(event.target).closest(".interactive-block")

  const tutorial_info = {
    "path": window.location.pathname,
    "button": event.target.id,
    "step": block.data("stepnumber"),
    "totalsteps": block.data("totalsteps")
  }

  const memo = {
    "Memo": {
      "MemoData": text_to_hex(JSON.stringify(tutorial_info, null, 0)),
      "MemoFormat": "6170706C69636174696F6E2F6A736F6E", // application/json
      // The MemoType decodes to a URL that explains the format of this memo type:
      // https://github.com/XRPLF/xrpl-dev-portal/blob/master/tool/INTERACTIVE_TUTORIALS_README.md
      "MemoType": "68747470733A2F2F6769746875622E636F6D2F5852504C462F7872706C2D6465762D706F7274616C2F626C6F622F6D61737465722F746F6F6C2F494E5445524143544956455F5455544F5249414C535F524541444D452E6D64"
    }
  }

  if (tx_json.Memos === undefined) {
    tx_json["Memos"] = [memo]
  } else {
    tx_json["Memos"].push(memo)
  }
}

/**
 * Helper for "Send Transaction" buttons to handle the full process of
 * Prepare → Sign → Submit in one step with appropriate outputs. Assumes you are
 * also using _snippets/interactive-tutorials/wait-step.md to report the
 * transaction's final results. Gets important information from data
 * attributes defined on the button that triggers the event:
 * data-tx-blob-from="{jQuery selector}" A selector for an element whose .text()
 *                                       is the blob to submit.
 * data-wait-step-name="{String}" The exact name of the wait step where this
 *                                transaction's results should be reported, as
 *                                defined in start_step(step_name) as the MD
 * This function is meant to be called from within a .click(event) handler, not
 * directly bound as the click handler.
 * @param {Event} event The (click) event that this is helping to handle.
 * @param {Object} tx_json JSON object of transaction instructions to finish
 *                         preparing and send.
 * @param {Wallet} wallet (Optional) The xrpl.js Wallet instance to use to sign the
 *                        transaction. If omitted, look up the #use-secret field
 *                        which was probably added by a "Get Credentials" step.
 */
async function generic_full_send(event, tx_json, wallet) {
  const block = $(event.target).closest(".interactive-block")
  const blob_selector = $(event.target).data("txBlobFrom")
  const wait_step_name = $(event.target).data("waitStepName")
  block.find(".output-area").html("")

  if (wallet === undefined) {
    wallet = get_wallet(event)
  }
  if (!wallet) {return}

  add_memo(event, tx_json)

  block.find(".loader").show()
  const prepared = await api.autofill(tx_json)
  block.find(".output-area").append(
    `<p>${tl("Prepared transaction:")}</p>
    <pre><code>${pretty_print(prepared)}</code></pre>`)

  const {tx_blob, hash} = wallet.sign(prepared)
  block.find(".output-area").append(
    `<p>${tl("Transaction hash:")} <code id="tx_id">${hash}</code></p>`)

  await do_submit(block, {"tx_blob":  tx_blob}, wait_step_name)
}

/**
 * Generic event handler for transaction submission buttons. Assumes
 * you are also using _snippets/interactive-tutorials/wait-step.md to report
 * the transaction's final results. Gets important information from data
 * attributes defined on the button that triggers the event:
 * data-tx-blob-from="{jQuery selector}" A selector for an element whose .text()
 *                                       is the blob to submt.
 * data-wait-step-name="{String}" The exact name of the wait step where this
 *                                transaction's results should be reported, as
 *                                defined in start_step(step_name) as the MD
 * This function is intended to be bound directly on a submit button as the
 * click event handler.
 */
async function submit_handler(event) {
  const block = $(event.target).closest(".interactive-block")
  const blob_selector = $(event.target).data("txBlobFrom")
  const wait_step_name = $(event.target).data("waitStepName")
  const tx_blob = $(blob_selector).text()
  do_submit(block, {tx_blob}, wait_step_name)
}

/**
 * General-purpose transaction submission helper.
 * @param {jQuery} block Output preliminary results inside this wrapping
 *                       .interactive-block's .output-area.
 * @param {Object} submit_opts The JSON object to be passed to the rippled
 *                             submit command. At a minimum, needs "tx_blob"
 * @param {String} wait_step_name The name of a wait step. Report the final
 *                                results of the transaction there. Must be a
 *                                _snippets/interactive-tutorials/wait-step.md
 */
async function do_submit(block, submit_opts, wait_step_name) {
  block.find(".loader").show()
  try {
    submit_opts["command"] = "submit"
    const prelim_result = await api.request(submit_opts)
    block.find(".output-area").append(
      `<p>${tl("Preliminary result:")}</p>
      <pre><code>${pretty_print(prelim_result)}</code></pre>`)

    block.find(".loader").hide()
    submit_step_id = get_block_id(block)
    complete_step_by_id(submit_step_id)
    if (wait_step_name){
      activate_wait_step(wait_step_name, prelim_result)
    }
    return prelim_result
  } catch(error) {
    block.find(".loader").hide()
    show_error(block, error)
  }
}

async function show_log(block, msg) {
  block.find(".output-area").append(msg)
}

/**
 * Run callback only when the current route is loaded.
 */
function onCurrentRouteLoaded(callback) {
  const currentPath = window.location.pathname;
  window.onRouteChange(() => {
    if (window.location.pathname === currentPath) {
      callback()
    }
  });
}

window.onRouteChange(() => {
  disable_followup_steps()
  setup_generate_step()
  setup_connect_step()
  setup_wait_steps()
})
