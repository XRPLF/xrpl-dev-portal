from xrpl.transaction import submit_and_wait
from xrpl.models.transactions.nftoken_cancel_offer import NFTokenCancelOffer
from xrpl.models.requests import AccountObjects, AccountObjectType
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet

# Cancel an offer for a NFToken on the XRPL via a NFTokenCancelOffer transaction
# https://xrpl.org/nftokencanceloffer.html#nftokencanceloffer

# For this code snippet to work, you need import an Account Seed with an existing Buy/Sell Offer for a NFT
# You could use 'create_sell_offer.py' OR 'create_buy_offer.py' on the same folder to import an account

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
    wallet = Wallet.from_seed(seed=seed)
    Addr = wallet.address

    print(f"\n  Account: {Addr}")
    print(f"     Seed: {seed}")

    get_offer_objects = client.request(
        AccountObjects(
            account=Addr,
            type=AccountObjectType.NFT_OFFER
        )
    )

    offer_objects = get_offer_objects.result

    offer_int = 1
    print(f"\n - Existing Offers made by {Addr}:")

    if len(offer_objects['account_objects']) >= 1:
        for offer in offer_objects['account_objects']:
            print(f"\n{offer_int}. Offer metadata:"
                  f"\n        NFT ID: {offer['NFTokenID']}"
                  f"\n      Offer ID: {offer['index']}"
                  f"\n  Offer amount: {offer['Amount']} drops"
                  f"\n   Offer owner: {offer['Owner']}"
                  f"\n  Raw metadata: {offer}")
            offer_int += 1

        cancel_offer = input("\nEnter the Offer (by ID) that you want to cancel: ")

        print(f"Cancelling offer {cancel_offer}...")
        cancel_sell_offer_tx = NFTokenCancelOffer(
            account=Addr,
            nftoken_offers=[
                cancel_offer
            ]
        )

        # Sign and submit cancel_sell_offer_tx using minter account
        cancel_sell_offer_tx_response = submit_and_wait(transaction=cancel_sell_offer_tx, client=client, wallet=wallet)
        cancel_sell_offer_tx_result = cancel_sell_offer_tx_response.result
        print(f"\n Cancel Sell Offer tx result: {cancel_sell_offer_tx_result['meta']['TransactionResult']}"
              f"\n                 Tx response: {cancel_sell_offer_tx_result}")

    else:
        print(f"\nAccount {Addr} has 0 Offers, thus none to cancel!")
