from xrpl.core import keypairs 

# Define network client
from xrpl.clients import JsonRpcClient
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Define signer address
from xrpl.wallet import Wallet
test_wallet_1 = Wallet(seed="shrPSF6vV3v3yoND9J3NeKks6M3xd")
print(test_wallet_1.classic_address) # "raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q"

# Prepate the tranaaction
from xrpl.ledger import get_latest_validated_ledger_sequence
current_validated_ledger = get_latest_validated_ledger_sequence(client)
min_ledger = current_validated_ledger + 1
max_ledger = min_ledger + 20

from xrpl.models.transactions import Payment
# not working in testing
# from xrpl.utils import xrp_to_drops
my_payment = Payment(
    account=test_wallet_1.classic_address,
    amount="2200000",
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    sequence=test_wallet_1.next_sequence_num,
)
print("Payment object:", my_payment)
print(f"Can be validated in ledger range: {min_ledger} - {max_ledger}")

# Sign transaction -------------------------------------------------------------
import xrpl.transaction 
signed = xrpl.transaction.safe_sign_transaction(my_payment, test_wallet_1)
print("Signed transaction blob:", signed)
