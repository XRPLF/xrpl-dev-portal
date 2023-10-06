from xrpl.transaction import submit_and_wait
from xrpl.models.transactions.nftoken_mint import NFTokenMint, NFTokenMintFlag
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountNFTs
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet

# Mint an NFT on the XRPL via a NFTokenMint transaction
# https://xrpl.org/nftokenmint.html#nftokenmint

# If you want to mint a NFT on an already existing account, enter in the seed. If not, an account will be provided
# Make sure the seed variable is empty "", if you want to use a brand new testing account

seed = ""

# Connect to a testnet node
print("Connecting to Testnet...")
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Get issuer account credentials from the testnet faucet
if seed == "":
    print("Requesting address from the Testnet faucet...")
    issuer_wallet = generate_faucet_wallet(client=client)
    issuerAddr = issuer_wallet.address
else:
    issuer_wallet = Wallet.from_seed(seed=seed)
    issuerAddr = issuer_wallet.address

print(f"\nIssuer Account: {issuerAddr}")
print(f"          Seed: {issuer_wallet.seed}")

# Construct NFTokenMint transaction to mint 1 NFT
print(f"Minting a NFT...")
mint_tx = NFTokenMint(
    account=issuerAddr,
    nftoken_taxon=1,
    flags=NFTokenMintFlag.TF_TRANSFERABLE
)

# Sign mint_tx using the issuer account
mint_tx_response = submit_and_wait(transaction=mint_tx, client=client, wallet=issuer_wallet)
mint_tx_result = mint_tx_response.result

print(f"\n  Mint tx result: {mint_tx_result['meta']['TransactionResult']}")
print(f"     Tx response: {mint_tx_result}")

for node in mint_tx_result['meta']['AffectedNodes']:
    if "CreatedNode" in list(node.keys())[0]:
        print(f"\n - NFT metadata:"
              f"\n        NFT ID: {node['CreatedNode']['NewFields']['NFTokens'][0]['NFToken']['NFTokenID']}"
              f"\n  Raw metadata: {node}")

# Query the minted account for its NFTs
get_account_nfts = client.request(
    AccountNFTs(account=issuerAddr)
)

nft_int = 1
print(f"\n - NFTs owned by {issuerAddr}:")
for nft in get_account_nfts.result['account_nfts']:
    print(f"\n{nft_int}. NFToken metadata:"
          f"\n    Issuer: {nft['Issuer']}"
          f"\n    NFT ID: {nft['NFTokenID']}"
          f"\n NFT Taxon: {nft['NFTokenTaxon']}")
    nft_int += 1
