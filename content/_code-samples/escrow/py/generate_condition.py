import random
from os import urandom

from cryptoconditions import PreimageSha256

# """Generate a condition and fulfillment for escrows"""

# Generate a random preimage with at least 32 bytes of cryptographically-secure randomness.
secret = urandom(32)

# Generate cryptic image from secret
fufill = PreimageSha256(preimage=secret)

# Parse image and return the condition and fulfillment
condition = str.upper(fufill.condition_binary.hex()) # conditon
fulfillment = str.upper(fufill.serialize_binary().hex()) # fulfillment

# Print condition and fulfillment
print(f"condition: {condition} \n fulfillment {fulfillment}")
