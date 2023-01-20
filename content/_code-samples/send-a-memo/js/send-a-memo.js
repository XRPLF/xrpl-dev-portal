if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Validate and send a Memo
  // https://xrpl.org/transaction-common-fields.html#memos-field
  
  async function main() {
    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
  
    // Get account credentials from the Testnet Faucet
    console.log("Requesting addresses from the Testnet faucet...")
    const { wallet, balance } = await client.fundWallet()
    
    console.log("Account: ", wallet.address)
    console.log("   Seed: ", wallet.seed)

    // Enter memo data to insert into a transaction
    const memoData = "TEXT 123 -+="
    const memoDataHex = Buffer.from(memoData, 'utf8').toString('hex')

    // Send AccountSet transaction 
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
      "Amount": "1000000", // Amount in drops, 1 XRP = 1,000,000 drops
      "Memos": [{
            "Memo":{
                "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
                "MemoData": memoDataHex
            }
        }]
    })
  
    const signed = wallet.sign(prepared)  
    const submit_result = await client.submitAndWait(signed.tx_blob)

    console.log("\nTransaction hash:", signed.hash)
    console.log(" Submit result:", submit_result.result.meta.TransactionResult)
    
    client.disconnect()

    // End main()
  }
  
  main()
