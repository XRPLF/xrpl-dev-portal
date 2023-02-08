'use strict'
const xrpl = require('xrpl');
const crypto = require('crypto');
const hash = crypto.createHash('sha512');

// Destination address for the check
const destination = "rP2BPdQ9ANSK7kVWT9jkjjDxCxL7xrC7oD";
// Amount of XRP in drops to send
const amount = "10000000";

const main = async () => {
    try {
        // Connect to the XRP Ledger Test Net -------------------------------------
        console.log("Connecting to Test Net...");
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();
        console.log("Connected to Test Net");

        // Generating new wallet --------------------------------------------------
        console.log("Generating new wallet...");
        const { wallet } = await client.fundWallet();
        console.log("Wallet Address:", wallet.address);
        console.log("Wallet Seed:", wallet.seed);

        // Prepare the transaction ------------------------------------------------
        const request = {
            "TransactionType": "CheckCreate",
            "Account": wallet.address,
            "Destination": destination,
            "SendMax": amount,
            "DestinationTag": 1,
            "Fee": "12"
        };

        // Submit the transaction -------------------------------------------------
        console.log("Submitting transaction...");
        const tx = await client.submitAndWait(request, { wallet });

        // Get the check ID and transaction result --------------------------------
        const checkID = tx.result.meta.AffectedNodes.reduce((prevOutput, node) => {
            if (node?.CreatedNode && node.CreatedNode?.LedgerEntryType == "Check") {
                return node.CreatedNode.LedgerIndex;
            } else {
                return prevOutput;
            }
        }, null);

        console.log(checkID ? `Check ID: ${checkID}` : "Unable to find the CheckID from parsing the metadata. Look for the LedgerIndex of the 'Check' object within 'meta'.");
        console.log(`Transaction: ${JSON.stringify(tx, null, "\t")}`);

        // Disconnect -------------------------------------------------------------
        await client.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`)
    }
};
main();
