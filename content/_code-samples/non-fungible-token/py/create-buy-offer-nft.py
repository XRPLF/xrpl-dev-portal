from xrpl.transaction import submit_and_wait
from xrpl.models.transactions.nftoken_create_offer import NFTokenCreateOffer
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountNFTs
from xrpl.clients import JsonRpcClient
from xrpl.models import NFTBuyOffers
from xrpl.wallet import Wallet

# Put up a buy offer for a NFT on the XRPL via a NFTokenCreateOffer transaction
# https://xrpl.org/nftokencreateoffer.html#nftokencreateoffer

# For this code snippet to work, you need import an Account Seed with an issued NFT
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

    # Get buyer account credentials from the testnet faucet
    print("Requesting address from the Testnet faucet...")
    buyer_wallet = generate_faucet_wallet(client=client)
    buyerAddr = buyer_wallet.address

    print(f"\n   Minter Account: {issuerAddr}")
    print(f"             Seed: {issuer_wallet.seed}")

    print(f"\n  Buyer Account: {buyerAddr}")
    print(f"           Seed: {buyer_wallet.seed}")

    # Query the issuer account for its account's NFTs
    get_account_nfts = AccountNFTs(
        account=issuerAddr
    )

    response = client.request(get_account_nfts)
    response = response.result['account_nfts'][0]

    # Put up a buy offer for the NFT on the open market
    buy_offer_amount = "10000000"
    print(f"Buying NFT {response['NFTokenID']} for {int(buy_offer_amount) / 1000000} XRP ")
    buy_tx = NFTokenCreateOffer(
        account=buyerAddr,
        owner=issuerAddr,
        nftoken_id=response['NFTokenID'],
        amount=buy_offer_amount, # 10 XRP in drops, 1 XRP = 1,000,000 drops
    )

    # Sign and submit buy_tx using the issuer account
    buy_tx_signed = submit_and_wait(transaction=buy_tx, client=client, wallet=buyer_wallet)
    buy_tx_result = buy_tx_signed.result

    print(f"\n  NFTokenCreateOffer tx result: {buy_tx_result['meta']['TransactionResult']}")
    print(f"                   Tx response: {buy_tx_result}")

    # Index through the tx's metadata and check the changes that occurred on the ledger (AffectedNodes)
    for node in buy_tx_result['meta']['AffectedNodes']:
        if "CreatedNode" in list(node.keys())[0] and "NFTokenOffer" in node['CreatedNode']['LedgerEntryType']:
            print(f"\n - Buy Offer metadata:"
                  f"\n        NFT ID: {node['CreatedNode']['NewFields']['NFTokenID']}"
                  f"\n Sell Offer ID: {node['CreatedNode']['LedgerIndex']}"
                  f"\n  Offer amount: {node['CreatedNode']['NewFields']['Amount']} drops"
                  f"\n   Offer owner: {node['CreatedNode']['NewFields']['Owner']}"
                  f"\n  Raw metadata: {node}")

    # Query buy offers for the NFT
    response_offers = client.request(
        NFTBuyOffers(nft_id=response['NFTokenID'])
    )

    offer_objects = response_offers.result

    offer_int = 1
    print(f"\n - Existing Buy Offers for NFT {response['NFTokenID']}:")
    for offer in offer_objects['offers']:
        print(f"\n{offer_int}. Buy Offer metadata:"
              f"\n        NFT ID: {offer_objects['nft_id']}"
              f"\n Sell Offer ID: {offer['nft_offer_index']}"
              f"\n  Offer amount: {offer['amount']} drops"
              f"\n   Offer owner: {offer['owner']}"
              f"\n  Raw metadata: {offer}")
        offer_int += 1
