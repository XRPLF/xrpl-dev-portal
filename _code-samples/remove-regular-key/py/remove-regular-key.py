import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.models.transactions import SetRegularKey
from xrpl.models.requests import AccountInfo
from xrpl.transaction import submit_and_wait

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client)
print(f"""Funded. Master key pair:
  Address: {wallet.address}
  Seed: {wallet.seed}
""")

# Generate a regular key and assign it to the account -------------------------
# Skip this step if you are using a pre-existing account that already has a
# regular key configured.
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

# Check regular key associated with account -----------------------------------
account_info_resp = client.request(
    AccountInfo(account=wallet.address, ledger_index="validated")
)
if not account_info_resp.is_successful():
    print(f"Error looking up account:", account_info_resp.result)
    exit(1)

account_data = account_info_resp.result["account_data"]
print(f"Account info for {wallet.address}:")
print(json.dumps(account_data, indent=2))

if "RegularKey" in account_data.keys():
    print("Current regular key:", account_data["RegularKey"])
else:
    print("❌ No regular key set.")
    exit(1)

# Remove regular key from account ---------------------------------------------
remove_regular_key_tx = SetRegularKey(
    account=wallet.address
    # Omit regular_key field to remove existing regular key from account
)

print("Removing regular key from account...")
# When removing, you can sign with the regular key or master key
remove_resp = submit_and_wait(remove_regular_key_tx, client, regular_key_pair)
remove_regular_key_result_code = remove_resp.result["meta"]["TransactionResult"]

if remove_regular_key_result_code == "tesSUCCESS":
    print("Regular Key successfully removed.")
else:
    print("SetRegularKey (removing) failed with code", remove_regular_key_result_code)
    exit(1)

# Confirm that the account has no regular key ---------------------------------
account_info_resp2 = client.request(
    AccountInfo(account=wallet.address, ledger_index="validated")
)
if not account_info_resp2.is_successful():
    print("Error looking up account:", account_info_resp2.result)
    exit(1)

account_data2 = account_info_resp2.result["account_data"]
print(f"Account info for {wallet.address}:")
print(json.dumps(account_data2, indent=2))

if "RegularKey" in account_data2.keys():
    print("❌ Regular key address is:", account_data2["RegularKey"])
else:
    print("✅ No regular key set.")
