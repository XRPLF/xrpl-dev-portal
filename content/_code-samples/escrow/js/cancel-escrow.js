'use strict'
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Preqrequisites:
// 1. Create an escrow using the create-escrow.js snippet
// 2. Replace the OfferSequence with the sequence number of the escrow you created
// 3. Paste the seed of the account that created the escrow
// 4. Run the snippet

const seed = "sEd7jfWyNG6J71dEojB3W9YdHp2KCjy";
const sequenceNumber = null;

const main = async () => {
  try {
    // Connect -------------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    
    // Prepare wallet to sign the transaction -------------------------------------
    const wallet = await xrpl.Wallet.fromSeed(seed);
    console.log("Wallet Address: ", wallet.address);
    console.log("Seed: ", seed);

    // Construct the escrow cancel transaction ------------------------------------

    if(!sequenceNumber){
        throw new Error("Please specify the sequence number of the escrow you created");
    };

    const escrowCancelTransaction = {
      "Account": wallet.address,
      "TransactionType": "EscrowCancel",
      "Owner": wallet.address,
      "OfferSequence": sequenceNumber, // Sequence number
    };

    xrpl.validate(escrowCancelTransaction);

    // Sign and submit the transaction --------------------------------------------
    console.log('Signing and submitting the transaction: ', JSON.stringify(escrowCancelTransaction, null,  "\t"));
    const response  = await client.submitAndWait(escrowCancelTransaction, { wallet });
    console.log(`Finished submitting! \n${JSON.stringify(response.result, null, "\t")}`);

    await client.disconnect();
    
  } catch (error) {
    console.log(error);
  }
}

main()
