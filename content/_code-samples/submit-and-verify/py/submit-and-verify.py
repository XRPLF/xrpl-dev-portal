from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import safe_sign_and_autofill_transaction, send_reliable_submission
from xrpl.wallet import Wallet

myAddr = "rM4vA4uRpc2MtCoc4vdhhTwWqsWcncwaLL"
mySeed = "ssJ4QYQLXomJLSKBT----------"

# Derive and initialize wallet
wallet_from_seed = Wallet(mySeed, 0)

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr
)

# Sign the transaction locally
my_tx_payment_signed = safe_sign_and_autofill_transaction(transaction=tx, wallet=wallet_from_seed, client=client)
# Submit transaction and verify its validity on the ledger
response = send_reliable_submission(transaction=my_tx_payment_signed, client=client)
result = response.result["meta"]["TransactionResult"]

if result == "tesSUCCESS":
    print("Transaction successful!")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
