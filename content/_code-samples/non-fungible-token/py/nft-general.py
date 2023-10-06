from xrpl.models.transactions.nftoken_create_offer import NFTokenCreateOffer, NFTokenCreateOfferFlag
from xrpl.transaction import submit_and_wait
from xrpl.models.transactions.nftoken_mint import NFTokenMint, NFTokenMintFlag
from xrpl.models.transactions.nftoken_accept_offer import NFTokenAcceptOffer
from xrpl.models.transactions.nftoken_cancel_offer import NFTokenCancelOffer
from xrpl.models.transactions.account_set import AccountSet, AccountSetAsfFlag
from xrpl.models.transactions.nftoken_burn import NFTokenBurn
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountNFTs
from xrpl.clients import JsonRpcClient
from xrpl.models import NFTSellOffers

# This code snippet walks you through on how to mint a NFT, burn a NFT, authorize another account to mint on your behalf
# And how to create an Offer, cancel an Offer, and accept an Offer native on the XRP Ledger

# https://xrpl.org/non-fungible-tokens.html#nfts-on-the-xrp-ledger
# https://xrpl.org/nftokenmint.html#nftokenmint
# https://xrpl.org/nftokenburn.html#nftokenburn
# https://xrpl.org/authorize-minter.html#set-minter

# This code flows as follows:
# 1. Create issuer, minter, buyer account (3 separate accounts)
# 2. Mint NFT using issuer account
# 3. Burn the previous NFT using issuer account
# 4. Assign an authorized NFT minter (minter account) on issuer account
# 5. Mint NFT using minter account but the issuer account as the NFT's Issuer
# 6. Sell NFT on the open market using minter account
# 7. Cancel NFT's sell offer using minter account
# 8. Sell NFT on the open market using minter account
# 9. Buy NFT using buyer account by accepting the sell offer via NFTokenAcceptOffer transaction
# -- END --

# Connect to a testnet node
print("Connecting to Testnet...")
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Get issuer, minter, buyer account credentials from the Testnet Faucet
print("Requesting address from the Testnet faucet...")
issuer_wallet = generate_faucet_wallet(client=client)
issuerAddr = issuer_wallet.address

nftoken_minter_wallet = generate_faucet_wallet(client=client)
minterAddr = nftoken_minter_wallet.address

buyer_wallet = generate_faucet_wallet(client=client)
buyerAddr = buyer_wallet.address

print(f"              Minter Account: {issuerAddr}"
      f"\n   Authorized Minter Account: {minterAddr}"
      f"\n               Buyer Account: {buyerAddr}")

# Construct NFTokenMint transaction to mint 1 NFT
print(f"\n - Minting a NFT on account {issuerAddr}...")
mint_tx = NFTokenMint(
    account=issuerAddr,
    nftoken_taxon=0
)

# Sign and submit mint_tx using issuer account
mint_tx_response = submit_and_wait(transaction=mint_tx, client=client, wallet=issuer_wallet)
mint_tx_result = mint_tx_response.result
print(f"\n Mint tx result: {mint_tx_result['meta']['TransactionResult']}"
      f"\n    Tx response: {mint_tx_result}")

# Query the issuer account for its NFTs
get_account_nfts = client.request(AccountNFTs(account=issuerAddr))
response = get_account_nfts.result['account_nfts'][0]

print(f"\n - NFToken metadata:"
      f"\n    Issuer: {response['Issuer']}"
      f"\n    NFT ID: {response['NFTokenID']}"
      f"\n NFT Taxon: {response['NFTokenTaxon']}")

# Construct NFTokenBurn transaction to burn our previously minted NFT
print(f"\n - Burning NFT {response['NFTokenID']} on account {issuerAddr}...")
burn_tx = NFTokenBurn(
    account=issuerAddr,
    nftoken_id=response['NFTokenID']
)

# Sign burn_tx using issuer account
burn_tx_response = submit_and_wait(transaction=burn_tx, client=client, wallet=issuer_wallet)
burn_tx_result = burn_tx_response.result
print(f"\n Burn tx result: {burn_tx_result['meta']['TransactionResult']}"
      f"\n    Tx response: {burn_tx_result}")

if burn_tx_result['meta']['TransactionResult'] == "tesSUCCESS":
    print(f"Transaction was successfully validated, NFToken {response['NFTokenID']} has been burned")
else:
    print(f"Transaction failed, NFToken was not burned, error code: {burn_tx_result['meta']['TransactionResult']}")

# Construct AccountSet transaction to authorize the minter account to issue NFTs on the issuer account's behalf
print(f"\n - Authorizing account {minterAddr} as a NFT minter on account {issuerAddr}...")
authorize_minter_tx = AccountSet(
    account=issuerAddr,
    set_flag=AccountSetAsfFlag.ASF_AUTHORIZED_NFTOKEN_MINTER,
    nftoken_minter=minterAddr
)

# Sign authorize_minter_tx using issuer account
authorize_minter_tx_response = submit_and_wait(transaction=authorize_minter_tx, client=client, wallet=issuer_wallet)
authorize_minter_tx_result = authorize_minter_tx_response.result
print(f"\n Authorize minter tx result: {authorize_minter_tx_result['meta']['TransactionResult']}"
      f"\n                Tx response: {authorize_minter_tx_result}")


