from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet
from xrpl.transaction import safe_sign_transaction, send_reliable_submission
from xrpl.account import get_next_valid_seq_number
from xrpl.ledger import get_latest_validated_ledger_sequence
from xrpl.wallet import Wallet
from xrpl.core import keypairs

myAddr = "r31FLxNkfFJwRXbJw82RYB6Fa7jmfA3ix1"
mySeed = "sn51LT5QeaPYhjM1HL9-----------"

# Derive and initialize wallet
public, private = keypairs.derive_keypair(mySeed)
wallet_from_seed = Wallet(mySeed, 0)

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Construct AccountSet transaction
tx = AccountSet(
    account=myAddr,
    fee="10",
    sequence=get_next_valid_seq_number(address=myAddr, client=client),
    last_ledger_sequence=get_latest_validated_ledger_sequence(client=client)+20,
)

# Sign the transaction locally & submit transaction and verify its validity on the ledger
my_tx_payment_signed = safe_sign_transaction(transaction=tx, wallet=wallet_from_seed)
response = send_reliable_submission(transaction=my_tx_payment_signed, client=client)
result = response.result["meta"]["TransactionResult"]

if result == "tesSUCCESS":
    print("Transaction successful!")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
