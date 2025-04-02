function generateCode() {
  let v_flags = 0
  if (clawbackSlider.checked) {v_flags+=64}
  if (lockSlider.checked) {v_flags+=2}
  if (authTokensSlider.checked) {v_flags +=4}
  if (txrSlider.checked) {v_flags += 32}
  if (tradeSlider.checked) {v_flags += 16}
  if (escrowSlider.checked) {v_flags+=8}
  const mptHexString = xrpl.convertStringToHex(metadataTextArea.value)
  let v_codeBlock = "{\n  \"TransactionType\": \"MPTokenIssuanceCreate\",\n  \"Account\": \"" + accountField.value +
  "\",\n  \"AssetScale\": " + parseInt(assetScaleField.value) + ", \n  \"MaximumAmount\": \"" + maximumAmountField.value +
  "\",\n  \"TransferFee\": " + transferFeeField.value +
  ",\n  \"Flags\": " + v_flags + ",\n  \"MPTokenMetadata\": \"" + mptHexString +  "\"\n}"
  resultField.value = v_codeBlock
} //End of generateCode()
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

async function getAccount() {
  let net = getNet()
  const client = new xrpl.Client(net)
  accountField.value = "Getting new account...."
  let faucetHost = null
  await client.connect()
  let results = '\nConnected, funding wallet.'
  resultField.value = results
// ----------------------------------------Create and fund a test account wallet.
  const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet
  results += '\nGot a wallet.'
// ------------------------------------------------------Get the current balance.
  const my_balance = (await client.getXrpBalance(my_wallet.address))  
  accountField.value = my_wallet.address
  seedField.value = my_wallet.seed
  results += '\nAccount created.'
  resultField.value = results
  client.disconnect()
} // End of getAccount()
      
// *******************************************************
// ************ Get Account from Seed ******************** 
// *******************************************************

async function getAccountFromSeed() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  await client.connect()
  results += '\nConnected, finding wallets.\n'
  resultField.value = results
// --------------------------------------------------Find the account wallet.    
  const my_wallet = xrpl.Wallet.fromSeed(seedField.value)
  accountField.value = my_wallet.address
  seedField.value = my_wallet.seed      
  client.disconnect()
} // End of getAccountFromSeed()

  // *******************************************************
  // *************** Send Transaction **********************
  // *******************************************************

async function sendTransaction() {
  let v_flags = 0
  if (clawbackSlider.checked) {v_flags+=64}
  if (lockSlider.checked) {v_flags+=2}
  if (authTokensSlider.checked) {v_flags +=4}
  if (txrSlider.checked) {v_flags += 32}
  if (tradeSlider.checked) {v_flags += 16}
  if (escrowSlider.checked) {v_flags+=8}
  results = 'Connecting to ' + getNet() + '....'
  mptIssuanceIdField.value = results
  let net = getNet()
  const my_wallet = xrpl.Wallet.fromSeed(seedField.value)
  const client = new xrpl.Client(net)
  await client.connect()
  const metadataHexString = xrpl.convertStringToHex(metadataTextArea.value)
  const transactionJson = {
    "TransactionType": "MPTokenIssuanceCreate",
    "Account": accountField.value,
    "AssetScale": parseInt(assetScaleField.value),
    "MaximumAmount": maximumAmountField.value,
    "TransferFee": parseInt(transferFeeField.value),
    "Flags": v_flags,
    "MPTokenMetadata": metadataHexString
  }
  const tx = await client.submitAndWait(transactionJson, { wallet: my_wallet} )
  if (document.getElementById("tn").checked) {
    resultField.value += "\n Success! Ledger Index: " + tx.result.ledger_index + "\nSee https://testnet.xrpl.org/ledgers/" + tx.result.ledger_index
  } else {
    resultField.value += "\n Success! Ledger Index: " + tx.result.ledger_index + "\nSee https://devnet.xrpl.org/ledgers/" + tx.result.ledger_index
  }
  mptIssuanceIdField.value = JSON.stringify(tx.result.meta.mpt_issuance_id)
}
// *****************************************************
// ************ Gather MPT Info ********************
// *****************************************************

function gatherMptInfo() {
  let mptInfo = accountNameField.value + "\n" + accountField.value + "\n" + seedField.value + "\n" + mptIssuanceIdField.value
  resultField.value = mptInfo
}