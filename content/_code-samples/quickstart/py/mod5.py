import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
testnet_url = "https://s.altnet.rippletest.net:51234"


def broker_sale(seed, sell_offer_index, buy_offer_index, broker_fee):
    """broker_sale"""
    broker_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    accept_offer_tx=xrpl.models.transactions.NFTokenAcceptOffer(
       account=broker_wallet.classic_address,
       nftoken_sell_offer=sell_offer_index,
       nftoken_buy_offer=buy_offer_index,
       nftoken_broker_fee=broker_fee
    )
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(accept_offer_tx,client,broker_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
