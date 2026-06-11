import asyncio
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import AccountLines
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.models.transactions import Payment, TrustSet
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

# Load preconfigured issuer, sender, and receiver accounts.
with open("send_trust_line_token_setup.json") as f:
    setup_data = json.load(f)

issuer = Wallet.from_seed(setup_data["issuer"]["seed"])
sender = Wallet.from_seed(setup_data["sender"]["seed"])
receiver = Wallet.from_seed(setup_data["receiver"]["seed"])
currency_code = "FOO"

print(f"Issuer address:   {issuer.address}")
print(f"Sender address:   {sender.address}")
print(f"Receiver address: {receiver.address}")

# Create trust line ----------------------
# The receiver opts in to the token by creating a trust line to the issuer.
# The limit_amount sets the maximum amount of the token the receiver will hold.
print("\n=== Creating trust line from receiver to issuer... ===\n")
trust_set_tx = TrustSet(
    account=receiver.address,
    limit_amount=IssuedCurrencyAmount(
        currency=currency_code,
        issuer=issuer.address,
        value="1000000000",
    ),
)
print(json.dumps(trust_set_tx.to_xrpl(), indent=2))

trust_set_response = submit_and_wait(trust_set_tx, client, receiver)
result_code = trust_set_response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Error: Unable to create trust line: {result_code}")
    sys.exit(1)
print("Trust line created from receiver to issuer!")
print(f"Explorer link: https://testnet.xrpl.org/transactions/{trust_set_response.result['hash']}")

# Check initial balances ----------------------
# get_trust_line_balance returns the trust line balance between `account` and
# `peer` for the given currency.
def get_trust_line_balance(account, currency, peer):
    response = client.request(AccountLines(
        account=account,
        peer=peer,
        ledger_index="validated",
    ))
    for line in response.result.get("lines", []):
        if line["currency"] == currency:
            return line["balance"]
    return "0"

print(f"\n=== Checking initial {currency_code} balances... ===\n")
print("Holders' perspective:")
print(f"  Sender's balance:   {get_trust_line_balance(sender.address, currency_code, issuer.address)}")
print(f"  Receiver's balance: {get_trust_line_balance(receiver.address, currency_code, issuer.address)}")
print("Issuer's perspective:")
print(f"  Owed to sender:   {get_trust_line_balance(issuer.address, currency_code, sender.address)}")
print(f"  Owed to receiver: {get_trust_line_balance(issuer.address, currency_code, receiver.address)}")

# Send issued token ----------------------
# The sender pays the receiver with the issued currency.
send_quantity = "100"
print(f"\n=== Sending {currency_code} payment... ===\n")
payment_tx = Payment(
    account=sender.address,
    destination=receiver.address,
    amount=IssuedCurrencyAmount(
        currency=currency_code,
        issuer=issuer.address,
        value=send_quantity,
    ),
)
print(json.dumps(payment_tx.to_xrpl(), indent=2))

payment_response = submit_and_wait(payment_tx, client, sender)
result_code = payment_response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Error: Unable to send token: {result_code}")
    sys.exit(1)
print("Payment successful!")
print(f"Explorer link: https://testnet.xrpl.org/transactions/{payment_response.result['hash']}")

# Verify balances ----------------------
# Check account balances after the payment.
print(f"\n=== Checking final {currency_code} balances... ===\n")
print("Holders' perspective:")
print(f"  Sender's balance:   {get_trust_line_balance(sender.address, currency_code, issuer.address)}")
print(f"  Receiver's balance: {get_trust_line_balance(receiver.address, currency_code, issuer.address)}")
print("Issuer's perspective:")
print(f"  Owed to sender:   {get_trust_line_balance(issuer.address, currency_code, sender.address)}")
print(f"  Owed to receiver: {get_trust_line_balance(issuer.address, currency_code, receiver.address)}")
