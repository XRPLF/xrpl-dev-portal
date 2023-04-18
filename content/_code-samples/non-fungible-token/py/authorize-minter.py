from xrpl.transaction import safe_sign_and_autofill_transaction, send_reliable_submission
from xrpl.models.transactions.nftoken_mint import NFTokenMint, NFTokenMintFlag
from xrpl.models.transactions.account_set import AccountSet, AccountSetFlag
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
    custom_wallet = Wallet(seed=seed, sequence=0)

# Connect to a testnet node
print("Connecting to Testnet...")
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Initialize wallet from seed
issuer_wallet = generate_faucet_wallet(client=client, wallet=custom_wallet)
issuerAddr = issuer_wallet.classic_address

# Get minter account credentials from the testnet faucet
print("Requesting address from the Testnet faucet...")
nftoken_minter_wallet = generate_faucet_wallet(client=client)
minterAddr = nftoken_minter_wallet.classic_address

print(f"\nMinter Account: {issuerAddr}")
print(f"          Seed: {issuer_wallet.seed}")

print(f"\nAuthorized Minter Account: {minterAddr}")
print(f"                     Seed: {nftoken_minter_wallet.seed}")

# Construct AccountSet transaction to authorize another account (Minter Account) to issue NFTs on our behalf
print(f"\nAuthorizing account {minterAddr} as a NFT minter on account {issuerAddr}...")
authorize_minter_tx = AccountSet(
    account=issuerAddr,
    set_flag=AccountSetFlag.ASF_AUTHORIZED_NFTOKEN_MINTER,
    nftoken_minter=minterAddr
)

# Sign authorize_minter_tx using issuer account
authorize_minter_tx_signed = safe_sign_and_autofill_transaction(transaction=authorize_minter_tx, wallet=issuer_wallet, client=client)
authorize_minter_tx_signed = send_reliable_submission(transaction=authorize_minter_tx_signed, client=client)
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
mint_tx_1_signed = safe_sign_and_autofill_transaction(transaction=mint_tx_1, wallet=nftoken_minter_wallet, client=client)
mint_tx_1_signed = send_reliable_submission(transaction=mint_tx_1_signed, client=client)
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
