# This example demonstrates how to create escrows that hold fungible tokens.
# It covers MPTs and Trust Line Tokens, and uses conditional and timed escrows.

import json
from datetime import datetime, timedelta, UTC
from os import urandom
from time import sleep

from cryptoconditions import PreimageSha256
from xrpl.clients import JsonRpcClient
from xrpl.models import (
    AccountSet,
    EscrowCreate,
    EscrowFinish,
    MPTokenAuthorize,
    MPTokenIssuanceCreate,
    Payment,
    TrustSet,
)
from xrpl.models.amounts import IssuedCurrencyAmount, MPTAmount
from xrpl.models.requests import Ledger
from xrpl.models.transactions.account_set import AccountSetAsfFlag
from xrpl.models.transactions.mptoken_issuance_create import MPTokenIssuanceCreateFlag
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time, ripple_time_to_datetime
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Fund an issuer account and an escrow creator account ----------------------
print("\n=== Funding Accounts ===\n")
issuer = generate_faucet_wallet(client, debug=True)
creator = generate_faucet_wallet(client, debug=True)
print(f"Issuer: {issuer.address}")
print(f"Escrow Creator: {creator.address}")

# ====== Conditional MPT Escrow ======

# Issuer creates an MPT ----------------------
print("\n=== Creating MPT ===\n")
mpt_create_tx = MPTokenIssuanceCreate(
    account=issuer.address,
    maximum_amount="1000000",
    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_ESCROW,
)

print(json.dumps(mpt_create_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation
print("\nSubmitting MPTokenIssuanceCreate transaction...")
mpt_create_response = submit_and_wait(mpt_create_tx, client, issuer)

if mpt_create_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"MPTokenIssuanceCreate failed: {mpt_create_response.result['meta']['TransactionResult']}")
    exit(1)

# Extract the MPT issuance ID from the transaction result
mpt_issuance_id = mpt_create_response.result["meta"]["mpt_issuance_id"]
print(f"MPT created: {mpt_issuance_id}")

# Escrow Creator authorizes the MPT ----------------------
print("\n=== Escrow Creator Authorizing MPT ===\n")
mpt_auth_tx = MPTokenAuthorize(
    account=creator.address,
    mptoken_issuance_id=mpt_issuance_id,
)

print(json.dumps(mpt_auth_tx.to_xrpl(), indent=2))

print("\nSubmitting MPTokenAuthorize transaction...")
mpt_auth_response = submit_and_wait(mpt_auth_tx, client, creator)

if mpt_auth_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"MPTokenAuthorize failed: {mpt_auth_response.result['meta']['TransactionResult']}")
    exit(1)
print("Escrow Creator authorized for MPT.")

# Issuer sends MPTs to escrow creator ----------------------
print("\n=== Issuer Sending MPTs to Escrow Creator ===\n")
mpt_payment_tx = Payment(
    account=issuer.address,
    destination=creator.address,
    amount=MPTAmount(
        mpt_issuance_id=mpt_issuance_id,
        value="5000",
    ),
)

print(json.dumps(mpt_payment_tx.to_xrpl(), indent=2))

print("\nSubmitting MPT Payment transaction...")
mpt_payment_response = submit_and_wait(mpt_payment_tx, client, issuer)

if mpt_payment_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"MPT Payment failed: {mpt_payment_response.result['meta']['TransactionResult']}")
    exit(1)
print("Successfully sent 5000 MPTs to Escrow Creator.")

# Escrow Creator creates a conditional MPT escrow ----------------------
print("\n=== Creating Conditional MPT Escrow ===\n")

# Generate crypto-condition
preimage = urandom(32)
fulfillment = PreimageSha256(preimage=preimage)
fulfillment_hex = fulfillment.serialize_binary().hex().upper()
condition_hex = fulfillment.condition_binary.hex().upper()
print(f"Condition: {condition_hex}")
print(f"Fulfillment: {fulfillment_hex}\n")

