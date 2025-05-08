// *******************************************************
// ******************** Send XRP *************************
// *******************************************************
async function sendXRP() {   
  const net = getNet() 
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}.===\n\nSending XRP.\n`
  resultField.value = results
  try {
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
    results += JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
    xrpBalanceField.value =  (await client.getXrpBalance(wallet.address))
  } catch (error) {
    console.error('Error sending transaction:', error);
    results += `\nError: ${error.message}\n`
    resultField.value = results
    throw error; // Re-throw the error to be handled by the caller
  }
  finally {
    // Disconnect from the client
    await xrplClient.disconnect();
  }   
} // End of sendXRP()