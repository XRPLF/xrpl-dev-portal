// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Connect -------------------------------------------------------------------
async function main() {
  console.log("Connecting to Mainnet...")
  const client = new xrpl.Client('wss://s1.ripple.com')
  await client.connect()

  const my_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
  const counterparty_address = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v'
  const frozen_currency = 'USD'

  // Look up current state of the trust line ----------------------------------
  const account_lines = {
    command: 'account_lines',
    account: my_address,
    peer: counterparty_address,
  }

  console.log(`Looking up all trust lines from
              ${counterparty_address} to ${my_address}`)

  const data = await client.request(account_lines)
  
  // Find the trust line for our frozen_currency ------------------------------
  let trustline = null
  for (let i = 0; i < data.result.lines.length; i++) {
    if(data.result.lines[i].currency === frozen_currency) {
      trustline = data.result.lines[i]
      break
    }
  }

  if(trustline === null) {
    throw `There was no ${frozen_currency} trust line`
  }

  // Check if the trust line is frozen -----------------------------------------
  console.log('Trust line frozen from our side?',
              trustline.freeze === true)
  console.log('Trust line frozen from counterparty\'s side?',
              trustline.freeze_peer === true)
  
  await client.disconnect()

  // End main()
}

main().catch(console.error)
