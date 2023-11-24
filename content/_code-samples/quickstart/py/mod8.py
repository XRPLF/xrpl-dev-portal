import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from xrpl.models.transactions import EscrowCreate, EscrowFinish
from xrpl.models.requests import AccountObjects, AccountTx

testnet_url = "https://s.altnet.rippletest.net:51234"


def add_seconds(numOfSeconds):
    new_date = datetime.now()
    if new_date != '':
        new_date = xrpl.utils.datetime_to_ripple_time(new_date)
        new_date = new_date + int(numOfSeconds)
    return new_date


def create_time_escrow(seed, amount, destination, finish, cancel):
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    finish_date = add_seconds(finish)
    cancel_date = add_seconds(cancel)

    escrow_tx=xrpl.models.transactions.EscrowCreate(
        account=wallet.address,
        amount=amount,
        destination=destination,
        finish_after=finish_date,
        cancel_after=cancel_date
    ) 
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(escrow_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def finish_time_escrow(seed, owner, sequence):
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    finish_tx=xrpl.models.transactions.EscrowFinish(
        account=wallet.address,
        owner=owner,
        offer_sequence=int(sequence)
    )
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(finish_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def get_escrows(account):
    client=JsonRpcClient(testnet_url)
    acct_escrows=AccountObjects(
        account=account,
        ledger_index="validated",
        type="escrow"
    )
    response=client.request(acct_escrows)
    return response.result

def cancel_time_escrow(seed, owner, sequence):
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    cancel_tx=xrpl.models.transactions.EscrowCancel(
        account=wallet.address,
        owner=owner,
        offer_sequence=int(sequence)
    )
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(cancel_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def get_transaction(account, ledger_index):
    client=JsonRpcClient(testnet_url)
    tx_info=AccountTx(
        account=account,
        ledger_index=int(ledger_index)
    )
    response=client.request(tx_info)
    return response.result
