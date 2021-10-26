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

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting an address from the Testnet faucet...")
  const { wallet, balance } = await client.fundWallet()

  // Prepare an AccountSet transaction to enable global freeze -----------------
  const accountSetTx = {
    TransactionType: "AccountSet",
    Account: wallet.address,
    // Set a flag to turn on a global freeze on this account
    SetFlag: xrpl.AccountSetAsfFlags.asfGlobalFreeze
  }

  // Best practice for JS users - validate checks if a transaction is well-formed
  xrpl.validate(accountSetTx)

  // Sign and submit the AccountSet transaction to enable a global freeze ------
  console.log('Signing and submitting the transaction:', accountSetTx)
  await client.submitAndWait(accountSetTx, { wallet })
  console.log(`Finished submitting! ${wallet.address} should be frozen now.`)

  // Investigate ---------------------------------------------------------------
  console.log(
    `You would investigate whatever prompted you to freeze the account now...`)
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Now we disable the global freeze ------------------------------------------
  const accountSetTx2 = {
    TransactionType: "AccountSet",
    Account: wallet.address,
    // ClearFlag let's us turn off a global freeze on this account
    ClearFlag: xrpl.AccountSetAsfFlags.asfGlobalFreeze
  }

  // Best practice for JS users - validate checks if a transaction is well-formed
  xrpl.validate(accountSetTx2)

  // Sign and submit the AccountSet transaction to end a global freeze ---------
  console.log('Signing and submitting the transaction:', accountSetTx2)
  const result = await client.submitAndWait(accountSetTx2, { wallet: wallet })
  console.log("Finished submitting!")

  // Global freeze disabled
  console.log("Disconnecting")
  await client.disconnect()

  // End main()
}

main().catch(console.error)
