import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests.account_info import AccountInfo


testnet_url = "https://s.altnet.rippletest.net:51234"

#####################
# create_trust_line #
#####################

def create_trust_line(_seed, _issuer, _currency, _amount):
# Get the client
    receiving_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
# Define the trust line transaction
    trustline_tx = xrpl.models.transactions.TrustSet(
        account = receiving_wallet.classic_address,
        limit_amount = xrpl.models.amounts.IssuedCurrencyAmount(
            currency = _currency,
            issuer = _issuer,
            value = int(_amount)
        )
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        trustline_tx, receiving_wallet, client)   
# Submit the transaction and get results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result

#################
# send_currency #
#################

def send_currency(_seed, _destination, _currency, _amount):
# Get the client
    sending_wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
# Define the payment transaction.
    send_currency_tx = xrpl.models.transactions.Payment(
        account = sending_wallet.classic_address,
        amount =  xrpl.models.amounts.IssuedCurrencyAmount(
            currency = _currency,
            value = int(_amount),
            issuer = sending_wallet.classic_address
        ),
        destination=_destination
    )
# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        send_currency_tx, sending_wallet, client)   
# Submit the transaction and get results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result

###############
# get_balance #
###############

def get_balance(_sb_account_id, _op_account_id):
    JSON_RPC_URL = 'wss://s.altnet.rippletest.net:51234'
    client = JsonRpcClient(JSON_RPC_URL)
    balance = xrpl.models.requests.GatewayBalances(
        account=_sb_account_id,
        ledger_index="validated",
        hotwallet=[_op_account_id]
    )
    response = client.request(balance)
    return response.result
    
#####################
# configure_account #
#####################

def configure_account(_seed, _default_setting):
# Get the client
    wallet = Wallet(_seed, sequence = 16237283)
    client = JsonRpcClient(testnet_url)
# Create transaction
    if (_default_setting.get()):
        setting_tx = xrpl.models.transactions.AccountSet(
            account =  wallet.classic_address,
            set_flag=xrpl.models.transactions.AccountSetFlag.ASF_DEFAULT_RIPPLE
        )
    else:
        setting_tx = xrpl.models.transactions.AccountSet(
            account =  wallet.classic_address,
            clear_flag = xrpl.models.transactions.AccountSetFlag.ASF_DEFAULT_RIPPLE
        )

# Sign and fill the transaction    
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        setting_tx, wallet, client)   
# Submit the transaction and get results
    try:
        response = xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response.result = f"Submit failed: {e}"
    return response.result
    
