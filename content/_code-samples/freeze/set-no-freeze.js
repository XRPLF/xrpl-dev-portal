const xrpl = require('xrpl')

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233') 
  await client.connect()
  console.log("Connected to Testnet")

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage)
  })

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

  console.log('Sign and submit the transaction:', accountSetTx)
  await client.submitReliable(wallet, accountSetTx)
  
  console.log("Finished submitting. Now disconnecting.")
  await client.disconnect()

  // End main()
}

main().catch(console.error)