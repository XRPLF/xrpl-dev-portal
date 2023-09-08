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

def create_sell_offer(seed, amount, nftoken_id, expiration, destination):
    """create_sell_offer"""
# Get the client
    owner_wallet = Wallet.from_seed(seed)
    client = JsonRpcClient(testnet_url)
    expiration_date = datetime.now()
    if expiration != '':
        expiration_date = xrpl.utils.datetime_to_ripple_time(expiration_date)
        expiration_date = expiration_date + int(expiration)
# Define the sell offer
    sell_offer_tx=xrpl.models.transactions.NFTokenCreateOffer(
        account=owner_wallet.address,
        nftoken_id=nftoken_id,
        amount=amount,
        destination=destination if destination != '' else None,
        expiration=expiration_date if expiration != '' else None,
        flags=1
    )
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(sell_offer_tx,client,owner_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def accept_sell_offer(seed, offer_index):
    """accept_sell_offer"""
    buyer_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    accept_offer_tx=xrpl.models.transactions.NFTokenAcceptOffer(
       account=buyer_wallet.classic_address,
       nftoken_sell_offer=offer_index
    )
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(accept_offer_tx,client,buyer_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply


def create_buy_offer(seed, amount, nft_id, owner, expiration, destination):
    """create_buy_offer"""
# Get the client
    buyer_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    expiration_date=datetime.now()
    if (expiration!=''):
        expiration_date=xrpl.utils.datetime_to_ripple_time(expiration_date)
        expiration_date=expiration_date + int(expiration)
# Define the buy offer transaction with an expiration date
    buy_offer_tx=xrpl.models.transactions.NFTokenCreateOffer(
        account=buyer_wallet.address,
        nftoken_id=nft_id,
        amount=amount,
        owner=owner,
        expiration=expiration_date if expiration!='' else None,
        destination=destination if destination!='' else None,
        flags=0
    )
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(buy_offer_tx,client,buyer_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply


def accept_buy_offer(seed, offer_index):
    """accept_buy_offer"""
    buyer_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    accept_offer_tx=xrpl.models.transactions.NFTokenAcceptOffer(
       account=buyer_wallet.address,
       nftoken_buy_offer=offer_index
    )
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(accept_offer_tx,client,buyer_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def get_offers(nft_id):
    """get_offers"""
    client=JsonRpcClient(testnet_url)
    offers=NFTBuyOffers(
        nft_id=nft_id
    )
    response=client.request(offers)
    allOffers="Buy Offers:\n"+json.dumps(response.result, indent=4)
    offers=NFTSellOffers(
        nft_id=nft_id
    )
    response=client.request(offers)
    allOffers+="\n\nSell Offers:\n"+json.dumps(response.result, indent=4)
    return allOffers

def cancel_offer(seed, nftoken_offer_ids):
    """cancel_offer"""
    owner_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    tokenOfferIDs=[nftoken_offer_ids]
    nftSellOffers="No sell offers"
    cancel_offer_tx=xrpl.models.transactions.NFTokenCancelOffer(
				account=owner_wallet.classic_address,
				nftoken_offers=tokenOfferIDs
    )
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(cancel_offer_tx,client,owner_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
