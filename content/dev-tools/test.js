import xrpl from "xrpl"

const client = new xrpl.Client('wss://amm.devnet.rippletest.net:51233/')

// The snippet walks us through creating and finishing escrows.
async function sendTx(){
  await client.connect()

  // creating wallets as prerequisite
  const wallet = xrpl.Wallet.generate()
  const response = await client.fundWallet(wallet, { usageContext: "xrpl.org-faucet" })
  console.log(response)

  await client.disconnect()
}

void sendTx()
