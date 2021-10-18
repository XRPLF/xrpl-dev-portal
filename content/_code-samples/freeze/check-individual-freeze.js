// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // gotta use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Connect -------------------------------------------------------------------
async function main() {
  console.log("Connecting to Mainnet...")
  const client = new xrpl.Client('wss://s1.ripple.com')
  await client.connect()

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage)
  })

  const my_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
  const counterparty_address = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v'
  const frozen_currency = 'USD'

  // Look up current state of trust line
  const account_lines = {
    command: 'account_lines',
    account: my_address,
    peer: counterparty_address,
  }

  console.log('looking up all trust lines from',
              counterparty_address, 'to', my_address)

  const data = await client.request(account_lines)
  
  // There is only one trust line per currency code per account, 
  // so we stop after the first match
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

  console.log('Trust line frozen from our side?',
              trustline.freeze === true)
  console.log('Trust line frozen from counterparty\'s side?',
              trustline.freeze_peer === true)
  
  await client.disconnect()
}

main().catch(console.error)
