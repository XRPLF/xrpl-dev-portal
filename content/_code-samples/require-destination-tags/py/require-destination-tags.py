from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import safe_sign_and_submit_transaction
from xrpl.core import keypairs
from xrpl.wallet import Wallet

myAddr = "rwDMiiYQTnPRxPxPg3DN5FneWmSrx8B2Ej"
mySeed = "sss69gbX4ayqgBHgKRa----------"

# Derive and initialize wallet
wallet_from_seed = Wallet(mySeed, 0)

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr,
    set_flag=1  # Numerical Value: 1 = asfRequireDest
)

# Sign the transaction locally and submit to a node
my_tx_payment_signed = safe_sign_and_submit_transaction(tx, wallet=wallet_from_seed, client=client)
my_tx_payment_signed = my_tx_payment_signed.result
result = my_tx_payment_signed["engine_result"]

if result == "tesSUCCESS":
    print("AccountSet transaction successful, Destination Tag is now required for all incoming transactions")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
