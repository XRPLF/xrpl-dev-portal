// *******************************************************
// ************* Create Conditional Escrow ***************
// *******************************************************

async function createConditionalEscrow() {

  //------------------------------------------------------Connect to the Ledger
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `Connected to ${net}, creating conditional escrow.\n`
  resultField.value = results

  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const sendAmount = amountField.value
  
  wallet.address
  
  let escrow_cancel_date = new Date()
  escrow_cancel_date = addSeconds(parseInt(escrowCancelDateField.value))

  // ------------------------------------------------------- Prepare transaction

  const escrowTx = await client.autofill({
    "TransactionType": "EscrowCreate",
    "Account": wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": destinationField.value,
    "CancelAfter": escrow_cancel_date,
    "Condition": escrowConditionField.value
  })

  // ------------------------------------------------ Sign prepared instructions
  const signed = wallet.sign(escrowTx)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  results += "\nSequence Number (Save!): " + tx.result.tx_json.Sequence 
  results  += "\n\nBalance changes: " + 
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
  resultField.value = results

  // ----------------------------------------------Disconnect from the XRP Ledger
  client.disconnect()

} // End of createTimeEscrow()

// *******************************************************
// ************** Finish Conditional Escrow **************
// *******************************************************

async function finishConditionalEscrow() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `Connected to ${net}, fulfilling conditional escrow.\n`
  resultField.value = results

  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)

  // ------------------------------------------------------- Prepare transaction

  const prepared = await client.autofill({
    "TransactionType": "EscrowFinish",
    "Account": accountAddressField.value,
    "Owner": escrowOwnerField.value,
    "OfferSequence": parseInt(escrowSequenceNumberField.value),
    "Condition": escrowConditionField.value,
    "Fulfillment": escrowFulfillmentField.value
  })

  // ------------------------------------------------ Sign prepared instructions
  const signed = wallet.sign(prepared)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  resultField.value = results
  xrpBalanceField.value = (await client.getXrpBalance(wallet.address))
  client.disconnect()

} // End of finishEscrow()