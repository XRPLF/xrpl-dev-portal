from xrpl.clients import JsonRpcClient
from xrpl.models import AccountSet, AccountSetFlag
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import Wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnet


# sender seed
sender_seed = "sxxxxxxxxxxxxxxxxxxxxx"

# generate wallet
sender_wallet = Wallet(seed=sender_seed, sequence=0)

# build accountset transaction to disable freezing
accountset = AccountSet(account=sender_wallet.classic_address,
 set_flag=AccountSetFlag.ASF_NO_FREEZE)# flag to disable freezing for this account

# sign transaction
stxn = safe_sign_and_autofill_transaction(accountset, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
