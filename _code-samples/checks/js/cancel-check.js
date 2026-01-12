'use strict'
const xrpl = require('xrpl')

// Define parameters. Edit this snippet with your values before running it.
const secret = 's████████████████████████████' // Replace with your secret
const check_id = '' // Replace with your Check ID

async function main() {
  try {
    // Connect ----------------------------------------------------------------
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    // Instantiate wallet from secret. ----------------------------------------
    const wallet = await xrpl.Wallet.fromSeed(secret)
    console.log('Wallet address: ', wallet.address)

    // Check if the check ID is provided --------------------------------------
    if (check_id.length === 0) {
      console.log('Please edit this snippet to provide a check ID. You can get a check ID by running create-check.js.')
      return
    }

    // Prepare the transaction ------------------------------------------------
    const checkcancel = {
      TransactionType: 'CheckCancel',
      Account: wallet.address,
      CheckID: check_id,
    }

    // Submit the transaction -------------------------------------------------
    const tx = await client.submitAndWait(checkcancel, { autofill: true, wallet: wallet })

    // Confirm results --------------------------------------------------------
    console.log(`Transaction result: ${JSON.stringify(tx, null, 2)}`)

    if (tx.result.meta.TransactionResult === 'tesSUCCESS') {
      // submitAndWait() only returns when the transaction's outcome is final,
      // so you don't also have to check for validated: true.
      console.log('Transaction was successful.')
    }

    // Disconnect -------------------------------------------------------------
    await client.disconnect()
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

main()
