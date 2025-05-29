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
  resultField.value = `===Getting Account===\n\nConnected to ${net}.`
  try {
    let faucetHost = null
    const my_wallet = (await client.fundWallet(null, { faucetHost})).wallet
    const newAccount = [my_wallet.address, my_wallet.seed]
    return (newAccount)
  }
  catch (error) {
    console.error('===Error getting account:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} // End of getAccount()

async function getNewAccount1() {
  account1address.value = "=== Getting new account. ===\n\n"
  account1seed.value = ""
  const accountInfo= await getAccount()
  account1address.value = accountInfo[0]
  account1seed.value = accountInfo[1]
}

async function getNewAccount2() {
  account2address.value = "=== Getting new account. ===\n\n"
  account2seed.value = ""
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
  let results = '===Finding wallet.===\n\n'
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(my_seed)
    const address = wallet.address
    results += "===Wallet found.===\n\n"
    results += "Account address: " + address + "\n\n"
    resultField.value = results
    return (address)
  }
  catch (error) {
    console.error('===Error getting account from seed:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} // End of getAccountFromSeed()

// *****************************************************
// ********** Get Account from Seed1 ******************* 
// *****************************************************

async function getAccountFromSeed1() {
  account1address.value = await getAccountFromSeed(account1seed.value)
}

// *****************************************************
// ********** Get Account from Seed2 ******************* 
// *****************************************************

async function getAccountFromSeed2() {
  account2address.value = await getAccountFromSeed(account2seed.value)
}

// *****************************************************
// ************ Gather Account Info ********************
// *****************************************************

function gatherAccountInfo() {
  let accountData = account1name.value + "\n" + account1address.value + "\n" + account1seed.value + "\n"
  accountData += account2name.value + "\n" + account2address.value + "\n" + account2seed.value
  resultField.value = accountData
}

// *****************************************************
// ********** Distribute Account Info ******************
// *****************************************************

function distributeAccountInfo() {
  let accountInfo = resultField.value.split("\n")
  account1name.value = accountInfo[0]
  account1address.value = accountInfo[1]
  account1seed.value = accountInfo[2]
  account2name.value = accountInfo[3]
  account2address.value = accountInfo[4]
  account2seed.value = accountInfo[5]
}

// *****************************************************
// ************ Populate Active Form 1 *****************
// *****************************************************

function populate1() {
  accountNameField.value = account1name.value
  accountAddressField.value = account1address.value
  accountSeedField.value = account1seed.value
  getXrpBalance()
}

// *****************************************************
// ************ Populate Active Form 2 *****************
// *****************************************************

function populate2() {
  accountNameField.value = account2name.value
  accountAddressField.value = account2address.value
  accountSeedField.value = account2seed.value
  getXrpBalance()
}

// *******************************************************
// **************** Get XRP Balance  *********************
// *******************************************************

async function getXrpBalance() {
  const net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Getting XRP balance...===\n\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const balance = await client.getXrpBalance(wallet.address)
    results += accountNameField.value + " current XRP balance: " + balance + "\n\n"
    xrpBalanceField.value = await client.getXrpBalance(accountAddressField.value)
    resultField.value = results
  }
  catch (error) {
    console.error('Error getting XRP balance:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} // End of getXrpBalance()

// *******************************************************
// ************** Get Token Balance  *********************
// *******************************************************

async function getTokenBalance() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()   
  let results = `===Connected to ${net}.===\n===Getting account token balance...===\n\n`
  resultField.value += results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const balance = await client.request({
      command: "gateway_balances",
      account: wallet.address,
      ledger_index: "validated",
    })
    results = accountNameField.value + "\'s token balance(s): " + JSON.stringify(balance.result, null, 2) + "\n"
    resultField.value += results
    xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
  }
  catch (error) {
    console.error('Error getting token balance:', error);
    results = `\nError: ${error.message}\n`
    resultField.value += results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await client.disconnect();
  }
} // End of getTokenBalance()

// *******************************************************
// **************** Scroll Results ***********************
// *******************************************************
let results

async function updateResults() {
  resultField.value += results;
  resultField.scrollTop = resultField.scrollHeight;
}

// End of updateResults()