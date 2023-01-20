if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }
  // List an account’s NFT pages and see token offers for that account’s NFTs
  // https://xrpl.org/account_nfts.html#account_nfts
  // https://xrpl.org/nft_buy_offers.html#nft_buy_offers
  
  async function main() {
    // Testnet example: r3CJF73Ugs5cT4G58CDBp6RAmycGdnTAFN
    account = "r3CJF73Ugs5cT4G58CDBp6RAmycGdnTAFN"

    // Connect to a testnet node
    console.log("Connecting to testnet...")
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
  
    const response = await client.request({
        "command": "account_nfts",
        "account": account,
        "ledger_index": "validated"
    })

    // Only append the NFTs' NFT ID onto the nft_keylets list, other fields aren't needed
    var nft_keylets = []
    for (var i = 0; i < response.result.account_nfts.length; i++) {
        nft_keylets.push(response.result.account_nfts[i].NFTokenID)
    }

    // Query through the NFTs' buy Offers
    // For each NFT owned by the account (on nft_keylets[]), go through all their respective buy Offers on the DEX
    for (var i = 0; i < nft_keylets.length ; i++) {
        const response_1 = await client.request({
            "command": "nft_buy_offers",
            "nft_id": nft_keylets[i],
            "ledger_index": "validated"
        })
        
        console.log(`\nBuy Offers for NFT ${nft_keylets[i]}:`)
        for (var i = 0; i < response_1.result.offers.length; i++) {
            console.log(`\n${i+1}.`)
            console.log(` NFT Offer Index: ${response_1.result.offers[i].nft_offer_index}`)
            console.log(`    Offer Amount: ${response_1.result.offers[i].amount} drops`)
            console.log(`     Offer Owner: ${response_1.result.offers[i].owner}`)
        }
        
    }
    client.disconnect()
    // End main()
  }
  
  main()
