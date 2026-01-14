import json
from datetime import datetime, timedelta, UTC
from time import sleep

from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCreate, EscrowCancel
from xrpl.models.requests import AccountObjects, Ledger, Tx
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time, ripple_time_to_datetime, get_balance_changes
from xrpl.wallet import generate_faucet_wallet

# Set up client and get a wallet
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client, debug=True)
# destination_address = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Testnet faucet
# Alternative: Get another account to send the escrow to. Use this if you get
# a tecDIR_FULL error trying to create escrows to the Testnet faucet.
destination_address = generate_faucet_wallet(client, debug=True).address

# Create an escrow that won't be finished --------------------------------------
cancel_delay = 30
cancel_after = datetime.now(tz=UTC) + timedelta(seconds=cancel_delay)
print("This escrow will expire after", cancel_after)
cancel_after_rippletime = datetime_to_ripple_time(cancel_after)
# Use a crypto-condition that nobody knows the fulfillment for
condition_hex = "A02580200000000000000000000000000000000000000000000000000000000000000000810120"
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

result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"EscrowCreate failed with result code {result_code}")
    exit(1)

# Wait for the escrow to expire ------------------------------------------------
# Since ledger close times can be rounded by up to 10 seconds, wait an extra
# 10 seconds to make sure the escrow has officially expired.
print(f"Waiting {cancel_delay + 10} seconds for the escrow to expire.")
sleep(cancel_delay + 10)

# Look up the official close time of the validated ledger ----------------------
validated_ledger = client.request(Ledger(ledger_index="validated"))
close_time = validated_ledger.result["ledger"]["close_time"]
print("Latest validated ledger closed at", 
    ripple_time_to_datetime(close_time)
)
ledger_hash = validated_ledger.result["ledger"]["ledger_hash"]

# Look up escrows connected to the account, handling pagination ----------------
expired_escrow = None
marker = None
while True:
    try:
        response = client.request(AccountObjects(
            account=wallet.address,
            ledger_hash=ledger_hash,
            type="escrow",
            marker=marker
        ))
    except Exception as e:
        print(f"Error: account_objects failed: {e}")
        exit(1)

    for escrow in response.result["account_objects"]:
        if "CancelAfter" not in escrow:
            print("This escrow does not have an expiration")
        elif escrow["CancelAfter"] < close_time:
            print("This escrow has expired.")
            expired_escrow = escrow
            break
        else:
            expiration_time = ripple_time_to_datetime(escrow["CancelAfter"])
            print(f"This escrow expires at {expiration_time}.")
    
    if expired_escrow:
        # Found an expired escrow, stop paginating
        break
    
    if "marker" in response.result.keys():
        marker=marker
    else:
        # This is the last page of results
        break

if not expired_escrow:
    print("Did not find any expired escrows.")
    exit(1)

# Find the sequence number of the expired escrow -------------------------------
response = client.request(Tx(transaction=expired_escrow["PreviousTxnID"]))
if not response.is_successful():
    print("Couldn't get transaction. Maybe this server doesn't have enough "
            "transaction history available?")
    exit(1)

if response.result["tx_json"]["TransactionType"] == "EscrowCreate":
    # Save this sequence number for canceling the escrow
    escrow_seq = response.result["tx_json"]["Sequence"]
    if escrow_seq == 0:
        # This transaction used a Ticket, so use the TicketSequence instead.
        escrow_seq = response.result["tx_json"]["TicketSequence"]
else:
    # Currently, this is impossible since no current transaction can update
    # an escrow without finishing or canceling it. But in the future, if
    # that becomes possible, you would have to look at the transaction
    # metadata to find the previous transaction and repeat until you found
    # the transaction that created the escrow.
    print("The escrow's previous transaction wasn't EscrowCreate!")
    exit(1)

# Send EscrowCancel transaction ------------------------------------------------
escrow_cancel = EscrowCancel(
    account=wallet.address,
    owner=expired_escrow["Account"],
    offer_sequence=escrow_seq
)
print("Signing and submitting the EscrowCancel transaction.")
response2 = submit_and_wait(escrow_cancel, client, wallet, autofill=True)
print(json.dumps(response2.result, indent=2))

result_code = response2.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"EscrowCancel failed with result code {result_code}")
    exit(1)

print("Escrow canceled. Balance changes:")
print(json.dumps(get_balance_changes(response2.result["meta"]), indent=2))
