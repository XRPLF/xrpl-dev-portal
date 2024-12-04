'use strict'
const xrpl = require('xrpl')

// Define parameters. Edit this code with your values before running it.
const secret = "s████████████████████████████" // Replace with your secret
const check_id =  "49D339B76FAB3FE3C9DFAD32EB7DB9269FD07B07E165DD7BAFDF68D14CE6CAB8"
const amount = "30000000" // Replace with the amount you want to cash
               // String for XRP in drops
               // {currency, issuer, value} object for token amount

async function main() {
  try {
    // Connect to Testnet
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Instantiate a wallet -----------------------------------------------
    const wallet = xrpl.Wallet.fromSeed(secret)
    console.log("Wallet address: ", wallet.address)

    // Check if the check ID is provided ----------------------------------
    if (check_id == "49D339B76FAB3FE3C9DFAD32EB7DB9269FD07B07E165DD7BAFDF68D14CE6CAB8") {
        console.log("Please edit this snippet to provide your own check ID. You can get a check ID by running create-check.js.")
        return
    }

    // Prepare the transaction ------------------------------------------------
    const checkcash = {
        TransactionType: "CheckCash",
        Account: wallet.address,
        CheckID: check_id,
        Amount: amount
    }

    // Submit the transaction -------------------------------------------------
    const tx = await client.submitAndWait(
      checkcash, 
      { autofill: true, 
          wallet: wallet }
    )

    // Confirm transaction results --------------------------------------------
    console.log(`Transaction result: ${JSON.stringify(tx, null, 2)}`)

    if (tx.result.meta.TransactionResult === "tesSUCCESS") {
      // submitAndWait() only returns when the transaction's outcome is final,
      // so you don't also have to check for validated: true.
      console.log("Transaction was successful.")

      console.log("Balance changes:", 
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
      )
    }

    // Disconnect -------------------------------------------------------------
    await client.disconnect()
  } catch (error) {
    console.log("Error: ", error)
  }
}

main()
