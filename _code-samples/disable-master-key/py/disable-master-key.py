import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.models.transactions import SetRegularKey, AccountSet, AccountSetAsfFlag
from xrpl.models.requests import AccountInfo
from xrpl.transaction import submit_and_wait

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client)
print(f"""Funded. Master key pair:
  Address: {wallet.address}
  Seed: {wallet.seed}
""")

# Generate a regular key and assign it to the account --------------------------
# Skip this step if you are using a pre-existing account that already has a
# regular key or multi-signing list configured.
# To black-hole an account, set the RegularKey to a well-known blackhole
# address such as rrrrrrrrrrrrrrrrrrrrrhoLvTp instead.
algorithm = "ed25519"
regular_key_pair = Wallet.create(algorithm)
print(f"""Generated regular key pair:
  Address: {regular_key_pair.address}
  Seed: {regular_key_pair.seed}
  Algorithm: {algorithm}
""")

regular_key_tx = SetRegularKey(
    account=wallet.address, regular_key=regular_key_pair.address
)

print("Assigning regular key to the account...")
try:
    response = submit_and_wait(regular_key_tx, client, wallet)
except err:
    print("Submitting SetRegularKey transaction failed with error", err)
    exit(1)
set_regular_key_result_code = response.result["meta"]["TransactionResult"]
if set_regular_key_result_code == "tesSUCCESS":
    print("Regular Key set successfully.")
else:
    print(f"SetRegularKey failed with code {set_regular_key_result_code}.")
    exit(1)

# Disable master key pair ------------------------------------------------------
disable_master_key_tx = AccountSet(
    account=wallet.address, set_flag=AccountSetAsfFlag.ASF_DISABLE_MASTER
)

print("Disabling master key pair...")
response2 = submit_and_wait(
    disable_master_key_tx, client, wallet
)  # only the master key pair can disable itself
disable_master_result_code = response2.result["meta"]["TransactionResult"]

if disable_master_result_code == "tesSUCCESS":
    print("Master key disabled successfully.")
else:
    print(f"AccountSet failed with code {disable_master_result_code}.")
    exit(1)

# Confirm account flags --------------------------------------------------------
account_info_request = AccountInfo(account=wallet.address, ledger_index="validated")
try:
    account_info_resp = client.request(account_info_request)
except Exception as e:
    print(f"Error requesting account_info: {e}")
    exit(1)
if not account_info_resp.is_successful():
    print(f"Error looking up account: {account_info_resp.result}")
    exit(1)

account_flags = account_info_resp.result["account_flags"]
print(f"Flags for account {wallet.address}:")
print(json.dumps(account_flags, indent=2))

if account_flags["disableMasterKey"]:
    print("Master key pair is disabled")
else:
    print("Master key pair is ENABLED")
