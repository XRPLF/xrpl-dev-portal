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

  const prepared = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": sender,
    "Amount": api.xrpToDrops(send_amount), // Same as "Amount": "22000000"
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  }, {
    // Expire this transaction if it doesn't execute within ~5 minutes:
    "maxLedgerVersionOffset": 75
  })

  block.find(".output-area").append(
    `<div><strong>Prepared transaction instructions:</strong>
    <pre><code id='prepared-tx-json'>${pretty_print(prepared.txJSON)}</code></pre>
    </div>
    <div><strong>Transaction cost:</strong> ${prepared.instructions.fee} XRP</div>
    <div><strong>Transaction expires after ledger:</strong>
      ${prepared.instructions.maxLedgerVersion}</div>`)

  complete_step("Prepare")
})


// 3. Sign the transaction -----------------------------------------------------
$("#sign-button").click( function(event) {
  const block = $(event.target).closest(".interactive-block")
  block.find(".output-area").html("")

  const preparedTxJSON = $("#prepared-tx-json").text()
  const secret = get_secret(event)
  if (!secret) {return}

  signResponse = api.sign(preparedTxJSON, secret)

  block.find(".output-area").html(
    `<div><strong>Signed Transaction blob:</strong>
    <code id='signed-tx-blob' style='overflow-wrap: anywhere; word-wrap: anywhere'
    >${signResponse.signedTransaction}</code></div>
    <div><strong>Identifying hash:</strong> <span id='signed-tx-hash'
    >${signResponse.id}</span></div>`
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
    const tx = await api.getTransaction(txID, {
        minLedgerVersion: earliestLedgerVersion,
        maxLedgerVersion: lastLedgerSequence
      })

    block.find(".output-area").html(
      "<div><strong>Transaction result:</strong> " +
      tx.outcome.result + "</div>" +
      "<div><strong>Balance changes:</strong> <pre><code>" +
      pretty_print(tx.outcome.balanceChanges) +
      "</pre></code></div>"
    )

    complete_step("Check")
  } catch(error) {
    show_error(block, "Couldn't get transaction outcome:" + error)
  }

})

})
