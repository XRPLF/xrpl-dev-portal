from xrpl.clients import JsonRpcClient
from xrpl.models import IssuedCurrencyAmount, TrustSet
from xrpl.models.transactions import TrustSetFlag
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to testnet

token_name = "FOO"

# Amount a trustline can handle, for this transaction it is set to 0
value = "100"

target_addr = generate_faucet_wallet(client=client).classic_address

sender_wallet = generate_faucet_wallet(client=client)

print("Successfully generated test wallets")

# Build trustline freeze transaction
trustset = TrustSet(account=sender_wallet.classic_address, limit_amount=IssuedCurrencyAmount(
    currency= token_name,
    issuer=target_addr,
    value = value),
    flags=TrustSetFlag.TF_SET_FREEZE) 

# Sign transaction
stxn = safe_sign_and_autofill_transaction(trustset, sender_wallet, client)

print("Now setting a trustline with the TF_SET_FREEZE flag enabled...")

# Submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

if(stxn_result["meta"]["TransactionResult"] == 'tesSUCCESS'):
    print(f"Froze {token_name} issued by {target_addr} for address {sender_wallet.classic_address}")
if(stxn_result["meta"]["TransactionResult"] == 'tesSUCCESS'):
    print(f"Froze {token_name} issued by {target_addr} for address {sender_wallet.classic_address}")
