const xrpl = require('xrpl')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const { stringToHex, hexToString } = require('@xrplf/isomorphic/utils')

// Get delegator and delegate accounts from user input
readline.question(`Delegator's address? `, async function(delegator_address) {
  readline.question(`Delegate's seed? `, async function(secret) {
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    const delegate_wallet = xrpl.Wallet.fromSeed(secret)
    console.log(`Using delegate address ${delegate_wallet.address}`)

    // Check which permissions the delegate has been granted, if any
    response = await client.request({
        "command": "account_objects",
        "account": delegator_address,
        "type": "delegate",
        "ledger_index": "validated"
    })
    let found_match = false
    for (delegate_entry of response.result.account_objects) {
      if (delegate_entry.Account == delegator_address && 
          delegate_entry.Authorize == delegate_wallet.address) {

        found_match = true
        console.log("Delegate has the following permissions:")
        for (perm of delegate_entry.Permissions) {
          console.log(perm.Permission.PermissionValue)
        }
        break
      }
    }
    if (!found_match) {
      console.warn("Delegate appears not to have any permissions granted"+
                   " by the delegator.")
      console.warn("Make sure you ran delegate-permissions.js and input the"+
                   " correct delegate/delegator values to this script.")
      return
    }

    // Use the AccountDomainSet granular permission to set the "Domain" field
    // of the delegator
    const set_domain_example = {
      "TransactionType": "AccountSet",
      "Account": delegator_address,
      "Delegate": delegate_wallet.address,
      "Domain": stringToHex("example.com")
    }

    // Prepare, sign, and submit the transaction
    console.log("Submitting transaction:")
    console.log(set_domain_example)
    const result = await client.submitAndWait(set_domain_example, {
      wallet: delegate_wallet,
      autofill: true
    })

    // Check transaction results and disconnect
    console.log(result)
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      console.log("Transaction successful.")
    }

    // Confirm that the account's Domain field has been set as expected
    const acct_info_resp = await client.request({
      "command": "account_info",
      "account": delegator_address,
      "ledger_index": "validated"
    })
    const domain_str = hexToString(acct_info_resp.result.account_data.Domain)
    console.log(`Domain is ${domain_str}`)

    client.disconnect()
    readline.close()
  })
})
