#!/usr/bin/env python3

# XRPL Key Derivation Code
# Author: rome@ripple.com
# Copyright Ripple 2019

import sys

from hashlib import sha512

if sys.version_info[0] < 3:
    sys.exit("Python 3+ required")
elif sys.version_info.minor < 6:
    from random import SystemRandom
    randbits = SystemRandom().getrandbits
else:
    from secrets import randbits

import ed25519

def sha512half(buf):
    """
    Return the first 256 bits (32 bytes) of a SHA-512 hash.
    """
    return sha512(buf).digest()[:32]

def decode_input(in_string):
    """
    Decode a buffer input in one of the formats the XRPL supports and convert
    it to a buffer representing the seed to use for key derivation.
    Formats include:
    - XRPL base58 encoding
    - RFC-1751
    - passphrase
    - hexadecimal
    """
    #TODO: split by format
    return seed = seed.encode("UTF-8")

def derive_ed25519_private_key(seed=None):
    """
    Takes a seed (buffer) and outputs a 32-byte private key (buffer).
    If seed is not provided, generates a seed at random using the OS-level
    random number generator, which should be secure enough for this purpose.
    """
    if seed is None:
        seed = randbits(32*8).to_bytes(32, byteorder="big")
    return sha512half(seed)
