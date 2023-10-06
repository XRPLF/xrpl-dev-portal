// *******************************************************
// ************* Add Seconds to Current Date *************
// *******************************************************

function addSeconds(numOfSeconds, date = new Date()) {
  date.setSeconds(date.getSeconds() + numOfSeconds);
  date = Math.floor(date / 1000)
  date = date - 946684800

  return date;
}

// *******************************************************
// ***************** Create Time Escrow ******************
// *******************************************************

async function createTimeEscrow() {

  //-------------------------------------------- Prepare Finish and Cancel Dates

  let escrow_finish_date = new Date()
  let escrow_cancel_date = new Date()
  escrow_finish_date = addSeconds(parseInt(standbyEscrowFinishDateField.value))
  escrow_cancel_date = addSeconds(parseInt(standbyEscrowCancelDateField.value))

  //------------------------------------------------------Connect to the Ledger
  results  = "Connecting to the selected ledger.\n"
  standbyResultField.value = results
  let net = getNet()
  results = "Connecting to " + net + "....\n"
  const client = new xrpl.Client(net)
  await client.connect()

  results  += "Connected. Creating time-based escrow.\n"
  standbyResultField.value = results

  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)
  const sendAmount = standbyAmountField.value
  
  results += "\nstandby_wallet.address: = " + standby_wallet.address
  standbyResultField.value = results

  // ------------------------------------------------------- Prepare transaction

  const escrowTx = await client.autofill({
    "TransactionType": "EscrowCreate",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value,
    "FinishAfter": escrow_finish_date,
    "CancelAfter": escrow_cancel_date
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
// ***************** Finish Time Escrow ******************
// *******************************************************

async function finishEscrow() {

  results  = "Connecting to the selected ledger.\n"
  operationalResultField.value = results
  let net = getNet()
  results = 'Connecting to ' + getNet() + '....'
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
  // Note that the destination is hard coded.
  const prepared = await client.autofill({
    "TransactionType": "EscrowFinish",
    "Account": operationalAccountField.value,
    "Owner": standbyAccountField.value,
    "OfferSequence": parseInt(operationalEscrowSequenceField.value)
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
} // End of finishEscrow()

// *******************************************************
// ************** Get Standby Escrows ********************
// *******************************************************

async function getStandbyEscrows() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  standbyResultField.value = results

  results= "\nGetting standby account escrows...\n"
  const escrow_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": standbyAccountField.value,
    "ledger_index": "validated",
    "type": "escrow"
  })
  results += JSON.stringify(escrow_objects.result, null, 2)
  standbyResultField.value = results

  client.disconnect()
} // End of getStandbyEscrows()

// *******************************************************
// ***************** Get Op Escrows **********************
// *******************************************************

async function getOperationalEscrows() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  operationalResultField.value = results

  results= "\nGetting operational account escrows...\n"
  const escrow_objects = await client.request({
    "id": 5,
    "command": "account_objects",
    "account": operationalAccountField.value,
    "ledger_index": "validated",
    "type": "escrow"
  })
  results += JSON.stringify(escrow_objects.result, null, 2)
  operationalResultField.value = results
  client.disconnect()
 
} // End of getOperationalEscrows()

// *******************************************************
// ************** Get Transaction Info *******************
// *******************************************************

async function getTransaction() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  operationalResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  operationalResultField.value = results

  results= "\nGetting transaction information...\n"
  const tx_info = await client.request({
    "id": 1,
    "command": "tx",
    "transaction": operationalTransactionField.value,
  })
  results += JSON.stringify(tx_info.result, null, 2)
  operationalResultField.value = results
  client.disconnect()
 
} // End of getTransaction()

// *******************************************************
// ****************** Cancel Escrow **********************
// *******************************************************

async function cancelEscrow() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  standbyResultField.value = results
  
  await client.connect()   
  results += '\nConnected.'
  standbyResultField.value = results

  const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value)
  const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value)

  // ------------------------------------------------------- Prepare transaction

  const prepared = await client.autofill({
    "TransactionType": "EscrowCancel",
    "Account": standby_wallet.address,
    "Owner": standbyAccountField.value,
    "OfferSequence": parseInt(standbyEscrowSequenceNumberField.value)
  })

  // ------------------------------------------------ Sign prepared instructions
  const signed = standby_wallet.sign(prepared)

  // -------------------------------------------------------- Submit signed blob
  const tx = await client.submitAndWait(signed.tx_blob)

   results  += "\nBalance changes: " + 
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
   standbyResultField.value = results
   
  standbyBalanceField.value = (await client.getXrpBalance(standby_wallet.address))
  operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))

  client.disconnect()
}