import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from xrpl.models.transactions import EscrowCreate, EscrowFinish
from os import urandom
from cryptoconditions import PreimageSha256

testnet_url = "https://s.altnet.rippletest.net:51234"

def generate_condition():
    randy = urandom(32)
    fulfillment = PreimageSha256(preimage=randy)
    return (fulfillment.condition_binary.hex().upper(),
            fulfillment.serialize_binary().hex().upper())

def add_seconds(numOfSeconds):
    new_date = datetime.now()
    if new_date != '':
        new_date = xrpl.utils.datetime_to_ripple_time(new_date)
        new_date = new_date + int(numOfSeconds)
    return new_date


def create_conditional_escrow(seed, amount, destination, cancel, condition):
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    cancel_date = add_seconds(cancel)
    finish_date = cancel_date - 200

    escrow_tx=xrpl.models.transactions.EscrowCreate(
        account=wallet.address,
        amount=amount,
        destination=destination,
        cancel_after=cancel_date,
        condition=condition
    ) 
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(escrow_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def finish_conditional_escrow(seed, owner, sequence, condition, fulfillment):
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    finish_tx=xrpl.models.transactions.EscrowFinish(
        account=wallet.address,
        owner=owner,
        offer_sequence=int(sequence),
        condition=condition,
        fulfillment=fulfillment
    )
    # Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(finish_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
