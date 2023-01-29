const xrpl = require('xrpl');

const secret = "sEdTPPEeMH6SAgpo6rSj8YW7a9vFfUj";
const checkId = "505E0A4CCBCC971EE07DCD25611A612830CFFA4D50DBC04947EF952D898C94F3"; // Replace with your check ID

const main = async ()=> {
  try {
      
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    // Prepare ----------------------------------------------------------------
    const wallet = await xrpl.Wallet.fromSeed(secret);
    const checkCancelRequest = {
        "TransactionType": "CheckCancel",
        "Account": wallet.address,
        "CheckID": checkId
    };

    // Auto-fill the fields ---------------------------------------------------
    const prepared = await client.autofill(request);

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