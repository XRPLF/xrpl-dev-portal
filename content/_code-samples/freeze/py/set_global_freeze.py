from xrpl.clients import JsonRpcClient
from xrpl.models import AccountSet, AccountSetFlag
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to testnet

# Sender wallet object
sender_wallet = generate_faucet_wallet(client)

print("Successfully generated test wallet")

# Build accountset transaction to enable global freeze
accountset = AccountSet(account=sender_wallet.classic_address,
    set_flag=AccountSetFlag.ASF_GLOBAL_FREEZE)

print("Preparing and submitting Account set transaction with ASF_GLOBAL_FREEZE ...")

# Sign and submit transaction
stxn = safe_sign_and_autofill_transaction(accountset, sender_wallet, client)
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
if stxn_result["meta"]["TransactionResult"] == "tesSUCCESS":
  print(f'Successfully enabled global freeze for {sender_wallet.classic_address}')
  print(stxn_result["hash"])