if authorize_minter_tx_result['meta']['TransactionResult'] == "tesSUCCESS":
    print(f"Transaction was successfully validated, minter {minterAddr} is now authorized to issue NFTs on behalf of {issuerAddr}")
else:
    print(f"Transaction failed, error code: {authorize_minter_tx_result['meta']['TransactionResult']}"
          f"\nMinter {minterAddr} is not authorized to issue NFTS on behalf of {issuerAddr}")

# Construct NFTokenMint transaction to mint a brand new NFT
print(f"\n - Minting a NFT from the newly authorized account to prove that it works...")
mint_tx_1 = NFTokenMint(
    account=minterAddr,
    issuer=issuerAddr,
    nftoken_taxon=1,
    flags=NFTokenMintFlag.TF_TRANSFERABLE
)

# Sign using previously authorized minter's account, this will result in the NFT's issuer field to be the Issuer Account
# while the NFT's owner would be the Minter Account
mint_tx_1_response = submit_and_wait(transaction=mint_tx_1, client=client, wallet=nftoken_minter_wallet)
mint_tx_1_result = mint_tx_1_response.result
print(f"\n Mint tx result: {mint_tx_1_result['meta']['TransactionResult']}"
      f"\n    Tx response: {mint_tx_1_result}")

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

# Construct a NFTokenCreateOffer transaction to sell the previously minted NFT on the open market
nftoken_amount = "10000000"
print(f"\n - Selling NFT {response['NFTokenID']} for {int(nftoken_amount) / 1000000} XRP on the open market...")
sell_tx = NFTokenCreateOffer(
    account=minterAddr,
    nftoken_id=response['NFTokenID'],
    amount=nftoken_amount, # 10 XRP in drops, 1 XRP = 1,000,000 drops
    flags=NFTokenCreateOfferFlag.TF_SELL_NFTOKEN,
)

# Sign and submit sell_tx using minter account
sell_tx_response = submit_and_wait(transaction=sell_tx, client=client, wallet=nftoken_minter_wallet)
sell_tx_result = sell_tx_response.result
print(f"\n Sell Offer tx result: {sell_tx_result['meta']['TransactionResult']}"
      f"\n          Tx response: {sell_tx_result}")

# Query the sell offer
response_offers = client.request(
    NFTSellOffers(nft_id=response['NFTokenID'])
)

offer_objects = response_offers.result

# Cancel the previous Sell Offer
print(f"\n - Cancelling offer {offer_objects['offers'][0]['nft_offer_index']}...")
cancel_sell_offer_tx = NFTokenCancelOffer(
    account=minterAddr,
    nftoken_offers=[
        offer_objects['offers'][0]['nft_offer_index']
    ]
)

# Sign cancel_sell_offer_tx using minter account
cancel_sell_offer_tx_response = submit_and_wait(transaction=cancel_sell_offer_tx, client=client, wallet=nftoken_minter_wallet)
cancel_sell_offer_tx_result = cancel_sell_offer_tx_response.result
print(f"\n Cancel Sell Offer tx result: {cancel_sell_offer_tx_result['meta']['TransactionResult']}"
      f"\n                 Tx response: {cancel_sell_offer_tx_result}")

# Construct a NFTokenCreateOffer transaction to sell the previously minted NFT on the open market
print(f"\n - Selling NFT {response['NFTokenID']} for {int(nftoken_amount) / 1000000} XRP on the open market...")
sell_1_tx = NFTokenCreateOffer(
    account=minterAddr,
    nftoken_id=response['NFTokenID'],
    amount=nftoken_amount, # 10 XRP in drops, 1 XRP = 1,000,000 drops
    flags=NFTokenCreateOfferFlag.TF_SELL_NFTOKEN,
)

# Sign and submit sell_1_tx using minter account
sell_1_tx_response = submit_and_wait(transaction=sell_1_tx, client=client, wallet=nftoken_minter_wallet)
sell_1_tx_result = sell_1_tx_response.result
print(f"\n Sell Offer tx result: {sell_1_tx_result['meta']['TransactionResult']}"
      f"\n          Tx response: {sell_1_tx_result}")

# Query the sell offer
response = client.request(
    NFTSellOffers(
        nft_id=response['NFTokenID']
    )
)

offer_objects = response.result

# Construct a NFTokenAcceptOffer offer to buy the NFT being listed for sale on the open market
print(f"\n - Accepting offer {offer_objects['offers'][0]['nft_offer_index']}...")
buy_tx = NFTokenAcceptOffer(
    account=buyerAddr,
    nftoken_sell_offer=offer_objects['offers'][0]['nft_offer_index']
)

# Sign buy_tx using buyer account
buy_tx_response = submit_and_wait(transaction=buy_tx, client=client, wallet=buyer_wallet)
buy_tx_result = buy_tx_response.result
print(f"\n Buy Offer result: {buy_tx_result['meta']['TransactionResult']}"
      f"\n      Tx response: {buy_tx_result}")
