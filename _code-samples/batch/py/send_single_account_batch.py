"""
 * Single Account Batch Transaction Example
 *
 * This example demonstrates how to use the Batch transactions feature (XLS-56)
 * to create a single-account batch transaction that sends payments
 * to multiple destinations in one atomic operation.
 * Concept doc: https://xrpl.org/docs/concepts/transactions/batch-transactions
 * Reference doc: https://xrpl.org/docs/references/protocol/transactions/types/batch
"""

import json
import sys

from xrpl.account import get_balance
from xrpl.clients import JsonRpcClient
from xrpl.models import Batch, Payment, Transaction, Tx
from xrpl.models.transactions.batch import BatchFlag
from xrpl.models.transactions.transaction import TransactionFlag
from xrpl.transaction import submit_and_wait
from xrpl.utils import drops_to_xrp, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create and fund wallets
print("=== Funding new wallets from faucet... ===")
sender = generate_faucet_wallet(client)
wallet1 = generate_faucet_wallet(client)
wallet2 = generate_faucet_wallet(client)

print(f"Sender: {sender.address}, Balance: {drops_to_xrp(str(get_balance(sender.address, client)))} XRP")
print(f"Wallet1: {wallet1.address}, Balance: {drops_to_xrp(str(get_balance(wallet1.address, client)))} XRP")
print(f"Wallet2: {wallet2.address}, Balance: {drops_to_xrp(str(get_balance(wallet2.address, client)))} XRP")

# Create inner transactions ----------------------
# REQUIRED: Inner transactions MUST have the TF_INNER_BATCH_TXN flag (0x40000000).
# This marks them as part of a batch (requires Fee: 0 and empty SigningPubKey).

# Transaction 1
payment1 = Payment(
    account=sender.address,
    destination=wallet1.address,
    amount=xrp_to_drops(2),
    flags=TransactionFlag.TF_INNER_BATCH_TXN,  # THIS IS REQUIRED
)

# Transaction 2
payment2 = Payment(
    account=sender.address,
    destination=wallet2.address,
    amount=xrp_to_drops(5),
    flags=TransactionFlag.TF_INNER_BATCH_TXN,  # THIS IS REQUIRED
)

# Prepare Batch transaction ----------------------
print("\n=== Creating Batch transaction... ===")
batch_tx = Batch(
    account=sender.address,
    flags=BatchFlag.TF_ALL_OR_NOTHING,  # TF_ALL_OR_NOTHING: All inner transactions must succeed
    # Must include a minimum of 2 transactions and a maximum of 8 transactions.
    raw_transactions=[payment1, payment2],
)
print(json.dumps(batch_tx.to_xrpl(), indent=2))

# Submit and wait for validation ----------------------
print("\n=== Submitting Batch transaction... ===")
# "autofill" (on by default in submit_and_wait) will automatically add Fee: "0" and SigningPubKey: "" to inner transactions.
submit_response = submit_and_wait(batch_tx, client, sender)

# Check Batch transaction result ----------------------
if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"\nTransaction failed with result code {result_code}")
    sys.exit(1)
print("\nBatch transaction submitted successfully!")
print("Result:\n", json.dumps(submit_response.result, indent=2))
# View the batch transaction on the XRPL Explorer
print(f"\nBatch transaction URL:\nhttps://devnet.xrpl.org/transactions/{submit_response.result['hash']}")

# Calculate and verify inner transaction hashes ----------------------
print("\n=== Verifying inner transactions... ===")
raw_transactions = submit_response.result["tx_json"]["RawTransactions"]
has_failure = False

for i, raw_tx in enumerate(raw_transactions):
    inner_tx = Transaction.from_xrpl(raw_tx["RawTransaction"])
    tx_hash = inner_tx.get_hash()
    print(f"\nTransaction {i + 1} hash: {tx_hash}")

    tx_response = client.request(Tx(transaction=tx_hash))
    if tx_response.is_successful():
        status = tx_response.result["meta"]["TransactionResult"]
        print(f" - Status: {status} (Ledger {tx_response.result['ledger_index']})")
        print(f" - Transaction URL: https://devnet.xrpl.org/transactions/{tx_hash}")
    else:
        has_failure = True
        print(f" - Transaction not found: {tx_response.result['error']}")

if has_failure:
    print("\n--- Error: One or more inner transactions failed. ---")
    sys.exit(1)

# Verify balances after transaction
print("\n=== Final balances ===")
print(f"Sender: {sender.address}, Balance: {drops_to_xrp(str(get_balance(sender.address, client)))} XRP")
print(f"Wallet1: {wallet1.address}, Balance: {drops_to_xrp(str(get_balance(wallet1.address, client)))} XRP")
print(f"Wallet2: {wallet2.address}, Balance: {drops_to_xrp(str(get_balance(wallet2.address, client)))} XRP")
