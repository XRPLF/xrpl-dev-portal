"""Inspect the on-chain properties of a Multi-Purpose Token (MPT).

Reads the MPTokenIssuance ledger entry, decodes flags, formats the transfer
fee, and decodes the XLS-89 metadata blob.

Usage: python inspect_mpt.py [mpt_issuance_id]
"""
import json
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerEntry
from xrpl.utils import decode_mptoken_metadata

# --- 1. Set up client and inputs ---
# Devnet example MPT from XRPLF/xrpl-dev-portal#3740.
DEFAULT_ISSUANCE_ID = "002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8"
NETWORK = "https://s.devnet.rippletest.net:51234"

# --- 2. Define shared helpers ---
# MPTokenIssuance flags.
# https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-flags
MPT_ISSUANCE_FLAGS = {
    "lsfMPTLocked": 0x00000001,
    "lsfMPTCanLock": 0x00000002,
    "lsfMPTRequireAuth": 0x00000004,
    "lsfMPTCanEscrow": 0x00000008,
    "lsfMPTCanTrade": 0x00000010,
    "lsfMPTCanTransfer": 0x00000020,
    "lsfMPTCanClawback": 0x00000040,
}


def percent_from_transfer_fee(fee):
    """Convert an MPT `TransferFee` from tenths of a basis point to a percent."""
    if not fee:
        return "0%"
    return f"{fee / 1000:.3f}%"


def decode_flags(value, table):
    """Decode a bitmask into the list of flag names it contains."""
    return [name for name, bit in table.items() if value & bit]


# --- 3. Look up the MPTokenIssuance entry ---
def print_issuance(node):
    """Print the MPTokenIssuance fields relevant to inspecting a token."""
    flags = decode_flags(node.get("Flags", 0), MPT_ISSUANCE_FLAGS)
    fee = node.get("TransferFee", 0)
    print("\n--- MPTokenIssuance ---")
    print(f"  Issuer            : {node.get('Issuer')}")
    print(f"  AssetScale        : {node.get('AssetScale', 0)}")
    print(f"  MaximumAmount     : {node.get('MaximumAmount', '(unlimited: 2^63 - 1)')}")
    print(f"  OutstandingAmount : {node.get('OutstandingAmount', '0')}")
    print(f"  LockedAmount      : {node.get('LockedAmount', '0')}")
    print(f"  TransferFee       : {fee} ({percent_from_transfer_fee(fee)})")
    print(f"  Flags value       : {node.get('Flags', 0)}")
    print(f"  Flags decoded     : {', '.join(flags) if flags else '(none set)'}")


# --- 4. Decode the XLS-89 metadata blob ---
def print_metadata(hex_blob):
    """Decode the XLS-89 metadata blob (hex-encoded JSON) if present."""
    print("\n--- MPTokenMetadata (XLS-89) ---")
    if not hex_blob:
        print("  (none)")
        return
    try:
        print(json.dumps(decode_mptoken_metadata(hex_blob), indent=2))
    except Exception as err:  # noqa: BLE001 - metadata may be non-XLS-89
        print(f"  Failed to decode as XLS-89 JSON: {err}")
        print(f"  Raw hex: {hex_blob}")


# --- 5. Main flow ---
def main():
    issuance_id = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ISSUANCE_ID
    client = JsonRpcClient(NETWORK)
    print(f"Inspecting MPT {issuance_id} on {NETWORK}")

    response = client.request(LedgerEntry(mpt_issuance=issuance_id, ledger_index="validated"))
    node = response.result["node"]
    print_issuance(node)
    print_metadata(node.get("MPTokenMetadata"))

    # MPT issuance fields (except lsfMPTLocked) are immutable in MPTokensV1.
    # XLS-94 (dynamic MPT) will add mutability — historical inspection will
    # become useful then.
    print("\nNote: MPT issuance fields are immutable in MPTokensV1;")
    print("      dynamic mutation is proposed in XLS-94.")


if __name__ == "__main__":
    main()
