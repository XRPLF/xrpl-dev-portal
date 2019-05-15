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
          return true
        }
      }
    }
  }
  console.log("This transaction did not directly modify account "+address)
  return false
}

const lookOutForGaps = function(data) {
  const gap_status = hasGaps(data.meta.AffectedNodes)
  if (gap_status === false) {
    console.log("Chained successfully. New tx:")
  } else if (gap_status === true) {
    // fill gap
  } else if (gap_status === undefined) {
    console.log("")
  }


}
WS_HANDLERS['transaction'] = watchForGaps
