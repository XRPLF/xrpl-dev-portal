from xrpl.transaction import submit_and_wait
from xrpl.models.transactions.nftoken_burn import NFTokenBurn
from xrpl.models.requests import AccountNFTs
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet

# Burn an NFT on the XRPL via a NFTokenBurn transaction
# https://xrpl.org/nftokenburn.html#nftokenburn

# For this code snippet to work, you need import an Account Seed with an issued NFT
# You could use 'mint_nft.py' on the same folder to import an account with its own minted NFT

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

    # Query the minter account for its NFTs
    get_account_nfts = client.request(
        AccountNFTs(account=issuerAddr)
    )

    if get_account_nfts.result['account_nfts'] != []:
        nft_int = 1
        print(f"\n - NFTs owned by {issuerAddr}:")
        for nft in get_account_nfts.result['account_nfts']:
            print(f"\n{nft_int}. NFToken metadata:"
                f"\n    Issuer: {nft['Issuer']}"
                f"\n    NFT ID: {nft['NFTokenID']}"
                f"\n NFT Taxon: {nft['NFTokenTaxon']}")
            nft_int += 1

        print("\n/// --- ///")
        print(f"Burning NFT {get_account_nfts.result['account_nfts'][0]['NFTokenID']}...")

        # Construct NFTokenBurn transaction to burn our previously minted NFT
        burn_tx = NFTokenBurn(
            account=issuerAddr,
            nftoken_id=get_account_nfts.result['account_nfts'][0]['NFTokenID']
        )

        # Sign and submit burn_tx using the issuer account
        burn_tx_response = submit_and_wait(transaction=burn_tx, client=client, wallet=issuer_wallet)
        burn_tx_result = burn_tx_response.result
        print(f"\nBurn tx result: {burn_tx_result['meta']['TransactionResult']}")
        print(f"   Tx response:{burn_tx_result}")

        if burn_tx_result['meta']['TransactionResult'] == "tesSUCCESS":
            print(f"\nTransaction was successfully validated, NFToken {burn_tx_result['NFTokenID']} has been burned")
        else:
            print(f"\nTransaction failed, NFToken was not burned, error code: {burn_tx_result['meta']['TransactionResult']}")
    else:
        print(f"Account {issuerAddr} owns 0 NFTs, there are no NFTs to burn. Please provide an account that has minted a NFT in the past")
        print("You could use 'mint_nft.py' on the same folder to import an account with its own minted NFT")
