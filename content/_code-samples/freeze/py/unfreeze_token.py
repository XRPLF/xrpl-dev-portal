from xrpl.clients import JsonRpcClient
from xrpl.models import IssuedCurrencyAmount, TrustSet
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import Wallet

from Misc import symbol_to_hex

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnet

# token helper method
def symbol_to_hex(symbol: str = None) -> str:
    """symbol_to_hex."""
    if len(symbol) > 3:
        bytes_string = bytes(str(symbol).encode('utf-8'))
        return bytes_string.hex().upper().ljust(40, '0')
    return symbol

# your issuing account's seed
issuer_seed = "sxxxxxxxxxxxxxxxxxxxxx"

# token name
token = "LegitXRP"

# amount a trustline can handle, for this transaction it is set to 0
value = "0"

# address to ufreeze trustline
target_addr = "rxxxxxxxxxxxxxxxxxxxxx"

# generate wallet
sender_wallet = Wallet(seed=issuer_seed, sequence=0)

# build trustline freeze transaction
trustset = TrustSet(account=sender_wallet.classic_address, limit_amount=IssuedCurrencyAmount(
    currency=symbol_to_hex(token),
    issuer=target_addr,
    value = "0"
),
flags=2097152)# flag to unfreeze the trust line.

# sign transaction
stxn = safe_sign_and_autofill_transaction(trustset, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])


