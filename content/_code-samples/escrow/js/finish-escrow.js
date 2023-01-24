'use strict'
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

const secret = "sEdTPPEeMH6SAgpo6rSj8YW7a9vFfUj";

const main = async () => {
  try {
    // Connect -------------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    const wallet = await xrpl.Wallet.fromSeed(secret);

    const escrowFinishTransaction = {
        "Account": wallet.address,
        "TransactionType": "EscrowFinish",
        "Owner": wallet.address,
        // This should equal the sequence number of the escrow transaction
        "OfferSequence": 7,
        // Crypto condition that must be met before escrow can be completed, passed on escrow creation
        "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100", 
        // Fulfillment of the condition, passed on escrow creation
        "Fulfillment": "A0028000"
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
