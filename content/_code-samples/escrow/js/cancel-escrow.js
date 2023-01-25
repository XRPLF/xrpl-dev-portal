'use strict'
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

const main = async () => {
  try {
    // Connect -------------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    
    // Get credentials from the Testnet Faucet ------------------------------------
    console.log("Requesting an address from the Testnet faucet...");
    const { wallet } = await client.fundWallet();
    console.log("Wallet: ", wallet.address);

    const escrowCancelTransaction = {
      "Account": wallet.address,
      "TransactionType": "EscrowCancel",
      "Owner": wallet.address,
      "OfferSequence": 34821001, // Sequence number
    };

    xrpl.validate(escrowCancelTransaction);

    // Sign and submit the transaction --------------------------------------------
    console.log('Signing and submitting the transaction:', JSON.stringify(escrowCancelTransaction, null,  "\t"));
    const response  = await client.submitAndWait(escrowCancelTransaction, { wallet });
    console.log(`Finished submitting! ${JSON.stringify(response.result, null, "\t")}`);

    await client.disconnect();
    
  } catch (error) {
    console.log(error);
  }
}

main()
