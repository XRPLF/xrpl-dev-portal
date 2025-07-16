"""
Create, claim and verify a Payment Channel.
Reference: https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/paychannel
"""
from xrpl.clients import JsonRpcClient
from xrpl.models import (
    AccountObjects,
    PaymentChannelCreate,
    PaymentChannelClaim,
)
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit, submit_and_wait
from xrpl.account import get_balance


"""The snippet walks us through creating and claiming a Payment Channel."""

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Creating wallets as prerequisite
print("Setting up wallets...")
wallet1 = generate_faucet_wallet(client)
wallet2 = generate_faucet_wallet(client)

print("Balances of wallets before Payment Channel is claimed:")
print(f"Balance of {wallet1.address} is {get_balance(wallet1.address, client)} XRP")
print(f"Balance of {wallet2.address} is {get_balance(wallet2.address, client)} XRP")

# Create a Payment Channel and submit and wait for tx to be validated
payment_channel_create = PaymentChannelCreate(
    account=wallet1.address,
    amount="100",  # 10 XRP
    destination=wallet2.address,
    settle_delay=86400,  # 1 day in seconds
    public_key=wallet1.public_key,
)

print("Submitting a PaymentChannelCreate transaction...")
payment_channel_response = submit_and_wait(
    payment_channel_create,
    client,
    wallet1
)
print("PaymentChannelCreate transaction response:")
print(payment_channel_response.result)

# Check that the object was actually created
account_objects_request = AccountObjects(
    account=wallet1.address,
)
account_objects_response = client.request(account_objects_request)
account_objects = account_objects_response.result["account_objects"]

# Find the PayChannel object to get the correct channel ID
channel_id = None
for obj in account_objects:
    if obj["LedgerEntryType"] == "PayChannel":
        channel_id = obj["index"]
        break

if not channel_id:
    raise Exception("PayChannel not found in account objects")

print(f"PayChannel ID: {channel_id}")

# Destination claims the Payment Channel and we see the balances to verify.
payment_channel_claim = PaymentChannelClaim(
    account=wallet2.address,
    channel=channel_id,
    amount="100",
)

print("Submitting a PaymentChannelClaim transaction...")
channel_claim_response = submit_and_wait(
    payment_channel_claim,
    client,
    wallet2,
)
print("PaymentChannelClaim transaction response:")
print(channel_claim_response.result)

print("Balances of wallets after Payment Channel is claimed:")
print(f"Balance of {wallet1.address} is {get_balance(wallet1.address, client)} XRP")
print(f"Balance of {wallet2.address} is {get_balance(wallet2.address, client)} XRP")
