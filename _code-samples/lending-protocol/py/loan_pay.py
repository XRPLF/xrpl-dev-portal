# IMPORTANT: This example pays off an existing loan and then deletes it.

import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import LedgerEntry, LoanDelete, LoanPay, MPTAmount
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the lending protocol tutorials.
# If missing, lending_setup.py will generate the data.
if not os.path.exists("lending_setup.json"):
    print("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "lending_setup.py"], check=True)

# Load preconfigured accounts, loan_id, and mpt_id.
with open("lending_setup.json") as f:
    setup_data = json.load(f)

# You can replace these values with your own.
borrower = Wallet.from_seed(setup_data["borrower"]["seed"])
loan_id = setup_data["loan_id_2"]
mpt_id = setup_data["mpt_id"]

print(f"\nBorrower address: {borrower.address}")
print(f"LoanID: {loan_id}")
print(f"MPT ID: {mpt_id}")

# Check initial loan status ----------------------
print("\n=== Loan Status ===\n")
loan_status = client.request(LedgerEntry(
    index=loan_id,
    ledger_index="validated",
))

total_value_outstanding = loan_status.result["node"]["TotalValueOutstanding"]
loan_service_fee = loan_status.result["node"]["LoanServiceFee"]
total_payment = str(int(total_value_outstanding) + int(loan_service_fee))

print(f"Amount Owed: {total_value_outstanding} TSTUSD")
print(f"Loan Service Fee: {loan_service_fee} TSTUSD")
print(f"Total Payment Due (including fees): {total_payment} TSTUSD")

# Prepare LoanPay transaction ----------------------
print("\n=== Preparing LoanPay transaction ===\n")
loan_pay_tx = LoanPay(
    account=borrower.address,
    loan_id=loan_id,
    amount=MPTAmount(mpt_issuance_id=mpt_id, value=total_payment),
)

print(json.dumps(loan_pay_tx.to_xrpl(), indent=2))

# Sign, submit, and wait for payment validation ----------------------
print("\n=== Submitting LoanPay transaction ===\n")
pay_response = submit_and_wait(loan_pay_tx, client, borrower)

if pay_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = pay_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to pay loan: {result_code}")
    sys.exit(1)

print("Loan paid successfully!")

# Extract updated loan info from transaction results ----------------------
print("\n=== Loan Status After Payment ===\n")
loan_node = next(
    node for node in pay_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Loan"
)

final_balance = loan_node["ModifiedNode"]["FinalFields"].get("TotalValueOutstanding")
if final_balance:
    print(f"Outstanding Loan Balance: {final_balance} TSTUSD")
else:
    print("Outstanding Loan Balance: Loan fully paid off!")

# Prepare LoanDelete transaction ----------------------
# Either the loan broker or borrower can submit this transaction.
print("\n=== Preparing LoanDelete transaction ===\n")
loan_delete_tx = LoanDelete(
    account=borrower.address,
    loan_id=loan_id,
)

print(json.dumps(loan_delete_tx.to_xrpl(), indent=2))

# Sign, submit, and wait for deletion validation ----------------------
print("\n=== Submitting LoanDelete transaction ===\n")
delete_response = submit_and_wait(loan_delete_tx, client, borrower)

if delete_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = delete_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to delete loan: {result_code}")
    sys.exit(1)

print("Loan deleted successfully!")

# Verify loan deletion ----------------------
print("\n=== Verifying Loan Deletion ===\n")
verify_response = client.request(LedgerEntry(
    index=loan_id,
    ledger_index="validated",
))

if verify_response.is_successful():
    print("Warning: Loan still exists in the ledger.")
elif verify_response.result.get("error") == "entryNotFound":
    print("Loan has been successfully removed from the XRP Ledger!")
else:
    print(f"Error checking loan status: {verify_response.result.get('error')}")
