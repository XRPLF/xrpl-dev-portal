if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Construct a CheckCreate transaction to create a Check natively on the XRPL
  // https://xrpl.org/checks.html#checks
  // https://xrpl.org/checkcreate.html#checkcreate

  async function main() {
    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
  
    // Get account credentials from the Testnet Faucet
    console.log("Requesting addresses from the Testnet faucet...")
    const { wallet } = await client.fundWallet()
    const { wallet: reciepient_wallet } = await client.fundWallet()

    // This account sends a Check
    console.log(" Sending Account:", wallet.address)
    console.log("            Seed:", wallet.seed)

    // This account receives a Check
    console.log("\n Receiving Account:", reciepient_wallet.address)
    console.log("              Seed:", reciepient_wallet.seed)

    // Get current datetime
    const date = new Date();

    // ISO8601 timestmap to a ripple timestamp.
    // After the Expiration time has passed, you could cancel the Check and the recipient  may no longer cash the Check
    const Expiration = xrpl.isoTimeToRippleTime(date) + 10

    // Construct EscrowCreate transaction
    const EscrowCreate_tx = await client.autofill({
        "TransactionType": "CheckCreate",
        "Account": wallet.address,
        "SendMax": "10000000", // 1 XRP = 1,000,000 drops
        "Destination": reciepient_wallet.address,
        "Expiration": Expiration,
    })
  
    console.log(`\n The sender may cancel the Check after ${xrpl.rippleTimeToISOTime(Expiration)}`)
    
    const EscrowCreate_tx_signed = wallet.sign(EscrowCreate_tx)

    console.log("\n Transaction hash:", EscrowCreate_tx_signed.hash)
  
    const EscrowCreate_tx_result = await client.submitAndWait(EscrowCreate_tx_signed.tx_blob)
    
    console.log("\n Submit result:", EscrowCreate_tx_result.result.meta.TransactionResult)
    console.log("    Tx content:", EscrowCreate_tx_result)
    
    client.disconnect()

    // End main()
  }
  
  main()
