// *******************************************************
// ************* Add Seconds to Current Date *************
// *******************************************************

function addSeconds(numOfSeconds, date = new Date()) {
  date.setSeconds(date.getSeconds() + numOfSeconds)
  date = Math.floor(date / 1000)
  date = date - 946684800

  return date
}

// *******************************************************
// ************* Create Time-based Escrow ****************
// *******************************************************

async function createTimeBasedEscrow() {
  //-------------------------------------------- Prepare Finish and Cancel Dates
  let escrow_finish_date = new Date()
  let escrow_cancel_date = new Date()
  escrow_finish_date = addSeconds(parseInt(escrowFinishTimeField.value))
  escrow_cancel_date = addSeconds(parseInt(escrowCancelTimeField.value))
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}.===\n\n===Creating time-based escrow.===\n`
  resultField.value = results
  try {
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const sendAmount = amountField.value
    const escrowTx = await client.autofill({
      TransactionType: 'EscrowCreate',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(sendAmount),
      Destination: destinationField.value,
      FinishAfter: escrow_finish_date,
      CancelAfter: escrow_cancel_date,
    })
    const signed = wallet.sign(escrowTx)
    const tx = await client.submitAndWait(signed.tx_blob)
    results += '\n===Success! === *** Save this sequence number: ' + tx.result.tx_json.Sequence
    xrpBalanceField.value = await client.getXrpBalance(wallet.address)
    resultField.value = results
  } catch (error) {
    results += '\n===Error: ' + error.message
    resultField.value = results
  } finally {
    client.disconnect()
  }
} // End of createTimeEscrow()

// *******************************************************
// ***************** Finish Time- Based Escrow ***********
// *******************************************************

async function finishTimeBasedEscrow() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}. Finishing escrow.===\n`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  try {
    const prepared = await client.autofill({
      TransactionType: 'EscrowFinish',
      Account: accountAddressField.value,
      Owner: escrowOwnerField.value,
      OfferSequence: parseInt(escrowSequenceNumberField.value),
    })
    const signed = wallet.sign(prepared)
    const tx = await client.submitAndWait(signed.tx_blob)
    results += '\n===Balance changes===' + JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
    xrpBalanceField.value = await client.getXrpBalance(wallet.address)
  } catch (error) {
    results += '\n===Error: ' + error.message + '==='
    resultField.value = results
  } finally {
    client.disconnect()
  }
} // End of finishTimeBasedEscrow()

// *******************************************************
// ******************* Get Escrows ***********************
// *******************************************************

async function getEscrows() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}.\nGetting account escrows.===\n`
  resultField.value = results
  try {
    const escrow_objects = await client.request({
      id: 5,
      command: 'account_objects',
      account: accountAddressField.value,
      ledger_index: 'validated',
      type: 'escrow',
    })
    results += JSON.stringify(escrow_objects.result, null, 2)
    resultField.value = results
  } catch (error) {
    results += '\nError: ' + error.message
    resultField.value = results
  } finally {
    client.disconnect()
  }
}

// *******************************************************
// ************** Get Transaction Info *******************
// *******************************************************

async function getTransaction() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}.===\n===Getting transaction information.===\n`
  resultField.value = results
  try {
    const tx_info = await client.request({
      id: 1,
      command: 'tx',
      transaction: transactionField.value,
    })
    results += JSON.stringify(tx_info.result, null, 2)
    resultField.value = results
  } catch (error) {
    results += '\nError: ' + error.message
    resultField.value = results
  } finally {
    client.disconnect()
  }
} // End of getTransaction()

// *******************************************************
// ****************** Cancel Escrow **********************
// *******************************************************

async function cancelEscrow() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `\n===Connected to ${net}. Cancelling escrow.===`
  resultField.value = results
  try {
    const prepared = await client.autofill({
      TransactionType: 'EscrowCancel',
      Account: accountAddressField.value,
      Owner: escrowOwnerField.value,
      OfferSequence: parseInt(escrowSequenceNumberField.value),
    })
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    const signed = wallet.sign(prepared)
    const tx = await client.submitAndWait(signed.tx_blob)
    results += '\n===Balance changes: ' + JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
  } catch (error) {
    results += '\n===Error: ' + error.message
    resultField.value = results
  } finally {
    client.disconnect()
  }
}
