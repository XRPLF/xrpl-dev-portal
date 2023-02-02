'use strict'
if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl');
};

const address = "rNQhxJsQ5a4newq4acmWsrn8PbrSjLu69p";
const sourceAddress = ""; // Optional: filter by source address
const destinationAddress = ""; // Optional: filter by destination address

const main = async () => {

    try {

        // Connect to Testnet -----------------------------------------------
        console.log("Connecting to testnet...");
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();
        console.log("Connected.");
        
        let currMarker = null;
        let account_objects = [];
        console.log("Getting escrows...");
        // Loop through all account objects until marker is undefined -------
        do {

            const payload = {
                "command": "account_objects",
                "account": address,
                "ledger_index": "validated",
                "type": "escrow",
            };

            if (currMarker !== null) {
                payload.marker = currMarker;
            };

            let { result: { account_objects: escrows, marker } } = await client.request(payload);

            if (marker === currMarker) {
                break;
            }

            account_objects.push(...escrows);
            currMarker = marker;
        } while (typeof currMarker !== 'undefined')

        // Filter by source address ----------------------------------------
        if (sourceAddress.length > 0) {
            account_objects = account_objects.filter((escrow) => escrow.Account === sourceAddress);
        };

        // Filter by destination address -----------------------------------
        if (destinationAddress.length > 0) {
            account_objects = account_objects.filter((escrow) => escrow.Destination === destinationAddress);
        };

        // Print results ---------------------------------------------------
        if (account_objects.length === 0) {
            console.log("No escrows found.");
            return;
        };

        if(sourceAddress.length === 0 && destinationAddress.length === 0) {
            console.log("Note: The sourceAddress and destinationAddress variables can be used to filter escrows by source or destination address.");
        }

        console.log(account_objects);
    } catch (err) {
        console.log(err);
    }

};

main();