import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from datetime import timedelta
from xrpl.models.requests import NFTSellOffers
from xrpl.models.requests import NFTBuyOffers
from xrpl.models.transactions import NFTokenAcceptOffer
testnet_url = "https://s.altnet.rippletest.net:51234"

def create_sell_offer(_seed, _amount, _nftoken_id, _expiration, _destination):
# Get the client
    owner_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)  
    expiration_date = datetime.now()
    if (_expiration != ''):
        expiration_date = xrpl.utils.datetime_to_ripple_time(expiration_date)
        expiration_date = expiration_date + int(_expiration)
# Define the sell offer
    sell_offer_tx = xrpl.models.transactions.NFTokenCreateOffer(
        account = owner_wallet.classic_address,
        nftoken_id = _nftoken_id,
        amount = _amount,
        destination=_destination if _destination != '' else None,
        expiration = expiration_date if _expiration != '' else None,
        flags = 1
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        sell_offer_tx, owner_wallet, client)   
# Submit the transaction and report the results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result
def accept_sell_offer(_seed, _offer_index):
    buyer_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
    accept_offer_tx = xrpl.models.transactions.NFTokenAcceptOffer(
       account = buyer_wallet.classic_address,
       nftoken_sell_offer = _offer_index
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        accept_offer_tx, buyer_wallet, client)   
# Submit the transaction and report the results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result

def create_buy_offer(_seed, _amount, _nft_id, _owner, _expiration, _destination):
# Get the client
    buyer_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
    expiration_date = datetime.now()
    if (_expiration != ''):
        expiration_date = xrpl.utils.datetime_to_ripple_time(expiration_date)
        expiration_date = expiration_date + int(_expiration)
# Define the buy offer transaction with an expiration date
    buy_offer_tx = xrpl.models.transactions.NFTokenCreateOffer(
        account = buyer_wallet.classic_address,
        nftoken_id = _nft_id,
        amount = _amount,
        owner = _owner,
        expiration = expiration_date if _expiration != '' else None,
        destination=_destination if _destination != '' else None,
        flags = 0
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        buy_offer_tx, buyer_wallet, client)   
# Submit the transaction and report the results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result
def accept_buy_offer(_seed, _offer_index):
    buyer_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
    accept_offer_tx = xrpl.models.transactions.NFTokenAcceptOffer(
       account = buyer_wallet.classic_address,
       nftoken_buy_offer = _offer_index
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        accept_offer_tx, buyer_wallet, client)   
# Submit the transaction and report the results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result

def get_offers(_nft_id):
    client = JsonRpcClient(testnet_url)
    offers = NFTBuyOffers(
        nft_id=_nft_id
    )
    response = client.request(offers)
    allOffers = "Buy Offers:\n" + json.dumps(response.result, indent=4)
    offers = NFTSellOffers(
        nft_id=_nft_id
    )
    response = client.request(offers)
    allOffers += "\n\nSell Offers:\n" + json.dumps(response.result, indent=4)
    return allOffers

def cancel_offer(_seed, _nftoken_offer_ids):
    owner_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
    tokenOfferIDs = [_nftoken_offer_ids]
    nftSellOffers = "No sell offers"
    cancel_offer_tx = xrpl.models.transactions.NFTokenCancelOffer(
            account = owner_wallet.classic_address,
            nftoken_offers = tokenOfferIDs
        )
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        cancel_offer_tx, owner_wallet, client)     
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result




    
    
