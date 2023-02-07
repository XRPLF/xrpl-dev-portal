if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // Blackhole an account.
  // For some addresses, it's possible that no one has the secret key, in which case the account is a black hole and the XRP is lost forever.
  // https://xrpl.org/accounts.html#special-addresses
  // https://xrpl.org/disable-master-key-pair.html#disable-master-key-pair

  async function main() {
    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
  
    // Get account credentials from the Testnet Faucet
    console.log("Requesting an account from the Testnet faucet...")
    const { wallet, balance } = await client.fundWallet()
    
    console.log("\nAccount: ", wallet.address)
    console.log("   Seed: ", wallet.seed)

    // This is a well known blackhole address
    const blackhole_address = "rrrrrrrrrrrrrrrrrrrrBZbvji" 

    // Send AccountSet transaction 
    const SetRegularKey_tx = await client.autofill({
      "TransactionType": "SetRegularKey",
      "Account": wallet.address,
      "RegularKey": blackhole_address
    })
  
    const SetRegularKey_tx_signed = wallet.sign(SetRegularKey_tx)  
    const SetRegularKey_tx_result = await client.submitAndWait(SetRegularKey_tx_signed.tx_blob)

    console.log(`\n Submitted a SetRegularKey transaction (Result: ${SetRegularKey_tx_result.result.meta.TransactionResult})`)
    console.log(`                              Transaction hash: ${SetRegularKey_tx_signed.hash}`)

    // Send AccountSet transaction 
    const DisableMasterKey_tx = await client.autofill({
      "TransactionType": "AccountSet",
      "Account": wallet.address,
      "SetFlag": xrpl.AccountSetAsfFlags.asfDisableMaster
    })
  
    const DisableMasterKey_tx_signed = wallet.sign(DisableMasterKey_tx)
    const DisableMasterKey_tx_result = await client.submitAndWait(DisableMasterKey_tx_signed.tx_blob)

    console.log(`\n Submitted a DisableMasterKey transaction (Result: ${DisableMasterKey_tx_result.result.meta.TransactionResult}`)
    console.log(`                                 Transaction hash: ${DisableMasterKey_tx_signed.hash}`)

    const response = await client.request({
        "command": "account_info",
        "account": wallet.address,
        "ledger_index": "validated"
    })

    if (response.result.account_data.Flags == 1114112) {
        console.log(`\nAccount ${wallet.address}'s master key has been disabled, the account is now blackholed.`)
    } else {
        console.log(`\nAccount ${wallet.address}'s master key is still enabled, account is NOT blackholed.`)
    }

    client.disconnect()
    // End main()
  }
  
  main()
