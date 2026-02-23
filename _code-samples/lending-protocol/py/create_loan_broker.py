# IMPORTANT: This example creates a loan broker using an existing account
# that has already created a PRIVATE vault.
# If you want to create a loan broker for a PUBLIC vault, you can replace the vault_id
# and loan_broker values with your own.

import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import LoanBrokerSet
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the lending protocol tutorials.
# If missing, lending_setup.py will generate the data.
if not os.path.exists("lending_setup.json"):
    print("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "lending_setup.py"], check=True)

# Load preconfigured accounts and vault_id.
with open("lending_setup.json") as f:
    setup_data = json.load(f)

# You can replace these values with your own.
loan_broker = Wallet.from_seed(setup_data["loan_broker"]["seed"])
vault_id = setup_data["vault_id"]

print(f"\nLoan broker/vault owner address: {loan_broker.address}")
print(f"Vault ID: {vault_id}")

# Prepare LoanBrokerSet transaction ----------------------
print("\n=== Preparing LoanBrokerSet transaction ===\n")
loan_broker_set_tx = LoanBrokerSet(
    account=loan_broker.address,
    vault_id=vault_id,
    management_fee_rate=1000,
)

print(json.dumps(loan_broker_set_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting LoanBrokerSet transaction ===\n")
submit_response = submit_and_wait(loan_broker_set_tx, client, loan_broker)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create loan broker: {result_code}")
    sys.exit(1)

print("Loan broker created successfully!")

# Extract loan broker information from the transaction result
print("\n=== Loan Broker Information ===\n")
loan_broker_node = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "LoanBroker"
)
print(f"LoanBroker ID: {loan_broker_node['CreatedNode']['LedgerIndex']}")
print(f"LoanBroker Psuedo-Account Address: {loan_broker_node['CreatedNode']['NewFields']['Account']}")
