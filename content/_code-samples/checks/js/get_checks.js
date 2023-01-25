'use strict'
const xrpl = require('xrpl');

const address = "rEDvX5pbdgC7rYp2eHawTqr5smN7ikMB4r"; // <-- Change this to your account

const main = async () => {
  try {
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    let currMarker = null;
    let account_objects = [];

    // Loop through all account objects until marker is undefined
    while(currMarker !== 'undefined'){

        const payload = {
            "command": "account_objects",
            "account": address,
            "ledger_index": "validated",
            "type": "check",
        };

        if(currMarker !== null) {
            payload.marker = currMarker;
        };

        let { result: { account_objects : checks, marker } } = await client.request(payload);

        if (typeof marker === 'undefined' || marker === null || marker === currMarker) {
            currMarker = 'undefined';
        } else {
            currMarker =  marker;
        };

        account_objects.push(...checks);
    };
    
    // Response: --------------------------------------------------------------
    console.log("Final transaction result:", JSON.stringify(account_objects, null, "\t"));
    await client.disconnect();
    
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}

main();
