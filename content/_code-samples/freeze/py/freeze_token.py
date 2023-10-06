from xrpl.clients import JsonRpcClient
from xrpl.models import IssuedCurrencyAmount, TrustSet
from xrpl.models.transactions import TrustSetFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to testnet

token_name = "FOO"

# Amount a trustline can handle, for this transaction it is set to 0
value = "100"

target_addr = generate_faucet_wallet(client=client).address

sender_wallet = generate_faucet_wallet(client=client)

print("Successfully generated test wallets")

# Build trustline freeze transaction
trustset = TrustSet(account=sender_wallet.address, limit_amount=IssuedCurrencyAmount(
    currency= token_name,
    issuer=target_addr,
    value = value),
    flags=TrustSetFlag.TF_SET_FREEZE) 

print("Now setting a trustline with the TF_SET_FREEZE flag enabled...")

# Autofill, sign, then submit transaction and wait for result
stxn_response = submit_and_wait(trustset, client, sender_wallet)

# Parse response for result
stxn_result = stxn_response.result

if(stxn_result["meta"]["TransactionResult"] == 'tesSUCCESS'):
    print(f"Froze {token_name} issued by {target_addr} for address {sender_wallet.address}")
if(stxn_result["meta"]["TransactionResult"] == 'tesSUCCESS'):
    print(f"Froze {token_name} issued by {target_addr} for address {sender_wallet.address}")
