import asyncio
import json
import os

from xrpl.clients import JsonRpcClient
from xrpl.ext.confidential import (
    MPTCrypto,
    prepare_confidential_merge_inbox,
    prepare_confidential_send,
)
from xrpl.models import Batch, LedgerEntry, Tx
from xrpl.models.requests.ledger_entry import MPToken
from xrpl.models.transactions import ConfidentialMPTSend, Transaction
from xrpl.models.transactions.batch import BatchFlag
from xrpl.models.transactions.transaction import TransactionFlag
from xrpl.transaction import (
    autofill,
    combine_batch_signers,
    sign_multiaccount_batch,
    submit_and_wait,
)
from xrpl.wallet import Wallet, generate_faucet_wallet

from confidential_transfers_setup import main as run_setup

# Connect to the network ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")
crypto = MPTCrypto()

EXPLORER = "https://devnet.xrpl.org"

# Load setup data ----------------------
# This step checks for the necessary setup data to run the tutorial.
# If missing, confidential_transfers_setup.py will generate it.
if not os.path.exists("confidential_transfers_setup.json"):
    print("\n=== Setup data doesn't exist. Running setup script... ===\n")
    asyncio.run(run_setup())

with open("confidential_transfers_setup.json") as setup_file:
    setup_data = json.load(setup_file)

fund = setup_data["fund"]
stablecoin = setup_data["stablecoin"]

# Set up accounts
print("\n=== Getting accounts... ===")
orchestrator = generate_faucet_wallet(client)
seller = Wallet.from_seed(setup_data["seller"]["seed"])
buyer = Wallet.from_seed(setup_data["buyer"]["seed"])
auditor = Wallet.from_seed(setup_data["auditor"]["seed"])

# A confidential encryption keypair is generated at random and can't be rebuilt
# from an account seed, so the setup script saved each one it created.
seller_privkey = setup_data["seller"]["privateKey"]
seller_pubkey = setup_data["seller"]["publicKey"]
buyer_privkey = setup_data["buyer"]["privateKey"]
buyer_pubkey = setup_data["buyer"]["publicKey"]
issuer_pubkey = setup_data["issuer"]["publicKey"]
auditor_privkey = setup_data["auditor"]["privateKey"]
auditor_pubkey = setup_data["auditor"]["publicKey"]

print(f"Orchestrator address: {orchestrator.address}")
print(f"Seller address: {seller.address}")
print(f"Buyer address: {buyer.address}")
print(f"Auditor address: {auditor.address}")

# Make each holder's balance spendable ----------------------
print("\n=== Merging inbox balance for seller and buyer... ===")
tokens = (fund, stablecoin)
holders = (
    ("Seller", seller, seller_privkey),
    ("Buyer", buyer, buyer_privkey),
)
holdings = ((fund, seller), (stablecoin, buyer))

for token, holder in holdings:
    merge_tx = prepare_confidential_merge_inbox(
        client, holder, token["mptIssuanceID"]
    )
    merge_response = submit_and_wait(merge_tx, client, holder, autofill=True)
    merge_result = merge_response.result["meta"]["TransactionResult"]
    if merge_result != "tesSUCCESS":
        print(f"Error: Unable to merge the {token['ticker']} inbox: {merge_result}")
        exit(1)
    print(f"{holder.address} holds spendable confidential {token['ticker']}.")
    print(f"{EXPLORER}/transactions/{merge_response.result['hash']}\n")

# Build both confidential payments ----------------------
fund_amount = 100
cash_amount = 500

fund_payment = prepare_confidential_send(
    client,
    seller,
    buyer.address,
    fund["mptIssuanceID"],
    fund_amount,
    seller_privkey,
    seller_pubkey,
    buyer_pubkey,
    issuer_pubkey,
    auditor_pubkey,
)
cash_payment = prepare_confidential_send(
    client,
    buyer,
    seller.address,
    stablecoin["mptIssuanceID"],
    cash_amount,
    buyer_privkey,
    buyer_pubkey,
    seller_pubkey,
    issuer_pubkey,
    auditor_pubkey,
)

print("=== Prepared confidential payments ===")
print(f"Payment1 (Fund): {json.dumps(fund_payment.to_xrpl(), indent=2)}")
print(f"\nPayment2 (Cash): {json.dumps(cash_payment.to_xrpl(), indent=2)}")

# Read the fees the payments carried before overwriting them, because the outer
# Batch needs them later on.
inner_fees = int(fund_payment.fee) + int(cash_payment.fee)

# Every inner Batch transaction needs the tfInnerBatchTxn flag and a Fee of 0, so
# set the flag and overwrite the Fee the helper function filled in.
fund_payment, cash_payment = [
    ConfidentialMPTSend.from_dict(
        {**payment.to_dict(), "fee": "0", "flags": TransactionFlag.TF_INNER_BATCH_TXN}
    )
    for payment in (fund_payment, cash_payment)
]

# Settle both payments atomically ----------------------
print("\n=== Submit confidential payments in batch... ===")
print(f"Seller sends {fund['ticker']} to Buyer.")
print(f"Buyer sends {stablecoin['ticker']} to Seller.\n")

