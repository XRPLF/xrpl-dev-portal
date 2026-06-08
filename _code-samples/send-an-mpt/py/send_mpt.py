import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects, MPTokenAuthorize, Payment
from xrpl.models.amounts import MPTAmount
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet, generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Load setup data ----------------------
# This step checks for the necessary setup data to run the tutorial.
# If missing, send_mpt_setup.py will generate it.
if not os.path.exists("send_mpt_setup.json"):
    print("\n=== Setup data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "send_mpt_setup.py"], check=True)

# Load sender wallet and MPT issuance ID.
with open("send_mpt_setup.json") as f:
    setup_data = json.load(f)

sender = Wallet.from_seed(setup_data["sender"]["seed"])
mpt_issuance_id = setup_data["mpt_issuance_id"]

print(f"Sender address:   {sender.address}")
print(f"MPT issuance ID:  {mpt_issuance_id}")

# Fund a fresh receiver wallet from the faucet.
print(f"\nCreating and funding receiver wallet...")
receiver = generate_faucet_wallet(client)
print(f"Receiver address: {receiver.address}")

# Authorize receiver to hold the MPT ----------------------
print("\n=== Authorizing receiver to hold the MPT... ===\n")
authorize_tx = MPTokenAuthorize(
    account=receiver.address,
    mptoken_issuance_id=mpt_issuance_id,
)
print(json.dumps(authorize_tx.to_xrpl(), indent=2))

authorize_response = submit_and_wait(authorize_tx, client, receiver)
if authorize_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    code = authorize_response.result["meta"]["TransactionResult"]
    print(f"Error: MPTokenAuthorize failed: {code}")
    sys.exit(1)
print("Receiver authorized to hold the MPT!")
print(f"Explorer link: https://testnet.xrpl.org/transactions/{authorize_response.result['hash']}")

# Check initial balances ----------------------
def get_mpt_balance(address, issuance_id):
    """Return the MPTAmount for the given MPT issuance held by an account.

    Queries the validated ledger for the account's MPToken entries and
    returns the MPTAmount of the entry matching issuance_id, or "0" if
    the account holds no entry for that issuance.
    """
    response = client.request(AccountObjects(
        account=address,
        ledger_index="validated",
        type="mptoken",
    ))
    for node in response.result["account_objects"]:
        if node["MPTokenIssuanceID"] == issuance_id:
            return node.get("MPTAmount", "0")
    return "0"

print(f"\n=== Checking initial MPT balances for issuance {mpt_issuance_id}... ===\n")
sender_balance_before = get_mpt_balance(sender.address, mpt_issuance_id)
receiver_balance_before = get_mpt_balance(receiver.address, mpt_issuance_id)
print(f"Sender balance:   {sender_balance_before}")
print(f"Receiver balance: {receiver_balance_before}")

# Send MPT from sender to receiver ----------------------
print("\n=== Sending MPT payment... ===\n")
payment_tx = Payment(
    account=sender.address,
    destination=receiver.address,
    amount=MPTAmount(
        mpt_issuance_id=mpt_issuance_id,
        value="100",
    ),
)
print(json.dumps(payment_tx.to_xrpl(), indent=2))

payment_response = submit_and_wait(payment_tx, client, sender)
if payment_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    code = payment_response.result["meta"]["TransactionResult"]
    print(f"Error: Payment failed: {code}")
    sys.exit(1)
print("Payment successful!")
print(f"Explorer link: https://testnet.xrpl.org/transactions/{payment_response.result['hash']}")

# Verify balances ----------------------
print(f"\n=== Checking final MPT balances for issuance {mpt_issuance_id}... ===\n")
sender_balance_after = get_mpt_balance(sender.address, mpt_issuance_id)
receiver_balance_after = get_mpt_balance(receiver.address, mpt_issuance_id)
print(f"Sender balance:   {sender_balance_after}")
print(f"Receiver balance: {receiver_balance_after}")
