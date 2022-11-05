from xrpl.clients import JsonRpcClient
from xrpl.models import AccountSet, AccountSetFlag
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import Wallet, generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnet


# generate wallet
sender_wallet = generate_faucet_wallet(client=client)

print("Successfully generated test wallet")

# build accountset transaction to disable freezing
accountset = AccountSet(account=sender_wallet.classic_address, set_flag=AccountSetFlag.ASF_NO_FREEZE)

# sign transaction
stxn = safe_sign_and_autofill_transaction(accountset, sender_wallet, client)

print("Now sending an AccountSet transaction to set the ASF_NO_FREEZE flag...")

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)


# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
if stxn_result["meta"]["TransactionResult"] == "tesSUCCESS":
  print(f'Successfully enabled no freeze for {sender_wallet.classic_address}')
  print(stxn_result["hash"])
 
