import asyncio
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import MPTokenAuthorize, Payment, PaymentFlag, SponsorshipSet
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet, generate_faucet_wallet

from sponsored_fees_and_reserves_setup import main as run_setup

# Sponsorship flags for the transaction common fields
TF_SPONSOR_FEE = 0x00000001
TF_SPONSOR_RESERVE = 0x00000002

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the sponsorship tutorials.
# If missing, sponsored_fees_and_reserves_setup.py will generate the data.
if not os.path.exists("sponsored_fees_and_reserves_setup.json"):
    print("\n=== Sponsorship tutorial data doesn't exist. Running setup script... ===\n")
    asyncio.run(run_setup())

# Load the preconfigured issuer and MPT issuance ID.
with open("sponsored_fees_and_reserves_setup.json") as f:
    setup_data = json.load(f)

# You can replace these values with your own.
issuer_address = setup_data["issuer"]["address"]
mpt_issuance_id = setup_data["mpt_issuance_id"]

print(f"\nIssuer address:  {issuer_address}")
print(f"MPT Issuance ID: {mpt_issuance_id}")

# Create the sponsor and sponsee wallets ----------------------
print("\n=== Creating the sponsor and sponsee wallets ===\n")
sponsor = generate_faucet_wallet(client)
sponsee = Wallet.create()

print(f"Sponsor address: {sponsor.address}")
print(f"Sponsee address: {sponsee.address}")

# Prepare Payment transaction to create the sponsee's account ----------------------
print("\n=== Preparing Payment transaction to create the sponsee's account ===\n")
create_account_tx = Payment(
    account=sponsor.address,
    destination=sponsee.address,
    amount="1",
    flags=PaymentFlag.TF_SPONSOR_CREATED_ACCOUNT,
)

print(json.dumps(create_account_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting Payment transaction ===\n")
create_account_response = submit_and_wait(create_account_tx, client, sponsor)

if create_account_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = create_account_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the sponsee's account: {result_code}")
    sys.exit(1)

print("Sponsee account created successfully!")

# Prepare SponsorshipSet transaction ----------------------
# FeeAmount is a pool of drops the sponsee can spend on fees. MaxFee caps what the
# pool pays for any single transaction. RemainingOwnerCount is how many object
# reserves the sponsor will cover.
print("\n=== Preparing SponsorshipSet transaction ===\n")
sponsorship_set_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount="1000000",
    max_fee="1000",
    remaining_owner_count=5,
)

print(json.dumps(sponsorship_set_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting SponsorshipSet transaction ===\n")
sponsorship_response = submit_and_wait(sponsorship_set_tx, client, sponsor)

if sponsorship_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = sponsorship_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the sponsorship: {result_code}")
    sys.exit(1)

# Extract the Sponsorship entry from the transaction result ----------------------
sponsorship_node = next(
    node for node in sponsorship_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
print("Sponsorship created successfully!")
print(f"Sponsorship ID: {sponsorship_node['CreatedNode']['LedgerIndex']}")

# Prepare the sponsored MPTokenAuthorize transaction ----------------------
# The sponsee names the sponsor and the costs to draw from the pool. Because the
# Sponsorship entry already exists, the sponsee signs and submits alone.
print("\n=== Preparing sponsored MPTokenAuthorize transaction ===\n")
mptoken_authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
    sponsor=sponsor.address,
    sponsor_flags=TF_SPONSOR_FEE | TF_SPONSOR_RESERVE,
)

print(json.dumps(mptoken_authorize_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting sponsored MPTokenAuthorize transaction ===\n")
submit_response = submit_and_wait(mptoken_authorize_tx, client, sponsee)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to authorize the MPT: {result_code}")
    sys.exit(1)

# The transaction carries no SponsorSignature, which is what distinguishes the
# pre-funded flow from the co-signed flow.
if "SponsorSignature" in submit_response.result["tx_json"]:
    print("Error: A pre-funded sponsorship should not need a SponsorSignature")
    sys.exit(1)

print("Transaction sponsored successfully, with no sponsor signature!")

# Extract sponsorship information from the transaction result ----------------------
print("\n=== Sponsorship Information ===\n")
mptoken_node = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "MPToken"
)
print(f"MPToken ID: {mptoken_node['CreatedNode']['LedgerIndex']}")
print(f"MPToken reserve sponsored by: {mptoken_node['CreatedNode']['NewFields']['Sponsor']}")

# The Sponsorship entry shows the fee drops and owner reserves the pool spent.
sponsorship_used = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
fields = sponsorship_used["ModifiedNode"]["FinalFields"]
previous = sponsorship_used["ModifiedNode"]["PreviousFields"]

print(f"\nFee paid from the pool: {int(previous['FeeAmount']) - int(fields['FeeAmount'])} drops")
print(f"Fee remaining in the pool: {fields['FeeAmount']} drops")
print(f"Owner reserves remaining: {fields['RemainingOwnerCount']}")
