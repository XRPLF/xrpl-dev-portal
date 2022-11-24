const xrpl = require("xrpl")

async function main() {

  // Create a client and connect to the network.
  const client = new xrpl.Client("wss://xrplcluster.com/")
  await client.connect()

  // Specify a ledger to query for info.
  let ledger = await client.request({
    "command": "ledger_data",
    "ledger_index": 500000,
  })

  // Create a function to run on each API call.
  function code(){
    console.log(ledger["result"])
  }
 
  // Execute function at least once before checking for markers.
  do {
    code()
    
    if (ledger["result"]["marker"] === undefined) {
        break
    }

    // Specify the same ledger and add the marker to continue querying.
    const ledger_marker = await client.request({
        "command": "ledger_data",
        "ledger_index": 500000,
        "marker": ledger["result"]["marker"]
    })
    ledger = ledger_marker

  } while (true)

  // Disconnect when done. If you omit this, Node.js won't end the process.
  client.disconnect()
}

main()