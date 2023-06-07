import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
testnet_url = "https://s.altnet.rippletest.net:51234"


def broker_sale(_seed, _sell_offer_index, _buy_offer_index, _broker_fee):
    broker_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
    accept_offer_tx = xrpl.models.transactions.NFTokenAcceptOffer(
       account = broker_wallet.classic_address,
       nftoken_sell_offer = _sell_offer_index,
       nftoken_buy_offer = _buy_offer_index,
       nftoken_broker_fee = _broker_fee
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        accept_offer_tx, broker_wallet, client)   
# Submit the transaction and report the results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result
