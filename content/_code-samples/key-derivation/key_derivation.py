#!/usr/bin/env python3

################################################################################
# XRPL Key Derivation Code
# Author: rome@ripple.com
# Copyright Ripple 2019
# This sample code is provided as a reference for educational purposes. It is
# not optimized for speed or for security. Use this code at your own risk and
# exercise due caution before using it with real money or infrastructure.
# This file is provided under the MIT license along with the rest of the
# XRP Ledger Dev Portal docs and sample code:
# https://github.com/ripple/xrpl-dev-portal/blob/master/LICENSE
# Some of its dependencies are released under other licenses or are adapted
# from public domain code. See their respective files for details.
################################################################################

import argparse
import sys
from hashlib import sha512

if sys.version_info[0] < 3:
    sys.exit("Python 3+ required")
elif sys.version_info.minor < 6:
    from random import SystemRandom
    randbits = SystemRandom().getrandbits
else:
    from secrets import randbits

from fastecdsa import keys, curve

import ed25519
import RFC1751
from base58 import base58

XRPL_SEED_PREFIX = b'\x21'
XRPL_ACCT_PUBKEY_PREFIX = b'\x23'
XRPL_VALIDATOR_PUBKEY_PREFIX = b'\x1c'
ED_PREFIX = b'\xed'

def sha512half(buf):
    """
    Return the first 256 bits (32 bytes) of a SHA-512 hash.
    """
    return sha512(buf).digest()[:32]

class Seed:
    """
    A 16-byte value used for key derivation.
    """

    def __init__(self, in_string=None, correct_rfc1751=False):
        """
        Decode a buffer input in one of the formats the XRPL supports and convert
        it to a buffer representing the 16-byte seed to use for key derivation.
        Formats include:
        - XRPL base58 encoding
        - RFC-1751
        - hexadecimal
        - passphrase
        """
        self.correct_rfc1751 = correct_rfc1751
        # Keys are lazy-derived later
        self._secp256k1_sec = None
        self._secp256k1_pub = None
        self._secp256k1_root_pub = None
        self._ed25519_sec = None
        self._ed25519_pub = None

        if in_string is None:
            # Generate a new seed randomly from OS-level RNG.
            self.bytes = randbits(16*8).to_bytes(16, byteorder="big")
            return

        # Is it base58?
        try:
            decoded = base58.b58decode_check(in_string)
            if decoded[:1] == XRPL_SEED_PREFIX and len(decoded) == 17:
                self.bytes = decoded[1:]
                return
            else:
                raise ValueError
        except:
            pass

        # Maybe it's RFC1751?
        try:
            decoded = RFC1751.english_to_key(in_string)
            if len(decoded) == 16:
                if correct_rfc1751:
                    self.bytes = decoded
                else:
                    self.bytes = swap_byte_order(decoded)

                return
            else:
                raise ValueError
        except:
            pass

        # OK, how about hexadecimal?
        try:
            decoded = bytes.fromhex(in_string)
            if len(decoded) == 16:
                self.bytes = decoded
                return
            else:
                raise ValueError
        except ValueError as e:
            pass

        # Fallback: Guess it's a passphrase.
        encoded = in_string.encode("UTF-8")
        self.bytes = sha512(encoded).digest()[:16]
        return

    def encode_base58(self):
        """
        Returns a string representation of this seed as an XRPL base58 encoded
        string such as 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb'.
        """
        return base58.b58encode_check(XRPL_SEED_PREFIX + self.bytes).decode()

    def encode_hex(self):
        """
        Returns a string representation of this seed as hexadecimal.
        """
        return self.bytes.hex().upper()

    def encode_rfc1751(self, correct_rfc1751=None):
        """
        Returns a string representation of this seed as an RFC-1751 encoded
        passphrase.
        """
        # Use the default byte order swap this Seed was generated with
        # unless the method call overrides it.
        if correct_rfc1751 is None:
            correct_rfc1751=self.correct_rfc1751

        if correct_rfc1751:
            buf = self.bytes
        else:
            buf = swap_byte_order(self.bytes)
        return RFC1751.key_to_english(buf)

    @property
    def ed25519_secret_key(self):
        """
        Returns a 32-byte Ed25519 secret key (bytes).
        Saves the calculation for later calls.
        """
        if self._ed25519_sec is None:
            self._ed25519_sec = sha512half(self.bytes)
        return self._ed25519_sec

    @property
    def ed25519_public_key(self):
        """
        33-byte Ed25519 public key (bytes)—really a 32-byte key
        prefixed with the byte 0xED to indicate that it's an Ed25519 key.
        """
        if self._ed25519_pub is None:
            self._ed25519_pub = (ED_PREFIX +
                                 ed25519.publickey(self.ed25519_secret_key))
        return self._ed25519_pub

    @property
    def secp256k1_secret_key(self):
        """
        32-byte secp256k1 secret key (bytes)
        """
        if self._secp256k1_sec is None:
            self.derive_secp256k1_master_keys()
        return self._secp256k1_sec

    @property
    def secp256k1_public_key(self):
        """
        33-byte secp256k1 account public key (bytes)
        """
        if self._secp256k1_pub is None:
            self.derive_secp256k1_master_keys()
        return self._secp256k1_pub

    @property
    def secp256k1_root_public_key(self):
        """
        33-byte secp256k1 root public key (bytes)
        This is the public key used for validators.
        """
        if self._secp256k1_root_pub is None:
            self.derive_secp256k1_master_keys()
        return self._secp256k1_root_pub

    def derive_secp256k1_master_keys(self):
        """
        Uses the XRPL's convoluted key derivation process to get the
        secp256k1 master keypair for this seed value.
        Saves the values to the object for later reference.
        """

        root_sec_i = secp256k1_secret_key_from(self.bytes)
        root_pub_point = keys.get_public_key(root_sec_i, curve.secp256k1)
        root_pub_b = compress_secp256k1_public(root_pub_point)
        fam_b = bytes(4) # Account families are unused; just 4 bytes of zeroes
        inter_pk_i = secp256k1_secret_key_from( b''.join([root_pub_b, fam_b]) )
        inter_pub_point = keys.get_public_key(inter_pk_i, curve.secp256k1)

        # Secret keys are ints, so just add them mod the secp256k1 group order
        master_sec_i = (root_sec_i + inter_pk_i) % curve.secp256k1.q
        # Public keys are points, so the fastecdsa lib handles adding them
        master_pub_point = root_pub_point + inter_pub_point

        self._secp256k1_sec = master_sec_i.to_bytes(32, byteorder="big", signed=False)
        self._secp256k1_pub = compress_secp256k1_public(master_pub_point)
        self._secp256k1_root_pub = root_pub_b

        # Saving the full key to make it easier to sign things later
        self._secp256k1_full = master_pub_point

    def encode_secp256k1_public_base58(self, validator=False):
        """
        Return the base58-encoded version of the secp256k1 public key.
        """
        if validator:
            # Validators use the "root" public key
            key = self.secp256k1_root_public_key
            prefix = XRPL_VALIDATOR_PUBKEY_PREFIX
        else:
            # Accounts use the derived "master" public key
            key = self.secp256k1_public_key
            prefix = XRPL_ACCT_PUBKEY_PREFIX

        return base58.b58encode_check(prefix + key).decode()

    def encode_ed25519_public_base58(self):
        """
        Return the base58-encoded version of the Ed25519 public key.
        """
        # Unlike secp256k1, Ed25519 public keys are the same for
        # accounts and for validators.
        prefix = XRPL_ACCT_PUBKEY_PREFIX

        return base58.b58encode_check(prefix +
                                      self.ed25519_public_key).decode()

