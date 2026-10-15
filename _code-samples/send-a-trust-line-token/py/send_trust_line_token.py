import asyncio
import json
import os
import sys
from decimal import Decimal

from xrpl.clients import JsonRpcClient
from xrpl.models import AccountInfo, AccountLines
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

from send_trust_line_token_setup import main as run_setup

# Set up client ----------------------
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# This step checks for the necessary setup data to run the tutorial.
# If missing, send_trust_line_token_setup.py will generate it.
if not os.path.exists("send_trust_line_token_setup.json"):
    print("\n=== Tutorial setup data doesn't exist. Running setup script... ===\n")
    asyncio.run(run_setup())

# Load the preconfigured sender account.
with open("send_trust_line_token_setup.json") as f:
    setup_data = json.load(f)

sender = Wallet.from_seed(setup_data["sender"]["seed"])

# The token to send and who to send it to. TST is a test token on Testnet,
# and the receiver is a well-known account that already holds a TST trust
# line. You can replace these values with your own.
issuer_address = "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
currency_code = "TST"
receiver_address = "rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE"
send_quantity = "2"

# The highest transfer fee this script is willing to pay, as a percentage of
# the amount sent. Protects against approving a large fee by accident.
max_transfer_fee_percent = 10

# AccountRoot flags. See https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot
LSF_REQUIRE_AUTH = 0x00040000
LSF_DEFAULT_RIPPLE = 0x00800000

print(f"Issuer address:   {issuer_address}")
print(f"Sender address:   {sender.address}")
print(f"Receiver address: {receiver_address}")


# get_trust_line returns the trust line between `account` and `peer` for the
# given currency, or None if no such trust line exists.
def get_trust_line(account, currency, peer):
    response = client.request(
        AccountLines(account=account, peer=peer, ledger_index="validated")
    )
    for line in response.result["lines"]:
        if line["currency"] == currency:
            return line
    return None


# Check sender balance ----------------------
# Confirm the sender holds enough of the token to make the payment.
print(f"\n=== Checking sender's {currency_code} balance... ===\n")
sender_line = get_trust_line(sender.address, currency_code, issuer_address)
if sender_line is None:
    print(f"Error: Sender has no {currency_code} trust line with the issuer.")
    sys.exit(1)
print(f"Sender's balance: {sender_line['balance']}")
if Decimal(sender_line["balance"]) < Decimal(send_quantity):
    print(f"Error: Sender's balance is less than the {send_quantity} {currency_code} to send.")
    sys.exit(1)

# Check receiver ----------------------
# Confirm the receiver can accept the payment before sending it.
print(f"\n=== Checking receiver can receive {currency_code}... ===\n")
issuer_info = client.request(
    AccountInfo(account=issuer_address, ledger_index="validated")
)
issuer_flags = issuer_info.result["account_data"]["Flags"]
receiver_line = get_trust_line(receiver_address, currency_code, issuer_address)

# 1. The receiver must have a trust line to the issuer for this currency.
if receiver_line is None:
    print(f"Error: Receiver has no {currency_code} trust line with the issuer.")
    sys.exit(1)
print("✓ Receiver has a trust line to the issuer")

# 2. The issuer must allow rippling on both trust lines, since a payment
#    between holders moves through the issuer. Default Ripple on the issuer
#    is the usual way to allow this, but check the lines themselves.
if sender_line.get("no_ripple_peer") or receiver_line.get("no_ripple_peer"):
    print("Error: The issuer has disabled rippling on the sender or receiver trust line.")
    sys.exit(1)
default_ripple = bool(issuer_flags & LSF_DEFAULT_RIPPLE)
print(f"✓ Rippling is allowed (issuer Default Ripple: {default_ripple})")

# 3. The receiver's limit must cover their current balance plus the payment.
if Decimal(receiver_line["balance"]) + Decimal(send_quantity) > Decimal(receiver_line["limit"]):
    print(f"Error: Payment would exceed the receiver's limit of {receiver_line['limit']} {currency_code}.")
    sys.exit(1)
print("✓ Receiver's limit covers the payment")

# 4. If the issuer requires authorization, the receiver's line must be authorized.
require_auth = bool(issuer_flags & LSF_REQUIRE_AUTH)
if require_auth and not receiver_line.get("peer_authorized"):
    print("Error: The issuer requires authorization and has not authorized the receiver.")
    sys.exit(1)
print(f"✓ Authorization OK (issuer Require Auth: {require_auth})")

# 5. If the issuer charges a transfer fee, the sender pays more than the
#    receiver gets. Work out the SendMax needed and refuse unreasonable fees.
#    TransferRate is a multiplier in billionths, e.g. 1005000000 = 1.005 = 0.5% fee.
transfer_rate = issuer_info.result["account_data"].get("TransferRate", 1000000000)
transfer_fee_percent = Decimal(transfer_rate - 1000000000) / Decimal(10000000)
if transfer_fee_percent > max_transfer_fee_percent:
    print(f"Error: Transfer fee of {transfer_fee_percent}% exceeds the {max_transfer_fee_percent}% limit.")
    sys.exit(1)
send_max = None
if transfer_fee_percent > 0:
    send_max = str(Decimal(send_quantity) * Decimal(transfer_rate) / Decimal(1000000000))
    print(f"✓ Transfer fee is {transfer_fee_percent}%; sender will pay up to {send_max} {currency_code}")
else:
    print("✓ No transfer fee")

print("\nBalances before payment:")
print(f"  Sender:   {sender_line['balance']} {currency_code}")
print(f"  Receiver: {receiver_line['balance']} {currency_code}")

# Send payment ----------------------
# The sender pays the receiver with the token. Amount is what the receiver
# gets; SendMax (if set) is the most the sender is willing to spend.
print(f"\n=== Sending {send_quantity} {currency_code} to receiver... ===\n")
payment_tx = Payment(
    account=sender.address,
    destination=receiver_address,
    amount=IssuedCurrencyAmount(
        currency=currency_code,
        issuer=issuer_address,
        value=send_quantity,
    ),
    send_max=(
        IssuedCurrencyAmount(
            currency=currency_code,
            issuer=issuer_address,
            value=send_max,
        )
        if send_max
        else None
    ),
)
print(json.dumps(payment_tx.to_xrpl(), indent=2))

payment_response = submit_and_wait(payment_tx, client, sender)
if payment_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = payment_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to send token: {result_code}")
    sys.exit(1)
print("Payment successful!")
print(f"Explorer link: https://testnet.xrpl.org/transactions/{payment_response.result['hash']}")

# Verify balances ----------------------
# Check both balances again to confirm the transfer.
print(f"\n=== Checking final {currency_code} balances... ===\n")
sender_line_after = get_trust_line(sender.address, currency_code, issuer_address)
receiver_line_after = get_trust_line(receiver_address, currency_code, issuer_address)
print(f"  Sender:   {sender_line_after['balance']} {currency_code}")
print(f"  Receiver: {receiver_line_after['balance']} {currency_code}")
