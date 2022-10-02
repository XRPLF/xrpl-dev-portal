from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCash, IssuedCurrencyAmount
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import str_to_hex, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

# Connect to a network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")


# Cash an xrp check

# Check id
check_id = "F944CB379DEE18EFDA7A58A4F81AF1A98C46E54A8B9F2D268F1E26610BC0EB03"

# Amount to cash
amount = 10.00

# Generate wallet
sender_wallet = generate_faucet_wallet(client=client)

# Build check cash transaction
check_txn = CheckCash(account=sender_wallet.classic_address, check_id=check_id, amount=xrp_to_drops(amount))

# Sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# Submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])



#################### cash token check #############################

# Cash token check

# Token name
token = "USD" 

# Amount of token to deliver
amount = 10.00

# Token issuer address
issuer = generate_faucet_wallet(client=client).classic_address

# Create sender wallet object
sender_wallet = generate_faucet_wallet(client=client)

# Build check cash transaction
check_txn = CheckCash(account=sender_wallet.classic_address, check_id=check_id, amount=IssuedCurrencyAmount(
    currency=str_to_hex(token),
    issuer=issuer,
    value=amount))

# Sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# Submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
