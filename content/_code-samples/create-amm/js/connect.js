// In browsers, use a <script> tag. In Node.js, uncomment the following line:
// const xrpl = require('xrpl')

const WS_URL = 'wss://s.devnet.rippletest.net:51233/'
const EXPLORER = 'devnet.xrpl.org' // Optional, for linking

async function main() {
  // Define the network client
  const client = new xrpl.Client(WS_URL)
  await client.connect()

  // ... custom code goes here

  // Disconnect when done (If you omit this, Node.js won't end the process)
  await client.disconnect()
}

main()
