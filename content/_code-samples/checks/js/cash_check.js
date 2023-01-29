'use strict'
const xrpl = require('xrpl');

const secret = "sEdTPPEeMH6SAgpo6rSj8YW7a9vFfUj";
const checkId =  "505E0A4CCBCC971EE07DCD25611A612830CFFA4D50DBC04947EF952D898C94F3";
const amount = "12";

const main = async () => {
    try {
        // Connect to the testnet
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();


        // Generate a wallet ------------------------------------------------------
        const wallet = await xrpl.Wallet.fromSeed(secret);
        console.log("Wallet address: ", wallet.address);

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