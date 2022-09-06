from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCreate, IssuedCurrencyAmount
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import datetime_to_rippletime, xrp_to_drops

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork

"""Create a token check"""

"""Helper methods for working with token names"""
def symbol_to_hex(symbol: str = None) -> str:
    """token symbol_to_hex."""
    if len(symbol) > 3:
        bytes_string = bytes(str(symbol).encode('utf-8'))
        return bytes_string.hex().upper().ljust(40, '0')
    return symbol


# check receiver address
receiver_addr = generate_faucet_wallet(client=client).classic_address

# token name
token = "LegitXRP" 

# amount of token to deliver
amount = 10.00

# token issuer address
issuer = generate_faucet_wallet(client=client).classic_address

# check expiry date
expiry_date = int # from xrpl.utils import datetime_to_ripple_time()

# generate wallet from seed
sender_wallet = generate_faucet_wallet(client=client)

# build check create transaction
check_txn = CheckCreate(account=sender_wallet.classic_address, destination=receiver_addr,
send_max=IssuedCurrencyAmount(
    currency=symbol_to_hex(token), 
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
expiry_date = int # from xrpl.utils import datetime_to_ripple_time()

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
