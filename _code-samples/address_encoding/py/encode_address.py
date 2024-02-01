from typing import Union, List
from hashlib import sha256
import hashlib

R58dict = b'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'


def scrub_input(input: Union[str, bytes]) -> bytes:
    if isinstance(input, str):
        input = input.encode('ascii')
    return input


def b58encode_int(
        integer: int, default_one: bool = True, alphabet: bytes = R58dict
) -> bytes:
    """
    Encode an integer using Base58
    """
    if not integer and default_one:
        return alphabet[0:1]
    string = b""
    base = len(alphabet)
    while integer:
        integer, idx = divmod(integer, base)
        string = alphabet[idx:idx + 1] + string
    return string


def b58encode(
        v: Union[str, bytes], alphabet: bytes = R58dict
) -> bytes:
    """
    Encode a string using Base58
    """
    v = scrub_input(v)

    origlen = len(v)
    v = v.lstrip(b'\0')
    newlen = len(v)

    acc = int.from_bytes(v, byteorder='big')

    result = b58encode_int(acc, default_one=False, alphabet=alphabet)
    return alphabet[0:1] * (origlen - newlen) + result


_CLASSIC_ADDRESS_PREFIX: List[int] = [0x0]

# Public Key -> AccountID
# Ed25519 key:
public_key = "ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32"


# Calculate the RIPEMD160 hash of the SHA-256 hash of the public key
# This is the "Account ID"
sha_hash = hashlib.sha256(bytes.fromhex(public_key)).digest()
account_id = hashlib.new("ripemd160", sha_hash).digest()

encoded_prefix = bytes(_CLASSIC_ADDRESS_PREFIX)
payload = encoded_prefix + account_id
v = scrub_input(payload)
digest = sha256(sha256(v).digest()).digest()
check = b58encode(v + digest[:4], alphabet=R58dict)
print(check.decode("utf-8"))
# rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN (Ed25519)

