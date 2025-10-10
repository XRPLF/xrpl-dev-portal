import xrpl from 'xrpl'

/* Main function when called as a commandline script ------------------------*/
main()
async function main () {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  console.log('Funding new wallet from faucet...')
  const { wallet } = await client.fundWallet()

  // Define properties of the escrow
  const dest_address = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe' // Testnet faucet
  const delay = 30 // how long to escrow the funds, in seconds
  const amount = '12345' // drops of XRP to send in the escrow

  const { escrowSeq, finishAfterRippleTime } = await send_timed_escrow(
    client,
    wallet,
    dest_address,
    amount,
    delay
  )

  await wait_for_escrow(client, finishAfterRippleTime)

  await finish_escrow(client, wallet, escrowSeq)

  client.disconnect()
}

/* send_timed_escrow
 * Create a time-based escrow.
 * Parameters:
 *   client (xrpl.Client): network-connected client
 *   wallet (xrpl.Wallet): sender wallet
 *   dest_address (string): receiver address in base58
 *   amount (string): how many drops of XRP to send in escrow
 *   delay (int): number of seconds until the escrow is mature
 * Returns: object with the following keys
 *   response (xrpl.TxResponse): transaction result from submitAndWait
 *   escrowSeq (int): sequence number of the created escrow (int)
 *   finishAfterRippleTime (int): the FinishAfter time of the created escrow,
 *                                in seconds since the Ripple Epoch
 */
async function send_timed_escrow (client, wallet, dest_address, amount, delay) {
  // Set the escrow finish time
  const finishAfter = new Date()
  finishAfter.setSeconds(finishAfter.getSeconds() + delay)
  console.log('This escrow will finish after:', finishAfter)
  // Convert finishAfter to seconds since the Ripple Epoch:
  const finishAfterRippleTime = xrpl.isoTimeToRippleTime(finishAfter.toISOString())

  // Construct the EscrowCreate transaction
  const escrowCreate = {
    TransactionType: 'EscrowCreate',
    Account: wallet.address,
    Destination: dest_address,
    Amount: amount,
    FinishAfter: finishAfterRippleTime
  }
  xrpl.validate(escrowCreate)

  // Send the transaction
  console.log('Signing and submitting the transaction:',
    JSON.stringify(escrowCreate, null, 2))
  const response = await client.submitAndWait(escrowCreate, {
    wallet,
    autofill: true
  })
  
  // Display the transaction results & return them
  console.log(JSON.stringify(response.result, null, 2))
  const escrowSeq = response.result.tx_json.Sequence
  console.log(`Escrow sequence is ${escrowSeq}.`)
  return {
    response,
    escrowSeq,
    finishAfterRippleTime
  }
}

/* wait_for_escrow ------------------------------------------------------------
 * Check the ledger close time to see if an escrow can be finished.
 * If it's not ready yet, wait a number of seconds equal to the difference
 * from the latest ledger close time to the escrow's FinishAfter time.
 * Parameters:
 *   client (xrpl.Client): network-connected client
 *   finishAfterRippleTime (int): the FinishAfter time of the escrow,
 *                                in seconds since the Ripple Epoch
 * Returns: null
 */
async function wait_for_escrow (client, finishAfterRippleTime) {
  // Check if escrow can be finished
  let escrowReady = false
  while (!escrowReady) {
    // Check the close time of the latest validated ledger.
    // Close times are rounded by about 10 seconds, so the exact time the escrow
    // is ready to finish may vary by +/- 10 seconds.
    const validatedLedger = await client.request({
      command: 'ledger',
      ledger_index: 'validated'
    })
    const ledgerCloseTime = validatedLedger.result.ledger.close_time
    console.log('Latest validated ledger closed at',
      xrpl.rippleTimeToISOTime(ledgerCloseTime))
    if (ledgerCloseTime > finishAfterRippleTime) {
      escrowReady = true
      console.log('Escrow is ready to be finished.')
    } else {
      let timeDifference = finishAfterRippleTime - ledgerCloseTime
      if (timeDifference === 0) { timeDifference = 1 }
      console.log(`Waiting another ${timeDifference} second(s).`)
      await sleep(timeDifference)
    }
  }
}

/* Sleep function that can be used with await */
function sleep (delayInSeconds) {
  const delayInMs = delayInSeconds * 1000
  return new Promise((resolve) => setTimeout(resolve, delayInMs))
}

/* finish_escrow --------------------------------------------------------------
 * Finish an escrow that your account owns.
 * Parameters:
 *   client (xrpl.Client): network-connected client
 *   wallet (xrpl.Wallet): escrow owner and transaction sender's wallet
 *   escrowSeq (int): the Sequence number of the escrow to finish
 * Returns: null
 */
async function finish_escrow (client, wallet, escrowSeq) {
  // Construct the EscrowFinish transaction
  const escrowFinish = {
    TransactionType: 'EscrowFinish',
    Account: wallet.address,
    Owner: wallet.address,
    OfferSequence: escrowSeq
  }
  xrpl.validate(escrowFinish)

  // Send the transaction
  console.log('Signing and submitting the transaction:',
    JSON.stringify(escrowFinish, null, 2))
  const response2 = await client.submitAndWait(escrowFinish, {
    wallet,
    autofill: true
  })
  
  // Display the transaction results
  console.log(JSON.stringify(response2.result, null, 2))
  if (response2.result.meta.TransactionResult === 'tesSUCCESS') {
    console.log('Escrow finished successfully.')
  }
}
