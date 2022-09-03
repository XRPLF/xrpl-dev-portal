import random
from os import urandom

from cryptoconditions import PreimageSha256

# """Generate a condition and fulfillment for escrows"""

# whatever you please
secret = urandom(random.randint(32, 64))

# generate cryptic image from secret
fufill = PreimageSha256(preimage=secret)

# parse image and return the condition and fulfillment
condition = str.upper(fufill.condition_binary.hex()) # conditon
fulfillment = str.upper(fufill.serialize_binary().hex()) # fulfillment

# print condition and fulfillment
print(f"condition: {condition} \n fulfillment {fulfillment}")
