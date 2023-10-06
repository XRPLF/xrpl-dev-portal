from xrpl.models.transactions.nftoken_create_offer import NFTokenCreateOffer, NFTokenCreateOfferFlag
from xrpl.transaction import submit_and_wait
from xrpl.models.requests import AccountNFTs
from xrpl.clients import JsonRpcClient
from xrpl.models import NFTSellOffers
from xrpl.wallet import Wallet

# Put up a NFT sell offer on the XRPL via NFTokenCreateOffer transaction with flag TF_SELL_NFTOKEN
# https://xrpl.org/nftokencreateoffer.html#nftokencreateoffer

# For this code snippet to work, you need import an Account Seed with an already issued NFT
# You could use 'mint_nft.py' on the same folder to import an account

seed = ""

if seed == "":
    print("Please edit this code to update variable 'seed' to an account with a minted NFT to run this snippet. "
          "You can get this by running 'mint-nft.py' and copying the printed seed.")
else:
    # Connect to a testnet node
    print("Connecting to Testnet...")
    JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    client = JsonRpcClient(JSON_RPC_URL)

    # Initialize wallet from seed
    issuer_wallet = Wallet.from_seed(seed=seed)
    issuerAddr = issuer_wallet.address

    print(f"\nIssuer Account: {issuerAddr}")
    print(f"          Seed: {issuer_wallet.seed}")

    # Query the issuer account for its NFTs
    get_account_nfts = client.request(AccountNFTs(account=issuerAddr))

    if get_account_nfts.result['account_nfts'] != []:
        nft_int = 1
        print(f"\n - NFTs owned by {issuerAddr}:")
        for nft in get_account_nfts.result['account_nfts']:
            print(f"\n{nft_int}. NFToken metadata:"
                  f"\n    NFT ID: {nft['NFTokenID']}"
                  f"\n    Issuer: {nft['Issuer']}"
                  f"\n NFT Taxon: {nft['NFTokenTaxon']}")
            nft_int += 1

        nftoken_id = input("\nEnter which NFT (by ID) you want to put up for sell: ")
        nftoken_amount = input("Enter how much you want the NFT to go for, in drops: ")

        # Sell the NFT on the open market
        print(f"Selling NFT {nftoken_id} for {int(nftoken_amount) / 1000000} XRP on the open market...")
        sell_tx = NFTokenCreateOffer(
            account=issuerAddr,
            nftoken_id=nftoken_id,
            amount=nftoken_amount,  # 10 XRP in drops, 1 XRP = 1,000,000 drops
            flags=NFTokenCreateOfferFlag.TF_SELL_NFTOKEN,
        )

        # Sign sell_tx using the issuer account
        sell_tx_response = submit_and_wait(transaction=sell_tx, client=client, wallet=issuer_wallet)
        sell_tx_result = sell_tx_response.result

        print(f"\n  Sell Offer tx result: {sell_tx_result['meta']['TransactionResult']}")
        print(f"           Tx response: {sell_tx_result}")

        # Index through the tx's metadata and check the changes that occurred on the ledger (AffectedNodes)
        for node in sell_tx_result['meta']['AffectedNodes']:
            if "CreatedNode" in list(node.keys())[0] and "NFTokenOffer" in node['CreatedNode']['LedgerEntryType']:
                print(f"\n - Sell Offer metadata:"
                      f"\n        NFT ID: {node['CreatedNode']['NewFields']['NFTokenID']}"
                      f"\n Sell Offer ID: {node['CreatedNode']['LedgerIndex']}"
                      f"\n  Offer amount: {node['CreatedNode']['NewFields']['Amount']} drops"
                      f"\n   Offer owner: {node['CreatedNode']['NewFields']['Owner']}"
                      f"\n  Raw metadata: {node}")

        # Query past sell offer
        response_offers = client.request(
            NFTSellOffers(nft_id=nftoken_id)
        )

        offer_objects = response_offers.result

        offer_int = 1
        print(f"\n - Existing Sell Offers for NFT {nftoken_id}:")
        for offer in offer_objects['offers']:
            print(f"\n{offer_int}. Sell Offer metadata:"
                  f"\n        NFT ID: {offer_objects['nft_id']}"
                  f"\n Sell Offer ID: {offer['nft_offer_index']}"
                  f"\n  Offer amount: {offer['amount']} drops"
                  f"\n   Offer owner: {offer['owner']}"
                  f"\n  Raw metadata: {offer}")
            offer_int += 1
    else:
        print(f"\nError: account {issuerAddr} has no NFT, thus there are no NFTs to sell.")

