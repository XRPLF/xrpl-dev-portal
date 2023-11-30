// *******************************************************
// ************* Create Conditional Escrow ***************
// *******************************************************

async function createConditionalEscrow() {

  //------------------------------------------------------Connect to the Ledger
  results  = "Connecting to the selected ledger.\n"
  standbyResultField.value = results
  let net = getNet()
  results = "Connecting to " + net + "....\n"
  const client = new xrpl.Client(net)
  await client.connect()

  results  += "Connected. Creating conditional escrow.\n"
  standbyResultField.value = results

  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const sendAmount = standbyAmountField.value
  
  results += "\nstandby_wallet.address: = " + standby_wallet.address
  standbyResultField.value = results
  
  let escrow_cancel_date = new Date()
  escrow_cancel_date = addSeconds(parseInt(standbyEscrowCancelDateField.value))

  // ------------------------------------------------------- Prepare transaction

  const escrowTx = await client.autofill({
    "TransactionType": "EscrowCreate",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value,
    "CancelAfter": escrow_cancel_date,
    "Condition": standbyEscrowConditionField.value
  })

  // ------------------------------------------------ Sign prepared instructions
  const signed = standby_wallet.sign(escrowTx)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  results += "\nSequence Number (Save!): " + JSON.stringify(tx.result.Sequence)
  results  += "\n\nBalance changes: " + 
  JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))
  standbyResultField.value = results

  // ----------------------------------------------Disconnect from the XRP Ledger
  client.disconnect()

} // End of createTimeEscrow()

// *******************************************************
// ************** Finish Conditional Escrow **************
// *******************************************************

async function finishConditionalEscrow() {
  results  = "Connecting to the selected ledger.\n"
  operationalResultField.value = results
  let net = getNet()
  results += 'Connecting to ' + getNet() + '....'
  const client = new xrpl.Client(net)
  await client.connect()
  results  += "\nConnected. Finishing escrow.\n"
  operationalResultField.value = results

  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const sendAmount = operationalAmountField.value
  
  results += "\noperational_wallet.address: = " + operational_wallet.address
  operationalResultField.value = results

  // ------------------------------------------------------- Prepare transaction

  const prepared = await client.autofill({
    "TransactionType": "EscrowFinish",
    "Account": operationalAccountField.value,
    "Owner": standbyAccountField.value,
    "OfferSequence": parseInt(operationalEscrowSequenceField.value),
    "Condition": standbyEscrowConditionField.value,
    "Fulfillment": operationalFulfillmentField.value
  })

  // ------------------------------------------------ Sign prepared instructions
  const signed = operational_wallet.sign(prepared)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)
  results  += "\nBalance changes: " + 
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  operationalResultField.value = results
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

  client.disconnect()

} // End of finishEscrow()``