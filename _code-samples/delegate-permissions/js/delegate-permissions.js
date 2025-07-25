const xrpl = require('xrpl')

async function main() {
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    console.log("Funding new wallet from faucet...")
    const { wallet } = await client.fundWallet()

    // Define the transaction
    const delegate_address = "r9GAKojMTyexqvy8DXFWYq63Mod5k5wnkT"
    const delegateset = {
        "TransactionType": "DelegateSet",
        "Account": wallet.address,
        "Authorize": delegate_address,
        "Permissions": [
            {
                "Permission": {
                    "PermissionValue": "AccountDomainSet"
                }
            }
        ]
    }

    // Prepare, sign, and submit the transaction
    const prepared = await client.autofill(delegateset)
    const signed = wallet.sign(prepared)
    const result = await client.submitAndWait(signed.tx_blob)

    // Check transaction results
    console.log(result)
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
        console.log("Delegate successfully set.")
    }

    // Confirm presence of Delegate ledger entry using account_objects
    response = await client.request({
        "command": "account_objects",
        "account": wallet.address,
        "type": "delegate",
        "ledger_index": "validated"
    })
    console.log(JSON.stringify(response, null, 2))

    client.disconnect()
}

main()
