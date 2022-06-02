// Submit-and-verify XRPL transaction using xrpl.js (v2.0)
// Demonstrates how to submit a transaction and wait for validation.
// This is not true "robust" transaction submission because it does not protect
// against power outages or other sudden interruptions.
// It may be more robust than the submitAndWait() method included in xrpl.js 2.0
// because it uses subscriptions and checks the server's available ledger range.

// Look up a transaction's result.
// Arguments:
// @param api object Client instance connected to the network where you
//            submitted the transaction. MUST ALREADY BE SUBSCRIBED TO THE
//            `ledger` event stream.
// @param tx_id string The identifying hash of the transaction.
// @param max_ledger int optional The highest ledger index where the
//            transaction can be validated.
// @param min_ledger int optional The lowest ledger index where the
//            transaction can be validated.
// Returns: Promise<object> -> result of the tx command with the transaction's
//            validated transaction results.
// On failure, the reason is an object with two fields:
//    - failure_final: if true, this transaction did not achieve consensus and
//                     it can never be validated in the future (assuming the
//                     min_ledger and max_ledger values provided were accurate).
//    - msg: A human-readable message explaining what happened.
function lookup_tx_final(api, tx_id, max_ledger, min_ledger) {
  if (typeof min_ledger == "undefined") {
    min_ledger = -1
  }
  if (typeof max_ledger == "undefined") {
    max_ledger = -1
  }
  if (min_ledger > max_ledger) {
    // Assume the args were just passed backwards & swap them
    [min_ledger, max_ledger] = [max_ledger, min_ledger]
  }

  // Helper to determine if we (should) know the transaction's final result yet.
  // If the server has validated all ledgers the tx could possibly appear in,
  // then we should know its final result.
  async function server_has_ledger_range(min_ledger, max_ledger) {
    const si = await api.request({command: "server_info"})
    // console.log(`Server has ledger range: ${si.result.info.complete_ledgers}`)
    if (si.result.info.complete_ledgers == "empty") {
      console.warn("Connected server is not synced.")
      return false
    }
    // In case of a discontiguous set, use only the last set, since we need
    // continuous history from submission to expiration to know that a
    // transaction failed to achieve consensus.
    const ledger_ranges = si.result.info.complete_ledgers.split(',')
    // Note: last_range can be in the form 'x-y' or just 'y'
    const last_range = ledger_ranges[ledger_ranges.length -1].split('-')
    const lr_min = parseInt(last_range[0])
    const lr_max = parseInt(last_range[last_range.length - 1])
    if (lr_min <= min_ledger && lr_max >= max_ledger) {
      // Server has ledger range needed.
      return true
    }
    return false
  }

  return new Promise((resolve, reject) => {
    ledger_listener = async (ledger) => {
      try {
        const tx_response = await api.request({
            "command": "tx",
            "transaction": tx_id,
            "min_ledger": min_ledger,
            "max_ledger": max_ledger
        })

        if (tx_response.result.validated) {
          resolve(tx_response.result.meta.TransactionResult)
        } else if (ledger.ledger_index >= max_ledger) {
          api.off("ledgerClosed", ledger_listener)
          // Transaction found, not validated, but we should have a final result
          // by now.
          // Work around https://github.com/ripple/rippled/issues/3727
          if (await server_has_ledger_range(min_ledger, max_ledger)) {
            // Transaction should have been validated by now.
            reject({
              failure_final: true,
              msg: `Transaction not found in ledgers ${min_ledger}-${max_ledger}. This result is final if this range is correct.`
            })
          } else {
            reject({
              failure_final: false,
              msg: "Can't get final result (1). Check a full history server."
            })
          }
        } else {
          // Transaction may still be validated later. Keep waiting.
        }
      } catch(e) {
        console.warn(e)
        if (e.data.error == "txnNotFound") {
          if (e.data.searched_all) {
            api.off("ledgerClosed", ledger_listener)
            reject({
              failure_final: true,
              msg: `Transaction not found in ledgers ${min_ledger}-${max_ledger}. This result is final if this range is correct.`
            })
          } else {
            if (max_ledger > ledger.ledger_index) {
              api.off("ledgerClosed", ledger_listener)
              // Transaction may yet be confirmed. This would not be a bad time
              // to resubmit the transaction just in case.
            } else {
              // Work around https://github.com/ripple/rippled/issues/3750
              if (await server_has_ledger_range(min_ledger, max_ledger)) {
                reject({
                  failure_final: true,
                  msg: `Transaction not found in ledgers ${min_ledger}-${max_ledger}. This result is final if this range is correct.`
                })
              } else {
                reject({
                  failure_final: false,
                  msg: "Can't get final result. Check a full history server."
                })
              }
            }
          }
        } else {
          // Unknown error; pass it back up
          reject({
            failure_final: false,
            msg: `Unknown Error: ${e}`
          })
        }
      }
    } // end ledger event handler
    api.on('ledgerClosed', ledger_listener)
  }) // end promise def
}


// Submit a transaction blob and get its final result as a string.
// This can be one of these possibilities:
// tesSUCCESS. The transaction executed successfully.
// tec*. The transaction was validated with a failure code. It destroyed the XRP
//      transaction cost and may have done some cleanup such as removing
//      expired objects from the ledger, but nothing else.
//      See https://xrpl.org/tec-codes.html for the full list.
// tefMAX_LEDGER. The transaction expired without ever being included
//      in a validated ledger.
// unknown. Either the server you are querying does not have the
//      necessary ledger history to find the transaction's final result, or
//      something else went wrong when trying to look up the results. The
//      warning written to the console can tell you more about what happened.
async function submit_and_verify(api, tx_blob) {
  // Make sure we subscribe to the ledger stream. This is idempotent so we don't
  // have to worry about oversubscribing.
  api.request({"command": "subscribe", "streams": ["ledger"]})
  const prelim = await api.request({"command": "submit", "tx_blob": tx_blob})
  console.log("Preliminary result code:", prelim.result.engine_result)
  const min_ledger = prelim.result.validated_ledger_index
  if (prelim.result.tx_json.LastLedgerSequence === undefined) {
    console.warn("Transaction has no LastLedgerSequence field. "+
                 "It may be impossible to determine final failure.")
  }
  const max_ledger = prelim.result.tx_json.LastLedgerSequence
  const tx_id = prelim.result.tx_json.hash

  let final_result
  try {
    final_result = await lookup_tx_final(api, tx_id, max_ledger, min_ledger)
  } catch(reason) {
    if (reason.failure_final) final_result = "tefMAX_LEDGER"
    else final_result = "unknown"
    console.warn(reason)
  }

  return final_result;
}

// Exports for node.js; no-op for browsers
if (typeof module !== "undefined") {
  module.exports = {
    submit_and_verify: submit_and_verify,
    lookup_tx_final: lookup_tx_final
  }
}
