from xrpl.transaction import submit_and_wait
from xrpl.models.transactions.nftoken_mint import NFTokenMint, NFTokenMintFlag
from xrpl.models.transactions.account_set import AccountSet, AccountSetAsfFlag
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountNFTs
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet

# Assign an authorized NFT minter on your account via AccountSet transaction with flag ASF_AUTHORIZED_NFTOKEN_MINTER
# Mint a NFT using the minter account on behalf of the issuer account
# https://xrpl.org/authorize-minter.html#set-minter

seed = ""
custom_wallet = None

if seed:
    custom_wallet = Wallet.from_seed(seed=seed)

# Connect to a testnet node
print("Connecting to Testnet...")
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Initialize wallet from seed
issuer_wallet = generate_faucet_wallet(client=client, wallet=custom_wallet)
issuerAddr = issuer_wallet.address

# Get minter account credentials from the testnet faucet
print("Requesting address from the Testnet faucet...")
nftoken_minter_wallet = generate_faucet_wallet(client=client)
minterAddr = nftoken_minter_wallet.address

print(f"\nMinter Account: {issuerAddr}")
print(f"          Seed: {issuer_wallet.seed}")

print(f"\nAuthorized Minter Account: {minterAddr}")
print(f"                     Seed: {nftoken_minter_wallet.seed}")

# Construct AccountSet transaction to authorize another account (Minter Account) to issue NFTs on our behalf
print(f"\nAuthorizing account {minterAddr} as a NFT minter on account {issuerAddr}...")
authorize_minter_tx = AccountSet(
    account=issuerAddr,
    set_flag=AccountSetAsfFlag.ASF_AUTHORIZED_NFTOKEN_MINTER,
    nftoken_minter=minterAddr
)

# Sign and submit authorize_minter_tx using issuer account
authorize_minter_tx_signed = submit_and_wait(transaction=authorize_minter_tx, client=client, wallet=issuer_wallet)
authorize_minter_tx_result = authorize_minter_tx_signed.result
print(f"\nAuthorize minter tx result: {authorize_minter_tx_result}")

if authorize_minter_tx_result['meta']['TransactionResult'] == "tesSUCCESS":
    print(f"\nTransaction was successfully validated, minter {minterAddr} is now authorized to issue NFTs on behalf of {issuerAddr}")
else:
    print(f"Transaction failed, error code: {authorize_minter_tx_result['meta']['TransactionResult']}"
          f"\nMinter {minterAddr} is not authorized to issue NFTS on behalf of {issuerAddr}")

# Construct NFTokenMint transaction to mint a brand new NFT
print(f"Minting a NFT from the newly authorized account to prove that it works...")
mint_tx_1 = NFTokenMint(
    account=minterAddr,
    issuer=issuerAddr,
    nftoken_taxon=1,
    flags=NFTokenMintFlag.TF_TRANSFERABLE
)

# Sign using previously authorized minter's account, this will result in the NFT's issuer field to be the Issuer Account
# while the NFT's owner would be the Minter Account
mint_tx_1_signed = submit_and_wait(transaction=mint_tx_1, client=client, wallet=nftoken_minter_wallet)
mint_tx_1_result = mint_tx_1_signed.result
print(f"\n Mint tx result: {mint_tx_1_result['meta']['TransactionResult']}")
print(f"    Tx response: {mint_tx_1_result}")

# Query the minter account for its account's NFTs
get_account_nfts = AccountNFTs(
    account=minterAddr
)

response = client.request(get_account_nfts)
response = response.result['account_nfts'][0]

print(f"\n - NFToken metadata:"
      f"\n    Issuer: {response['Issuer']}"
      f"\n    NFT ID: {response['NFTokenID']}"
      f"\n NFT Taxon: {response['NFTokenTaxon']}")
