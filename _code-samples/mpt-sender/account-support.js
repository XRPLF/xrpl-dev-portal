// ******************************************************
// ************* Get the Preferred Network **************
// ******************************************************  

function getNet() {
  let net
  if (document.getElementById("tn").checked) net = "wss://s.altnet.rippletest.net:51233/"
  if (document.getElementById("dn").checked) net = "wss://s.devnet.rippletest.net:51233/"
  return net
} // End of getNet()
              
// *******************************************************
// ************* Get Account *****************************
// *******************************************************

async function getAccount() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let faucetHost = null
  const my_wallet = (await client.fundWallet(null, { faucetHost})).wallet
  const newAccount = [my_wallet.address, my_wallet.seed]
  return (newAccount)
  client.disconnect()
} // End of getAccount()

async function getNewAccount1() {
  account1address.value = "Getting new account."
  const accountInfo= await getAccount()
  account1address.value = accountInfo[0]
  account1seed.value = accountInfo[1]
}

async function getNewAccount2() {
  account2address.value = "Getting new account."
  const accountInfo= await getAccount()
  account2address.value = accountInfo[0]
  account2seed.value = accountInfo[1]
}

// *****************************************************
// ********** Get Account from Seed ******************** 
// *****************************************************

async function getAccountFromSeed(my_seed) {
  const net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = '\nConnected, finding wallet.\n'
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(my_seed)
// ----------------------Populate the fields for left and right accounts.
  const address = wallet.address
  client.disconnect()
  return (address)
} // End of getAccountFromSeed()

async function getAccountFromSeed1() {
  account1address.value = await getAccountFromSeed(account1seed.value)
}

async function getAccountFromSeed2() {
  account2address.value = await getAccountFromSeed(account2seed.value)
}

function gatherAccountInfo() {
  let accountData = account1name.value + "\n" + account1address.value + "\n" + account1seed.value + "\n"
  accountData += account2name.value + "\n" + account2address.value + "\n" + account2seed.value
  resultField.value = accountData
}

function distributeAccountInfo() {
  let accountInfo = resultField.value.split("\n")
  account1name.value = accountInfo[0]
  account1address.value = accountInfo[1]
  account1seed.value = accountInfo[2]
  account2name.value = accountInfo[3]
  account2address.value = accountInfo[4]
  account2seed.value = accountInfo[5]
}

async function getBalance() {
  const net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  xrpBalanceField.value = await client.getXrpBalance(accountAddressField.value)
}

function populate1() {
  accountNameField.value = account1name.value
  accountAddressField.value = account1address.value
  accountSeedField.value = account1seed.value
  getBalance()
}

function populate2() {
  accountNameField.value = account2name.value
  accountAddressField.value = account2address.value
  accountSeedField.value = account2seed.value
  getBalance()
}
