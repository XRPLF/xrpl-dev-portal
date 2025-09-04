// You can also use a <script> tag in browsers or require('xrpl') in Node.js
import xrpl from 'xrpl'

// Define the network client
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
await client.connect()

// ... custom code goes here

// Disconnect when done (If you omit this, Node.js won't end the process)
client.disconnect()
