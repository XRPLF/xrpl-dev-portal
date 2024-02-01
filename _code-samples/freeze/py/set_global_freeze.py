from xrpl.clients import JsonRpcClient
from xrpl.models import AccountSet, AccountSetAsfFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to testnet

# Sender wallet object
sender_wallet = generate_faucet_wallet(client)

print("Successfully generated test wallet")

# Build accountset transaction to enable global freeze
accountset = AccountSet(account=sender_wallet.address,
    set_flag=AccountSetAsfFlag.ASF_GLOBAL_FREEZE)

print("Preparing and submitting Account set transaction with ASF_GLOBAL_FREEZE ...")

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(accountset, client, sender_wallet)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
if stxn_result["meta"]["TransactionResult"] == "tesSUCCESS":
  print(f'Successfully enabled global freeze for {sender_wallet.address}')
  print(stxn_result["hash"])
