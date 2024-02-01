// In browsers, add the following <script> tags to the HTML to load dependencies
// instead of using require():
// <script src="https://unpkg.com/xrpl@2.11.0/build/xrpl-latest-min.js"></script>
// <script src='https://cdn.jsdelivr.net/npm/bignumber.js@9.0.2/bignumber.min.js'></script>
const xrpl = require('xrpl')
const BigNumber = require('bignumber.js')

// Wrap code in an async function so we can use await
async function main() {

  // Define the network client
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()

  // ... custom code goes here

  // Disconnect when done (If you omit this, Node.js won't end the process)
  await client.disconnect()
}

main()
