# IMPORTANT: This example creates a loan using a preconfigured
# loan broker, borrower, and private vault.

import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import LoanSet
from xrpl.transaction import autofill, sign, sign_loan_set_by_counterparty, submit_and_wait
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
borrower = Wallet.from_seed(setup_data["borrower"]["seed"])
loan_broker_id = setup_data["loan_broker_id"]

print(f"\nLoan broker address: {loan_broker.address}")
print(f"Borrower address: {borrower.address}")
print(f"LoanBrokerID: {loan_broker_id}")

# Prepare LoanSet transaction ----------------------
# Account and Counterparty accounts can be swapped, but determines signing order.
# Account signs first, Counterparty signs second.
print("\n=== Preparing LoanSet transaction ===\n")

loan_set_tx = autofill(LoanSet(
    account=loan_broker.address,
    counterparty=borrower.address,
    loan_broker_id=loan_broker_id,
    principal_requested="1000",
    interest_rate=500,
    payment_total=12,
    payment_interval=2592000,
    grace_period=604800,
    loan_origination_fee="100",
    loan_service_fee="10",
), client)

print(json.dumps(loan_set_tx.to_xrpl(), indent=2))

# Loan broker signs first.
print("\n=== Adding loan broker signature ===\n")
loan_broker_signed = sign(loan_set_tx, loan_broker)

print(f"TxnSignature: {loan_broker_signed.txn_signature}")
print(f"SigningPubKey: {loan_broker_signed.signing_pub_key}\n")
print(f"Signed loan_set_tx for borrower to sign over:\n{json.dumps(loan_broker_signed.to_xrpl(), indent=2)}")

# Borrower signs second.
print("\n=== Adding borrower signature ===\n")
fully_signed = sign_loan_set_by_counterparty(borrower, loan_broker_signed)

print(f"Borrower TxnSignature: {fully_signed.tx.counterparty_signature.txn_signature}")
print(f"Borrower SigningPubKey: {fully_signed.tx.counterparty_signature.signing_pub_key}")
print(f"\nFully signed LoanSet transaction:\n{json.dumps(fully_signed.tx.to_xrpl(), indent=2)}")

# Submit and wait for validation ----------------------
print("\n=== Submitting signed LoanSet transaction ===\n")
submit_response = submit_and_wait(fully_signed.tx, client)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create loan: {result_code}")
    sys.exit(1)

print("Loan created successfully!")

# Extract loan information from the transaction result.
print("\n=== Loan Information ===\n")
loan_node = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "Loan"
)
print(json.dumps(loan_node["CreatedNode"]["NewFields"], indent=2))
