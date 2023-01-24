'use strict'
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

const cc = require('five-bells-condition')
const crypto = require('crypto')

const main = async () => {
  try {

    // Construct condition and fulfillment ---------------------------------------
    const preimageData = crypto.randomBytes(32)
    const myFulfillment = new cc.PreimageSha256()
    myFulfillment.setPreimage(preimageData)
    const conditionHex = myFulfillment.getConditionBinary().toString('hex').toUpperCase()

    console.log('Condition:', conditionHex)
    console.log('Fulfillment:', myFulfillment.serializeBinary().toString('hex').toUpperCase())

    // Connect -------------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    // Get credentials from the Testnet Faucet -----------------------------------
    console.log("Requesting an address from the Testnet faucet...")
    const { wallet, balance } = await client.fundWallet();
    console.log("Wallet: ",wallet.address);

    const firstRippleEpoch = 946684800;
    const escrowCreateTransaction = {
      "TransactionType": "EscrowCreate",
      "Account": wallet.address,
      "Destination": wallet.address,
      "Amount": "6000000", //drops XRP
      "DestinationTag": 2023,
      "Condition": conditionHex,
      "Fee": "12",
      "FinishAfter": Math.floor((new Date().getTime() / 1000) + 120) - firstRippleEpoch, // 2 minutes from now
  };

    xrpl.validate(escrowCreateTransaction);

    // Sign and submit the transaction --------------------------------------------
    console.log('Signing and submitting the transaction:', escrowCreateTransaction);
    const response  = await client.submitAndWait(escrowCreateTransaction, { wallet });
    console.log(`Finished submitting! ${JSON.stringify(response.result)}`);

    await client.disconnect();
    
  } catch (error) {
    console.log(error);
  }
}

main()
