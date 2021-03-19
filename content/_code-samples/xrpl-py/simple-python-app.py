import xrpl

# Core modules to 
# To generate keypairs and encode addresses
from xrpl.core import keypairs
from xrpl.core.addresscodec.main import classic_address_to_xaddress

# Network client
from xrpl.clients.json_rpc_client import JsonRpcClient

# To create test wallets
from xrpl.wallet import generate_faucet_wallet

# Request models
from xrpl.models.requests.account_info import AccountInfo

# Wallet models
from xrpl.wallet import Wallet

# Transaction models
from xrpl.models.transactions.transaction import Transaction, TransactionType, AccountSet, Payment
from xrpl.models.transactions import AccountSet
from xrpl.transaction import (
    LastLedgerSequenceExpiredException,
)
from xrpl.transaction.main import (
    safe_sign_and_submit_transaction,
    safe_sign_transaction,
    submit_transaction_blob,
    transaction_json_to_binary_codec_form,
)
from xrpl.transaction.reliable_submission import send_reliable_submission

# Account models 
from xrpl.account import get_next_valid_seq_number




#JSON handling
import json

# Define the network client
JSON_RPC_URL_TESTNET = "https://s.altnet.rippletest.net:51234/"
JSON_RPC_CLIENT_TESTNET = JsonRpcClient(JSON_RPC_URL_TESTNET)


JSON_RPC_URL_DEVNET = "https://s.devnet.rippletest.net:51234/"
JSON_RPC_CLIENT_DEVNET = JsonRpcClient(JSON_RPC_URL_DEVNET)

# Create wallets using the testnet faucet: 
# https://xrpl.org/xrp-testnet-faucet.html
TESTNET_WALLET = generate_faucet_wallet(JSON_RPC_CLIENT_TESTNET)
TESTNET_CLASSIC_ACCOUNT = TESTNET_WALLET.classic_address

DEVNET_WALLET = generate_faucet_wallet(JSON_RPC_CLIENT_DEVNET)
DEVNET_CLASSIC_ACCOUNT = DEVNET_WALLET.classic_address

# Define the receiver accounts
TESTNET_DESTINATION_WALLET = generate_faucet_wallet(JSON_RPC_CLIENT_TESTNET)
TESTNET_DESTINATION_ACCOUNT = TESTNET_DESTINATION_WALLET.classic_address


# Define variables to use for transactions
_ACCOUNT = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ"
_FEE = "10"
_SEQUENCE = 19048
SET_FLAG = 8
MEMO = "I built this with xrpl-py!"

# Secrets to use for signing transactions
_SECRET = "randomsecretkey"
_SEED = "randomsecretseedforakey"
_SEED_HEX = "EACEB081770D8ADE216C85445DD6FB002C6B5A2930F2DECE006DA18150CB18F6"
_PASSPHRASE = "mytopsecretpassphrasethatwillneverbehacked"


# Create an XRP Ledger wallet
# And create an x-address for the address
def create_wallet():
    TESTNET_WALLET = generate_faucet_wallet(JSON_RPC_CLIENT_TESTNET)
    wallet2_address = wallet2.classic_address
    xaddress = addresscodec.classic_address_to_xaddress(
                wallet2_address, tag, True
            )
    print("Classic address:", address)
    print("X-address:", xaddress)



# Optionally generate private and public keys
# to manage your XRP Ledger account
def generate_keys():
    seed = keypairs.generate_seed()
    public, private = keypairs.derive_keypair(seed)
    CLASSIC_ACCOUNT = keypairs.derive_classic_address(public)
    print("Here's the public key: ", public + "Store this in a secure place.")
    print("Here's the private key: ", private)
    
# Look up information about your account
def get_acct_info():
    client = JsonRpcClient(JSON_RPC_URL)
    acct_info = AccountInfo(
        account=wallet,
        ledger_index="current",
        queue=True,
        strict=True,
    )
    response = JSON_RPC_CLIENT_TESTNET.request(acct_info)
    print("response.status: ", response.status)
    print("response.result: ", response.result)
    print("response.id: ", response.id)
    print("response.type: ", response.type)
    print("response.result.account_data.Balance", response.result.account_data.Balance)
    for key, value in response.result():
        print(key, value)
        for k, v in value.result():
            print(k,v)



# Prepare the tx by formatting it into
# the shape expected by the XRP Ledger
# and signing it
def prepare_sign_submit_tx():
    TESTNET_WALLET.next_sequence_num = get_next_valid_seq_number(TESTNET_CLASSIC_ACCOUNT, JSON_RPC_CLIENT_TESTNET)
    account_set = AccountSet(
        account=TESTNET_CLASSIC_ACCOUNT,
        fee=_FEE,
        sequence=TESTNET_WALLET.next_sequence_num,
        set_flag=SET_FLAG,
    )
    response = safe_sign_and_submit_transaction(account_set, TESTNET_WALLET, JSON_RPC_CLIENT_TESTNET)
    value = tx.to_dict()[]
    signed_tx = Sign(
        transaction=value,
        seed=_SEED,
        seed_hex=_SEED_HEX,
    )
    print("Signed transaction: ", signed_tx)
    payment_transaction = Payment.from_dict(value)
    response = send_reliable_submission(
        payment_transaction, CLASSIC_ACCOUNT, JSON_RPC_URL
        )
    print("response.result.validated: ", response["validated"])
    print("response.result.meta: ", response.result["meta"]["TransactionResult"], "tesSUCCESS")
    if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
        print("Transaction not yet validated")
    else:
        print("Validated!")    
    