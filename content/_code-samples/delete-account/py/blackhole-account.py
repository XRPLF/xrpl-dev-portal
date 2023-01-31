from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet, SetRegularKey, AccountSetFlag, Payment
from xrpl.transaction import safe_sign_and_autofill_transaction, send_reliable_submission
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountInfo

# This code sample will blackhole an account
# A funded account on the testnet is provided for testing purposes
# https://xrpl.org/accounts.html#special-addresses

asfDisableMaster = 1114112

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Get credentials from the Testnet Faucet
print("Requesting an account from the Testnet faucet...")
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.classic_address

print(f"\n Account: {test_wallet.classic_address}")
print(f"    Seed: {test_wallet.seed}")

# This is a well known blackhole address
blackhole_address = "rrrrrrrrrrrrrrrrrrrrBZbvji"

# Construct SetRegularKey transaction
tx_regulary_key = SetRegularKey(
    account=myAddr,
    regular_key=blackhole_address
)

# Sign the transaction
tx_regulary_key_signed = safe_sign_and_autofill_transaction(tx_regulary_key, wallet=test_wallet, client=client)
submit_tx_regular = send_reliable_submission(client=client, transaction=tx_regulary_key_signed)
submit_tx_regular = submit_tx_regular.result
print(f"\n Submitted a SetRegularKey tx.  Result: {submit_tx_regular['meta']['TransactionResult']}")
print(f"                            Tx content: {submit_tx_regular}")

# Construct AccountSet transaction w/ asfDisableMaster flag
# This permanently blackholes an account!
tx_disable_master_key = AccountSet(
    account=myAddr,
    set_flag=AccountSetFlag.ASF_DISABLE_MASTER
)

# Sign the transaction
tx_disable_master_key_signed = safe_sign_and_autofill_transaction(tx_disable_master_key, wallet=test_wallet, client=client)
submit_tx_disable = send_reliable_submission(client=client, transaction=tx_disable_master_key_signed)
submit_tx_disable = submit_tx_disable.result
print(f"\n Submitted a DisableMasterKey tx.  Result: {submit_tx_disable['meta']['TransactionResult']}")
print(f"                               Tx content: {submit_tx_disable}")

# Verify Account Settings
get_acc_flag = AccountInfo(
    account=myAddr
)
response = client.request(get_acc_flag)

if response.result['account_data']['Flags'] & asfDisableMaster:
    print(f"\nAccount {myAddr}'s master key has been disabled, account is blackholed.")

else:
    print(f"\nAccount {myAddr}'s master key is still enabled, account is NOT blackholed")
