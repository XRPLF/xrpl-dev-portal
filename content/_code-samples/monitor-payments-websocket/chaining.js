const ADDRESS = '' // address to watch for gaps

async function resetStartingPoint() {
  // using the api_request function defined in earlier examples
  const resp = await api_request({
    "command": "account_info",
    "account": ADDRESS
  })
  if (resp.status === "success") {
    return resp.result.account_data.PreviousTxnID
  } else {
    console.error("Couldn't get account_info for address "+address+" because of error: "+JSON.stringify(resp))
  }
}

let knownPreviousTxnID = undefined
// Using the socket from earlier examples
socket.addEventListener('open', (event) => {
  knownPreviousTxnID = resetStartingPoint()
})

function hasGaps(affected_nodes) {
  if (typeof knownPreviousTxnID === "undefined") {
    console.warn("Can't detect gaps without a known PreviousTxnID...")
    return undefined
  }

  for (let i=0; i<affected_nodes.length; i++) {
    if ((affected_nodes[i].hasOwnProperty("ModifiedNode"))) {
      const ledger_entry = affected_nodes[i].ModifiedNode
      if (ledger_entry.LedgerEntryType === "AccountRoot" &&
          ledger_entry.FinalFields.Account === ADDRESS) {
        if (ledger_entry.PreviousTxnID === knownPreviousTxnID) {
          return false
        } else {
          console.warn("Gap detected...")
          return ledger_entry.PreviousTxnID
        }
      }
    }
  }
  console.log("This transaction did not directly modify account "+address)
  return false
}

async function fill_gap(gap_tx_hash) {
  response = await api_request({
    "command": "tx",
    "transaction": gap_tx_hash
  })
  if (response.status === "success") {
    reduced_gap_status = hasGaps(response.result.meta.AffectedNodes)
    if (gap_status === false) {
      console.log("Successfully closed the gap! Found transaction: "+response.result)
      // At this point, you'd process the transaction. Warning: the format
      //  returned by tx is different than transaction subscription messages.
      return response.result.hash
    } else if (typeof gap_status === "undefined") {
      console.log("Can't fill gap. Undefined last known tx.")
      return false
    } else if (typeof gap_status === "string") {
      console.log("Gap extends deeper. Expected PreviousTxnID: " +
                  knownPreviousTxnID + " vs. actual: " + gap_status)
      return fill_gap(gap_status)
    }

  } else {
    console.error("Error looking up gap TX " + gap_tx_hash +
                  "; maybe it's older than our server's known history?")
    return false
  }
}

const lookOutForGaps = function(data) {
  const gap_status = hasGaps(data.meta.AffectedNodes)
  if (gap_status === false) {
    console.log("Chained successfully. New tx: "+data.transaction.hash)
    knownPreviousTxnID = data.transaction.hash
  } else if (typeof gap_status === "undefined") {
    console.log("Unknown prior status. Starting chain from tx: " +
                data.transaction.hash)
  } else if (typeof gap_status === "string") {
    console.warn("Gap detected. Expected PreviousTxnID: " +
                knownPreviousTxnID + " vs. actual: " + gap_status)
    fill_success = await fill_gap(gap_tx_hash)
    if (fill_success) {
      knownPreviousTxnID = data.transaction.hash
    }
  }
}

WS_HANDLERS['transaction'] = lookOutForGaps
