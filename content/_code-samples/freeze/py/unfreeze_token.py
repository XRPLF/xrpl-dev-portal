from xrpl.clients import JsonRpcClient
from xrpl.models import IssuedCurrencyAmount, TrustSet, TrustSetFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnet

token_name = "USD"

# Amount a trustline can handle
value = "0"
print("Generating two test wallets...")

# Address to unfreeze trustline
target_addr = generate_faucet_wallet(client=client).address
print("Successfully generated the target account")

# Sender wallet
sender_wallet = generate_faucet_wallet(client=client)
print("Successfully generated the sender account")

print("Successfully generated test wallets")

# Build trustline freeze transaction
trustset = TrustSet(account=sender_wallet.address, limit_amount=IssuedCurrencyAmount(
    currency=token_name,
    issuer=target_addr,
    value = value 
),
flags=TrustSetFlag.TF_CLEAR_FREEZE)

print("prepared and submitting TF_CLEAR_FREEZE transaction")

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(trustset, client, sender_wallet)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
if stxn_result["meta"]["TransactionResult"] == "tesSUCCESS":
  print(f'Successfully enabled no freeze for {sender_wallet.address}')
if stxn_result["meta"]["TransactionResult"] == "tecNO_LINE_REDUNDANT":
  print("This was used on an account which didn't have a trustline yet. To try this out, modify `target_addr` to point to an account with a frozen trustline, and make sure the currency code matches.")
else:  
  print(f"Transaction failed with {stxn_result['meta']['TransactionResult']}")
  
print(stxn_result["hash"])
