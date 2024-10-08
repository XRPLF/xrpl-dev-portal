'use strict'
const xrpl = require('xrpl')

async function main() {
    try {
        // Connect to the XRP Ledger Test Net -------------------------------------
        console.log("Connecting to Testnet...")
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
        await client.connect()
        console.log("Connected.")

        // Get a new wallet ---------------------------------------------------
        console.log("Generating new wallet...")
        const wallet = (await client.fundWallet()).wallet
        console.log("  Address:", wallet.address)
        console.log("  Seed:", wallet.seed)

        // Prepare the transaction --------------------------------------------
        const checkcreate = {
            "TransactionType": "CheckCreate",
            "Account": wallet.address,
            "Destination": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
            "SendMax": xrpl.xrpToDrops(120), // Can be more than you have
            "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291"
        }

        // Submit the transaction ---------------------------------------------
        console.log("Submitting transaction...")
        const tx = await client.submitAndWait(
            checkcreate, 
            { autofill: true, 
                wallet: wallet }
        )

        // Get transaction result and Check ID---------------------------------
        console.log(`Transaction: ${JSON.stringify(tx, null, 2)}`)

        if (tx.result.meta.TransactionResult === "tesSUCCESS") {
            let checkID = null
            for (const node of tx.result.meta.AffectedNodes) {
                if (node?.CreatedNode && 
                    node.CreatedNode?.LedgerEntryType == "Check") {
                    checkID = node.CreatedNode.LedgerIndex
                    break
                }
            }
    
            if (checkID) {
                console.log(`Check ID: ${checkID}`)
            } else {
                console.log("Unable to find the CheckID from parsing the metadata. Look for the LedgerIndex of the 'Check' object within 'meta'.")
            }
        } else {
            console.log("Transaction failed with result code "+
                        tx.result.meta.TransactionResult)
        }

        // Disconnect ---------------------------------------------------------
        await client.disconnect()
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

main()
