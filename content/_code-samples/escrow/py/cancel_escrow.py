from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCancel
from xrpl.transaction import (autofill_and_sign,
                              send_reliable_submission)
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

# Cancel an escrow
# An Escrow can only be canceled if it was created with a CancelAfter time

escrow_sequence = 30215126

# Sender wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build escrow cancel transaction
cancel_txn = EscrowCancel(account=sender_wallet.classic_address, owner=sender_wallet.classic_address, offer_sequence=escrow_sequence)

# Sign and submit transaction
stxn = autofill_and_sign(cancel_txn, sender_wallet, client)
stxn_response = send_reliable_submission(stxn, client)

# Parse response and return result
stxn_result = stxn_response.result

# Parse result and print out the transaction result and transaction hash 
print(stxn_result["meta"]["TransactionResult"]) 
print(stxn_result["hash"])
