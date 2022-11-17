from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet, AccountSetFlag
from xrpl.transaction import safe_sign_and_autofill_transaction, submit_transaction
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountInfo

# Stand-alone code sample for the "Require Destination Tags" tutorial:
# https://xrpl.org/require-destination-tags.html

lsfRequireDestTag = 131072

# Connect to a testnet node
print("Connecting to Testnet...")
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Get credentials from the Testnet Faucet
print("Requesting address from the Testnet faucet...")
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.classic_address

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr,
    set_flag=AccountSetFlag.ASF_REQUIRE_DEST
)
print(f"Prepared transaction: {tx}")

# Sign the transaction
my_tx_payment_signed = safe_sign_and_autofill_transaction(tx, wallet=test_wallet, client=client)
print(f"Transaction Hash: {my_tx_payment_signed.txn_signature}")

# Send the transaction to the node
print(f"Enabling Require Destination Tag flag (asfRequireDest) on {myAddr}")
submit_tx = submit_transaction(client=client, transaction=my_tx_payment_signed)
submit_tx = submit_tx.result["engine_result"]
print(f"Submit result: {submit_tx}")

# Verify Account Settings
get_acc_flag = AccountInfo(
    account=myAddr
)
response = client.request(get_acc_flag)

if response.result['account_data']['Flags'] & lsfRequireDestTag:
    print("Require Destination Tag is ENABLED.")
else:
    print("Require Destination Tag is DISABLED.")
