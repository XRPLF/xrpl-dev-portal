from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import xrp_to_drops
from xrpl.wallet import Wallet, generate_faucet_wallet

from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCreate, IssuedCurrencyAmount

# create a client
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")


# cash an xrp check

# check id
check_id = str

# amount to cash
amount = 10.00

# generate wallet from seed
sender_wallet =generate_faucet_wallet(client=client)

# build check cash transaction
check_txn = CheckCash(account=sender_wallet.classic_address, check_id=check_id, amount=xrp_to_drops(amount))

# sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])



#################### cash token check #############################

# cash token check

# token name
token = "LegitXRP" 

# amount of token to deliver
amount = 10.00

# token issuer address
issuer = "rxxxxxxxxxxxxxxxxxxxxxxxx"

# create wallet object
sender_wallet = sender_wallet =generate_faucet_wallet(client=client)

# build check cash transaction
check_txn = CheckCash(account=sender_wallet.classic_address, check_id=check_id, amount=IssuedCurrencyAmount(
    currency=token,
    issuer=issuer,
    value=amount))

# sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
