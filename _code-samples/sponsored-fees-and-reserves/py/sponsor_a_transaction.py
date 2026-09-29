import json
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import DepositPreauth, Payment, PaymentFlag, SponsorFlag
from xrpl.transaction import autofill, sign, sign_as_sponsor, submit_and_wait
from xrpl.wallet import Wallet, generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create the sponsor and sponsee wallets ----------------------
# Only the sponsor is funded. The sponsee has no account on the ledger yet, and no
# XRP to pay for one.
print("\n=== Creating the sponsor and sponsee wallets... ===")
sponsor = generate_faucet_wallet(client)
sponsee = Wallet.create()

print(f"Sponsor address: {sponsor.address}")
print(f"Sponsee address: {sponsee.address}")

# Prepare Payment transaction to create the sponsee's account ----------------------
# The tfSponsorCreatedAccount flag makes the sponsor pay the new account's reserve,
# so the payment itself only needs to deliver 1 drop.
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

# Confirm the new AccountRoot entry records the sponsor
account_node = next(
    node for node in create_account_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "AccountRoot"
)
print("Sponsee account created successfully!")
print(f"Account reserve sponsored by: {account_node['CreatedNode']['NewFields']['Sponsor']}")
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{create_account_response.result['hash']}")

# Prepare the sponsored DepositPreauth transaction ----------------------
# The sponsee is the sending account. The Sponsor and SponsorFlags fields ask the
# sponsor to cover both the fee and the reserve for the new DepositPreauth entry.
print("\n=== Preparing sponsored DepositPreauth transaction... ===")
deposit_preauth_tx = DepositPreauth(
    account=sponsee.address,
    authorize=sponsor.address,
    sponsor=sponsor.address,
    sponsor_flags=SponsorFlag.SPF_SPONSOR_FEE | SponsorFlag.SPF_SPONSOR_RESERVE,
)

deposit_preauth_tx = autofill(deposit_preauth_tx, client)
print(json.dumps(deposit_preauth_tx.to_xrpl(), indent=2))

# Sign as the sponsee ----------------------
sponsee_signed_tx = sign(deposit_preauth_tx, sponsee)

# Co-sign as the sponsor ----------------------
co_signed_tx = sign_as_sponsor(sponsor, sponsee_signed_tx)

# Submit the fully signed transaction and wait for validation ----------------------
print("\n=== Submitting sponsored DepositPreauth transaction... ===")
print(json.dumps(co_signed_tx.tx.to_xrpl(), indent=2))
submit_response = submit_and_wait(co_signed_tx.tx, client)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the preauthorization: {result_code}")
    sys.exit(1)

print("Transaction sponsored successfully!")
print(f"Transaction URL: https://devnet.xrpl.org/transactions/{submit_response.result['hash']}")

# Extract sponsorship information from the transaction result ----------------------
print("\n=== Sponsorship Information ===")
preauth_node = next(
    node for node in submit_response.result["meta"]["AffectedNodes"]
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "DepositPreauth"
)
print(f"DepositPreauth ID: {preauth_node['CreatedNode']['LedgerIndex']}")
print(f"DepositPreauth reserve sponsored by: {preauth_node['CreatedNode']['NewFields']['Sponsor']}")

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
