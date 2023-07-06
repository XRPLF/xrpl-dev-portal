import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests.account_info import AccountInfo


testnet_url = "https://s.altnet.rippletest.net:51234"

#####################
# create_trust_line #
#####################

def create_trust_line(seed, issuer, currency, amount):
    """create_trust_line"""
# Get the client
    receiving_wallet = Wallet(seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
# Define the trust line transaction
    trustline_tx=xrpl.models.transactions.TrustSet(
        account=receiving_wallet.classic_address,
        limit_amount=xrpl.models.amounts.IssuedCurrencyAmount(
            currency=currency,
            issuer=issuer,
            value=int(amount)
        )
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        trustline_tx, receiving_wallet, client)
# Submit the transaction and get results
    reply = ""
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
        reply = response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply = f"Submit failed: {e}"
    return reply

#################
# send_currency #
#################

def send_currency(seed, destination, currency, amount):
    """send_currency"""
# Get the client
    sending_wallet=Wallet(seed, sequence=16237283)
    client=JsonRpcClient(testnet_url)
# Define the payment transaction.
    send_currency_tx=xrpl.models.transactions.Payment(
        account=sending_wallet.classic_address,
        amount=xrpl.models.amounts.IssuedCurrencyAmount(
            currency=currency,
            value=int(amount),
            issuer=sending_wallet.classic_address
        ),
        destination=destination
    )
# Sign and fill the transaction    
    signed_tx=xrpl.transaction.safe_sign_and_autofill_transaction(
        send_currency_tx, sending_wallet, client)
# Submit the transaction and get results
    reply = ""
    try:
        response=xrpl.transaction.send_reliable_submission(signed_tx,client)
        reply = response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply = f"Submit failed: {e}"
    return reply

###############
# get_balance #
###############

def get_balance(sb_account_id, op_account_id):
    """get_balance"""
    JSON_RPC_URL='wss://s.altnet.rippletest.net:51234'
    client=JsonRpcClient(JSON_RPC_URL)
    balance=xrpl.models.requests.GatewayBalances(
        account=sb_account_id,
        ledger_index="validated",
        hotwallet=[op_account_id]
    )
    response = client.request(balance)
    return response.result
    
#####################
# configure_account #
#####################

def configure_account(seed, default_setting):
    """configure_account"""
# Get the client
    wallet=Wallet(seed, sequence = 16237283)
    client=JsonRpcClient(testnet_url)
# Create transaction
    if (default_setting):
        setting_tx=xrpl.models.transactions.AccountSet(
            account=wallet.classic_address,
            set_flag=xrpl.models.transactions.AccountSetFlag.ASF_DEFAULT_RIPPLE
        )
    else:
        setting_tx=xrpl.models.transactions.AccountSet(
            account=wallet.classic_address,
            clear_flag=xrpl.models.transactions.AccountSetFlag.ASF_DEFAULT_RIPPLE
        )

# Sign and fill the transaction    
    signed_tx=xrpl.transaction.safe_sign_and_autofill_transaction(
        setting_tx, wallet, client)
# Submit the transaction and get results
    reply = ""
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
        reply = response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply = f"Submit failed: {e}"
    return reply
    
