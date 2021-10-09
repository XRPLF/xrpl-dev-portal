// Wrap code in an async function so we can use await
async function main() {

  // Define the network client
  const client = new xrpl.Client("https://s.altnet.rippletest.net:51234/")
  await client.connect()

  // ... custom code goes here

  // Disconnect when done so Node.js can end the process
  client.disconnect()
}

main()
