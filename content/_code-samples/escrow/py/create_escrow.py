from datetime import datetime, timedelta

from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCreate
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

# Create Escrow

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to client

amount_to_escrow = 10.000 

receiver_addr = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Example: send back to Testnet Faucet

# Escrow will be available to claim after 3 days
claim_date = datetime_to_ripple_time(datetime.now() + timedelta(days=3))

# Escrow will expire after 5 days
expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=5))

# Optional field
# You can optionally use a Crypto Condition to allow for dynamic release of funds. For example:
condition = "A02580205A0E9E4018BE1A6E0F51D39B483122EFDF1DDEF3A4BE83BE71522F9E8CDAB179810120" # do not use in production

# sender wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build escrow create transaction
create_txn = EscrowCreate(
    account=sender_wallet.address,
    amount=xrp_to_drops(amount_to_escrow), 
    destination=receiver_addr,
    finish_after=claim_date, 
    cancel_after=expiry_date,
    condition=condition)

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(create_txn, client, sender_wallet)

# Return result of transaction
stxn_result = stxn_response.result


# Parse result and print out the neccesary info
print(stxn_result["Account"])
print(stxn_result["Sequence"])

print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
