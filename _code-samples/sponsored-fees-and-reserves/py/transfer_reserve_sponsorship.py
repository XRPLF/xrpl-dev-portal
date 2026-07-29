import asyncio
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import (
    MPTokenAuthorize,
    SponsorshipTransfer,
    SponsorshipTransferFlag,
)
from xrpl.transaction import autofill, sign, sign_as_sponsor, submit_and_wait
from xrpl.wallet import generate_faucet_wallet

from sponsored_fees_and_reserves_setup import main as run_setup

# Sponsorship flag for the transaction common fields. Only the reserve can be
# sponsored on an object, so tfSponsorFee is not used here.
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

# Create the wallets ----------------------
print("\n=== Creating the sponsor and sponsee wallets ===\n")
sponsor_a = generate_faucet_wallet(client)
sponsor_b = generate_faucet_wallet(client)
sponsee = generate_faucet_wallet(client)

print(f"Sponsor A address: {sponsor_a.address}")
print(f"Sponsor B address: {sponsor_b.address}")
print(f"Sponsee address:   {sponsee.address}")

# Create an unsponsored object ----------------------
# The sponsee authorizes the MPT with no sponsorship fields, so it pays the fee and
# the owner reserve for the resulting MPToken entry itself.
print("\n=== Submitting unsponsored MPTokenAuthorize transaction ===\n")
authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
)
authorize_response = submit_and_wait(authorize_tx, client, sponsee)

if authorize_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = authorize_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to authorize the MPT: {result_code}")
    sys.exit(1)

mptoken_node = next(
    node for node in authorize_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "MPToken"
)
mptoken_id = mptoken_node["CreatedNode"]["LedgerIndex"]

print("MPToken created successfully, with its reserve paid by the sponsee.")
print(f"MPToken ID: {mptoken_id}")

# Prepare SponsorshipTransfer transaction to start the sponsorship ----------------------
# The sponsee owns the object, so the sponsee sends the transaction and names
# Sponsor A in the Sponsor field. The sponsor's signature is optional for an object,
# but required when the target is an account.
print("\n=== Preparing SponsorshipTransfer transaction to start the sponsorship ===\n")
create_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=mptoken_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_CREATE,
    sponsor=sponsor_a.address,
    sponsor_flags=TF_SPONSOR_RESERVE,
)
create_tx = autofill(create_tx, client)

print(json.dumps(create_tx.to_xrpl(), indent=2))

# Sign as the sponsee, then co-sign as Sponsor A ----------------------
print("\n=== Submitting SponsorshipTransfer transaction ===\n")
create_signed_tx = sign_as_sponsor(sponsor_a, sign(create_tx, sponsee))
create_response = submit_and_wait(create_signed_tx.tx, client)

if create_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = create_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to start the sponsorship: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in create_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "MPToken"
)
print("Sponsorship started successfully!")
print(f"MPToken reserve now sponsored by: {fields['Sponsor']}")

# Prepare SponsorshipTransfer transaction to reassign the sponsorship ----------------
# tfSponsorshipReassign moves the reserve to Sponsor B in one transaction. Only the
# incoming sponsor has to consent; Sponsor A's obligation is released automatically.
print("\n=== Preparing SponsorshipTransfer transaction to reassign the sponsorship ===\n")
reassign_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=mptoken_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_REASSIGN,
    sponsor=sponsor_b.address,
    sponsor_flags=TF_SPONSOR_RESERVE,
)
reassign_tx = autofill(reassign_tx, client)

print(json.dumps(reassign_tx.to_xrpl(), indent=2))

# Sign as the sponsee, then co-sign as Sponsor B ----------------------
print("\n=== Submitting SponsorshipTransfer transaction ===\n")
reassign_signed_tx = sign_as_sponsor(sponsor_b, sign(reassign_tx, sponsee))
reassign_response = submit_and_wait(reassign_signed_tx.tx, client)

if reassign_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = reassign_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to reassign the sponsorship: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in reassign_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "MPToken"
)
print("Sponsorship reassigned successfully!")
print(f"MPToken reserve now sponsored by: {fields['Sponsor']}")

# Prepare SponsorshipTransfer transaction to end the sponsorship ----------------------
# tfSponsorshipEnd takes no Sponsor field and needs no co-signature. The sponsee must
# hold enough XRP to cover the owner reserve it's taking back.
print("\n=== Preparing SponsorshipTransfer transaction to end the sponsorship ===\n")
end_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=mptoken_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_END,
)

print(json.dumps(end_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting SponsorshipTransfer transaction ===\n")
end_response = submit_and_wait(end_tx, client, sponsee)

if end_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = end_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to end the sponsorship: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in end_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "MPToken"
)
if "Sponsor" in fields:
    print("Error: The MPToken still has a Sponsor field")
    sys.exit(1)

print("Sponsorship ended successfully!")
print("The sponsee now pays the MPToken's owner reserve again.")
