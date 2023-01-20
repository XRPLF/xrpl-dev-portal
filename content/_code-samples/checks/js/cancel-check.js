if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Construct a CheckCancel transaction to cancel a Check which has passed its Expiration date
  // https://xrpl.org/escrow.html#escrow
  // https://xrpl.org/checkcancel.html#checkcancel

  async function main() {
    // To cancel a Check, you'd need to have an account which has sent a Check with an 'Expiration' field pass its time
    // You could use 'create_check.js' on the same folder to import an account 'Sending Account'

    seed = ""

    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    wallet = xrpl.Wallet.fromSeed(seed)

    console.log(" Sending Account:", wallet.address)
    console.log("            Seed:", wallet.seed)

    // Query the account's objects (Type: Check)
    const response = await client.request({
        "command": "account_objects",
        "account": wallet.address,
        "ledger_index": "validated",
        "type": "check"
    })

    // Only append Checks that were sent by this Account, incoming Checks are ignored since we have no authority to cancel them
    var outgoing = []
    for (var i = 0; i < response.result.account_objects.length; i++) {
        if (response.result.account_objects[i].Account == wallet.address) {
            outgoing.push(response.result.account_objects[i])
        }
    }

    // Get current datetime
    const date = new Date();

    // Only append outgoing Checks that have passed their Expiration time
    var outgoing_cancelable = []
    for (var i = 0; i < outgoing.length; i++) {
        const CancelAfter_date = new Date(xrpl.rippleTimeToISOTime(outgoing[i].Expiration));
        if (CancelAfter_date.getTime() <= date.getTime()) {
            outgoing_cancelable.push(outgoing[i])
        }
    }
    
    if (outgoing_cancelable.length != 0 ) {
        console.log("\nOutgoing/Sent Check(s) that have passed their Expiration time:")
        for (var i = 0; i < outgoing_cancelable.length; i++) {
            console.log(`\n${i+1}. Index (ObjectID/keylet): ${outgoing_cancelable[i].index}`)
            console.log(` - Account: ${outgoing_cancelable[i].Account})`)
            console.log(` - Destination: ${outgoing_cancelable[i].Destination}`)
            console.log(` - Amount: ${outgoing_cancelable[i].SendMax} drops`)
        }

        console.log(`\nWe're going to cancel Check ${outgoing_cancelable[0].index} which was destined for ${outgoing_cancelable[0].Destination} @ ${outgoing_cancelable[0].SendMax} drops...`)

        // Construct CheckCancel transaction
        const CheckCancel_tx = await client.autofill({
            "TransactionType": "CheckCancel",
            "Account": wallet.address,
            "CheckID": outgoing_cancelable[0].index
        })

        const CheckCancel_tx_signed = wallet.sign(CheckCancel_tx)

        console.log("\n Transaction hash:", CheckCancel_tx_signed.hash)

        const CheckCancel_tx_result = await client.submitAndWait(CheckCancel_tx_signed.tx_blob)
        console.log("\n Submit result:", CheckCancel_tx_result.result.meta.TransactionResult)
        console.log("    Tx content:", CheckCancel_tx_result)
    } else {
        console.log(`\nThere are no Checks that have pass their Expiration due date on account ${wallet.address}`)
    }

    client.disconnect()
    // End main()
}

main()
