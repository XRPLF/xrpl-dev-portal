import json
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import (
    AccountInfo,
    DepositPreauth,
    SponsorFlag,
    SponsorshipSet,
    SponsorshipSetFlag,
)
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create the sponsor and sponsee wallets ----------------------
print("\n=== Creating the sponsor and sponsee wallets... ===")
sponsor = generate_faucet_wallet(client)
sponsee = generate_faucet_wallet(client)

print(f"Sponsor address: {sponsor.address}")
print(f"Sponsee address: {sponsee.address}")

# Prepare SponsorshipSet transaction ----------------------
# FeeAmountDelta adds 1 XRP to the fee pool, MaxFee caps the pool's contribution
# to any single transaction, and RemainingOwnerCountDelta allows five sponsored ledger entries.
print("\n=== Preparing SponsorshipSet transaction... ===")
create_pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount_delta="1000000",
    max_fee="1000",
    remaining_owner_count_delta=5,
)

print(json.dumps(create_pool_tx.to_xrpl(), indent=2))

# Submit the SponsorshipSet transaction ----------------------
print("\n=== Submitting SponsorshipSet transaction... ===")
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
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{create_response.result['hash']}")

# Spend part of the pool ----------------------
# The sponsee creates a DepositPreauth entry, drawing the fee and one owner reserve
# from the pool.
print("\n=== Submitting sponsored DepositPreauth transaction... ===")
deposit_preauth_tx = DepositPreauth(
    account=sponsee.address,
    authorize=sponsor.address,
    sponsor=sponsor.address,
    sponsor_flags=SponsorFlag.SPF_SPONSOR_FEE | SponsorFlag.SPF_SPONSOR_RESERVE,
)
deposit_preauth_response = submit_and_wait(deposit_preauth_tx, client, sponsee)

if deposit_preauth_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = deposit_preauth_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the preauthorization: {result_code}")
    sys.exit(1)

fields = next(
    node["ModifiedNode"]["FinalFields"]
    for node in deposit_preauth_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
print("Sponsorship pool:")
print(f"  Fee amount:            {fields['FeeAmount']} drops")
print(f"  Owner reserves count:  {fields['RemainingOwnerCount']}")
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{deposit_preauth_response.result['hash']}")

# Prepare SponsorshipSet transaction to top up the pool ----------------------
# A second SponsorshipSet on the same sponsee applies deltas to the current allowances.
# Here the sponsor adds another 1 XRP of fee budget and five more reserve units.
print("\n=== Preparing SponsorshipSet transaction to top up sponsorship pool... ===")
update_pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount_delta="1000000",
    max_fee="1000",
    remaining_owner_count_delta=5,
)

print(json.dumps(update_pool_tx.to_xrpl(), indent=2))

# Submit the SponsorshipSet transaction to top up the pool ----------------------
print("\n=== Submitting SponsorshipSet transaction... ===")
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
print("Sponsorship pool topped up successfully:")
print(f"  Fee amount:            {fields['FeeAmount']} drops")
print(f"  Owner reserves count:  {fields['RemainingOwnerCount']}")
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{update_response.result['hash']}")

# Prepare SponsorshipSet transaction to delete the sponsorship ----------------------
# tfDeleteObject returns the unspent FeeAmount to the sponsor. Ledger entries the
# pool already paid reserves for stay sponsored until they're transferred or deleted.
print("\n=== Preparing SponsorshipSet transaction to delete the sponsorship... ===")
sponsor_balance_before = int(
    client.request(AccountInfo(account=sponsor.address)).result["account_data"]["Balance"]
)

delete_pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    flags=SponsorshipSetFlag.TF_DELETE_OBJECT,
)

print(json.dumps(delete_pool_tx.to_xrpl(), indent=2))

# Submit the SponsorshipSet transaction to delete the sponsorship ----------------------
print("\n=== Submitting SponsorshipSet transaction... ===")
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
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{delete_response.result['hash']}")

# Show the reclaimed XRP ----------------------
print("\n=== Reclaimed Funds ===")
sponsor_balance_after = int(
    client.request(AccountInfo(account=sponsor.address)).result["account_data"]["Balance"]
)
delete_fee = int(delete_response.result["tx_json"]["Fee"])

print(f"Unspent fee amount returned from pool: {deleted_node['DeletedNode']['FinalFields']['FeeAmount']} drops")
print(f"Sponsor balance \"before\" deletion:     {sponsor_balance_before} drops")
print(f"Sponsor balance \"after\" deletion:      {sponsor_balance_after} drops")
print(f"Delete transaction (fee paid):         {delete_fee} drops")
