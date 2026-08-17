"""Inspect the on-chain properties of a Trust Line token.

Reads the issuer's AccountRoot (transfer rate, flags, domain, tick size),
walks its trust lines for the given currency, and reconstructs the history
of TransferRate changes from AccountSet transactions.

Usage: python inspect_trust_line_token.py [issuer] [currency]
"""
import sys
from binascii import unhexlify

from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo, AccountLines, AccountTx

# --- 1. Set up client and inputs ---
# Devnet example token from XRPLF/xrpl-dev-portal#3740.
DEFAULT_ISSUER = "ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf"
DEFAULT_CURRENCY = "USD"
NETWORK = "https://s.devnet.rippletest.net:51234"

# --- 2. Define shared helpers ---
# AccountRoot flags that affect trust line token behavior.
# https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot#accountroot-flags
ACCOUNT_ROOT_FLAGS = {
    "lsfDefaultRipple": 0x00800000,
    "lsfDepositAuth": 0x01000000,
    "lsfDisallowIncomingTrustline": 0x20000000,
    "lsfGlobalFreeze": 0x00400000,
    "lsfNoFreeze": 0x00200000,
    "lsfRequireAuth": 0x00040000,
    "lsfRequireDestTag": 0x00020000,
    "lsfAllowTrustLineClawback": 0x80000000,
}


def percent_from_transfer_rate(rate):
    """Convert a `TransferRate` from billionths to a percentage string."""
    if not rate or rate == 1_000_000_000:
        return "0%"
    return f"{(rate - 1_000_000_000) / 10_000_000:.4f}%"


def decode_flags(value, table):
    """Decode a bitmask into the list of flag names it contains."""
    return [name for name, bit in table.items() if value & bit]


# --- 3. Look up the issuer's AccountRoot ---
def print_issuer_settings(account_root):
    """Print AccountRoot-level properties that apply to every trust line token."""
    flags = decode_flags(account_root.get("Flags", 0), ACCOUNT_ROOT_FLAGS)
    domain_hex = account_root.get("Domain")
    domain = unhexlify(domain_hex).decode("utf-8", errors="replace") if domain_hex else "(none)"
    rate = account_root.get("TransferRate", 0)
    print("\n--- Issuer AccountRoot settings ---")
    print(f"  Address       : {account_root.get('Account')}")
    print(f"  TransferRate  : {rate} ({percent_from_transfer_rate(rate)})")
    print(f"  TickSize      : {account_root.get('TickSize', '(default)')}")
    print(f"  Domain        : {domain}")
    print(f"  Flags value   : {account_root.get('Flags', 0)}")
    print(f"  Flags decoded : {', '.join(flags) if flags else '(none set)'}")


# --- 4. Look up individual trust lines ---
def print_trust_lines(lines, currency):
    """Print per-trust-line properties for each holder of this currency."""
    print(f"\n--- Trust lines for currency {currency} ({len(lines)} shown) ---")
    for line in lines:
        print(f"  Counterparty : {line.get('account')}")
        print(f"    balance      : {line.get('balance')}")
        print(f"    limit        : {line.get('limit')}")
        print(f"    no_ripple    : {bool(line.get('no_ripple'))}")
        print(f"    freeze       : {bool(line.get('freeze'))}")
        print(f"    authorized   : {bool(line.get('authorized'))}")


# --- 5. Reconstruct the TransferRate history ---
def fetch_transfer_rate_history(client, issuer):
    """Return the chronological list of TransferRate changes for the issuer."""
    history = []
    previous = None
    marker = None

    while True:
        response = client.request(AccountTx(
            account=issuer,
            ledger_index_min=-1,
            ledger_index_max=-1,
            forward=True,
            limit=200,
            marker=marker,
        ))
        for entry in response.result["transactions"]:
            tx = entry.get("tx_json") or entry.get("tx") or {}
            if tx.get("TransactionType") != "AccountSet":
                continue
            if "TransferRate" not in tx:
                continue
            rate = tx.get("TransferRate") or 0
            if rate == previous:
                continue
            history.append({
                "ledger_index": tx.get("ledger_index") or entry.get("ledger_index"),
                "tx_hash": entry.get("hash") or tx.get("hash"),
                "transfer_rate": rate,
                "percent": percent_from_transfer_rate(rate),
            })
            previous = rate
        marker = response.result.get("marker")
        if not marker:
            break
    return history


def print_fee_history(history):
    """Print the chronological TransferRate history."""
    print(f"\n--- TransferRate history ({len(history)} change{'' if len(history) == 1 else 's'}) ---")
    if not history:
        print("  No AccountSet transactions modified TransferRate.")
        return
    for entry in history:
        print(f"  Ledger {entry['ledger_index']}  →  {entry['percent']}  (tx {entry['tx_hash']})")


# --- 6. Main flow ---
def main():
    issuer = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ISSUER
    currency = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_CURRENCY
    client = JsonRpcClient(NETWORK)
    print(f"Inspecting {currency}.{issuer} on {NETWORK}")

    account_info = client.request(AccountInfo(account=issuer, ledger_index="validated"))
    print_issuer_settings(account_info.result["account_data"])

    account_lines = client.request(AccountLines(account=issuer, ledger_index="validated"))
    filtered = [l for l in account_lines.result["lines"] if l.get("currency") == currency]
    print_trust_lines(filtered, currency)

    history = fetch_transfer_rate_history(client, issuer)
    print_fee_history(history)


if __name__ == "__main__":
    main()