# Set expiration (300 seconds from now)
cancel_after = datetime.now(tz=UTC) + timedelta(seconds=300)
cancel_after_ripple_time = datetime_to_ripple_time(cancel_after)

mpt_escrow_create_tx = EscrowCreate(
    account=creator.address,
    destination=issuer.address,
    amount=MPTAmount(
        mpt_issuance_id=mpt_issuance_id,
        value="1000",
    ),
    condition=condition_hex,
    cancel_after=cancel_after_ripple_time,  # Fungible token escrows require a cancel_after time
)

print(json.dumps(mpt_escrow_create_tx.to_xrpl(), indent=2))

print("\nSubmitting MPT EscrowCreate transaction...")
mpt_escrow_response = submit_and_wait(mpt_escrow_create_tx, client, creator)

if mpt_escrow_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"MPT EscrowCreate failed: {mpt_escrow_response.result['meta']['TransactionResult']}")
    exit(1)

# Save the sequence number to identify the escrow later
mpt_escrow_seq = mpt_escrow_response.result["tx_json"]["Sequence"]
print(f"Conditional MPT escrow created. Sequence: {mpt_escrow_seq}")

# Finish the conditional MPT escrow with the fulfillment ----------------------
print("\n=== Finishing Conditional MPT Escrow ===\n")
mpt_escrow_finish_tx = EscrowFinish(
    account=creator.address,
    owner=creator.address,
    offer_sequence=mpt_escrow_seq,
    condition=condition_hex,
    fulfillment=fulfillment_hex,
)

print(json.dumps(mpt_escrow_finish_tx.to_xrpl(), indent=2))

print("\nSubmitting EscrowFinish transaction...")
mpt_finish_response = submit_and_wait(mpt_escrow_finish_tx, client, creator)

if mpt_finish_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"MPT EscrowFinish failed: {mpt_finish_response.result['meta']['TransactionResult']}")
    exit(1)
print(f"Conditional MPT escrow finished successfully: https://testnet.xrpl.org/transactions/{mpt_finish_response.result['hash']}")

# ====== Timed Trust Line Token Escrow ======

# Enable trust line token escrows on the issuer ----------------------
print("\n=== Enabling Trust Line Token Escrows on Issuer ===\n")
account_set_tx = AccountSet(
    account=issuer.address,
    set_flag=AccountSetAsfFlag.ASF_ALLOW_TRUSTLINE_LOCKING,
)

print(json.dumps(account_set_tx.to_xrpl(), indent=2))

print("\nSubmitting AccountSet transaction...")
account_set_response = submit_and_wait(account_set_tx, client, issuer)

if account_set_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"AccountSet failed: {account_set_response.result['meta']['TransactionResult']}")
    exit(1)
print("Trust line token escrows enabled by issuer.")

# Escrow Creator sets up a trust line to the issuer ----------------------
print("\n=== Setting Up Trust Line ===\n")
currency_code = "IOU"

trust_set_tx = TrustSet(
    account=creator.address,
    limit_amount=IssuedCurrencyAmount(
        currency=currency_code,
        issuer=issuer.address,
        value="10000000",
    ),
)

print(json.dumps(trust_set_tx.to_xrpl(), indent=2))

print("\nSubmitting TrustSet transaction...")
trust_response = submit_and_wait(trust_set_tx, client, creator)

if trust_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"TrustSet failed: {trust_response.result['meta']['TransactionResult']}")
    exit(1)
print(f'Trust line successfully created for "{currency_code}" tokens.')

# Issuer sends IOU tokens to creator ----------------------
print("\n=== Issuer Sending IOU Tokens to Escrow Creator ===\n")
iou_payment_tx = Payment(
    account=issuer.address,
    destination=creator.address,
    amount=IssuedCurrencyAmount(
        currency=currency_code,
        value="5000",
        issuer=issuer.address,
    ),
)

print(json.dumps(iou_payment_tx.to_xrpl(), indent=2))

