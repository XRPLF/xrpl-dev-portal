from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Generate a wallet and request faucet
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.address

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr
)

# Submit transaction and verify its validity on the ledger
response = submit_and_wait(transaction=tx, client=client, wallet=test_wallet)
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
