if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
}
  // Encode and send a Memo. 
  // In general, Memo's can be added to any transaction, and are sometimes used to
  // share extra information needed for a 3rd party integration.
  // https://xrpl.org/transaction-common-fields.html#memos-field
  
  async function main() {
    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
  
    // Get account credentials from the Testnet Faucet
    console.log("Requesting an account from the Testnet faucet...")
    const { wallet, balance } = await client.fundWallet()
    
    console.log("Account: ", wallet.address)
    console.log("   Seed: ", wallet.seed)

    // Enter memo data to insert into a transaction
    const MemoData = xrpl.convertStringToHex(string="Example Memo - 123 -=+");
    const MemoType = xrpl.convertStringToHex(string="Text");
    // MemoFormat values: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    const MemoFormat = xrpl.convertStringToHex(string="text/plain");

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
    console.log("Submitting a payment transaction with our memo field...")
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
