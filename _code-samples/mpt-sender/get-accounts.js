// ******************************************************
// ************* Get the Preferred Network **************
// ******************************************************   

function getNet() {
  let net
  if (document.getElementById("tn").checked) net = "wss://s.altnet.rippletest.net:51233"
  if (document.getElementById("dn").checked) net = "wss://s.devnet.rippletest.net:51233"
  return net
} // End of getNet()
              
// *******************************************************
// ************* Get Account *****************************
// *******************************************************

async function getAccount(type) {
  let net = getNet()
      
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + net + '....'
        
// This uses the default faucet for Testnet/Devnet
  let faucetHost = null

  if (type == 'left') {
    leftResultField.value = results
  } else {
    rightResultField.value = results
  }
  await client.connect()
        
  results += '\nConnected, funding wallet.'
  if (type == 'left') {
    leftResultField.value = results
  } else {
    rightResultField.value = results
  }

// -----------------------------------Create and fund a test account wallet
  const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet
        
  results += '\nGot a wallet.'
  if (type == 'left') {
    leftResultField.value = results
  } else {
    rightResultField.value = results
  }       
      
// ------------------------------------------------------Get the current balance.
  const my_balance = (await client.getXrpBalance(my_wallet.address))  
        
  if (type == 'left') {
    leftAccountField.value = my_wallet.address
    leftBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    leftSeedField.value = my_wallet.seed
    results += '\nStandby account created.'
    leftResultField.value = results
  } else {
    rightAccountField.value = my_wallet.address
    rightSeedField.value = my_wallet.seed
    rightBalanceField.value = (await client.getXrpBalance(my_wallet.address))
    results += '\nOperational account created.'
    rightResultField.value = results
  }
// --------------- Capture the seeds for both accounts for ease of reload.
  seeds.value = leftSeedField.value + '\n' + rightSeedField.value
  client.disconnect()
} // End of getAccount()
      
// *******************************************************
// ********** Get Accounts from Seeds ******************** 
// *******************************************************

async function getAccountsFromSeeds() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  leftResultField.value = results
  await client.connect()
  results += '\nConnected, finding wallets.\n'
  leftResultField.value = results
      
// -------------------------------------------------Find the test account wallets.    
  var lines = seeds.value.split('\n')
  const left_wallet = xrpl.Wallet.fromSeed(lines[0])
  const right_wallet = xrpl.Wallet.fromSeed(lines[1])
      
// -------------------------------------------------------Get the current balance.
  const left_balance = (await client.getXrpBalance(left_wallet.address))  
  const right_balance = (await client.getXrpBalance(right_wallet.address))  
        
// ----------------------Populate the fields for Standby and Operational accounts.
  leftAccountField.value = left_wallet.address
  leftSeedField.value = left_wallet.seed
  leftBalanceField.value = (await client.getXrpBalance(left_wallet.address))
      
  rightAccountField.value = right_wallet.address
  rightSeedField.value = right_wallet.seed
  rightBalanceField.value = (await client.getXrpBalance(right_wallet.address))
      
  client.disconnect()
            
} // End of getAccountsFromSeeds()