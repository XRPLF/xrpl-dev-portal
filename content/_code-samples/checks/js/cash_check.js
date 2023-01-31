'use strict'
const xrpl = require('xrpl');

const secret = "sEdTPPEeMH6SAgpo6rSj8YW7a9vFfUj"; // TODO: Replace with your secret
const checkId =  ""; // TODO: Replace with your check ID
const amount = "12"; // TODO: Replace with the amount you want to cash

const main = async () => {
    try {
        // Connect to the testnet
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        // Generate a wallet ------------------------------------------------------
        const wallet = await xrpl.Wallet.fromSeed(secret);
        console.log("Wallet address: ", wallet.address);

        // Check if the check ID is provided --------------------------------------
        if (checkId.length === 0) {
            console.log("Please provide a check ID");
            return;
        }

        // Prepare the transaction ------------------------------------------------
        const transaction = {
            TransactionType: "CheckCash",
            Account: wallet.address,
            CheckID: checkId,
            Amount: amount,
        };

        // Auto-fill the fields ---------------------------------------------------
        const prepared = await client.autofill(transaction);
        
        // Submit -----------------------------------------------------------------
        const response = await client.submitAndWait(prepared, { wallet });
        console.log(JSON.stringify(response.result, null, "\t"));

        // Disconnect -------------------------------------------------------------
        await client.disconnect();
    } catch (error) {
        console.log("Error: ", error);
    }
}

main()