from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.models EscrowFinish
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork

# Complete an escrow
# cannot be called until the finish time is reached


escrow_creator = generate_faucet_wallet(client=client).classic_address # ecsrow creator/ sender address
escrow_seq = int # escrow sequence

# optional fields

# cryptic condition that must be met before escrow can be completed, passed on escrow creation
condition = str 

# cryptic fulfillment of the condtion 
fulfillment = str

# generate wallet object
sender_wallet = generate_faucet_wallet(client=client)

# build escrow finish transaction
finish_txn = EscrowFinish(account=sender_wallet.classic_address, owner=escrow_creator, offer_sequence=escrow_seq, condition=condition, fulfillment=fulfillment)

# sign transaction with wallet
stxn = safe_sign_and_autofill_transaction(cancel_txn, sender_wallet, client)

# send transaction and wait for response
stxn_response = send_reliable_submission(stxn, client)

# parse response and return result
stxn_result = stxn_response.result

# parse result and print out the transaction result and transaction hash 
print(stxn_result["meta"]["TransactionResult"]) 
print(stxn_result["hash"])
