const xrpl = require('xrpl')

// Connect -------------------------------------------------------------------
async function main() {
  const api = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await api.connect()
  const { wallet, balance } = await api.fundWallet()
  const prepared = await api.autofill({
    "TransactionType": "AccountSet",
    "Account": wallet.address,
    "SetFlag": "foo"
  })
  console.log("Prepared transaction:", prepared)
  api.disconnect()
}

main()
