const xrpl = require("xrpl")

async function main() {

  // Create a client and connect to the network.
  const client = new xrpl.Client("wss://xrplcluster.com/")
  await client.connect()

  // Query the most recently validated ledger for info.
  let ledger = await client.request({
    "command": "ledger_data",
    "ledger_index": "validated",
  })
  const ledger_data_index = ledger["result"]["ledger_index"]

  // Create a function to run on each API call.
  function printLedgerResult(){
    console.log(ledger["result"])
  }

  // Execute function at least once before checking for markers.
  do {
    printLedgerResult()

    if (ledger["result"]["marker"] === undefined) {
        break
    }

    // Specify the same ledger and add the marker to continue querying.
    const ledger_marker = await client.request({
        "command": "ledger_data",
        "ledger_index": ledger_data_index,
        "marker": ledger["result"]["marker"]
    })
    ledger = ledger_marker

  } while (true)

  // Disconnect when done. If you omit this, Node.js won't end the process.
  await client.disconnect()
}

main()
