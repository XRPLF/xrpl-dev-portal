// *******************************************************
// ************* Create Conditional Escrow ***************
// *******************************************************

async function createConditionalEscrow() {
  //------------------------------------------------------Connect to the Ledger
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  const sendAmount = amountField.value
  let results = `===Connected to ${net}===\n===Creating conditional escrow.===\n\n`
  resultField.value = results
  let escrow_cancel_date = new Date()
  escrow_cancel_date = addSeconds(parseInt(escrowCancelDateField.value))

  // ------------------------------------------------------- Prepare transaction
  try {
    const escrowTx = await client.autofill({
      TransactionType: 'EscrowCreate',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(sendAmount),
      Destination: destinationField.value,
      CancelAfter: escrow_cancel_date,
      Condition: escrowConditionField.value,
    })

    // ------------------------------------------------ Sign prepared instructions
    const signed = wallet.sign(escrowTx)

    // -------------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(signed.tx_blob)
    results = '\n=== *** Sequence Number (Save!): ' + tx.result.tx_json.Sequence
    results += '\n\n===Balance changes===\n' + JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    xrpBalanceField.value = await client.getXrpBalance(wallet.address)
    resultField.value += results
  } catch (error) {
    results += '\n===Error: ' + error.message
    resultField.value = results
  } finally {
    // -------------------------------------------------------- Disconnect
    client.disconnect()
  }
} // End of createTimeEscrow()

// *******************************************************
// ************** Finish Conditional Escrow **************
// *******************************************************

async function finishConditionalEscrow() {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let results = `===Connected to ${net}===\n===Fulfilling conditional escrow.===\n`
  resultField.value = results
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  try {
    // ------------------------------------------------------- Prepare transaction
    const prepared = await client.autofill({
      TransactionType: 'EscrowFinish',
      Account: accountAddressField.value,
      Owner: escrowOwnerField.value,
      OfferSequence: parseInt(escrowSequenceNumberField.value),
      Condition: escrowConditionField.value,
      Fulfillment: escrowFulfillmentField.value,
    })
    const signed = wallet.sign(prepared)
    const tx = await client.submitAndWait(signed.tx_blob)
    results += '\n===Balance changes===' + JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    resultField.value = results
    xrpBalanceField.value = await client.getXrpBalance(wallet.address)
  } catch (error) {
    results += '\n===Error: ' + error.message + '.===\n'
    resultField.value = results
  } finally {
    // -------------------------------------------------------- Disconnect
    client.disconnect()
  }
} // End of finisConditionalEscrow()
