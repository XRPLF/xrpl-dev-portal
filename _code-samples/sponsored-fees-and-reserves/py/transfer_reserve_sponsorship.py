import json
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import (
    DepositPreauth,
    SponsorFlag,
    SponsorshipTransfer,
    SponsorshipTransferFlag,
)
from xrpl.transaction import autofill, sign, sign_as_sponsor, submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create the wallets ----------------------
print("\n=== Creating the sponsor and sponsee wallets... ===")
sponsor_a = generate_faucet_wallet(client)
sponsor_b = generate_faucet_wallet(client)
sponsee = generate_faucet_wallet(client)

print(f"Sponsor A address: {sponsor_a.address}")
print(f"Sponsor B address: {sponsor_b.address}")
print(f"Sponsee address:   {sponsee.address}")

# Create an unsponsored ledger entry ----------------------
# The sponsee creates a DepositPreauth entry with no sponsorship fields, so it pays
# the fee and the owner reserve for the resulting entry itself.
print("\n=== Submitting unsponsored DepositPreauth transaction... ===")
deposit_preauth_tx = DepositPreauth(
    account=sponsee.address,
    authorize=sponsor_a.address,
)
deposit_preauth_response = submit_and_wait(deposit_preauth_tx, client, sponsee)

if deposit_preauth_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = deposit_preauth_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the preauthorization: {result_code}")
    sys.exit(1)

preauth_node = next(
    node for node in deposit_preauth_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "DepositPreauth"
)
preauth_id = preauth_node["CreatedNode"]["LedgerIndex"]

print("DepositPreauth created successfully, with its reserve paid by the sponsee.")
print(f"DepositPreauth ID: {preauth_id}")

# Prepare SponsorshipTransfer transaction to start the sponsorship ----------------------
print("\n=== Preparing SponsorshipTransfer transaction to start the sponsorship... ===")
create_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=preauth_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_CREATE,
    sponsor=sponsor_a.address,
    sponsor_flags=SponsorFlag.SPF_SPONSOR_RESERVE,
)
create_tx = autofill(create_tx, client)

print(json.dumps(create_tx.to_xrpl(), indent=2))

# Sign as the sponsee, then co-sign as Sponsor A ----------------------
print("\n=== Submitting SponsorshipTransfer transaction... ===")
create_signed_tx = sign_as_sponsor(sponsor_a, sign(create_tx, sponsee))
create_response = submit_and_wait(create_signed_tx.tx, client)

if create_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = create_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to start the sponsorship: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in create_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "DepositPreauth"
)
print("Sponsorship started successfully!")
print(f"DepositPreauth reserve now sponsored by: {fields['Sponsor']}")

# Prepare SponsorshipTransfer transaction to reassign the sponsorship ----------------
# tfSponsorshipReassign moves the reserve to Sponsor B in one transaction. Only the
# incoming sponsor has to consent; Sponsor A's obligation is released automatically.
print("\n=== Preparing SponsorshipTransfer transaction to reassign the sponsorship... ===")
reassign_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=preauth_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_REASSIGN,
    sponsor=sponsor_b.address,
    sponsor_flags=SponsorFlag.SPF_SPONSOR_RESERVE,
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
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "DepositPreauth"
)
print("Sponsorship reassigned successfully!")
print(f"DepositPreauth reserve now sponsored by: {fields['Sponsor']}")

# Prepare SponsorshipTransfer transaction to end the sponsorship ----------------------
# tfSponsorshipEnd takes no Sponsor field and needs no co-signature. If it
# succeeds, the Sponsor field is removed and the sponsee becomes responsible for
# the entry's reserve again.
print("\n=== Preparing SponsorshipTransfer transaction to end the sponsorship... ===")
end_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=preauth_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_END,
)

print(json.dumps(end_tx.to_xrpl(), indent=2))

# Submit the SponsorshipTransfer transaction to end the sponsorship ----------------------
print("\n=== Submitting SponsorshipTransfer transaction... ===")
end_response = submit_and_wait(end_tx, client, sponsee)

if end_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = end_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to end the sponsorship: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in end_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "DepositPreauth"
)
if "Sponsor" in fields:
    print("Error: The DepositPreauth entry still has a Sponsor field")
    sys.exit(1)

print("Sponsorship ended successfully!")
print("The sponsee now pays the DepositPreauth entry's owner reserve again.")
