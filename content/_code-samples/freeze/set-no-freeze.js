const xrpl = require('xrpl')

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233') 
  await client.connect()
  console.log("Connected to TestNet")

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage)
  })

  const { wallet, balance } = await client.fundWallet()

  // Prepare a settings transaction to enable global freeze
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
}

main().catch(console.error)