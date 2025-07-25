const xrpl = require('xrpl')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const { stringToHex, hexToString } = require('@xrplf/isomorphic/utils')

// Set delegating account and delegate from user input
readline.question(`Address of delegating account? `, async function(from_address) {
  readline.question(`Delegate's secret key? `, async function(secret) {
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    const delegate_wallet = xrpl.Wallet.fromSeed(secret)
    console.log(`Using delegate address ${delegate_wallet.address}`)

    // Check which permissions the delegate has been granted, if any
    response = await client.request({
        "command": "account_objects",
        "account": from_address,
        "type": "delegate",
        "ledger_index": "validated"
    })
    let found_match = false
    for (delegate_entry of response.result.account_objects) {
      if (delegate_entry.Account == from_address && delegate_entry.Authorize == delegate_wallet.address) {
        found_match = true
        console.log("Delegate has the following permissions:")
        for (perm of delegate_entry.Permissions) {
          console.log(perm.Permission.PermissionValue)
        }
        break
      }
    }
    if (!found_match) {
      console.warn("Delegate appears not to have any permissions granted by delegating account.")
      console.warn("Did you run delegate-permissions.js first with your delegate address?")
      return
    }

    // Use the AccountDomainSet granular permission to set the "Domain" field
    // of the delegating account
    const set_domain_example = {
      "TransactionType": "AccountSet",
      "Account": from_address,
      "Delegate": delegate_wallet.address,
      "Domain": stringToHex("example.com")
    }

    // Prepare, sign, and submit the transaction
    const prepared = await client.autofill(set_domain_example)
    const signed = delegate_wallet.sign(prepared)
    console.log("Submitting transaction:")
    console.log(JSON.stringify(signed, null, 2))
    const result = await client.submitAndWait(signed.tx_blob)

    // Check transaction results and disconnect
    console.log(result)
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      console.log("Transaction successful.")
    }

    // Confirm that the account's Domain field has been set as expected
    const account_info_resp = await client.request({
      "command": "account_info",
      "account": from_address,
      "ledger_index": "validated"
    })
    const domain_str = hexToString(account_info_resp.result.account_data.Domain)
    console.log(`Domain is ${domain_str}`)

    client.disconnect()
  })
})
