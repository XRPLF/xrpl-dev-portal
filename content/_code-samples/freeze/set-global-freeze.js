const xrpl = require('xrpl')

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233') 
  await client.connect()

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage)
  })
  // Get credentials from the Testnet Faucet ------------------------------------
  console.log("Requesting an address from the Testnet faucet...")
  const { wallet, balance } = await client.fundWallet()

  // Prepare an AccountSet transaction to enable global freeze ------------------
  const accountSetTx = {
    TransactionType: "AccountSet",
    Account: wallet.address,
    // Set a flag to turn on a global freeze on this account
    SetFlag: xrpl.AccountSetAsfFlags.asfGlobalFreeze
  }

  // Sign and submit the AccountSet transaction to enable a global freeze -------
  console.log('Sign and submit the transaction:', accountSetTx)
  await client.submitReliable(wallet, accountSetTx)

  console.log("Finished submitting. Now disconnecting.")
  await client.disconnect()

  // End main()
}

main().catch(console.error)