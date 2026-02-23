# IMPORTANT: This example impairs an existing loan, which has a 60 second grace period.
# After the 60 seconds pass, this example defaults the loan.

import json
import os
import subprocess
import sys
import time
from datetime import datetime

from xrpl.clients import JsonRpcClient
from xrpl.models import LedgerEntry, LoanManage
from xrpl.models.transactions.loan_manage import LoanManageFlag
from xrpl.transaction import submit_and_wait
from xrpl.utils import posix_to_ripple_time, ripple_time_to_posix
from xrpl.wallet import Wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the lending protocol tutorials.
# If missing, lending_setup.py will generate the data.
if not os.path.exists("lending_setup.json"):
    print("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "lending_setup.py"], check=True)

# Load preconfigured accounts and loan_id.
with open("lending_setup.json") as f:
    setup_data = json.load(f)

# You can replace these values with your own.
loan_broker = Wallet.from_seed(setup_data["loan_broker"]["seed"])
loan_id = setup_data["loan_id_1"]

print(f"\nLoan broker address: {loan_broker.address}")
print(f"LoanID: {loan_id}")

# Check loan status before impairment ----------------------
print("\n=== Loan Status ===\n")
loan_status = client.request(LedgerEntry(
    index=loan_id,
    ledger_index="validated",
))

print(f"Total Amount Owed: {loan_status.result['node']['TotalValueOutstanding']} TSTUSD.")
# Convert Ripple Epoch timestamp to local date and time
next_payment_due_date = loan_status.result["node"]["NextPaymentDueDate"]
payment_due = datetime.fromtimestamp(ripple_time_to_posix(next_payment_due_date))
print(f"Payment Due Date: {payment_due}")

# Prepare LoanManage transaction to impair the loan ----------------------
print("\n=== Preparing LoanManage transaction to impair loan ===\n")
loan_manage_impair = LoanManage(
    account=loan_broker.address,
    loan_id=loan_id,
    flags=LoanManageFlag.TF_LOAN_IMPAIR,
)

print(json.dumps(loan_manage_impair.to_xrpl(), indent=2))

# Sign, submit, and wait for impairment validation ----------------------
print("\n=== Submitting LoanManage impairment transaction ===\n")
impair_response = submit_and_wait(loan_manage_impair, client, loan_broker)

if impair_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = impair_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to impair loan: {result_code}")
    sys.exit(1)

print("Loan impaired successfully!")

# Extract loan impairment info from transaction results ----------------------
loan_node = next(
    node for node in impair_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Loan"
)

# Check grace period and next payment due date
grace_period = loan_node["ModifiedNode"]["FinalFields"]["GracePeriod"]
next_payment_due_date = loan_node["ModifiedNode"]["FinalFields"]["NextPaymentDueDate"]
default_time = next_payment_due_date + grace_period
payment_due = datetime.fromtimestamp(ripple_time_to_posix(next_payment_due_date))

print(f"New Payment Due Date: {payment_due}")
print(f"Grace Period: {grace_period} seconds")

# Convert current time to Ripple Epoch timestamp
current_time = posix_to_ripple_time(int(time.time()))
seconds_until_default = default_time - current_time

# Countdown until loan can be defaulted ----------------------
print("\n=== Countdown until loan can be defaulted ===\n")

while seconds_until_default >= 0:
    print(f"{seconds_until_default} seconds...", end="\r")
    time.sleep(1)
    seconds_until_default -= 1

print("\rGrace period expired. Loan can now be defaulted.")

# Prepare LoanManage transaction to default the loan ----------------------
print("\n=== Preparing LoanManage transaction to default loan ===\n")
loan_manage_default = LoanManage(
    account=loan_broker.address,
    loan_id=loan_id,
    flags=LoanManageFlag.TF_LOAN_DEFAULT,
)

print(json.dumps(loan_manage_default.to_xrpl(), indent=2))

# Sign, submit, and wait for default validation ----------------------
print("\n=== Submitting LoanManage default transaction ===\n")
default_response = submit_and_wait(loan_manage_default, client, loan_broker)

if default_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = default_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to default loan: {result_code}")
    sys.exit(1)

print("Loan defaulted successfully!")

# Verify loan default status from transaction results ----------------------
print("\n=== Checking final loan status ===\n")
loan_node = next(
    node for node in default_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Loan"
)
loan_flags = loan_node["ModifiedNode"]["FinalFields"]["Flags"]
active_flags = [f.name for f in LoanManageFlag if loan_flags & f.value]
print(f"Final loan flags: {active_flags}")
