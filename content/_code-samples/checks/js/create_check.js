'use strict'
const xrpl = require('xrpl');

// Account secret key
const secret = "sEdTPPEeMH6SAgpo6rSj8YW7a9vFfUj";
// Destination address for the check
const destination = "rP2BPdQ9ANSK7kVWT9jkjjDxCxL7xrC7oD";
// Amount of XRP in drops to send
const amount = "10000000";

const main = async () => {
    try {
        // Connect to the XRP Ledger Test Net
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();

        const wallet = await xrpl.Wallet.fromSeed(secret);
        console.log(`Wallet Address: ${JSON.stringify(wallet.address)}`);

        // Prepare the transaction
        const request = {
            "TransactionType": "CheckCreate",
            "Account": wallet.address,
            "Destination": destination,
            "SendMax": amount,
            "DestinationTag": 1,
            "Fee": "12"
        };
        // Auto-fill the sequence number
        const prepared = await client.autofill(request);

        // Submit the transaction
        const tx = await client.submitAndWait(prepared, { wallet });
        console.log(`Transaction: ${JSON.stringify(tx, null, "\t")}`);

    } catch (error) {
        console.error(`Error: ${error}`)
    }
};
main();