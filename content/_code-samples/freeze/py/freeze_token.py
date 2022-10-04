from xrpl.clients import JsonRpcClient
from xrpl.models import IssuedCurrencyAmount, TrustSet
from xrpl.models.transactions import TrustSetFlag
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to testnet

token_name = "FOO"

# Amount a trustline can handle, for this transaction it is set to 0
value = "0"

target_addr = generate_faucet_wallet(client=client).classic_address

sender_wallet = generate_faucet_wallet(client=client)

# Build trustline freeze transaction
trustset = TrustSet(account=sender_wallet.classic_address, limit_amount=IssuedCurrencyAmount(
    currency= token,
    issuer=target_addr,
    value = value),
    flags=TrustSetFlag.TF_SET_FREEZE) 

# Sign transaction
stxn = safe_sign_and_autofill_transaction(trustset, sender_wallet, client)

# Submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# Parse response for result
stxn_result = stxn_response.result

# Print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
