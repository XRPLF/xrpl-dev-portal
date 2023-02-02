'use strict'
const xrpl = require('xrpl');

const address = "rEYyvXCwv1WJ6a8hW4sBx5afXbJTK97bbR"; // <-- Change this to your account

const main = async () => {
  try {
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    let currMarker = null;
    let account_objects = [];

    // Loop through all account objects until marker is undefined --------------
    do {
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

        if (marker === currMarker) {
            break;
        }
        
        account_objects.push(...checks);
        currMarker = marker;
        
    } while (typeof currMarker !== "undefined")
    
    // Print results ----------------------------------------------------------
    if (account_objects.length === 0) {
        console.log("No checks found.");
    } else {
      console.log("Checks: \n", JSON.stringify(account_objects, null, "\t"));
    };

    // Disconnect -------------------------------------------------------------
    await client.disconnect();

  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}

main();
