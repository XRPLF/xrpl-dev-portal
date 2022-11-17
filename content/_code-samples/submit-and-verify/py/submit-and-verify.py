from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import safe_sign_and_autofill_transaction, send_reliable_submission
from xrpl.wallet import Wallet, generate_faucet_wallet

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Generate a wallet and request faucet
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.classic_address

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr
)

# Sign the transaction locally
my_tx_payment_signed = safe_sign_and_autofill_transaction(transaction=tx, wallet=test_wallet, client=client)
# Submit transaction and verify its validity on the ledger
response = send_reliable_submission(transaction=my_tx_payment_signed, client=client)
result = response.result["meta"]["TransactionResult"]

print(f"Account: {myAddr}")
if result == "tesSUCCESS":
    print("Transaction successful!")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
