from xrpl.clients import JsonRpcClient
from xrpl.models import AccountSet, AccountSetAsfFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnet


# generate wallet
sender_wallet = generate_faucet_wallet(client=client)

print("Successfully generated test wallet")

# build accountset transaction to disable freezing
accountset = AccountSet(account=sender_wallet.address, set_flag=AccountSetAsfFlag.ASF_NO_FREEZE)

print("Now sending an AccountSet transaction to set the ASF_NO_FREEZE flag...")

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(accountset, client, sender_wallet)


# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
if stxn_result["meta"]["TransactionResult"] == "tesSUCCESS":
  print(f'Successfully enabled no freeze for {sender_wallet.address}')
  print(stxn_result["hash"])

