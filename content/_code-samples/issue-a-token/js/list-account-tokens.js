if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
}
// Show tokens and other objects owned by an account.
// https://xrpl.org/account_objects.html#account_objects
// https://xrpl.org/account_lines.html#account_lines
 
async function main() {
    // Testnet example: r9CEVt4Cmcjt68ME6GKyhf2DyEGo2rG8AW
    account = "r9CEVt4Cmcjt68ME6GKyhf2DyEGo2rG8AW"
 
    // Connect to a testnet node
    console.log("Connecting to Testnet...")
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233/")
    await client.connect()
 
    // Query the ledger for an account's objects and its trustlines...
    const responseObjects = await client.request({
        command: "account_objects",
        account: account,
        ledger_index: "validated",
    })
 
    const responseLines = await client.request({
        command: "account_lines",
        account: account,
        ledger_index: "validated",
    })
 
    // We'll only display the key data of RippleState ledger objects, other objects are simply shown as their ObjectID and their LedgerEntryType
    console.log(`\nAccount ${account}'s Ledger Objects:`)
    for (let i = 0; i < responseObjects.result.account_objects.length; i++) {
        if (responseObjects.result.account_objects[i].LedgerEntryType != "RippleState") {
            console.log(`\n${i+1}. Index (ObjectID/keylet): ${responseObjects.result.account_objects[i].index}`)
            console.log(` - LedgerEntryType: ${responseObjects.result.account_objects[i].LedgerEntryType}`)
            console.log(` - Account: ${responseObjects.result.account_objects[i].Account})`)
            console.log(` - Destination: ${responseObjects.result.account_objects[i].Destination}`)
            console.log(` - Amount: ${responseObjects.result.account_objects[i].Amount} drops`)
        } else {
            console.log(`\n${i+1}. Index (ObjectID/keylet): ${responseObjects.result.account_objects[i].index}`)
            console.log(` - LedgerEntryType: ${responseObjects.result.account_objects[i].LedgerEntryType} `)
        }
    }
 
    console.log(`\nAccount ${account}'s Trust lines:`)
    for (let i = 0 ; i < responseLines.result.lines.length; i++) {
        console.log(`\n${i+1}. Trustline:`)
        console.log(` - Account: ${responseLines.result.lines[i].account}`)
        console.log(` - Currency: ${responseLines.result.lines[i].currency}`)
        console.log(` - Amount: ${responseLines.result.lines[i].balance}`)
        console.log(` - Limit: ${responseLines.result.lines[i].limit}`)
        console.log(` - Limit Peer: ${responseLines.result.lines[i].limit_peer}`)
    }
    client.disconnect()
    // End main()
}
 
main()
