from xrpl.models.requests.account_nfts import AccountNFTs
from xrpl.models import NFTBuyOffers
from xrpl.clients import JsonRpcClient

# This code sample lists an account’s NFT pages (https://xrpl.org/nftokenpage.html#nftokenpage)
# and see token offers for that account’s NFTs
# https://xrpl.org/non-fungible-tokens.html#nfts-on-the-xrp-ledger
# https://xrpl.org/nftokenpage.html#nftokenpage
# https://xrpl.org/nft_buy_offers.html#nft_buy_offers

# Testnet example: rP7aApVAyf3bjtRVVTixVSHBbU4kpd742k
account = input("Enter wallet address: ")

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Query the account's NFTs
response = client.request(
    AccountNFTs(account=account)
)

if response.status[0:7] == "success":
    nft_list = response.result['account_nfts']

    # Only append the NFTs' NFT ID onto the nft_keylets list, other fields aren't needed
    nft_keylets = []
    for x in nft_list:
        nft_keylets.append(x['NFTokenID'])

    # Query through the NFTs' buy Offers
    # For each NFT owned by the account (on nft_keylets), go through all their respective buy Offerss
    for nft in nft_keylets:
        response = client.request(
            NFTBuyOffers(
                nft_id=nft
            )
        )

        offer_objects = response.result
        if 'error' not in offer_objects:
            print(f"\nBuy Offers for NFT {nft}:")
            x_int = 1
            for x in offer_objects['offers']:
                print(f"\n{x_int}.")
                print(f" NFT Offer Index: {x['nft_offer_index']}")
                print(f"    Offer Amount: {x['amount']} drops")
                print(f"     Offer Owner: {x['owner']}")
                x_int += 1
        else:
            print(f"\nNFT {nft} does not have any buy offers...")

else:
    print(f"Account {account} does not own any NFTs!")
