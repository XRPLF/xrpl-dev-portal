#Address Encoding
#Encode XRP Ledger addresses in base58.
from typing import List
import base58
import hashlib

#Ed25519 example: rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN 
# Calculate the RIPEMD160 hash of the SHA-256 hash of the public key
# This is the "Account ID"

class EncodeRippleAddress():
    def __init__(self):
        self.PUBLIC_KEY = 'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32'
        self.RB58_DICT = b'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
        self.ADDRESS_PREFIX: List[int] = [0x00]

    def calculate_hash(self):
        p = hashlib.new('sha256', bytes.fromhex(self.PUBLIC_KEY)).digest()
        a = hashlib.new('ripemd160', p).digest()
        payload = bytes(self.ADDRESS_PREFIX) + a
        chksum1 = hashlib.new('sha256', payload).digest()
        chksum2 = hashlib.new('sha256', chksum1).digest()
        chksum = chksum2[:4]
        return payload + chksum

    def encode_address(self):
        encode = self.calculate_hash()
        address = base58.b58encode(encode, self.RB58_DICT)
        return address.decode('utf-8')

generate = EncodeRippleAddress().encode_address()
print(generate)