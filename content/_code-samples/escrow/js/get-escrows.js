'use strict'
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl');
};

const address = "rNQhxJsQ5a4newq4acmWsrn8PbrSjLu69p";
const source = ""; // Optional: filter by source
const destination = ""; // Optional: filter by destination

const main = async () => {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    let currMarker = null;
    let account_objects = [];
    
    // Loop through all account objects until marker is undefined
    do {

        const payload = {
            "command": "account_objects",
            "account": address,
            "ledger_index": "validated",
            "type": "escrow",
        };

        if(currMarker !== null) {
            payload.marker = currMarker;
        };

        let { result: { account_objects : escrows, marker } } = await client.request(payload);

        if(marker === currMarker){
            break;
        }

        account_objects.push(...escrows);
        currMarker =  marker;
    } while (typeof currMarker !== 'undefined')

    if (source.length > 0) {
        account_objects = account_objects.filter((escrow) =>  escrow.Account === source);
    };

    if (destination.length > 0) {
        account_objects = account_objects.filter((escrow) =>  escrow.Destination === destination);
    };

    if(account_objects.length === 0) {
        console.log("No escrows found.");
        return;
    };

    console.log(account_objects);
};

main();