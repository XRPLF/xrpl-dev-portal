from datetime import datetime, timedelta

from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCreate, IssuedCurrencyAmount
from xrpl.transaction import (autofill_and_sign,
                              send_reliable_submission)
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
check_txn = CheckCreate(account=sender_wallet.classic_address, destination=check_receiver_addr,
send_max=IssuedCurrencyAmount(
    currency=token_name, 
    issuer=token_issuer, 
    value=amount_to_deliver),
    expiration=expiry_date)

# Sign, submit transaction and wait for result
stxn = autofill_and_sign(check_txn, sender_wallet, client)
stxn_response = send_reliable_submission(stxn, client)

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
check_txn = CheckCreate(account=sender_wallet.classic_address,
        destination=check_receiver_addr,
        send_max=xrp_to_drops(amount_to_deliver),
        expiration=expiry_date)

# Sign, submit transaction and wait for result
stxn = autofill_and_sign(check_txn, sender_wallet, client)
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
