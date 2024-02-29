from os import urandom
from cryptoconditions import PreimageSha256

secret = urandom(32)

fulfillment = PreimageSha256(preimage=secret)

print("Condition", fulfillment.condition_binary.hex().upper())

# Keep secret until you want to finish the escrow
print("Fulfillment", fulfillment.serialize_binary().hex().upper())
