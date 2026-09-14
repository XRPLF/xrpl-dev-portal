import json
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import (
    DepositPreauth,
    Payment,
    PaymentFlag,
    SponsorFlag,
    SponsorshipSet,
)
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet, generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create the sponsor and sponsee wallets ----------------------
print("\n=== Creating the sponsor and sponsee wallets... ===")
sponsor = generate_faucet_wallet(client)
sponsee = Wallet.create()

print(f"Sponsor address: {sponsor.address}")
print(f"Sponsee address: {sponsee.address}")

# Prepare Payment transaction to create the sponsee's account ----------------------
print("\n=== Preparing Payment transaction to create the sponsee's account... ===")
create_account_tx = Payment(
    account=sponsor.address,
    destination=sponsee.address,
    amount="1",
    flags=PaymentFlag.TF_SPONSOR_CREATED_ACCOUNT,
)

print(json.dumps(create_account_tx.to_xrpl(), indent=2))

# Submit the Payment transaction ----------------------
print("\n=== Submitting Payment transaction... ===")
create_account_response = submit_and_wait(create_account_tx, client, sponsor)

if create_account_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = create_account_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the sponsee's account: {result_code}")
    sys.exit(1)

print("Sponsee account created successfully!")
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{create_account_response.result['hash']}")

# Prepare SponsorshipSet transaction ----------------------
print("\n=== Preparing SponsorshipSet transaction... ===")
sponsorship_set_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount_delta="1000000",
    max_fee="1000",
    remaining_owner_count_delta=5,
)
print(json.dumps(sponsorship_set_tx.to_xrpl(), indent=2))

# Submit the SponsorshipSet transaction ----------------------
print("\n=== Submitting SponsorshipSet transaction... ===")
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
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{sponsorship_response.result['hash']}")

# Prepare the sponsored DepositPreauth transaction ----------------------
print("\n=== Preparing sponsored DepositPreauth transaction... ===")
deposit_preauth_tx = DepositPreauth(
    account=sponsee.address,
    authorize=sponsor.address,
    sponsor=sponsor.address,
    sponsor_flags=SponsorFlag.SPF_SPONSOR_FEE | SponsorFlag.SPF_SPONSOR_RESERVE,
)
print(json.dumps(deposit_preauth_tx.to_xrpl(), indent=2))

# Submit the sponsored DepositPreauth transaction ----------------------
print("\n=== Submitting sponsored DepositPreauth transaction... ===")
submit_response = submit_and_wait(deposit_preauth_tx, client, sponsee)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the preauthorization: {result_code}")
    sys.exit(1)

# The transaction carries no SponsorSignature, which is what distinguishes the
# pre-funded flow from the co-signed flow.
if "SponsorSignature" in submit_response.result["tx_json"]:
    print("Error: A pre-funded sponsorship should not need a SponsorSignature")
    sys.exit(1)

print("Transaction sponsored successfully!")
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{submit_response.result['hash']}")

# Extract sponsorship information from the transaction result ----------------------
print("\n=== Sponsorship Pool information ===")
preauth_node = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "DepositPreauth"
)
print(f"DepositPreauth ID: {preauth_node['CreatedNode']['LedgerIndex']}")
print(f"DepositPreauth reserve sponsored by: {preauth_node['CreatedNode']['NewFields']['Sponsor']}")

# The Sponsorship entry shows the fee drops and owner reserves the pool spent.
sponsorship_pool = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"
)
fields = sponsorship_pool["ModifiedNode"]["FinalFields"]
previous = sponsorship_pool["ModifiedNode"]["PreviousFields"]
fee_paid = int(previous["FeeAmount"]) - int(fields["FeeAmount"])
owner_reserves_spent = int(previous["RemainingOwnerCount"]) - int(fields["RemainingOwnerCount"])

print(f"\nFee spent from the pool: {fee_paid} drops")
print(f"Fee remaining in the pool: {fields['FeeAmount']} drops")
print(f"Owner reserves spent: {owner_reserves_spent}")
print(f"Owner reserves remaining: {fields['RemainingOwnerCount']}")
