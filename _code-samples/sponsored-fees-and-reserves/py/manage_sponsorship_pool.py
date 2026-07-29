import asyncio
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import AccountInfo, MPTokenAuthorize, SponsorshipSet, SponsorshipSetFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

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
sponsee = generate_faucet_wallet(client)

print(f"Sponsor address: {sponsor.address}")
print(f"Sponsee address: {sponsee.address}")

# Prepare SponsorshipSet transaction ----------------------
# FeeAmount funds the pool with 1 XRP for fees, MaxFee caps the pool's contribution to
# any single transaction, and RemainingOwnerCount allows five sponsored objects.
print("\n=== Preparing SponsorshipSet transaction ===\n")
create_pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount="1000000",
    max_fee="1000",
    remaining_owner_count=5,
)

print(json.dumps(create_pool_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting SponsorshipSet transaction ===\n")
create_response = submit_and_wait(create_pool_tx, client, sponsor)

if create_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = create_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the sponsorship: {result_code}")
    sys.exit(1)

sponsorship_node = next(
    node for node in create_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
print("Sponsorship created successfully!")
print(f"Sponsorship ID: {sponsorship_node['CreatedNode']['LedgerIndex']}")

# Spend part of the pool ----------------------
# The sponsee authorizes the MPT, drawing the fee and one owner reserve from the pool.
print("\n=== Submitting sponsored MPTokenAuthorize transaction ===\n")
authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
    sponsor=sponsor.address,
    sponsor_flags=TF_SPONSOR_FEE | TF_SPONSOR_RESERVE,
)
authorize_response = submit_and_wait(authorize_tx, client, sponsee)

if authorize_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = authorize_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to authorize the MPT: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in authorize_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
print("Sponsorship partially spent:")
print(f"  Fee remaining:            {fields['FeeAmount']} drops")
print(f"  Owner reserves remaining: {fields['RemainingOwnerCount']}")

# Prepare SponsorshipSet transaction to top up the pool ----------------------
# A second SponsorshipSet on the same sponsee replaces the current allowances rather
# than adding to them, so these values are the pool's new totals.
print("\n=== Preparing SponsorshipSet transaction to update the sponsorship ===\n")
update_pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount="2000000",
    max_fee="1000",
    remaining_owner_count=10,
)

print(json.dumps(update_pool_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting SponsorshipSet transaction ===\n")
update_response = submit_and_wait(update_pool_tx, client, sponsor)

if update_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = update_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to update the sponsorship: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in update_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
print("Sponsorship updated successfully:")
print(f"  Fee allocated:            {fields['FeeAmount']} drops")
print(f"  Owner reserves allocated: {fields['RemainingOwnerCount']}")

# Prepare SponsorshipSet transaction to delete the sponsorship ----------------------
# tfDeleteObject returns the unspent FeeAmount to the sponsor. Objects the pool
# already paid reserves for stay sponsored until they're transferred or deleted.
print("\n=== Preparing SponsorshipSet transaction to delete the sponsorship ===\n")
sponsor_balance_before = int(
    client.request(AccountInfo(account=sponsor.address)).result["account_data"]["Balance"]
)

delete_pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    flags=SponsorshipSetFlag.TF_DELETE_OBJECT,
)

print(json.dumps(delete_pool_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting SponsorshipSet transaction ===\n")
delete_response = submit_and_wait(delete_pool_tx, client, sponsor)

if delete_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = delete_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to delete the sponsorship: {result_code}")
    sys.exit(1)

deleted_node = next(
    node for node in delete_response.result["meta"]["AffectedNodes"]
    if node.get("DeletedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
print("Sponsorship deleted successfully!")

# Show the reclaimed XRP ----------------------
print("\n=== Reclaimed Funds ===\n")
sponsor_balance_after = int(
    client.request(AccountInfo(account=sponsor.address)).result["account_data"]["Balance"]
)
delete_fee = int(delete_response.result["tx_json"]["Fee"])

print(f"Unspent fee returned from the pool: {deleted_node['DeletedNode']['FinalFields']['FeeAmount']} drops")
print(f"Sponsor balance before deletion:    {sponsor_balance_before} drops")
print(f"Sponsor balance after deletion:     {sponsor_balance_after} drops")
print(f"Fee paid for the deletion:          {delete_fee} drops")
