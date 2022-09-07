from xrpl.clients import JsonRpcClient
from xrpl.models import IssuedCurrencyAmount, TrustSet
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import str_to_hex
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnet

# token name
token = "LegitXRP"

# amount a trustline can handle, for this transaction it is set to 0
value = "0"

# address to freeze trustline
target_addr = generate_faucet_wallet(client=client).classic_address

# generate wallet
sender_wallet = generate_faucet_wallet(client=client)

# build trustline freeze transaction
trustset = TrustSet(account=sender_wallet.classic_address, limit_amount=IssuedCurrencyAmount(
    currency=str_to_hex(token),
    issuer=target_addr,
    value = value
),
flags=1048576) # flag to freeze the trust line. check all trustset flags here https://xrpl.org/trustset.html#trustset-flags

# sign transaction
stxn = safe_sign_and_autofill_transaction(trustset, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
