const xrpl = require('xrpl')

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233') 
  await client.connect()

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage)
  })

  const { wallet, balance } = await client.fundWallet()

  // Prepare a settings transaction to enable global freeze
  const accountSetTx = {
    TransactionType: "AccountSet",
    Account: wallet.address,
    SetFlag: xrpl.AccountSetAsfFlags.asfGlobalFreeze
  }

  // Sign and submit the settings transaction
  console.log('Sign and submit the transaction:', accountSetTx)

  await client.submitReliable(wallet, accountSetTx)

  client.disconnect()
}

main().catch(console.error)