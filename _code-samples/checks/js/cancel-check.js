const xrpl = require('xrpl');

const secret = "sEdTPPEeMH6SAgpo6rSj8YW7a9vFfUj"; // TODO: Replace with your secret
const checkId = ""; // TODO: Replace with your check ID

const main = async ()=> {
  try {
      
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    // Check if the check ID is provided --------------------------------------
    if (checkId.length === 0) {
      console.log("Please edit this snippet to provide a check ID. You can get a check ID by running create-check.js.");
      return;
    }
    
    // Prepare ----------------------------------------------------------------
    const wallet = await xrpl.Wallet.fromSeed(secret);
    console.log("Wallet address: ", wallet.address);
    
    const checkCancelRequest = {
        "TransactionType": "CheckCancel",
        "Account": wallet.address,
        "CheckID": checkId
    };

    // Auto-fill the fields ---------------------------------------------------
    const prepared = await client.autofill(checkCancelRequest);

    // Submit -----------------------------------------------------------------
    const response = await client.submitAndWait(prepared, { wallet });
    console.log(JSON.stringify(response.result, null, "\t"));

    // Disconnect -------------------------------------------------------------
    await client.disconnect();

  } catch (error) {
      console.error(`Error: ${error}`);
  }
}

main();