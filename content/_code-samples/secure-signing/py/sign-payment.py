# Define signer address
import os  
my_secret = os.getenv("MYSECRET")
from xrpl.wallet import Wallet
wallet = Wallet.from_secret(my_secret)
print(wallet.classic_address) # "raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q"

from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
my_payment = Payment(
    account=wallet.classic_address,
    amount=xrp_to_drops(22),
    fee="10",
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    sequence=16237283, # this can be autofilled by the client using `autofill` 
)
print("Payment object:", my_payment)

# Sign transaction -------------------------------------------------------------
import xrpl.transaction 
signed = xrpl.transaction.sign(my_payment, wallet)
print("Signed transaction blob:", signed)
