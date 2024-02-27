// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()
  console.log("Connected to Testnet")

  // Get credentials from the Testnet Faucet ------------------------------------
  console.log("Requesting an address from the Testnet faucet...")
  const { wallet, balance } = await client.fundWallet()

  // Submit an AccountSet transaction to enable No Freeze ----------------------
  const accountSetTx = {
    TransactionType: "AccountSet",
    Account: wallet.address,
    // Set the NoFreeze flag for this account
    SetFlag: xrpl.AccountSetAsfFlags.asfNoFreeze
  }

  // Best practice for JS users - validate checks if a transaction is well-formed
  xrpl.validate(accountSetTx)

  console.log('Sign and submit the transaction:', accountSetTx)
  await client.submitAndWait(accountSetTx, { wallet: wallet })

  // Done submitting
  console.log("Finished submitting. Now disconnecting.")
  await client.disconnect()

  // End main()
}

main().catch(console.error)
