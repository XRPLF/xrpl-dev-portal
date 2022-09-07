from datetime import datetime, timedelta

from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCreate, IssuedCurrencyAmount
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import datetime_to_ripple_time, str_to_hex, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork

"""Create a token check"""

# check receiver address
receiver_addr = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Example: send back to Testnet Faucet

# token name
token = "LegitXRP" 

# amount of token to deliver
amount = 10.00

# token issuer address
issuer = "r9CEVt4Cmcjt68ME6GKyhf2DyEGo2rG8AW"

# check expiry date
# check will expire after 5 days
expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=5))


# generate wallet from seed
sender_wallet = generate_faucet_wallet(client=client)

# build check create transaction
check_txn = CheckCreate(account=sender_wallet.classic_address, destination=receiver_addr,
send_max=IssuedCurrencyAmount(
    currency=str_to_hex(token), 
    issuer=issuer, 
    value=amount),
    expiration=expiry_date)

# sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])



############# CREATE XRP CHECK ################################
"""Create xrp check"""


# check receiver address
receiver_addr = generate_faucet_wallet(client=client).classic_address

# amount of xrp to deliver
amount = 10.00

# check expiry date
# check will expire after 5 days
expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=5))


# generate wallet from seed
sender_wallet = generate_faucet_wallet(client=client)

# build check create transaction
check_txn = CheckCreate(account=sender_wallet.classic_address,
        destination=receiver_addr,
        send_max=xrp_to_drops(amount),
        expiration=expiry_date)

# sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
