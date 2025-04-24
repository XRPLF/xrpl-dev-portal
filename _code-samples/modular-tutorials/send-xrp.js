// *******************************************************
// ******************** Send XRP *************************
// *******************************************************
async function sendXRP() {   
  const net = getNet() 
  const client = new xrpl.Client(net)
  await client.connect()
  let results = "\nConnected. Sending XRP.\n"
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const sendAmount = amountField.value  
// -------------------------------------------------------- Prepare transaction
  const prepared_tx = await client.autofill({
    "TransactionType": "Payment",
    "Account": wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": destinationField.value
  })
// ------------------------------------------------- Sign prepared instructions
  const signed = wallet.sign(prepared_tx)
// -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  results = "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  resultField.value = results
  xrpBalanceField.value =  (await client.getXrpBalance(wallet.address))
  client.disconnect()    
} // End of sendXRP()