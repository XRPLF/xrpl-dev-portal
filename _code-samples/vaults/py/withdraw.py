import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import VaultWithdraw
from xrpl.models.requests import VaultInfo, LedgerEntry
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# Auto-run setup if needed
if not os.path.exists("vault_setup.json"):
    print("\n=== Vault setup data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "vault_setup.py"], check=True)

# Load setup data
with open("vault_setup.json", "r") as f:
    setup_data = json.load(f)

# Connect to the network
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# You can replace these values with your own
depositor = Wallet.from_seed(setup_data["depositor"]["seed"])
vault_id = setup_data["vault_id"]
asset_mpt_issuance_id = setup_data["mpt_issuance_id"]
share_mpt_issuance_id = setup_data["vault_share_mpt_issuance_id"]

print(f"Depositor address: {depositor.address}")
print(f"Vault ID: {vault_id}")
print(f"Asset MPT issuance ID: {asset_mpt_issuance_id}")
print(f"Vault share MPT issuance ID: {share_mpt_issuance_id}")

withdraw_amount = 1

# Get initial vault state
print("\n=== Getting initial vault state... ===")
initial_vault_info = client.request(
    VaultInfo(
        vault_id=vault_id,
        ledger_index="validated"
    )
)

print("Initial vault state:")
print(f"  Assets Total: {initial_vault_info.result['vault']['AssetsTotal']}")
print(f"  Assets Available: {initial_vault_info.result['vault']['AssetsAvailable']}")

# Check depositor's share balance
print("\n=== Checking depositor's share balance... ===")
try:
    share_balance_result = client.request(
        LedgerEntry(
            mptoken={
                "mpt_issuance_id": share_mpt_issuance_id,
                "account": depositor.address
            },
            ledger_index="validated"
        )
    )

    share_balance = share_balance_result.result["node"]["MPTAmount"]
    print(f"Shares held: {share_balance}")
except Exception as error:
    error_data = getattr(error, 'data', {})
    if 'error' in error_data and error_data['error'] == 'entryNotFound':
        print(f"Error: The depositor doesn't hold any vault shares with ID: {share_mpt_issuance_id}.", file=sys.stderr)
    else:
        print(f"Error checking MPT: {error}", file=sys.stderr)
    sys.exit(1)

# Prepare VaultWithdraw transaction
print("\n=== Preparing VaultWithdraw transaction ===")
vault_withdraw_tx = VaultWithdraw(
    account=depositor.address,
    vault_id=vault_id,
    amount={
        "mpt_issuance_id": asset_mpt_issuance_id,
        "value": str(withdraw_amount)
    }
    # Optional: Add destination field to send assets to a different account
    # destination="rGg4tHPRGJfewwJkd8immCFx9uSo2GgcoY"
)

print(json.dumps(vault_withdraw_tx.to_xrpl(), indent=2))

# Submit VaultWithdraw transaction
print("\n=== Submitting VaultWithdraw transaction... ===")
withdraw_result = submit_and_wait(vault_withdraw_tx, client, depositor, autofill=True)

if withdraw_result.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = withdraw_result.result["meta"]["TransactionResult"]
    print(f"Error: Unable to withdraw from vault: {result_code}", file=sys.stderr)
    sys.exit(1)

print("Withdrawal successful!")

# Extract vault state from transaction metadata
print("\n=== Vault state after withdrawal ===")
affected_nodes = withdraw_result.result["meta"]["AffectedNodes"]
vault_node = None
for node in affected_nodes:
    if "ModifiedNode" in node or "DeletedNode" in node:
        modified_node = node["ModifiedNode"] if "ModifiedNode" in node else node["DeletedNode"]
        if modified_node["LedgerEntryType"] == "Vault" and modified_node["LedgerIndex"] == vault_id:
            vault_node = node
            break

if vault_node:
    if "DeletedNode" in vault_node:
        print("  Vault empty (all assets withdrawn)")
    else:
        vault_fields = vault_node["ModifiedNode"]["FinalFields"]
        print(f"  Assets Total: {vault_fields['AssetsTotal']}")
        print(f"  Assets Available: {vault_fields['AssetsAvailable']}")

# Get the depositor's share balance
print("\n=== Depositor's share balance ===")
depositor_share_node = None
for node in affected_nodes:
    if "ModifiedNode" in node or "DeletedNode" in node:
        modified_node = node["ModifiedNode"] if "ModifiedNode" in node else node["DeletedNode"]
        if "FinalFields" in modified_node:
            fields = modified_node["FinalFields"]
            if (modified_node["LedgerEntryType"] == "MPToken" and
                fields["Account"] == depositor.address and
                fields["MPTokenIssuanceID"] == share_mpt_issuance_id):
                depositor_share_node = node
                break

if depositor_share_node:
    if "DeletedNode" in depositor_share_node:
        print("No more shares held (redeemed all shares)")
    else:
        share_fields = depositor_share_node["ModifiedNode"]["FinalFields"]
        print(f"Shares held: {share_fields['MPTAmount']}")

# Get the depositor's asset balance
print("\n=== Depositor's asset balance ===")
depositor_asset_node = None
for node in affected_nodes:
    if "ModifiedNode" in node:
        asset_node = node["ModifiedNode"]
        fields = asset_node["FinalFields"]
    elif "CreatedNode" in node:
        asset_node = node["CreatedNode"]
        fields = asset_node["NewFields"]
    else:
        continue

    if (asset_node["LedgerEntryType"] == "MPToken" and
        fields["Account"] == depositor.address and
        fields["MPTokenIssuanceID"] == asset_mpt_issuance_id):
        depositor_asset_node = node
        break

if depositor_asset_node:
    if "ModifiedNode" in depositor_asset_node:
        asset_fields = depositor_asset_node["ModifiedNode"]["FinalFields"]
    else:
        asset_fields = depositor_asset_node["CreatedNode"]["NewFields"]
    print(f"Balance: {asset_fields['MPTAmount']}")

