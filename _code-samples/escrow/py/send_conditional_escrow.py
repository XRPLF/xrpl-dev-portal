import json
from datetime import datetime, timedelta, UTC
from os import urandom

from cryptoconditions import PreimageSha256
from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCreate, EscrowFinish
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time
from xrpl.wallet import generate_faucet_wallet

# Set up client and get a wallet
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client, debug=True)
#destination_address = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Testnet faucet
# Alternative: Get another account to send the escrow to. Use this if you get
# a tecDIR_FULL error trying to create escrows to the Testnet faucet.
destination_address = generate_faucet_wallet(client, debug=True).address

# Create the crypto-condition for release -----------------------------------
preimage = urandom(32)
fulfillment = PreimageSha256(preimage=preimage)
condition_hex = fulfillment.condition_binary.hex().upper()
fulfillment_hex = fulfillment.serialize_binary().hex().upper()
print("Condition:", condition_hex)
print("Fulfillment:", fulfillment_hex)

# Set the escrow expiration -------------------------------------------------
cancel_delay = 300
cancel_after = datetime.now(tz=UTC) + timedelta(seconds=cancel_delay)
print("This escrow will expire after", cancel_after)
cancel_after_rippletime = datetime_to_ripple_time(cancel_after)

# Send EscrowCreate transaction ---------------------------------------------
escrow_create = EscrowCreate(
    account=wallet.address,
    destination=destination_address,
    amount="123456", # drops of XRP
    condition=condition_hex,
    cancel_after=cancel_after_rippletime
)

print("Signing and submitting the EscrowCreate transaction.")
response = submit_and_wait(escrow_create, client, wallet, autofill=True)
print(json.dumps(response.result, indent=2))

# Check result of submitting ------------------------------------------------
result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"EscrowCreate failed with result code {result_code}")
    exit(1)

# Save the sequence number so you can identify the escrow later
escrow_seq = response.result["tx_json"]["Sequence"]

# Send EscrowFinish transaction ---------------------------------------------
escrow_finish = EscrowFinish(
    account=wallet.address,
    owner=wallet.address,
    offer_sequence=escrow_seq,
    condition=condition_hex,
    fulfillment=fulfillment_hex
)
print("Signing and submitting the EscrowFinish transaction.")
response2 = submit_and_wait(escrow_finish, client, wallet, autofill=True)
print(json.dumps(response2.result, indent=2))

result_code = response2.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"EscrowFinish failed with result code {result_code}")
    exit(1)

print("Escrow finished successfully.")
