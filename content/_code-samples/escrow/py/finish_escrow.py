from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowFinish
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

# Complete an escrow
# Cannot be called until the finish time is reached

# Required fields (modify to match an escrow you create)
escrow_creator = generate_faucet_wallet(client=client).address

escrow_sequence = 27641268

# Optional fields

# Crypto condition that must be met before escrow can be completed, passed on escrow creation
condition = "A02580203882E2EB9B44130530541C4CC360D079F265792C4A7ED3840968897CB7DF2DA1810120"

# Crypto fulfillment of the condtion 
fulfillment = "A0228020AED2C5FE4D147D310D3CFEBD9BFA81AD0F63CE1ADD92E00379DDDAF8E090E24C"

# Sender wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build escrow finish transaction
finish_txn = EscrowFinish(account=sender_wallet.address, owner=escrow_creator, offer_sequence=escrow_sequence, condition=condition, fulfillment=fulfillment)

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(finish_txn, client, sender_wallet)

# Parse response and return result
stxn_result = stxn_response.result

# Parse result and print out the transaction result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
