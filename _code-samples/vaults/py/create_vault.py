import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import VaultCreate
from xrpl.models.requests import VaultInfo
from xrpl.models.transactions.vault_create import VaultCreateFlag, WithdrawalPolicy
from xrpl.transaction import submit_and_wait
from xrpl.utils import str_to_hex, encode_mptoken_metadata
from xrpl.wallet import generate_faucet_wallet

# Auto-run setup if needed
if not os.path.exists("vault_setup.json"):
    print("\n=== Vault setup data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "vault_setup.py"], check=True)

# Load setup data
with open("vault_setup.json", "r") as f:
    setup_data = json.load(f)

# Connect to the network
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create and fund vault owner account
vault_owner = generate_faucet_wallet(client)

# You can replace these values with your own
mpt_issuance_id = setup_data["mpt_issuance_id"]
domain_id = setup_data["domain_id"]

print(f"Vault owner address: {vault_owner.address}")
print(f"MPT issuance ID: {mpt_issuance_id}")
print(f"Permissioned domain ID: {domain_id}\n")

# Prepare VaultCreate transaction ----------------------
print("\n=== VaultCreate transaction ===")
vault_create_tx = VaultCreate(
    account=vault_owner.address,
    asset={"mpt_issuance_id": mpt_issuance_id},
    flags=VaultCreateFlag.TF_VAULT_PRIVATE,  # Omit TF_VAULT_PRIVATE flag for public vaults
    # To make vault shares non-transferable add the TF_VAULT_SHARE_NON_TRANSFERABLE flag:
    # flags=VaultCreateFlag.TF_VAULT_PRIVATE | VaultCreateFlag.TF_VAULT_SHARE_NON_TRANSFERABLE,
    domain_id=domain_id,  # Omit for public vaults
    # Convert Vault data to a string (without excess whitespace), then string to hex.
    data=str_to_hex(json.dumps(
        {"n": "LATAM Fund II", "w": "examplefund.com"}
    )),
    # Encode JSON metadata as hex string per XLS-89 MPT Metadata Schema.
    # See: https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html
    mptoken_metadata=encode_mptoken_metadata({
        "ticker": "SHARE1",
        "name": "Vault shares",
        "desc": "Proportional ownership shares of the vault.",
        "icon": "example.com/asset-icon.png",
        "asset_class": "defi",
        "issuer_name": "Asset Issuer Name",
        "uris": [
            {
                "uri": "example.com/asset",
                "category": "website",
                "title": "Asset Website",
            },
            {
                "uri": "example.com/docs",
                "category": "docs",
                "title": "Docs",
            },
        ],
        "additional_info": {
            "example_info": "test",
        },
    }),
    assets_maximum="0",  # No cap
    withdrawal_policy=WithdrawalPolicy.VAULT_STRATEGY_FIRST_COME_FIRST_SERVE,
)

print(json.dumps(vault_create_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting VaultCreate transaction... ===")
submit_response = submit_and_wait(vault_create_tx, client, vault_owner, autofill=True)

if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create vault: {result_code}", file=sys.stderr)
    sys.exit(1)

print("Vault created successfully!")

# Extract vault information from the transaction result
affected_nodes = submit_response.result["meta"].get("AffectedNodes", [])
vault_node = next(
    (node for node in affected_nodes
     if "CreatedNode" in node and node["CreatedNode"].get("LedgerEntryType") == "Vault"),
    None
)

if vault_node:
    print(f"\nVault ID: {vault_node['CreatedNode']['LedgerIndex']}")
    print(f"Vault pseudo-account address: {vault_node['CreatedNode']['NewFields']['Account']}")
    print(f"Share MPT issuance ID: {vault_node['CreatedNode']['NewFields']['ShareMPTID']}")

# Call vault_info method to retrieve the vault's information
print("\n=== Getting vault_info... ===")
vault_id = vault_node["CreatedNode"]["LedgerIndex"]
vault_info_response = client.request(
    VaultInfo(
        vault_id=vault_id,
        ledger_index="validated"
    )
)
print(json.dumps(vault_info_response.result, indent=2))