print("\nSubmitting Trust Line Token payment transaction...")
iou_pay_response = submit_and_wait(iou_payment_tx, client, issuer)

if iou_pay_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"Trust Line Token payment failed: {iou_pay_response.result['meta']['TransactionResult']}")
    exit(1)
print(f"Successfully sent 5000 {currency_code} tokens.")

# Escrow Creator creates a timed trust line token escrow ----------------------
print("\n=== Creating Timed Trust Line Token Escrow ===\n")
delay = 10  # seconds
now = datetime.now(tz=UTC)
finish_after = now + timedelta(seconds=delay)
finish_after_ripple_time = datetime_to_ripple_time(finish_after)
mature_time = finish_after.astimezone().strftime("%m/%d/%Y, %I:%M:%S %p")
print(f"Escrow will mature after: {mature_time}\n")

iou_cancel_after = now + timedelta(seconds=300)
iou_cancel_after_ripple_time = datetime_to_ripple_time(iou_cancel_after)

iou_escrow_create_tx = EscrowCreate(
    account=creator.address,
    destination=issuer.address,
    amount=IssuedCurrencyAmount(
        currency=currency_code,
        value="1000",
        issuer=issuer.address,
    ),
    finish_after=finish_after_ripple_time,
    cancel_after=iou_cancel_after_ripple_time,
)

print(json.dumps(iou_escrow_create_tx.to_xrpl(), indent=2))

print("\nSubmitting Trust Line Token EscrowCreate transaction...")
iou_escrow_response = submit_and_wait(iou_escrow_create_tx, client, creator)

if iou_escrow_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"Trust Line Token EscrowCreate failed: {iou_escrow_response.result['meta']['TransactionResult']}")
    exit(1)

# Save the sequence number to identify the escrow later
iou_escrow_seq = iou_escrow_response.result["tx_json"]["Sequence"]
print(f"Trust Line Token escrow created. Sequence: {iou_escrow_seq}")

# Wait for the escrow to mature, then finish it --------------------
print("\n=== Waiting For Timed Trust Line Token Escrow to Mature ===\n")

# Countdown delay until escrow matures
for i in range(delay, -1, -1):
    print(f"Waiting for escrow to mature... {i}s remaining...", end="\r", flush=True)
    sleep(1)
print("Waiting for escrow to mature... done.           ")

# Confirm latest validated ledger close time is after the finish_after time
escrow_ready = False
while not escrow_ready:
    validated_ledger = client.request(Ledger(ledger_index="validated"))
    ledger_close_time = validated_ledger.result["ledger"]["close_time"]
    ledger_close_local = ripple_time_to_datetime(ledger_close_time).astimezone().strftime("%m/%d/%Y, %I:%M:%S %p")
    print(f"Latest validated ledger closed at: {ledger_close_local}")
    if ledger_close_time > finish_after_ripple_time:
        escrow_ready = True
        print("Escrow confirmed ready to finish.")
    else:
        time_difference = finish_after_ripple_time - ledger_close_time
        if time_difference == 0:
            time_difference = 1
        print(f"Escrow needs to wait another {time_difference}s.")
        sleep(time_difference)

# Finish the timed trust line token escrow --------------------
print("\n=== Finishing Timed Trust Line Token Escrow ===\n")
iou_escrow_finish_tx = EscrowFinish(
    account=creator.address,
    owner=creator.address,
    offer_sequence=iou_escrow_seq,
)

print(json.dumps(iou_escrow_finish_tx.to_xrpl(), indent=2))

print("\nSubmitting EscrowFinish transaction...")
iou_finish_response = submit_and_wait(iou_escrow_finish_tx, client, creator)

if iou_finish_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"Trust Line Token EscrowFinish failed: {iou_finish_response.result['meta']['TransactionResult']}")
    exit(1)
print(f"Timed Trust Line Token escrow finished successfully: https://testnet.xrpl.org/transactions/{iou_finish_response.result['hash']}")
