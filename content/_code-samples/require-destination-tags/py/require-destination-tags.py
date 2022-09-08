from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import safe_sign_and_submit_transaction
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountInfo

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Generate a wallet and request faucet
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.classic_address

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr,
    set_flag=1  # Numerical Value: 1 = asfRequireDest
)

# Sign the transaction locally and submit to a node
my_tx_payment_signed = safe_sign_and_submit_transaction(tx, wallet=test_wallet, client=client)
my_tx_payment_signed = my_tx_payment_signed.result["engine_result"]

print(f"Transaction result: {my_tx_payment_signed}")

# Verify Account Settings
get_acc_flag = AccountInfo(
        account=myAddr
)

response = client.request(get_acc_flag)

if response.result['account_data']['Flags'] == 131072:
    print("Require Destination Tag is enabled.")
else:
    print("Require Destination Tag is DISABLED.")
