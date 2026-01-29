import json
from datetime import datetime, timedelta, UTC
from time import sleep

from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCreate, EscrowFinish
from xrpl.models.requests import Ledger
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time, ripple_time_to_datetime
from xrpl.wallet import generate_faucet_wallet

# Set up client and get a wallet
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client, debug=True)
# destination_address = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Testnet faucet
# Alternative: Get another account to send the escrow to. Use this if you get
# a tecDIR_FULL error trying to create escrows to the Testnet faucet.
destination_address = generate_faucet_wallet(client, debug=True).address

# Set the escrow finish time ------------------------------------------------
delay = 30
finish_after = datetime.now(tz=UTC) + timedelta(seconds=delay)
print("This escrow will mature after", finish_after)
finish_after_rippletime = datetime_to_ripple_time(finish_after)

# Send EscrowCreate transaction ---------------------------------------------
escrow_create = EscrowCreate(
    account=wallet.address,
    destination=destination_address,
    amount="123456", # drops of XRP
    finish_after=finish_after_rippletime
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
print(f"Escrow sequence is {escrow_seq}.")

# Wait for the escrow to be finishable --------------------------------------
sleep(delay)

# Check if escrow can be finished -------------------------------------------
escrow_ready = False
while not escrow_ready:
    validated_ledger = client.request(Ledger(ledger_index="validated"))
    ledger_close_time = validated_ledger.result["ledger"]["close_time"]
    print("Latest validated ledger closed at", 
        ripple_time_to_datetime(ledger_close_time)
    )
    if ledger_close_time > finish_after_rippletime:
        escrow_ready = True
        print("Escrow is mature.")
    else:
        time_difference = finish_after_rippletime - ledger_close_time
        if time_difference == 0:
            time_difference = 1
        print(f"Waiting another {time_difference} seconds.")
        sleep(time_difference)


# Send EscrowFinish transaction ---------------------------------------------
escrow_finish = EscrowFinish(
    account=wallet.address,
    owner=wallet.address,
    offer_sequence=escrow_seq
)
print("Signing and submitting the EscrowFinish transaction.")
response2 = submit_and_wait(escrow_finish, client, wallet, autofill=True)
print(json.dumps(response2.result, indent=2))

result_code = response2.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"EscrowFinish failed with result code {result_code}")
    exit(1)

print("Escrow finished successfully.")
