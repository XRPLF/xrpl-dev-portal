// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Requesting an address from the Testnet faucet...")
  const { wallet, balance } = await client.fundWallet()

  // Set up an incoming trust line so we have something to freeze --------------
  // We use a hard-coded example wallet here so the sample code can have a hard-
  // coded example address below. Don't use this seed for anything real.
  const peer = xrpl.Wallet.fromSeed("sho56WRm8fKLrfixaWa9cxhYJg8hc")
  await client.fundWallet(peer)
  const submitted = await client.submitAndWait({
    "TransactionType": "TrustSet",
    "Account": peer.address,
    "LimitAmount": {
      "currency": 'FOO',
      "issuer": wallet.address,
      "value": "123456.789" // arbitrary limit
    }
  }, {wallet: peer})
  console.log("Set up incoming trust line result:", submitted)

  // Look up current trust lines -----------------------------------------------
  const issuing_address = wallet.address
  const address_to_freeze = 'rhPuJPcd9kcSRCGHWudV3tjUuTvvysi6sv'
  const currency_to_freeze = 'FOO'

  console.log('Looking up', currency_to_freeze, 'trust line from',
              issuing_address, 'to', address_to_freeze)
  const account_lines = await client.request({
    "command": "account_lines",
    "account": issuing_address,
    "peer": address_to_freeze,
    "ledger_index": "validated"
  })
  const trustlines = account_lines.result.lines
  console.log("Found lines:", trustlines)

  // Find the trust line for our currency_to_freeze ----------------------------
  let trustline = null
  for (let i = 0; i < trustlines.length; i++) {
    if(trustlines[i].currency === currency_to_freeze) {
      trustline = trustlines[i]
      break
    }
  }

  if (trustline === null) {
    console.error(`Couldn't find a ${currency_to_freeze} trustline between
                  ${issuing_address} and ${address_to_freeze}`)
    return
  }

  // Send a TrustSet transaction to set an individual freeze -------------------
  // Construct a TrustSet, preserving our existing limit value
  const trust_set = {
    "TransactionType": 'TrustSet',
    "Account": issuing_address,
    "LimitAmount": {
      "value": trustline.limit,
      "currency": trustline.currency,
      "issuer": trustline.account
    },
    "Flags": xrpl.TrustSetFlags.tfSetFreeze
  }

  // Best practice for JavaScript users: use validate(tx_json) to confirm
  // that a transaction is well-formed or throw ValidationError if it isn't.
  xrpl.validate(trust_set)

  console.log('Submitting TrustSet tx:', trust_set)
  const result = await client.submitAndWait(trust_set, { wallet: wallet })
  console.log("Transaction result:", result)

  // Confirm trust line status -------------------------------------------------
  const account_lines_2 = await client.request({
    "command": "account_lines",
    "account": issuing_address,
    "peer": address_to_freeze,
    "ledger_index": "validated"
  })
  const trustlines_2 = account_lines_2.result.lines

  let line = null
  for (let i = 0; i < trustlines_2.length; i++) {
    if(trustlines_2[i].currency === currency_to_freeze) {
      line = trustlines_2[i]
      console.log(`Status of ${currency_to_freeze} line between
          ${issuing_address} and ${address_to_freeze}:
          ${JSON.stringify(line, null, 2)}`)
      if (line.freeze === true) {
        console.log(`✅ Line is frozen.`)
      } else {
        console.error(`❌ Line is NOT FROZEN.`)
      }
    }
  }
  if (line === null) {
    console.error(`Couldn't find a ${CURRENCY_TO_FREEZE} line between
        ${issuing_address} and ${address_to_freeze}.`)
  }

  // Investigate ---------------------------------------------------------------
  console.log(`You would investigate whatever prompted you to freeze the
    trust line now... (This script waits 5000ms to end the freeze.)`)
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Clear the individual freeze -----------------------------------------------
  // We're reusing our TrustSet transaction from earlier with a different flag.
  trust_set.Flags = xrpl.TrustSetFlags.tfClearFreeze

  // Submit a TrustSet transaction to clear an individual freeze ---------------
  console.log('Submitting TrustSet tx:', trust_set)
  const result2 = await client.submitAndWait(trust_set, { wallet: wallet })
  console.log("Transaction result:", result2)

  console.log("Finished submitting. Now disconnecting.")
  await client.disconnect()

  // End main()
}

main().catch(console.error)
