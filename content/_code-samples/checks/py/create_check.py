from datetime import datetime, timedelta

from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCreate, IssuedCurrencyAmount
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time, str_to_hex, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

"""Create a token check"""

check_receiver_addr = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Example: send back to Testnet Faucet

token_name = "USD" 

amount_to_deliver = 10.00

token_issuer = "r9CEVt4Cmcjt68ME6GKyhf2DyEGo2rG8AW"

# Set check to expire after 5 days
expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=5))

# Generate wallet
sender_wallet = generate_faucet_wallet(client=client)

# Build check create transaction
check_txn = CheckCreate(account=sender_wallet.address, destination=receiver_addr,
send_max=IssuedCurrencyAmount(
    currency=str_to_hex(token), 
    issuer=issuer,
    value=amount),
    expiration=expiry_date)

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(check_txn, client, sender_wallet)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])


############### CREATE XRP CHECK ################################
"""Create xrp check"""


check_receiver_addr = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Example: send back to Testnet Faucet

amount_to_deliver = 10.00

# Set check to expire after 5 days
expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=5))


# Generate wallet
sender_wallet = generate_faucet_wallet(client=client)

# Build check create transaction
check_txn = CheckCreate(account=sender_wallet.address,
        destination=receiver_addr,
        send_max=xrp_to_drops(amount),
        expiration=expiry_date)

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(check_txn, client, sender_wallet)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