def secp256k1_secret_key_from(seed):
    """
    Calculate a valid secp256k1 secret key by hashing a seed value;
    if the result isn't a valid key, increment a seq value and try
    again.

    Returns a secret key as a 32-byte integer.
    """
    seq = 0
    while True:
        buf = seed + seq.to_bytes(4, byteorder="big", signed=False)
        h = sha512half(buf)
        h_i = int.from_bytes(h, byteorder="big", signed=False)
        if h_i < curve.secp256k1.q and h_i != 0:
            return h_i
        # Else, not a valid secp256k1 key; try again with a new sequence value.
        seq += 1

def compress_secp256k1_public(point):
    """
    Returns a 33-byte compressed key from an secp256k1 public key,
    which is a point in the form (x,y) where both x and y are 32-byte ints
    """
    if point.y % 2:
        prefix = b'\x03'
    else:
        prefix = b'\x02'
    return prefix + point.x.to_bytes(32, byteorder="big", signed=False)

def swap_byte_order(buf):
    """
    Swap the byte order of a bytes object.
    The rippled implementation of RFC-1751 uses the reversed byte order as the
    examples included in the RFC-1751 spec (which doesn't mention byte order).
    """
    size = len(buf)
    # doesn't actually matter if it's "really" big-endian
    i = int.from_bytes(buf, byteorder="big", signed=False)
    revbuf = i.to_bytes(size, byteorder="little", signed=False)
    return revbuf

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("secret", nargs="?", default=None, help="The seed to "+
        "derive a key from, in hex, XRPL base58, or RFC-1751; or the " + "passphrase to derive a seed and key from. If omitted, generate a "+
        "random seed.")
    p.add_argument("--unswap", "-u", default=False, action="store_true",
        help="If specified, preserve the byte order of RFC-1751 encoding"+
        "/decoding. Not compatible with rippled's RFC-1751 implementation.")
    args = p.parse_args()

    seed = Seed(args.secret, correct_rfc1751=args.unswap)
    seed.derive_secp256k1_master_keys()

    print("""
    Seed (base58): {base58}
    Seed (hex): {hex}
    Seed (true RFC-1751): {rfc1751_true}
    Seed (rippled RFC-1751): {rfc1751_rippled}
    Ed25519 Secret Key (hex): {ed25519_secret}
    Ed25519 Public Key (hex): {ed25519_public}
    Ed25519 Public Key (base58 - Account): {ed25519_pub_base58}
    secp256k1 Secret Key (hex): {secp256k1_secret}
    secp256k1 Public Key (hex): {secp256k1_public}
    secp256k1 Public Key (base58 - Account): {secp256k1_pub_base58}
    secp256k1 Public Key (base58 - Validator): {secp256k1_pub_base58_val}
    """.format(
            base58=seed.encode_base58(),
            hex=seed.encode_hex(),
            rfc1751_true=seed.encode_rfc1751(correct_rfc1751=True),
            rfc1751_rippled=seed.encode_rfc1751(correct_rfc1751=False),
            ed25519_secret=seed.ed25519_secret_key.hex().upper(),
            ed25519_public=seed.ed25519_public_key.hex().upper(),
            secp256k1_secret=seed.secp256k1_secret_key.hex().upper(),
            secp256k1_public=seed.secp256k1_public_key.hex().upper(),
            secp256k1_pub_base58=seed.encode_secp256k1_public_base58(),
            secp256k1_pub_base58_val=seed.encode_secp256k1_public_base58(
                validator=True),
            ed25519_pub_base58=seed.encode_ed25519_public_base58(),
    ))
