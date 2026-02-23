# IMPORTANT: This example deposits and withdraws first-loss capital from a
# preconfigured LoanBroker entry.

import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import LoanBrokerCoverDeposit, LoanBrokerCoverWithdraw, MPTAmount
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the lending protocol tutorials.
# If missing, lending_setup.py will generate the data.
if not os.path.exists("lending_setup.json"):
    print("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "lending_setup.py"], check=True)

# Load preconfigured accounts and loan_broker_id.
with open("lending_setup.json") as f:
    setup_data = json.load(f)

# You can replace these values with your own.
loan_broker = Wallet.from_seed(setup_data["loan_broker"]["seed"])
loan_broker_id = setup_data["loan_broker_id"]
mpt_id = setup_data["mpt_id"]

print(f"\nLoan broker address: {loan_broker.address}")
print(f"LoanBrokerID: {loan_broker_id}")
print(f"MPT ID: {mpt_id}")

# Prepare LoanBrokerCoverDeposit transaction ----------------------
print("\n=== Preparing LoanBrokerCoverDeposit transaction ===\n")
cover_deposit_tx = LoanBrokerCoverDeposit(
    account=loan_broker.address,
    loan_broker_id=loan_broker_id,
    amount=MPTAmount(mpt_issuance_id=mpt_id, value="2000"),
)

print(json.dumps(cover_deposit_tx.to_xrpl(), indent=2))

# Sign, submit, and wait for deposit validation ----------------------
print("\n=== Submitting LoanBrokerCoverDeposit transaction ===\n")
deposit_response = submit_and_wait(cover_deposit_tx, client, loan_broker)

if deposit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = deposit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to deposit cover: {result_code}")
    sys.exit(1)

print("Cover deposit successful!")

# Extract cover balance from the transaction result
print("\n=== Cover Balance ===\n")
loan_broker_node = next(
    node for node in deposit_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "LoanBroker"
)
# First-loss capital is stored in the LoanBroker's pseudo-account.
print(f"LoanBroker Pseudo-Account: {loan_broker_node['ModifiedNode']['FinalFields']['Account']}")
print(f"Cover balance after deposit: {loan_broker_node['ModifiedNode']['FinalFields']['CoverAvailable']} TSTUSD")

# Prepare LoanBrokerCoverWithdraw transaction ----------------------
print("\n=== Preparing LoanBrokerCoverWithdraw transaction ===\n")
cover_withdraw_tx = LoanBrokerCoverWithdraw(
    account=loan_broker.address,
    loan_broker_id=loan_broker_id,
    amount=MPTAmount(mpt_issuance_id=mpt_id, value="1000"),
)

print(json.dumps(cover_withdraw_tx.to_xrpl(), indent=2))

# Sign, submit, and wait for withdraw validation ----------------------
print("\n=== Submitting LoanBrokerCoverWithdraw transaction ===\n")
withdraw_response = submit_and_wait(cover_withdraw_tx, client, loan_broker)

if withdraw_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = withdraw_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to withdraw cover: {result_code}")
    sys.exit(1)

print("Cover withdraw successful!")

# Extract updated cover balance from the transaction result
print("\n=== Updated Cover Balance ===\n")
loan_broker_node = next(
    node for node in withdraw_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "LoanBroker"
)
print(f"LoanBroker Pseudo-Account: {loan_broker_node['ModifiedNode']['FinalFields']['Account']}")
print(f"Cover balance after withdraw: {loan_broker_node['ModifiedNode']['FinalFields']['CoverAvailable']} TSTUSD")
