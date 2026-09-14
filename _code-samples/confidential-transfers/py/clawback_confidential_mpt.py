import asyncio
import json
import os

from xrpl.clients import JsonRpcClient
from xrpl.ext.confidential import (
    decrypt_confidential_balance,
    prepare_confidential_clawback,
)
from xrpl.models import LedgerEntry, MPTokenIssuanceSet
from xrpl.models.requests.ledger_entry import MPToken
from xrpl.models.transactions import MPTokenIssuanceSetFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

from confidential_transfers_setup import main as run_setup

# Connect to the network ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

EXPLORER = "https://devnet.xrpl.org"

# Load setup data ----------------------
# This step checks for the necessary setup data to run the tutorial.
# If missing, confidential_transfers_setup.py will generate it.
if not os.path.exists("confidential_transfers_setup.json"):
    print("\n=== Setup data doesn't exist. Running setup script... ===\n")
    asyncio.run(run_setup())

with open("confidential_transfers_setup.json") as setup_file:
    setup_data = json.load(setup_file)

# Set up accounts ----------------------
print("\n=== Getting accounts... ===")
issuer = Wallet.from_seed(setup_data["issuer"]["seed"])
auditor = Wallet.from_seed(setup_data["auditor"]["seed"])
holder = Wallet.from_seed(setup_data["flaggedHolder"]["seed"])

issuer_privkey = setup_data["issuer"]["privateKey"]
issuer_pubkey = setup_data["issuer"]["publicKey"]
auditor_privkey = setup_data["auditor"]["privateKey"]
holder_privkey = setup_data["flaggedHolder"]["privateKey"]

ticker = setup_data["stablecoin"]["ticker"]
mpt_issuance_id = setup_data["stablecoin"]["mptIssuanceID"]

print(f"Issuer address: {issuer.address}")
print(f"Holder address: {holder.address}")
print(f"Auditor address: {auditor.address}")

# Lock the issuance for the holder ----------------------
print(f"\n=== Locking {ticker} for the holder... ===")
lock_tx = MPTokenIssuanceSet(
    account=issuer.address,
    mptoken_issuance_id=mpt_issuance_id,
    holder=holder.address,
    flags=MPTokenIssuanceSetFlag.TF_MPT_LOCK,
)

lock_response = submit_and_wait(lock_tx, client, issuer, autofill=True)
if lock_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = lock_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to lock the issuance: {result_code}")
    exit(1)
print(f"{ticker} is locked for {holder.address}.")
print(f"{EXPLORER}/transactions/{lock_response.result['hash']}")

# Read the confidential supply before the clawback ----------------------
print("\n=== Reading the confidential supply... ===")
mpt_issuance = client.request(
    LedgerEntry(mpt_issuance=mpt_issuance_id),
).result["node"]
confidential_supply = int(mpt_issuance["ConfidentialOutstandingAmount"])
print(f"Confidential supply before clawback: {confidential_supply}")

# Claw back the confidential balance ----------------------
print("\n=== Clawing back the holder's confidential balance... ===")
holder_mptoken = client.request(
    LedgerEntry(
        mptoken=MPToken(mpt_issuance_id=mpt_issuance_id, account=holder.address),
    ),
).result["node"]

issuer_encrypted_balance = holder_mptoken["IssuerEncryptedBalance"]
clawback_amount = decrypt_confidential_balance(
    issuer_encrypted_balance,
    issuer_privkey,
    range_high=confidential_supply,
)

# A clawback takes the whole balance, so there is nothing left to reclaim if
# this sample has already run against this setup data. The protocol rejects a
# clawback of zero, so stop before submitting.
if clawback_amount == 0:
    print(f"Error: The confidential balance of {holder.address} is already zero.")
    print("Delete confidential_transfers_setup.json and run the setup script again.")
    exit(1)

# prepare_confidential_clawback attaches the amount the issuer read and a
# Zero-Knowledge Proof (ZKP) that the amount matches the encrypted balance.
clawback_tx = prepare_confidential_clawback(
    client,
    issuer,
    holder.address,
    mpt_issuance_id,
    clawback_amount,
    issuer_privkey,
    issuer_pubkey,
    issuer_encrypted_balance,
)
print(json.dumps(clawback_tx.to_dict(), indent=2))

clawback_response = submit_and_wait(clawback_tx, client, issuer, autofill=True)
if clawback_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = clawback_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to claw back the balance: {result_code}")
    exit(1)
print(f"Clawed back {clawback_amount} {ticker} from {holder.address}.")
print(f"{EXPLORER}/transactions/{clawback_response.result['hash']}")

# Verify the clawback ----------------------
print("\n=== Verifying the clawback... ===")
holder_mptoken_after = client.request(
    LedgerEntry(
        mptoken=MPToken(mpt_issuance_id=mpt_issuance_id, account=holder.address),
    ),
).result["node"]
print("MPToken entry:")
print(json.dumps(holder_mptoken_after, indent=2))

spending = holder_mptoken_after["ConfidentialBalanceSpending"]
inbox = holder_mptoken_after["ConfidentialBalanceInbox"]
issuer_balance = holder_mptoken_after["IssuerEncryptedBalance"]
auditor_balance = holder_mptoken_after["AuditorEncryptedBalance"]

spending_balance = decrypt_confidential_balance(
    spending, holder_privkey, range_high=confidential_supply
)
inbox_balance = decrypt_confidential_balance(
    inbox, holder_privkey, range_high=confidential_supply
)
issuer_view = decrypt_confidential_balance(
    issuer_balance, issuer_privkey, range_high=confidential_supply
)
auditor_view = decrypt_confidential_balance(
    auditor_balance, auditor_privkey, range_high=confidential_supply
)
print(f"\nHolder reads its spending balance as {spending_balance} {ticker}.")
print(f"Holder reads its inbox balance as {inbox_balance} {ticker}.\n")
print(f"Issuer reads the holder's balance as {issuer_view} {ticker}.")
print(f"Auditor reads the holder's balance as {auditor_view} {ticker}.\n")

issuance_after = client.request(
    LedgerEntry(mpt_issuance=mpt_issuance_id),
).result["node"]
supply_after = issuance_after["ConfidentialOutstandingAmount"]
print(f"Confidential supply after the clawback: {supply_after}")
print(
    f"Total supply in circulation (public + confidential): {issuance_after['OutstandingAmount']}"
)
