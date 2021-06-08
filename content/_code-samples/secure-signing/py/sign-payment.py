# Define signer address
import os  
my_secret = os.getenv("MYSECRET")
from xrpl.wallet import Wallet
wallet = Wallet(seed=my_secret, sequence=16237283)
print(wallet.classic_address) # "raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q"

from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
my_payment = Payment(
    account=wallet.classic_address,
    amount=xrp_to_drops(22),
    fee="10",
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    sequence=wallet.sequence, # this needs to be incremented upon every successful transaction
)
print("Payment object:", my_payment)

# Sign transaction -------------------------------------------------------------
import xrpl.transaction 
signed = xrpl.transaction.safe_sign_transaction(my_payment, wallet)
print("Signed transaction blob:", signed)
