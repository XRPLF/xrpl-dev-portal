from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from datetime import datetime, timedelta
from xrpl.utils import xrp_to_drops
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import datetime_to_ripple_time
from xrpl.models import EscrowCreate                             

# Create Escrow

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # instanstiate ripple client

amount = 10.000 # amount to escrow

receiver_addr = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Example: send back to Testnet Faucet

# make claimable escrow after 3 days
claim_date = datetime_to_ripple_time(datetime.now() + timedelta(days=3))

# escrow will expire after 5 days
expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=5))

# optional field
# You can optionally use a Crypto Condition to allow for dynamic release of funds. For example:
condition = "A02580205A0E9E4018BE1A6E0F51D39B483122EFDF1DDEF3A4BE83BE71522F9E8CDAB179810120" # do not use in production


# generate sender wallet with seed
sender_wallet = generate_faucet_wallet(client=client)

# build escrow create transaction
create_txn = EscrowCreate(
    account=sender_wallet.classic_address,
    amount=xrp_to_drops(amount), 
    destination=receiver_addr,
    finish_after=claim_date, 
    cancel_after=expiry_date,
    condition=condition)

# sign transaction with sender wallet
stxn = safe_sign_and_autofill_transaction(create_txn, sender_wallet, client)

# send signed transaction and wait
stxn_response = send_reliable_submission(stxn, client)

# return result of transaction
stxn_result = stxn_response.result

# parse result and print out the trnasaction result and transaction hash 
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
