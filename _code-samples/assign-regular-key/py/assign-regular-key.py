import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.models.transactions import SetRegularKey, AccountSet
from xrpl.transaction import submit_and_wait

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client)
print(f"""Funded. Master key pair:
  Address: {wallet.address}
  Seed: {wallet.seed}
""")

# Generate a new key pair to use as the regular key ----------------------------
algorithm = "ed25519"
regular_key_pair = Wallet.create(algorithm=algorithm)
print(f"""Generated regular key pair:
  Address: {regular_key_pair.address}
  Seed: {regular_key_pair.seed}
  Algorithm: {algorithm}
""")

# Send SetRegularKey transaction -----------------------------------------------
regular_key_tx = SetRegularKey(
    account=wallet.address, regular_key=regular_key_pair.address
)

print(
    "Signing and submitting the SetRegularKey transaction:",
    json.dumps(regular_key_tx.to_xrpl(), indent=2),
)
try:
    response = submit_and_wait(regular_key_tx, client, wallet)
except err:
    print("Submitting SetRegularKey transaction failed with error", err)
    exit(1)

# Check result of the SetRegularKey transaction --------------------------------
print(json.dumps(response.result, indent=2))
set_regular_key_result_code = response.result["meta"]["TransactionResult"]
if set_regular_key_result_code == "tesSUCCESS":
    print("Regular Key set successfully.")
else:
    print(f"SetRegularKey failed with code {set_regular_key_result_code}.")
    exit(1)

# Send a test transaction using the regular key --------------------------------
test_tx = AccountSet(account=wallet.address)

print("Signing and submitting the test transaction using the regular key")
try:
    test_response = submit_and_wait(
        test_tx, client, regular_key_pair # IMPORTANT: use regular key pair here
    )
except err:
    print("Submitting test transaction failed with error", err)
    exit(1)

# Check result of the test transaction -----------------------------------------
print(json.dumps(test_response.result, indent=2))
test_result_code = test_response.result["meta"]["TransactionResult"]
test_signing_pub_key = test_response.result["tx_json"]["SigningPubKey"]

if test_result_code == "tesSUCCESS":
    print("Test transaction was successful.")
else:
    print(f"Test transaction failed with code {test_result_code}")

if test_signing_pub_key == regular_key_pair.public_key:
    print("This transaction was signed with the regular key pair.")
elif test_signing_pub_key == wallet.public_key:
    print("This transaction was signed with the master key pair.")
else:
    print(f"""Unexpected signing key mismatch.
    Regular key: {regular_key_pair.public_key}
    Key used: {test_signing_pub_key}""")
