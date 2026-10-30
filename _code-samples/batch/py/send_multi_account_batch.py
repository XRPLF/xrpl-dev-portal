"""
 * XRP Ledger Batch Transactions Tutorial
 *
 * This tutorial demonstrates how to use the Batch transaction feature (XLS-56)
 * to perform a multi-account batch transaction.
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
from xrpl.transaction import (
    autofill,
    combine_batch_signers,
    sign_multiaccount_batch,
    submit_and_wait,
)
from xrpl.utils import drops_to_xrp, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

# Create and fund wallets
print("=== Funding new wallets from faucet... ===")
alice = generate_faucet_wallet(client)
bob = generate_faucet_wallet(client)
charlie = generate_faucet_wallet(client)
third_party_wallet = generate_faucet_wallet(client)

print(f"Alice: {alice.address}, Balance: {drops_to_xrp(str(get_balance(alice.address, client)))} XRP")
print(f"Bob: {bob.address}, Balance: {drops_to_xrp(str(get_balance(bob.address, client)))} XRP")
print(f"Charlie: {charlie.address}, Balance: {drops_to_xrp(str(get_balance(charlie.address, client)))} XRP")
print(f"Third-party wallet: {third_party_wallet.address}, Balance: {drops_to_xrp(str(get_balance(third_party_wallet.address, client)))} XRP")

# Create inner transactions ----------------------
# REQUIRED: Inner transactions MUST have the TF_INNER_BATCH_TXN flag (0x40000000).
# This marks them as part of a batch (requires Fee: 0 and empty SigningPubKey).

# Transaction 1: Charlie pays Alice
charlie_payment = Payment(
    account=charlie.address,
    destination=alice.address,
    amount=xrp_to_drops(50),
    flags=TransactionFlag.TF_INNER_BATCH_TXN,  # THIS IS REQUIRED
)

# Transaction 2: Bob pays Alice
bob_payment = Payment(
    account=bob.address,
    destination=alice.address,
    amount=xrp_to_drops(50),
    flags=TransactionFlag.TF_INNER_BATCH_TXN,  # THIS IS REQUIRED
)

# Prepare Batch transaction ----------------------
print("\n=== Creating Batch transaction... ===")
batch_tx = Batch(
    account=third_party_wallet.address,
    flags=BatchFlag.TF_ALL_OR_NOTHING,  # TF_ALL_OR_NOTHING: All inner transactions must succeed
    # Must include a minimum of 2 transactions and a maximum of 8 transactions.
    raw_transactions=[charlie_payment, bob_payment],
)
print(json.dumps(batch_tx.to_xrpl(), indent=2))

# Set the expected number of signers, which is 2 (Bob and Charlie) in this case, for this transaction.
# "autofill" will automatically add Fee: "0" and SigningPubKey: "" to inner transactions.
autofilled_batch_tx = autofill(batch_tx, client, 2)

# Gather batch signatures ----------------------
# Each signer gets their own tx copy because sign_multiaccount_batch returns a new Batch.
# Charlie signs the Batch transaction
charlie_batch = sign_multiaccount_batch(charlie, autofilled_batch_tx)

# Bob signs the Batch transaction
bob_batch = sign_multiaccount_batch(bob, autofilled_batch_tx)

# Combine inner transaction signatures.
# This returns a signed transaction blob (hex string) ready for submission.
combined_signed_tx = combine_batch_signers([charlie_batch, bob_batch])

# Submit the signed blob with the third-party's wallet
print("\n=== Submitting Batch transaction... ===")
submit_response = submit_and_wait(combined_signed_tx, client, third_party_wallet)

# Check Batch transaction result ----------------------
if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"\nTransaction failed with result code {result_code}")
    sys.exit(1)

print("\nBatch transaction submitted successfully!")
print("Result:\n", json.dumps(submit_response.result, indent=2))
# View the transaction on the XRPL Explorer
print(f"\nBatch transaction URL:\nhttps://devnet.xrpl.org/transactions/{submit_response.result['hash']}")

# Calculate and verify inner transaction hashes ----------------------
print("\n=== Verifying inner transactions ===")
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
print(f"Alice: {alice.address}, Balance: {drops_to_xrp(str(get_balance(alice.address, client)))} XRP")
print(f"Bob: {bob.address}, Balance: {drops_to_xrp(str(get_balance(bob.address, client)))} XRP")
print(f"Charlie: {charlie.address}, Balance: {drops_to_xrp(str(get_balance(charlie.address, client)))} XRP")
print(f"Third-party wallet: {third_party_wallet.address}, Balance: {drops_to_xrp(str(get_balance(third_party_wallet.address, client)))} XRP")
