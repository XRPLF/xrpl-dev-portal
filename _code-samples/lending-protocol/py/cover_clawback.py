# IMPORTANT: This example deposits and claws back first-loss capital from a
# preconfigured LoanBroker entry. The first-loss capital is an MPT
# with clawback enabled.

import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import LedgerEntry, LoanBrokerCoverClawback, LoanBrokerCoverDeposit, MPTAmount
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the lending protocol tutorials.
# If missing, lending_setup.py will generate the data.
if not os.path.exists("lending_setup.json"):
    print("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "lending_setup.py"], check=True)

# Load preconfigured accounts, loan_broker_id, and mpt_id.
with open("lending_setup.json") as f:
    setup_data = json.load(f)

# You can replace these values with your own.
loan_broker = Wallet.from_seed(setup_data["loan_broker"]["seed"])
mpt_issuer = Wallet.from_seed(setup_data["depositor"]["seed"])
loan_broker_id = setup_data["loan_broker_id"]
mpt_id = setup_data["mpt_id"]

print(f"\nLoan broker address: {loan_broker.address}")
print(f"MPT issuer address: {mpt_issuer.address}")
print(f"LoanBrokerID: {loan_broker_id}")
print(f"MPT ID: {mpt_id}")

# Check cover available ----------------------
print("\n=== Cover Available ===\n")
cover_info = client.request(LedgerEntry(
    index=loan_broker_id,
    ledger_index="validated",
))

current_cover_available = cover_info.result["node"].get("CoverAvailable", "0")
print(f"{current_cover_available} TSTUSD")

# Prepare LoanBrokerCoverDeposit transaction ----------------------
print("\n=== Preparing LoanBrokerCoverDeposit transaction ===\n")
cover_deposit_tx = LoanBrokerCoverDeposit(
    account=loan_broker.address,
    loan_broker_id=loan_broker_id,
    amount=MPTAmount(mpt_issuance_id=mpt_id, value="1000"),
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

# Extract updated cover available after deposit ----------------------
print("\n=== Cover Available After Deposit ===\n")
loan_broker_node = next(
    node for node in deposit_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "LoanBroker"
)

current_cover_available = loan_broker_node["ModifiedNode"]["FinalFields"]["CoverAvailable"]
print(f"{current_cover_available} TSTUSD")

# Verify issuer of cover asset matches ----------------------
# Only the issuer of the asset can submit clawback transactions.
# The asset must also have clawback enabled.
print("\n=== Verifying Asset Issuer ===\n")
asset_issuer_info = client.request(LedgerEntry(
    mpt_issuance=mpt_id,
    ledger_index="validated",
))

if asset_issuer_info.result["node"]["Issuer"] != mpt_issuer.address:
    issuer = asset_issuer_info.result["node"]["Issuer"]
    print(f"Error: {issuer} does not match account ({mpt_issuer.address}) attempting clawback!")
    sys.exit(1)

print(f"MPT issuer account verified: {mpt_issuer.address}. Proceeding to clawback.")

# Prepare LoanBrokerCoverClawback transaction ----------------------
print("\n=== Preparing LoanBrokerCoverClawback transaction ===\n")
cover_clawback_tx = LoanBrokerCoverClawback(
    account=mpt_issuer.address,
    loan_broker_id=loan_broker_id,
    amount=MPTAmount(mpt_issuance_id=mpt_id, value=current_cover_available),
)

print(json.dumps(cover_clawback_tx.to_xrpl(), indent=2))

# Sign, submit, and wait for clawback validation ----------------------
print("\n=== Submitting LoanBrokerCoverClawback transaction ===\n")
clawback_response = submit_and_wait(cover_clawback_tx, client, mpt_issuer)

if clawback_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = clawback_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to clawback cover: {result_code}")
    sys.exit(1)

print(f"Successfully clawed back {current_cover_available} TSTUSD!")

# Extract final cover available ----------------------
print("\n=== Final Cover Available After Clawback ===\n")
loan_broker_node = next(
    node for node in clawback_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "LoanBroker"
)

print(f"{loan_broker_node['ModifiedNode']['FinalFields'].get('CoverAvailable', '0')} TSTUSD")
