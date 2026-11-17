# IMPORTANT: This script sends a cross-currency payment. The sender spends XRP
# and the receiver is credited in USD, converted through the DEX order book.
# It requires the accounts and liquidity created by cross_currency_setup.py; if
# the setup data is missing, this script runs the setup script first.
import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.models.transactions import Payment, PaymentFlag
from xrpl.transaction import submit_and_wait
from xrpl.utils import xrp_to_drops
from xrpl.wallet import Wallet

# Set up client ----------------------
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Ensure the tutorial's accounts and liquidity exist ----------------------
if not os.path.exists("cross_currency_setup.json"):
    print("\n=== Setup data doesn't exist. Running setup script... ===\n")
    subprocess.run([sys.executable, "cross_currency_setup.py"], check=True)

with open("cross_currency_setup.json") as f:
    setup_data = json.load(f)

sender = Wallet.from_seed(setup_data["sender"]["seed"])
receiver_address = setup_data["receiver"]["address"]
issuer_address = setup_data["issuer_address"]
currency = setup_data["currency"]

print(f"\nSender address:   {sender.address}")
print(f"Receiver address: {receiver_address}")

# Prepare cross-currency Payment ----------------------
# Deliver 100 USD to the receiver while spending no more than 30 XRP from the
# source. The ledger routes XRP -> USD through the DEX automatically, so there
# is no router to integrate. SendMax caps what the source spends. DeliverMin,
# together with the tfPartialPayment flag, floors what the destination receives.
print("\n=== Preparing cross-currency Payment ===\n")
payment_tx = Payment(
    account=sender.address,
    destination=receiver_address,
    amount=IssuedCurrencyAmount(
        currency=currency,
        issuer=issuer_address,
        value="100",
    ),
    send_max=xrp_to_drops(30),
    deliver_min=IssuedCurrencyAmount(
        currency=currency,
        issuer=issuer_address,
        value="95",
    ),
    flags=[PaymentFlag.TF_PARTIAL_PAYMENT],
)

print(json.dumps(payment_tx.to_xrpl(), indent=2))

# Submit, sign, and wait for validation ----------------------
print("\n=== Submitting cross-currency Payment ===\n")
response = submit_and_wait(payment_tx, client, sender)

result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Error: payment failed with {result_code}")
    sys.exit(1)

# Credit the amount that ACTUALLY arrived, from metadata, never the Amount field
print("\n=== Payment delivered ===\n")
print("delivered_amount:", response.result["meta"]["delivered_amount"])
# End cross-currency payment
