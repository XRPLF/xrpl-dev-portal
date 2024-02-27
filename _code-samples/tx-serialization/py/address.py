import base58.base58 as base58

def decode_address(address):
    decoded = base58.b58decode_check(address)
    if decoded[0] == 0 and len(decoded) == 21: # is an address
        return decoded[1:]
    else:
        raise ValueError("Not an AccountID!")
