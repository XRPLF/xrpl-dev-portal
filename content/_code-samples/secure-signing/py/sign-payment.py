# Define signer address
import os  
my_secret = os.getenv("MYSECRET")
from xrpl.wallet import Wallet
wallet = Wallet.from_seed(seed=my_secret)
print(wallet.address)  # "raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q"

# For offline signing, you need to know your address's next Sequence number.
# Alternatively, you could use a Ticket in place of the Sequence number.
# This is useful when you need multiple signatures and may want to process transactions out-of-order.
# For details, see: https://xrpl.org/tickets.html
sequence = 0

from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
my_payment = Payment(
    account=wallet.address,
    amount=xrp_to_drops(22),
    fee="10",
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    sequence=sequence,
)
print("Payment object:", my_payment)

# Sign transaction -------------------------------------------------------------
import xrpl.transaction 
signed = xrpl.transaction.sign(my_payment, wallet)
print("Signed transaction blob:", signed)
