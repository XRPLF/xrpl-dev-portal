// Prerequisite: Generate
// 1. Connect
// The code for these steps is handled by interactive-tutorial.js

$(document).ready(() => {

// 2. Prepare Transaction ------------------------------------------------------
$("#prepare-button").click( async function(event) {
  const block = $(event.target).closest(".interactive-block")
  block.find(".output-area").html("")
  const send_amount = $("#xrp-amount").val()

  const sender = get_address(event)
  if (!sender) {return}

  const vli = await api.getLedgerIndex()

  const prepared = await api.autofill({
    "TransactionType": "Payment",
    "Account": sender,
    "Amount": xrpl.xrpToDrops(send_amount), // Same as "Amount": "22000000"
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "LastLedgerSequence": vli+75 // gives ~5min, rather than the default ~1min
  })

  block.find(".output-area").append(
    `<div><strong>Prepared transaction instructions:</strong>
    <pre><code id='prepared-tx-json'>${pretty_print(prepared)}</code></pre>
    </div>
    <div><strong>Transaction cost:</strong> ${xrpl.dropsToXrp(prepared.Fee)} XRP</div>
    <div><strong>Transaction expires after ledger:</strong>
      ${prepared.LastLedgerSequence}</div>`)

  complete_step("Prepare")
})


// 3. Sign the transaction -----------------------------------------------------
$("#sign-button").click( function(event) {
  const block = $(event.target).closest(".interactive-block")
  block.find(".output-area").html("")

  const preparedTxJSON = JSON.parse($("#prepared-tx-json").text())
  const wallet = get_wallet(event)
  if (!wallet) {return}

  const {tx_blob, hash} = wallet.sign(preparedTxJSON)

  block.find(".output-area").html(
    `<div><strong>Signed Transaction blob:</strong>
    <code id='signed-tx-blob' style='overflow-wrap: anywhere; word-wrap: anywhere'
    >${tx_blob}</code></div>
    <div><strong>Identifying hash:</strong> <span id='signed-tx-hash'
    >${hash}</span></div>`
  )

  complete_step("Sign")
})

// 4. Submit the signed transaction --------------------------------------------
$("#submit-button").click( submit_handler )

// 5. Wait for Validation: handled by interactive-tutorial.js and by the
// generic submit handler in the previous step. --------------------------------


// 6. Check transaction status -------------------------------------------------
$("#get-tx-button").click( async function(event) {
  const block = $(event.target).closest(".interactive-block")
  // Wipe previous output
  block.find(".output-area").html("")

  const txID = $("#signed-tx-hash").text()
  const earliestLedgerVersion = parseInt(
                $("#interactive-wait .earliest-ledger-version").text(), 10)
  const lastLedgerSequence = parseInt(
                $("#interactive-wait .lastledgersequence").text(), 10)

  try {
    const tx = await api.request({
      command: "tx",
      transaction: txID,
      min_ledger: earliestLedgerVersion,
      max_ledger: lastLedgerSequence
    })

    block.find(".output-area").html(
      `<div><strong>Transaction result code:</strong>
      ${tx.result.meta.TransactionResult} (${tx.result.validated ? "validated": "pending"})</div>
      <div><strong>Balance changes:</strong>
      <pre><code>${pretty_print(xrpl.getBalanceChanges(tx.result.meta))}</code></pre>
      </div>`
    )

    complete_step("Check")
  } catch(error) {
    show_error(block, "Couldn't get transaction outcome:" + error)
  }

})

})
