if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Construct a CheckCash transaction to cash a Check natively on the XRPL
  // https://xrpl.org/checks.html#checks
  // https://xrpl.org/checkcash.html#checkcash

  async function main() {
    // To cash a Check, you'd need to have an account which has RECEIVED a Check that hasn't passed its Expiration date
    // You could use 'create_check.js' on the same folder to import an account which receives Checks 'Receiving Account'

    seed = ""

    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    wallet = xrpl.Wallet.fromSeed(seed)

    console.log(" Receiving Account:", wallet.address)
    console.log("              Seed:", wallet.seed)

    // Query the account's objects (Type: Check)
    const response = await client.request({
        "command": "account_objects",
        "account": wallet.address,
        "ledger_index": "validated",
        "type": "check"
    })

    // Only append Checks that were sent by other Accounts, outgoing Checks are ignored since we have no authority to cash them
    var incoming = []
    for (var i = 0; i < response.result.account_objects.length; i++) {
        if (response.result.account_objects[i].Account != wallet.address) {
            incoming.push(response.result.account_objects[i])
        }
    }

    // Get current datetime
    const date = new Date();

    // Only append incoming Checks that have not passed their Expiration date
    var incoming_cashable = []
    for (var i = 0; i < incoming.length; i++) {
        const Expiration_date = new Date(xrpl.rippleTimeToISOTime(incoming[i].Expiration));
        console.log(Expiration_date.getTime() > date.getTime())
        if (Expiration_date.getTime() > date.getTime()) {
            incoming_cashable.push(incoming[i])
        }
    }

    if (incoming_cashable.length != 0 ) {
        console.log("\nIncoming/Received Check(s) that have not passed their Expiration date:")
        for (var i = 0; i < incoming_cashable.length; i++) {
            console.log(`\n${i+1}. Index (ObjectID/keylet): ${incoming_cashable[i].index}`)
            console.log(` - Account: ${incoming_cashable[i].Account})`)
            console.log(` - Destination: ${incoming_cashable[i].Destination}`)
            console.log(` - Amount: ${incoming_cashable[i].Amount} drops`)
            console.log(` - PreviousTxnID: ${incoming_cashable[i].PreviousTxnID}`)
        }

        console.log(`\nWe're going to cash Check ${incoming_cashable[0].index} which was sent from ${incoming_cashable[0].Account} @ ${incoming_cashable[0].SendMax} drops...`)
     
        // Get the transaction's sequence, this transaction created this Escrow
        const get_check_id = await client.request({
            "command": "tx",
            "transaction": incoming_cashable[0].PreviousTxnID
        })

        // Construct CheckCash transaction
        const CheckCash_tx = await client.autofill({
            "TransactionType": "CheckCash",
            "Account": wallet.address,
            "Owner": wallet.address,
            "CheckID": get_check_id.result.CheckID 
        })

        const CheckCash_tx_signed = wallet.sign(CheckCash_tx)

        console.log("\n Transaction hash:", CheckCash_tx_signed.hash)

        const CheckCash_tx_result = await client.submitAndWait(CheckCash_tx_signed.tx_blob)
        
        console.log("\n Submit result:", CheckCash_tx_result.result.meta.TransactionResult)
        console.log("    Tx content:", CheckCash_tx_result)
    } else {
        console.log(`\nThere are no Checks that have pass their Expiration date on account ${wallet.address}`)
    }

    client.disconnect()
    // End main()
}

main()
