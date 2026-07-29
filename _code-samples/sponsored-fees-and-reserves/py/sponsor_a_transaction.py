import asyncio
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import MPTokenAuthorize, Payment, PaymentFlag
from xrpl.transaction import autofill, sign, sign_as_sponsor, submit_and_wait
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
# Only the sponsor is funded. The sponsee has no account on the ledger yet, and no
# XRP to pay for one.
print("\n=== Creating the sponsor and sponsee wallets ===\n")
sponsor = generate_faucet_wallet(client)
sponsee = Wallet.create()

print(f"Sponsor address: {sponsor.address}")
print(f"Sponsee address: {sponsee.address}")

# Prepare Payment transaction to create the sponsee's account ----------------------
# The tfSponsorCreatedAccount flag makes the sponsor pay the new account's reserve,
# so the payment itself only needs to deliver 1 drop.
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

# Confirm the new AccountRoot entry records the sponsor
account_node = next(
    node for node in create_account_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "AccountRoot"
)
print("Sponsee account created successfully!")
print(f"Account reserve sponsored by: {account_node['CreatedNode']['NewFields']['Sponsor']}")

# Prepare the sponsored MPTokenAuthorize transaction ----------------------
# The sponsee is the sending account. The Sponsor and SponsorFlags fields ask the
# sponsor to cover both the fee and the reserve for the new MPToken entry.
print("\n=== Preparing sponsored MPTokenAuthorize transaction ===\n")
mptoken_authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
    sponsor=sponsor.address,
    sponsor_flags=TF_SPONSOR_FEE | TF_SPONSOR_RESERVE,
)

# The fee must be autofilled before either party signs, because the sponsor's
# signature approves the exact fee amount.
mptoken_authorize_tx = autofill(mptoken_authorize_tx, client)
print(json.dumps(mptoken_authorize_tx.to_xrpl(), indent=2))

# Sign as the sponsee ----------------------
sponsee_signed_tx = sign(mptoken_authorize_tx, sponsee)

# Co-sign as the sponsor ----------------------
co_signed_tx = sign_as_sponsor(sponsor, sponsee_signed_tx)

# Submit the fully signed transaction and wait for validation ----------------------
print("\n=== Submitting sponsored MPTokenAuthorize transaction ===\n")
print(json.dumps(co_signed_tx.tx.to_xrpl(), indent=2))
submit_response = submit_and_wait(co_signed_tx.tx, client)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to authorize the MPT: {result_code}")
    sys.exit(1)

print("Transaction sponsored successfully!")

# Extract sponsorship information from the transaction result ----------------------
print("\n=== Sponsorship Information ===\n")
mptoken_node = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "MPToken"
)
print(f"MPToken ID: {mptoken_node['CreatedNode']['LedgerIndex']}")
print(f"MPToken reserve sponsored by: {mptoken_node['CreatedNode']['NewFields']['Sponsor']}")

# The sponsor's AccountRoot shows the fee it paid and the reserves it now covers.
# The sponsee's balance is untouched.
for node in submit_response.result["meta"]["AffectedNodes"]:
    modified = node.get("ModifiedNode", {})
    if modified.get("LedgerEntryType") != "AccountRoot":
        continue

    fields = modified["FinalFields"]
    previous = modified.get("PreviousFields", {})
    fee_paid = int(previous.get("Balance", fields["Balance"])) - int(fields["Balance"])

    if fields["Account"] == sponsor.address:
        print(f"\nSponsor fee paid: {fee_paid} drops")
        print(f"Sponsor balance:  {fields['Balance']} drops")
        print(f"Reserves sponsored (SponsoringOwnerCount): {fields.get('SponsoringOwnerCount', 0)}")
    elif fields["Account"] == sponsee.address:
        print(f"\nSponsee fee paid: {fee_paid} drops")
        print(f"Sponsee balance:  {fields['Balance']} drops")
        print(f"Sponsee owner count: {fields.get('OwnerCount', 0)}")
