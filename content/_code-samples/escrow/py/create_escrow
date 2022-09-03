
from xrpl.wallet import Wallet
from xrpl.utils import xrp_to_drops
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.models import EscrowCreate                             

# Create Escrow

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # instanstiate ripple client

sender_seed = "sxxxxxxxxxxxxxxxxxxxxxxxxxx" # sender seed
amount = 10.000 # amount to escrow
receiver_addr = "rxxxxxxxxxxxxxxxxxxxxxxxxxxx" # receiver address

claim_date = int # date when and after ecsrow can be claimed `xrpl.utils.datetime_to_ripple_time()`

expiry_date = int # date when and after escrow expires `xrpl.utils.datetime_to_ripple_time()`

# optional field
condition = str # cryptic condition that must be met before escrow can be completed | see....


# generate sender wallet with seed
sender_wallet = Wallet(seed=sender_seed, sequence=0)

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
