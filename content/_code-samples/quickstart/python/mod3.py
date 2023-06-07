import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests import AccountNFTs

testnet_url = "https://s.altnet.rippletest.net:51234"

##############
# mint_token #
##############

def mint_token(_seed, _uri, _flags, _transfer_fee, _taxon):
# Get the client
    mint_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
# Define the mint transaction
    mint_tx = xrpl.models.transactions.NFTokenMint(
        account = mint_wallet.classic_address,
        uri = xrpl.utils.str_to_hex(_uri),
        flags = int(_flags),
        transfer_fee = int(_transfer_fee),
        nftoken_taxon = int(_taxon)
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        mint_tx, mint_wallet, client)   
# Submit the transaction and get results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result

##############
# get_tokens #
##############

def get_tokens(_account):
    from xrpl.clients import JsonRpcClient
    import json
    client = JsonRpcClient(testnet_url)
    acct_nfts = AccountNFTs(
        account=_account
    )
    response = client.request(acct_nfts)
    return response.result


##############
# burn_token #
##############

def burn_token(_seed, _nftoken_id):
# Get the client
    owner_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
    burn_tx = xrpl.models.transactions.NFTokenBurn(
        account = owner_wallet.classic_address,
        nftoken_id = _nftoken_id    
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        burn_tx, owner_wallet, client)   
# Submit the transaction and get results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result


