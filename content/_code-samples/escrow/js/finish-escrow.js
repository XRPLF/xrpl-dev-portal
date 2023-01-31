if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Construct an EscrowFinish transaction to finish an Escrow which has passed its FinishAfter due date
  // https://xrpl.org/escrow.html#escrow
  // https://xrpl.org/escrowfinish.html#escrowfinish

  async function main() {
    // To finish an Escrow, you'd need to have an account which has sent an Escrow with a 'FinishAfter' field pass its time
    // You could use 'create_escrow.js' on the same folder to import an account

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

    // Only append Escrows that were sent by this Account, outgoing Escrows are ignored since we have no authority to finish them
    var outgoing = []
    for (var i = 0; i < response.result.account_objects.length; i++) {
        if (response.result.account_objects[i].Account == wallet.address) {
            outgoing.push(response.result.account_objects[i])
        }
    }
    // Get current datetime
    const date = new Date();

    // Only append outgoing Escrows that have passed their FinishAfter time
    var outgoing_finishable = []
    for (var i = 0; i < outgoing.length; i++) {
        const FinishAfter_date = new Date(xrpl.rippleTimeToISOTime(outgoing[i].FinishAfter));
        if (FinishAfter_date.getTime() <= date.getTime()) {
            outgoing_finishable.push(outgoing[i])
        }
    }

    if (outgoing_finishable.length != 0 ) {
        console.log("\nOutgoing/Sent escrow(s) that have passed their FinishAfter time:")
        for (var i = 0; i < outgoing_finishable.length; i++) {
            console.log(`\n${i+1}. Index (ObjectID/keylet): ${outgoing_finishable[i].index}`)
            console.log(` - Account: ${outgoing_finishable[i].Account})`)
            console.log(` - Destination: ${outgoing_finishable[i].Destination}`)
            console.log(` - Amount: ${outgoing_finishable[i].Amount} drops`)
            console.log(` - PreviousTxnID: ${outgoing_finishable[i].PreviousTxnID}`)
        }

        console.log(`\nWe're going to finish Escrow ${outgoing_finishable[0].index} which was sending ${outgoing_finishable[0].Amount} drops to ${outgoing_finishable[0].Destination}`)
     
        // Get the transaction's sequence, this transaction created this Escrow
        const get_escrow_seq = await client.request({
            "command": "tx",
            "transaction": outgoing_finishable[0].PreviousTxnID
        })

        // Construct EscrowFinish transaction
        const EscrowFinish_tx = await client.autofill({
            "TransactionType": "EscrowFinish",
            "Account": wallet.address,
            "Owner": wallet.address,
            "OfferSequence": get_escrow_seq.result.Sequence 
        })

        const EscrowFinish_tx_signed = wallet.sign(EscrowFinish_tx)

        console.log("\n Transaction hash:", EscrowFinish_tx_signed.hash)

        const EscrowFinish_tx_result = await client.submitAndWait(EscrowFinish_tx_signed.tx_blob)
        
        console.log("\n Submit result:", EscrowFinish_tx_result.result.meta.TransactionResult)
        console.log("    Tx content:", EscrowFinish_tx_result)
    } else {
        console.log(`\nThere are no Escrows that have pass their FinishAfter due date on account ${wallet.address}`)
    }

    client.disconnect()
    // End main()
}

main()
