// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // gotta use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  // Get credentials from the Testnet Faucet ------------------------------------
  console.log("Requesting an address from the Testnet faucet...")
  const { wallet, balance } = await client.fundWallet()

  // Look up current state of a trust line --------------------------------------
  const issuing_address = wallet.address
  const address_to_freeze = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v'
  const currency_to_freeze = 'USD'

  const account_lines = {
    command: 'account_lines',
    account: issuing_address,
    peer: address_to_freeze,
  }

  console.log('Looking up', currency_to_freeze, 'trust line from',
              issuing_address, 'to', address_to_freeze)

  const data = await client.request(account_lines)
  const trustlines = data.result.lines

  // Find the trust line for our currency_to_freeze ------------------------------
  let trustline = null
  for (let i = 0; i < trustlines.length; i++) {
    if(trustlines[i].currency === currency_to_freeze) {
      trustline = trustlines[i]
      break
    }
  }

  // Prepare a TrustSet transaction to create or modify the target trust line ----
  let trust_set = null

  if(trustline === null) {
    console.log('Trustline not found, making a default one')

    trust_set = {
      TransactionType: 'TrustSet',
      Account: issuing_address,
      LimitAmount: {
        value: '0',
        currency: currency_to_freeze,
        issuer: address_to_freeze,
      },
    }

  } else {
    console.log('Found existing trustline: ', trustline)

    trust_set = {
      TransactionType: 'TrustSet',
      Account: issuing_address,
      LimitAmount: {
        value: trustline.limit,
        currency: trustline.currency,
        issuer: trustline.account
      },
    }
  }

  // Set a flag to freeze the trust line --------------------------------------------
  trust_set.Flags = xrpl.TrustSetFlags.tfSetFreeze

  // Best practice for JS users - validate checks if a transaction is well-formed
  xrpl.validate(trust_set)

  // Submit a TrustSet transaction to set an individual freeze ----------------------
  console.log('Submitting TrustSet tx:', trust_set)
  const result = await client.submitAndWait(wallet, trust_set)
  console.log("Submitted TrustSet!")

  // Investigate --------------------------------------------------------------------
  console.log(
    `You would investigate whatever prompted you to freeze the trust line now...`)
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Clear the individual freeze ----------------------------------------------------
  // We're reusing our TrustSet transaction from earlier with a different flag
  trust_set.Flags = xrpl.TrustSetFlags.tfClearFreeze

  // Submit a TrustSet transaction to clear an individual freeze --------------------
  console.log('Submitting TrustSet tx:', trust_set)
  const result2 = await client.submitAndWait(wallet, trust_set)
  console.log("Submitted TrustSet!")

  console.log("Finished submitting. Now disconnecting.")
  await client.disconnect()

  // End main()
}

main().catch(console.error)
