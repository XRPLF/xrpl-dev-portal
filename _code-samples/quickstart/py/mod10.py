import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from xrpl.models.transactions import CheckCreate, CheckCash, CheckCancel
from xrpl.models.requests import AccountObjects, AccountTx, GatewayBalances

testnet_url = "https://s.devnet.rippletest.net:51234"

def send_check(seed, amount, destination, currency, issuer):
    """send_check"""
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    if currency != "XRP":
        amount = {"value": amount,
                  "currency": currency,
                  "issuer": issuer
                 }
    check_tx=xrpl.models.transactions.CheckCreate(
        account=wallet.address,
        send_max=amount,
        destination=destination
    ) 
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(check_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def cash_check(seed, amount, check_id, currency, issuer):
    """cash_check"""
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    if currency != "XRP":
        amount = {
            "value": amount,
            "currency": currency,
            "issuer": issuer
        }
    finish_tx=xrpl.models.transactions.CheckCash(
        account=wallet.address,
        amount=amount,
        check_id=check_id
    )
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(finish_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def cancel_check(seed, check_id):
    """cancel_check"""
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    cancel_tx=xrpl.models.transactions.CheckCancel(
        account=wallet.address,
        check_id=check_id
    )
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(cancel_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def get_checks(account):
    """get_checks"""
    client=JsonRpcClient(testnet_url)
    acct_checks=AccountObjects(
        account=account,
        ledger_index="validated",
        type="check"
    )
    response=client.request(acct_checks)
    return response.result
