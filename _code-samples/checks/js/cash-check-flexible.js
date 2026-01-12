'use strict'
const xrpl = require('xrpl')

// Define parameters. Edit this code with your values before running it.
const secret = 's████████████████████████████' // Replace with your secret
const check_id = '5C5E9F39A92908BBA7B85AECD9457E9616AD36DF1895074723253B767A380D14'
const deliver_min = '20000000' // Replace with the minimum amount to receive
// String for XRP in drops
// {currency, issuer, value} object for token amount

async function main() {
  try {
    // Connect to Testnet
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    // Instantiate a wallet -----------------------------------------------
    const wallet = xrpl.Wallet.fromSeed(secret)
    console.log('Wallet address: ', wallet.address)

    // Check if the check ID is provided ----------------------------------
    if (check_id.length === 0) {
      console.log('Please edit this snippet to provide a check ID. You can get a check ID by running create-check.js.')
      return
    }

    // Prepare the transaction ------------------------------------------------
    const checkcash = {
      TransactionType: 'CheckCash',
      Account: wallet.address,
      CheckID: check_id,
      DeliverMin: deliver_min,
    }

    // Submit the transaction -------------------------------------------------
    const tx = await client.submitAndWait(checkcash, { autofill: true, wallet: wallet })

    // Confirm transaction results --------------------------------------------
    console.log(`Transaction result: ${JSON.stringify(tx, null, 2)}`)

    if (tx.result.meta.TransactionResult === 'tesSUCCESS') {
      // submitAndWait() only returns when the transaction's outcome is final,
      // so you don't also have to check for validated: true.
      console.log('Transaction was successful.')

      console.log('Balance changes:', JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
    }

    // Disconnect -------------------------------------------------------------
    await client.disconnect()
  } catch (error) {
    console.log('Error: ', error)
  }
}

main()
