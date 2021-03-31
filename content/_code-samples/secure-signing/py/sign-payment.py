# Define signer address
import os  
my_secret = os.getenv("MY_SECRET")
from xrpl.wallet import Wallet
wallet = Wallet(seed="MY_SECRET")
print(wallet.classic_address) # "raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q"

from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
my_payment = Payment(
    account=test_wallet_1.classic_address,
    amount=xrp_to_drops(22),
    fee="10",
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    sequence=16126889,
)
print("Payment object:", my_payment)

# Sign transaction -------------------------------------------------------------
import xrpl.transaction 
signed = xrpl.transaction.safe_sign_transaction(my_payment, test_wallet_1)
print("Signed transaction blob:", signed)
