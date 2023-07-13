from xrpl.wallet import generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCancel
from xrpl.transaction import submit_and_wait

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

"""Cancel a check"""
# Sender is the check creator or recipient
# If the Check has expired, any address can cancel it

# Check id
check_id = "F944CB379DEE18EFDA7A58A4F81AF1A98C46E54A8B9F2D268F1E26610BC0EB03"

# Create wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build check cancel transaction
check_txn = CheckCancel(account=sender_wallet.address, check_id=check_id)

# Sign and submit transaction
stxn_response = submit_and_wait(check_txn, client, sender_wallet)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])

