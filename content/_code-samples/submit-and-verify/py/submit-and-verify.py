from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import safe_sign_and_submit_transaction
from xrpl.core import keypairs
from xrpl.wallet import Wallet

myAddr = "rfaNymVS1fEREj4FpNroXVEcVVMph6k2Mt"
mySeed = "ss3GZzmyEBxvwB3LUv-----------"

# Derive and initialize wallet
public, private = keypairs.derive_keypair(mySeed)
wallet_from_seed = Wallet(mySeed, 0)

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr,
    fee="10",
    set_flag=1  # Numerical Value: 1 = asfRequireDest
)

# Sign the transaction locally & submit transaction and verify its validity on the ledger
my_tx_payment_signed = safe_sign_and_submit_transaction(transaction=tx, wallet=wallet_from_seed, client=client)

if my_tx_payment_signed.is_successful():
    print("Transaction successful!")
else:
    print("Transaction failed")
