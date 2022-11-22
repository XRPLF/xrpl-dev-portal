const xrpl = require("xrpl")

async function main() {

  // Create client and connect to network.
  const client = new xrpl.Client("wss://xrplcluster.com/")
  await client.connect()

  // Query ledger data.
  let ledger = await client.request({
    "command": "ledger_data",
    "ledger_index": 500000,
  })

  // Create function to loop through API calls.
  function code(){
    console.log(ledger["result"])
  }
 
  // Run code at least once before checking for markers.
  do {
    code()
    
    if (ledger["result"]["marker"] == null) {
        break
    }

    const ledger_marker = await client.request({
        "command": "ledger_data",
        "ledger_index": 500000,
        "marker": ledger["result"]["marker"]
    })
    ledger = ledger_marker

  } while (true)

  client.disconnect()
}

main()