if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Construct an EscrowCreate transaction to create an Escrow natively on the XRPL
  // https://xrpl.org/escrow.html#escrow
  // https://xrpl.org/escrowcreate.html#escrowcreate

  async function main() {
    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
  
    // Get account credentials from the Testnet Faucet
    console.log("Requesting addresses from the Testnet faucet...")
    const { wallet } = await client.fundWallet()
    const { wallet: reciepient_wallet } = await client.fundWallet()

    console.log(" Sending Account:", wallet.address)
    console.log("            Seed:", wallet.seed)

    console.log("\n Receiving Account:", reciepient_wallet.address)

    // Get current datetime
    const date = new Date();

    // ISO8601 timestmap to a ripple timestamp.
    // After the FinishAfter time has passed, you are given 20 seconds to finish ('claim') the escrow
    // After the CancelAfter time has passed, you're unable to finish the Escrow but you're allowed to Cancel it
    // You could configure CancelAfter and FinishAfter to a different time but the CancelAfter field must always be sooner than the FinishAfter field
    const CancelAfter = xrpl.isoTimeToRippleTime(date) + 25
    const FinishAfter = xrpl.isoTimeToRippleTime(date) + 5

    // Construct EscrowCreate transaction
    const EscrowCreate_tx = await client.autofill({
        "TransactionType": "EscrowCreate",
        "Account": wallet.address,
        "Amount": "10000000", // 1 XRP = 1,000,000 drops
        "Destination": reciepient_wallet.address,
        "CancelAfter": CancelAfter,
        "FinishAfter": FinishAfter
    })
  
    console.log(`\n The sender may finish the Escrow after ${xrpl.rippleTimeToISOTime(FinishAfter)}`)
    console.log(`\n The sender may claim back (Cancel) the Escrow after the ${xrpl.rippleTimeToISOTime(CancelAfter)} due date has passed`)
    
    const EscrowCreate_tx_signed = wallet.sign(EscrowCreate_tx)

    console.log("\n Transaction hash:", EscrowCreate_tx_signed.hash)
  
    const EscrowCreate_tx_result = await client.submitAndWait(EscrowCreate_tx_signed.tx_blob)
    console.log("\n Submit result:", EscrowCreate_tx_result.result.meta.TransactionResult)
    console.log("    Tx content:", EscrowCreate_tx_result)
    
    client.disconnect()

    // End main()
  }
  
  main()
