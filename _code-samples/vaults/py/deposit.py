# IMPORTANT: This example deposits into an existing PRIVATE vault.
# The depositor account used has valid credentials in the vault's Permissioned Domain.
# Without valid credentials, the VaultDeposit transaction will fail.
# If you want to deposit into a public vault, you can replace the vault_id and share_mpt_issuance_id
# values with your own.

import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import VaultDeposit
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

deposit_amount = 1

# Get initial vault state
print("\n=== Getting initial vault state... ===")
initial_vault_info = client.request(
    VaultInfo(
        vault_id=vault_id,
        ledger_index="validated"
    )
)

print(f" - Total vault value: {initial_vault_info.result['vault']['AssetsTotal']}")
print(f" - Available assets: {initial_vault_info.result['vault']['AssetsAvailable']}")

# Check depositor's asset balance
print("\n=== Checking depositor's balance... ===")
try:
    # Use ledger_entry to get specific MPT issuance balance
    ledger_entry_result = client.request(
        LedgerEntry(
            mptoken={
                "mpt_issuance_id": asset_mpt_issuance_id,
                "account": depositor.address
            },
            ledger_index="validated"
        )
    )

    balance = ledger_entry_result.result["node"]["MPTAmount"]
    print(f"Balance: {balance}")

    # Check if balance is sufficient
    if int(balance) < deposit_amount:
        print(f"Error: Insufficient balance! Have {balance}, need {deposit_amount}", file=sys.stderr)
        sys.exit(1)
except Exception as error:
    error_data = getattr(error, 'data', {})
    if 'error' in error_data and error_data['error'] == 'entryNotFound':
        print(f"Error: The depositor doesn't hold any assets with ID: {asset_mpt_issuance_id}", file=sys.stderr)
    else:
        print(f"Error checking MPT: {error}", file=sys.stderr)
    sys.exit(1)

# Prepare VaultDeposit transaction
print("\n=== VaultDeposit transaction ===")
vault_deposit_tx = VaultDeposit(
    account=depositor.address,
    vault_id=vault_id,
    amount={
        "mpt_issuance_id": asset_mpt_issuance_id,
        "value": str(deposit_amount)
    }
)

print(json.dumps(vault_deposit_tx.to_xrpl(), indent=2))

# Submit VaultDeposit transaction
print("\n=== Submitting VaultDeposit transaction... ===")
deposit_result = submit_and_wait(vault_deposit_tx, client, depositor, autofill=True)

if deposit_result.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = deposit_result.result["meta"]["TransactionResult"]
    print(f"Error: Unable to deposit: {result_code}", file=sys.stderr)
    sys.exit(1)

print("Deposit successful!")

# Extract vault state from transaction metadata
print("\n=== Vault state after deposit ===")
affected_nodes = deposit_result.result["meta"]["AffectedNodes"]
vault_node = None
for node in affected_nodes:
    if "ModifiedNode" in node:
        modified = node["ModifiedNode"]
        if modified["LedgerEntryType"] == "Vault" and modified["LedgerIndex"] == vault_id:
            vault_node = node
            break

if vault_node:
    vault_fields = vault_node["ModifiedNode"]["FinalFields"]
    print(f" - Total vault value: {vault_fields['AssetsTotal']}")
    print(f" - Available assets: {vault_fields['AssetsAvailable']}")

# Get the depositor's share balance
print("\n=== Depositor's share balance ===")
depositor_share_node = None
for node in affected_nodes:
    if "ModifiedNode" in node:
        share_node = node["ModifiedNode"]
        fields = share_node["FinalFields"]
    elif "CreatedNode" in node:
        share_node = node["CreatedNode"]
        fields = share_node["NewFields"]
    else:
        continue

    if (share_node["LedgerEntryType"] == "MPToken" and
        fields["Account"] == depositor.address and
        fields["MPTokenIssuanceID"] == share_mpt_issuance_id):
        depositor_share_node = node
        break

if depositor_share_node:
    if "ModifiedNode" in depositor_share_node:
        share_fields = depositor_share_node["ModifiedNode"]["FinalFields"]
    else:
        share_fields = depositor_share_node["CreatedNode"]["NewFields"]
    print(f"Shares held: {share_fields['MPTAmount']}")

