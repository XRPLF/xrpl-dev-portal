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
    const MemoData = xrpl.convertStringToHex(string="TEXT 123 -=+");
    const MemoType = xrpl.convertStringToHex(string="Text");
    const MemoFormat = xrpl.convertStringToHex(string="text/csv");

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
xrpl.convertHexToString
    const tx_MemoData = xrpl.convertHexToString(string=submit_result.result.Memos[0].Memo.MemoData);
    const tx_MemoFormat = xrpl.convertHexToString(string=submit_result.result.Memos[0].Memo.MemoFormat);
    const tx_MemoType = xrpl.convertHexToString(string=submit_result.result.Memos[0].Memo.MemoType);

    console.log(`\n Encoded Transaction MEMO: ${JSON.stringify({"MemoType": MemoType, "MemoData": MemoData, "MemoFormat": MemoFormat})}`)
    console.log(` Decoded Transaction MEMO: ${JSON.stringify({"MemoType": tx_MemoType, "MemoData": tx_MemoData, "MemoFormat": tx_MemoFormat})}`);
    console.log("\n Transaction hash:", signed.hash)
    console.log("    Submit result:", submit_result.result.meta.TransactionResult)
    
    client.disconnect()

    // End main()
  }
  
  main()
