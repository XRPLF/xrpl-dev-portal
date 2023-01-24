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
    const MemoData = Buffer.from("TEXT 123 -+=", 'utf8').toString('hex')
    const MemoType = Buffer.from("Text", 'utf8').toString('hex')
    const MemoFormat = Buffer.from("text/csv", 'utf8').toString('hex')

    // Send AccountSet transaction 
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
      "Amount": "1000000", // Amount in drops, 1 XRP = 1,000,000 drops
      "Memos": [{
            "Memo":{
                "MemoType": MemoType,
                "MemoData": MemoData,
                "MemoFormat": MemoFormat
            }
        }]
    })

    const signed = wallet.sign(prepared)  
    const submit_result = await client.submitAndWait(signed.tx_blob)

    const tx_MemoData = Buffer.from(submit_result.result.Memos[0].Memo.MemoData, 'hex').toString('utf8');
    const tx_MemoFormat = Buffer.from(submit_result.result.Memos[0].Memo.MemoFormat, 'hex').toString('utf8');
    const tx_MemoType = Buffer.from(submit_result.result.Memos[0].Memo.MemoType, 'hex').toString('utf8');

    console.log(`\n Encoded Transaction MEMO: ${JSON.stringify({"MemoType": MemoType, "MemoData": MemoData, "MemoFormat": MemoFormat})}`)
    console.log(` Decoded Transaction MEMO: ${JSON.stringify({"MemoType": tx_MemoType, "MemoData": tx_MemoData, "MemoFormat": tx_MemoFormat})}`);
    console.log("\n Transaction hash:", signed.hash)
    console.log("    Submit result:", submit_result.result.meta.TransactionResult)
    
    client.disconnect()

    // End main()
  }
  
  main()
