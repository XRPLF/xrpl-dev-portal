from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCancel
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

# Cancel an escrow
# An Escrow can only be canceled if it was created with a CancelAfter time

escrow_sequence = 30215126

# Sender wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build escrow cancel transaction
cancel_txn = EscrowCancel(account=sender_wallet.address, owner=sender_wallet.address, offer_sequence=escrow_sequence)

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(cancel_txn, client, sender_wallet)

# Parse response and return result
stxn_result = stxn_response.result

# Parse result and print out the transaction result and transaction hash 
print(stxn_result["meta"]["TransactionResult"]) 
print(stxn_result["hash"])
