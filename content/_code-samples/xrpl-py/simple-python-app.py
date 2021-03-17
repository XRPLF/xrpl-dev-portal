import xrpl
from xrpl.models import Wallet
from xrpl.models.transactions.transaction import Transaction, TransactionType


# Define the URL of the server you want to use
JSON_RPC_URL = "http://s1.ripple.com:51234/"

# Define the accounts you're going to use
CLASSIC_ACCOUNT = ""
SENDER_ACCOUNT = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
address = ""
DESTINATION_WALLET = generate_faucet_wallet(JSON_RPC_URL).classic_address

# You can create a wallet using the testnet faucet: 
# https://xrpl.org/xrp-testnet-faucet.html
# with the generate_faucet_wallet function
TESTNET_ACCOUNT = generate_faucet_wallet(JSON_RPC_CLIENT).classic_address

# Define variables to use for transactions
_ACCOUNT = "r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ"
_FEE = "0.00001"
_SEQUENCE = 19048

# Secrets to use for signing transactions
_SECRET = "randomsecretkey"
_SEED = "randomsecretseedforakey"
_SEED_HEX = "EACEB081770D8ADE216C85445DD6FB002C6B5A2930F2DECE006DA18150CB18F6"
_PASSPHRASE = "mytopsecretpassphrasethatwillneverbehacked"


# Create an XRP Ledger wallet
# And create an x-address for the address
def createWallet():
    wallet = Wallet.generate_seed_and_wallet()
    address = wallet.classic_address
    xaddress = addresscodec.classic_address_to_xaddress(
                classic_address, tag, True
            )
    print("Classic address:", address)
    print("X-address:", xaddress)



# Optionally generate private and public keys
# to manage your XRP Ledger account
def generateKeys():
    seed = keypairs.generate_seed()
    public, private = keypairs.derive_keypair(seed)
    CLASSIC_ACCOUNT = keypairs.derive_classic_address(public)
    print("Here's the public key: ", public + "Store this in a secure place.")
    print("Here's the private key: ", private)
    
# Look up information about your account
def getAcctInfo():
    client = JsonRpcClient(JSON_RPC_URL)
    acct_info = AccountInfo(
        account=address,
        ledger_index="current",
        queue=True,
        strict=True,
    )
    response = client.request(acct_info)
    print("response.status: ", response.status)
    print("response.result: ", response.result)
    print("response.id: ", response.id)
    print("response.type: ", response.type)

# Prepare the tx by formatting it into
# the shape expected by the XRP Ledger
# and signing it
def prepareSignSubmitTx():
    CLASSIC_ACCOUNT.next_sequence_num = get_next_valid_seq_number(CLASSIC_ACCOUNT, JSON_RPC_CLIENT)
    tx = Transaction(
        account=_ACCOUNT,
        fee=_FEE,
        sequence=CLASSIC_ACCOUNT.next_seuqnece_num + 10,
        transaction_type=TransactionType.
    )
    value = tx.to_dict()["payment_trannsaction"]
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
    