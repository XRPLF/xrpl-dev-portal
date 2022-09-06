from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from xrpl.models import CheckCancel
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork


"""cancel a check"""
# sender is the check creator or recipient
# If the Check has expired, any address can cancel it


# check id
check_id = str

# create wallet object
sender_wallet = generate_faucet_wallet(client=client)

# build check cancel transaction
check_txn = CheckCancel(account=sender_wallet.classic_address, check_id=check_id)

# sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])

