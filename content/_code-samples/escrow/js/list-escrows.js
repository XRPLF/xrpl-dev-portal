if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // List the Escrows on an existing account filtered by source and destination
  // https://xrpl.org/escrow.html#escrow
  // https://xrpl.org/account_objects.html#account_objects

  async function main() {
    // Testnet example: rPRKeXbcFMcn69nR2bovp4bEcP8kZx7x5i
    account = "rPRKeXbcFMcn69nR2bovp4bEcP8kZx7x5i"

    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233/')
    await client.connect()
  
    const response = await client.request({
        "command": "account_objects",
        "account": account,
        "ledger_index": "validated",
        "type": "escrow"
    })

    var incoming = []
    var outgoing = []

    for (var i = 0; i < response.result.account_objects.length; i++) {
        if (response.result.account_objects[i].Account == account) {
            outgoing.push(response.result.account_objects[i])
        } else {
            incoming.push(response.result.account_objects[i])
        }
    }

    console.log("\nIncoming/Received escrow(s):")
    for (var i = 0; i < incoming.length; i++) {
        console.log(`\n${i+1}. Index (ObjectID/keylet): ${incoming[i].index}`)
        console.log(` - Account: ${incoming[i].Account})`)
        console.log(` - Destination: ${incoming[i].Destination}`)
        console.log(` - Amount: ${incoming[i].Amount} drops`)
    }
    
    console.log("\nOutgoing/Sent escrow(s):")
    for (var i = 0; i < outgoing.length; i++) {
        console.log(`\n${i+1}. Index (ObjectID/keylet): ${outgoing[i].index}`)
        console.log(` - Account: ${outgoing[i].Account})`)
        console.log(` - Destination: ${outgoing[i].Destination}`)
        console.log(` - Amount: ${outgoing[i].Amount} drops`)
    }
    
    client.disconnect()
    // End main()
  }
  
  main()
