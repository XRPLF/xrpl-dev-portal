if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Construct an EscrowCancel transaction to cancel an Escrow which has passed its CancelAfter due date
  // https://xrpl.org/escrow.html#escrow
  // https://xrpl.org/escrowcancel.html#escrowcancel

  async function main() {
    // To cancel an Escrow, you'd need to have an account which has sent an Escrow with a 'CancelAfter' field pass its time
    // You could use 'create-escrow.js' on the same folder to import an account

    seed = ""

    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    wallet = xrpl.Wallet.fromSeed(seed)

    console.log(" Sending Account:", wallet.address)
    console.log("            Seed:", wallet.seed)

    // Query the account's objects (Type: Escrow)
    const response = await client.request({
        "command": "account_objects",
        "account": wallet.address,
        "ledger_index": "validated",
        "type": "escrow"
    })

    // Only append Escrows that were sent by this Account, incoming Escrows are ignored since we have no authority to cancel them
    var outgoing = []
    for (var i = 0; i < response.result.account_objects.length; i++) {
        if (response.result.account_objects[i].Account == wallet.address) {
            outgoing.push(response.result.account_objects[i])
        }
    }

    // Get current datetime
    const date = new Date();

    // Only append outgoing Escrows that have passed their CancelAfter time
    var outgoing_cancelable = []
    for (var i = 0; i < outgoing.length; i++) {
        const CancelAfter_date = new Date(xrpl.rippleTimeToISOTime(outgoing[i].CancelAfter));
        if (CancelAfter_date.getTime() <= date.getTime()) {
            outgoing_cancelable.push(outgoing[i])
        }
    }
    
    if (outgoing_cancelable.length != 0 ) {
        console.log("\nOutgoing/Sent escrow(s) that have passed their CancelAfter time:")
        for (var i = 0; i < outgoing_cancelable.length; i++) {
            console.log(`\n${i+1}. Index (ObjectID/keylet): ${outgoing_cancelable[i].index}`)
            console.log(` - Account: ${outgoing_cancelable[i].Account})`)
            console.log(` - Destination: ${outgoing_cancelable[i].Destination}`)
            console.log(` - Amount: ${outgoing_cancelable[i].Amount} drops`)
            console.log(` - PreviousTxnID: ${outgoing_cancelable[i].PreviousTxnID}`)
        }

        console.log(`\nWe're going to cancel Escrow ${outgoing_cancelable[0].index} which was sending ${outgoing_cancelable[0].Amount} drops to ${outgoing_cancelable[0].Destination}`)

        // Get the transaction's sequence, this transaction created this Escrow
        const get_escrow_seq = await client.request({
            "command": "tx",
            "transaction": outgoing_cancelable[0].PreviousTxnID
        })

        // Construct EscrowCancel transaction
        const EscrowCancel_tx = await client.autofill({
            "TransactionType": "EscrowCancel",
            "Account": wallet.address,
            "Owner": wallet.address,
            "OfferSequence": get_escrow_seq.result.Sequence 
        })

        const EscrowCancel_tx_signed = wallet.sign(EscrowCancel_tx)

        console.log("\n Transaction hash:", EscrowCancel_tx_signed.hash)

        const EscrowCancel_tx_result = await client.submitAndWait(EscrowCancel_tx_signed.tx_blob)
        console.log("\n Submit result:", EscrowCancel_tx_result.result.meta.TransactionResult)
        console.log("    Tx content:", EscrowCancel_tx_result)
    } else {
        console.log(`\nThere are no Escrows that have pass their CancelAfter due date on account ${wallet.address}`)
    }

    client.disconnect()
    // End main()
}

main()
