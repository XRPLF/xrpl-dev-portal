from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCancel
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

"""Cancel a check"""
# Sender is the check creator or recipient
# If the Check has expired, any address can cancel it

# Check id
check_id = "F944CB379DEE18EFDA7A58A4F81AF1A98C46E54A8B9F2D268F1E26610BC0EB03"

# Create wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build check cancel transaction
check_txn = CheckCancel(account=sender_wallet.classic_address, check_id=check_id)

# Sign and submit transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])

