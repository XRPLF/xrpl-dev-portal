'use strict'
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Preqrequisites:
// 1. Create an escrow using the create-escrow.js snippet
// 2. Replace the OfferSequence with the sequence number of the escrow you created
// 3. Replace the Condition and Fulfillment with the values from the escrow you created
// 4. Paste the seed of the account that created the escrow
// 5. Run the snippet

const seed = "sEd7jfWyNG6J71dEojB3W9YdHp2KCjy";
const offerSequence = null;
const condition = "";
const fulfillment = "";

const main = async () => {
  try {
    // Connect -------------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    
    // Prepare wallet to sign the transaction -------------------------------------
    const wallet = await xrpl.Wallet.fromSeed(seed);
    console.log("Wallet Address: ", wallet.address);
    console.log("Seed: ", seed);

    if((!offerSequence)|| (condition === "" || fulfillment === "")){
        throw new Error("Please specify the sequence number, condition and fulfillment of the escrow you created");
    };

    const escrowFinishTransaction = {
        "Account": wallet.address,
        "TransactionType": "EscrowFinish",
        "Owner": wallet.address,
        // This should equal the sequence number of the escrow transaction
        "OfferSequence": offerSequence,
        // Crypto condition that must be met before escrow can be completed, passed on escrow creation
        "Condition": condition, 
        // Fulfillment of the condition, passed on escrow creation
        "Fulfillment": fulfillment,
    };

    xrpl.validate(escrowFinishTransaction);

    // Sign and submit the transaction --------------------------------------------
    console.log('Signing and submitting the transaction:', JSON.stringify(escrowFinishTransaction, null,  "\t"));
    const response  = await client.submitAndWait(escrowFinishTransaction, { wallet });
    console.log(`Finished submitting! ${JSON.stringify(response.result, null,  "\t")}`);

    await client.disconnect();
    
  } catch (error) {
    console.log(error);
  }
}

main()
