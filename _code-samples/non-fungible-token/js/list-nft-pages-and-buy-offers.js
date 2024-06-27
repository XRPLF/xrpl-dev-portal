// List an account’s NFT pages and see token offers for that account’s NFTs
// https://xrpl.org/account_nfts.html#account_nfts
// https://xrpl.org/nft_buy_offers.html#nft_buy_offers

const xrpl = require('xrpl')

async function main() {
    const account = "rP7aApVAyf3bjtRVVTixVSHBbU4kpd742k"

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
    const nft_keylets = []
    for (let i = 0; i < response.result.account_nfts.length; i++) {
        nft_keylets.push(response.result.account_nfts[i].NFTokenID)
    }

    // Query through the NFTs' buy Offers
    // For each NFT owned by the account (on nft_keylets[]), go through all their respective buy Offers on the DEX
    for (let i = 0; i < nft_keylets.length; i++) {
        let response_1;
        try {
            response_1 = await client.request({
                "command": "nft_buy_offers",
                "nft_id": nft_keylets[i],
                "ledger_index": "validated"
            })
        } catch (e) {
            console.log(`Couldn't get buy offers for NFT ${nft_keylets[i]}. Maybe there aren't any.`)
            continue
        }

        console.log(`\nBuy Offers for NFT ${nft_keylets[i]}:`)
        for (let j = 0; j < response_1.result.offers.length; j++) {
            console.log(`\n${j + 1}.`)
            console.log(` NFT Offer Index: ${response_1.result.offers[j].nft_offer_index}`)
            console.log(`    Offer Amount: ${response_1.result.offers[j].amount} drops`)
            console.log(`     Offer Owner: ${response_1.result.offers[j].owner}`)
        }
    }
    await client.disconnect()
    // End main()
}

main()
