// iterate-owner-directory.js
// Iterate over an account's owner directory and display how many ledger entries
// are in each page. In cases of highly active accounts, it can demonstrate
// the extent of "fragmentation" with skipped page numbers and non-full pages.

import xrpl from 'xrpl'

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

const OWNER = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" // Testnet faucet
// const OWNER = "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" // TST issuer

// Set initial values for iterating
let sub_index = 0 // Directory root
let ledger_index = "validated"

// Query pages from the owner directory until they run out
console.log("Page #\t\t\tEntry count")
console.log("-----------------------------------")
while (true) {
    // console.log(`Getting directory page ${sub_index}...`)
    const resp = await client.request({
        "command": "ledger_entry",
        "directory": {
            "owner": OWNER,
            "sub_index": sub_index
        },
        "ledger_index": ledger_index
    })
    if (resp.error) {
        console.error("ledger_entry failed with error",resp.error)
        break
    }

    // Consistently iterate the same ledger: query by index after the first
    if (ledger_index === "validated") {
        ledger_index = resp.result.ledger_index
    }

    console.log(`${sub_index}\t\t\t${resp.result.node.Indexes.length}`)
    // console.log(`This page contains ${resp.result.node.Indexes.length} items.`)

    // Continue onto another page if this one has more
    if (resp.result.node.hasOwnProperty("IndexNext")) {
        // The directory continues onto another page.
        // IndexNext is returned as hex but sub_index needs decimal
        sub_index = parseInt(resp.result.node.IndexNext, 16)
    } else {
        console.info("This is the last page of the directory")
        break
    }
}

client.disconnect()
