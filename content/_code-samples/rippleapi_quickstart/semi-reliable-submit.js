function lookup_tx_final(tx_id, max_ledger, min_ledger) {
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
    const si = await api.request("server_info")
    if (si.info.complete_ledgers == "empty") {
      console.warn("Connected server is not synced.")
      return false
    }
    // In case of a discontiguous set, use only the last set, since we need
    // continuous history from submission to expiration to know that a
    // transaction failed to achieve consensus.
    const ledger_ranges = si.info.complete_ledgers.split(',')
    // Note: last_range can be in the form 'x-y' or just 'y'
    const last_range = ledger_ranges[ledger_ranges.length -1].split('-')
    const lr_min = parseInt(last_range[0])
    const lr_max = parseInt(last_range[last_range.length - 1])
    const max_validated = Math.min(lr_max, lr_max)
    if (lr_min <= min_ledger && max_validated >= max_ledger) {
      return true
    }
    return false
  }

  return new Promise((resolve, reject) => {
    api.on('ledger', async (ledger) => {
      try {
        tx_result = await api.request("tx", {
            "transaction": tx_id,
            "min_ledger": min_ledger,
            "max_ledger": max_ledger
        })

        if (tx_result.validated) {
          resolve(tx_result.meta.TransactionResult)
        } else if (max_ledger > ledger.ledgerVersion) {
          // Transaction found, not validated, but we should have a final result
          // by now.
          // Work around https://github.com/ripple/rippled/issues/3727
          if (server_has_ledger_range(min_ledger, max_ledger)) {
            // Transaction should have been validated by now.
            reject(`Transaction not found in ledgers ${min_ledger}-${max_ledger}. This result is final if this ledger is correct.`)
          } else {
            reject("Can't get final result. Check a full history server.")
          }
        } else {
          // Transaction may still be validated later. Keep waiting.
        }
      } catch(e) {
        if (e.data.error == "txnNotFound") {
          if (e.data.searched_all) {
            reject(`Transaction not found in ledgers ${min_ledger}-${max_ledger}. This result is final if this range is correct.`)
          } else {
            if (max_ledger > ledger.ledgerVersion) {
              // Transaction may yet be confirmed. This would not be a bad time
              // to resubmit the transaction just in case.
            } else {
              // Work around https://github.com/ripple/rippled/issues/3750
              if (server_has_ledger_range(min_ledger, max_ledger)) {
                reject(`Transaction not found in ledgers ${min_ledger}-${max_ledger}. This result is final if this range is correct.`)
              } else {
                reject("Can't get final result. Check a full history server.")
              }
            }
          }
        } else {
          // Unknown error; pass it back up
          reject(`Unknown Error: ${e}`)
        }
      }
    }) // end ledger event handler
  }) // end promise def
}