batch_tx = Batch(
    account=orchestrator.address,
    flags=BatchFlag.TF_ALL_OR_NOTHING,
    raw_transactions=[fund_payment, cash_payment],
)

autofilled_batch_tx = autofill(batch_tx, client, 2)
autofilled_batch_tx = Batch.from_dict(
    {
        **autofilled_batch_tx.to_dict(),
        "fee": str(int(autofilled_batch_tx.fee) + inner_fees),
    }
)

seller_batch = sign_multiaccount_batch(seller, autofilled_batch_tx)
buyer_batch = sign_multiaccount_batch(buyer, autofilled_batch_tx)
combined_batch_tx = combine_batch_signers([seller_batch, buyer_batch])

batch_response = submit_and_wait(combined_batch_tx, client, orchestrator)
if batch_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = batch_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to submit the Batch: {result_code}")
    exit(1)
print(f"Batch transaction hash: {batch_response.result['hash']}")
print(f"{EXPLORER}/transactions/{batch_response.result['hash']}")

# Verify each payment individually ----------------------
# A tesSUCCESS on the Batch only means the Batch itself was well-formed.
# Hash each inner transaction and look it up to confirm both payments applied.
print("\n=== Verifying both payments... ===")
raw_transactions = batch_response.result["tx_json"]["RawTransactions"]
for index, raw_transaction in enumerate(raw_transactions):
    inner = Transaction.from_xrpl(raw_transaction["RawTransaction"])
    inner_hash = inner.get_hash()
    inner_result = client.request(Tx(transaction=inner_hash)).result["meta"][
        "TransactionResult"
    ]
    print(f"Payment {index + 1}: {inner_result}")
    print(f"{EXPLORER}/transactions/{inner_hash}\n")

    if inner_result != "tesSUCCESS":
        print(f"Error: An inner payment failed: {inner_result}")
        exit(1)
print("Payments both successful!")

# Merge the received amounts into each spending balance ----------------------
print("\n=== Merging settled amounts into spending balance... ===")
settlements = ((fund, buyer), (stablecoin, seller))

for token, recipient in settlements:
    merge_tx = prepare_confidential_merge_inbox(
        client, recipient, token["mptIssuanceID"]
    )
    merge_response = submit_and_wait(merge_tx, client, recipient, autofill=True)
    merge_result = merge_response.result["meta"]["TransactionResult"]
    if merge_result != "tesSUCCESS":
        print(f"Error: Unable to merge the {token['ticker']} inbox: {merge_result}")
        exit(1)
    print(f"{recipient.address} can spend the {token['ticker']} it received.")
    print(f"{EXPLORER}/transactions/{merge_response.result['hash']}\n")

# Decrypt balances as each holder ----------------------
confidential_supplies = {}
for token in tokens:
    issuance = client.request(
        LedgerEntry(mpt_issuance=token["mptIssuanceID"]),
    ).result["node"]
    confidential_supplies[token["mptIssuanceID"]] = int(
        issuance["ConfidentialOutstandingAmount"]
    )

print("=== Decrypting balances as each holder... ===")
for name, holder, holder_privkey in holders:
    print(f"\n{name} reads its own balance as:")
    for token in tokens:
        mptoken = client.request(
            LedgerEntry(
                mptoken=MPToken(
                    mpt_issuance_id=token["mptIssuanceID"], account=holder.address
                ),
            ),
        ).result["node"]
        spending_balance = mptoken["ConfidentialBalanceSpending"]
        balance = crypto.decrypt(
            holder_privkey,
            spending_balance[:66],
            spending_balance[66:],
            range_high=confidential_supplies[token["mptIssuanceID"]],
        )
        print(f"     - {balance} {token['ticker']}\n")

# Decrypt the balances and amounts as the auditor ----------------------
print("\n=== Decrypting balances and amounts as the auditor... ===")
for name, holder, _ in holders:
    print(f"Auditor reads the {name.lower()}'s balance as:")
    for token in tokens:
        mptoken = client.request(
            LedgerEntry(
                mptoken=MPToken(
                    mpt_issuance_id=token["mptIssuanceID"], account=holder.address
                ),
            ),
        ).result["node"]
        auditor_balance = mptoken["AuditorEncryptedBalance"]
        auditor_view = crypto.decrypt(
            auditor_privkey,
            auditor_balance[:66],
            auditor_balance[66:],
            range_high=confidential_supplies[token["mptIssuanceID"]],
        )
        print(f"     - {auditor_view} {token['ticker']}")

print("\nAuditor reads the settled amounts as:")
settled = ((fund, fund_payment), (stablecoin, cash_payment))

for token, payment in settled:
    auditor_amount = payment.auditor_encrypted_amount
    settled_amount = crypto.decrypt(
        auditor_privkey,
        auditor_amount[:66],
        auditor_amount[66:],
        range_high=confidential_supplies[token["mptIssuanceID"]],
    )
    print(f"     - {settled_amount} {token['ticker']}")
