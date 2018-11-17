#!/bin/env python3

# Transaction Serialization Sample Code (Python3 version)
# Author: rome@ripple.com
# Copyright Ripple 2018

import json
import logging
import re

from address import decode_address

logger = logging.getLogger(__name__)
logger.addHandler(logging.StreamHandler())

def load_defs(fname="definitions.json"):
    with open(fname) as definitions_file:
        definitions = json.load(definitions_file)
        return {
            "TYPES": definitions["TYPES"],
                # type_name str: type_sort_key int
            "FIELDS": {k:v for (k,v) in definitions["FIELDS"]}, # convert list of tuples to dict
                # field_name str: {
                #   nth: field_sort_key int,
                #   isVLEncoded: bool,
                #   isSerialized: bool,
                #   isSigningField: bool,
                #   type: type_name str
                # }
            "LEDGER_ENTRY_TYPES": definitions["LEDGER_ENTRY_TYPES"],
            "TRANSACTION_RESULTS": definitions["TRANSACTION_RESULTS"],
            "TRANSACTION_TYPES": definitions["TRANSACTION_TYPES"],
        }


def field_sort_key(field_name):
    """Return a tuple sort key for a given field name"""
    field_type_name = DEFINITIONS["FIELDS"][field_name]["type"]
    return (DEFINITIONS["TYPES"][field_type_name], DEFINITIONS["FIELDS"][field_name]["nth"])

def field_id(field_name):
    field_type_name = DEFINITIONS["FIELDS"][field_name]["type"]
    type_code = DEFINITIONS["TYPES"][field_type_name]
    field_code = DEFINITIONS["FIELDS"][field_name]["nth"]

    if type_code < 16 and field_code < 16:
        # high 4 bits is the type_code
        # low 4 bits is the field code
        combined_code = (type_code << 4) | field_code
        return bytes_from_uint(combined_code, 8)
    elif type_code >= 16 and field_code < 16:
        # first 4 bits are zeroes
        # next 4 bits is field code
        # next byte is type code
        byte1 = bytes_from_uint(field_code, 8)
        byte2 = bytes_from_uint(type_code, 8)
        return b''.join( (byte1, byte2) )
    elif type_code < 16 and field_code >= 16:
        # first 4 bits is type code
        # next 4 bits are zeroes
        # next byte is field code
        byte1 = bytes_from_uint(type_code << 4, 8)
        byte2 = bytes_from_uint(field_code, 8)
        return b''.join( (byte1, byte2) )
    else: # both are >= 16
        # first byte is all zeroes
        # second byte is type
        # third byte is field code
        byte2 = bytes_from_uint(type_code, 8)
        byte3 = bytes_from_uint(field_code, 8)
        return b''.join( (bytes(1), byte2, byte3) )

def bytes_from_uint(i, bits):
    if bits % 8:
        raise ValueError("bytes_from_uint: bits must be divisible by 8")
    return i.to_bytes(bits // 8, byteorder="big", signed=False)

def amount_to_bytes(a):
    if type(a) == str:
        # is XRP
        xrp_amt = int(a)
        if (xrp_amt >= 0):
            # set the "is positive" bit -- this is backwards from usual two's complement!
            xrp_amt = xrp_amt | 0x4000000000000000
        else:
            # convert to absolute value, leaving the "is positive" bit unset
            xrp_amt = -xrp_amt
        return xrp_amt.to_bytes(8, byteorder="big", signed=False)
    elif type(a) == dict:
        if sorted(a.keys()) != ["currency", "issuer", "value"]:
            raise ValueError("amount must have currency, value, issuer only (actually had: %s)" %
                    sorted(a.keys()))
        #TODO: canonicalize mantissa/exponent/etc. of issued currency amount
        # https://developers.ripple.com/currency-formats.html#issued-currency-math
        # temporarily returning all zeroes
        issued_amt = bytes(8)
        currency_code = currency_code_to_bytes(a["currency"])
        return issued_amt + currency_code + decode_address(a["issuer"])
    else:
        raise ValueError("amount must be XRP string or {currency, value, issuer}")

def tx_type_to_bytes(txtype):
    type_uint = DEFINITIONS["TRANSACTION_TYPES"][txtype]
    return type_uint.to_bytes(2, byteorder="big", signed=False)

def currency_code_to_bytes(code_string):
    if re.match(r"^[A-Za-z0-9?!@#$%^&*<>(){}\[\]|]{3}$", code_string):
        # ISO 4217-like code
        if code_string == "XRP":
            raise ValueError("issued currency can't be XRP")
        code_ascii = code_string.encode("ASCII")
        # standard currency codes: https://developers.ripple.com/currency-formats.html#standard-currency-codes
        # 8 bits type code (0x00)
        # 96 bits reserved (0's)
        # 24 bits ASCII
        # 8 bits version (0x00)
        # 24 bits reserved (0's)
        return b''.join( ( bytes(13), code_ascii, bytes(4) ) )
    elif re.match(r"^[0-9a-fA-F]{40}$", code_string):
        # raw hex code
        return bytes.fromhex(code_string) # requires Python 3.5+
    else:
        raise ValueError("invalid currency code")

def vl_encode(vl_contents):
    vl_len = len(vl_contents)
    if vl_len <= 192:
        len_byte = vl_len.to_bytes(1, byteorder="big", signed=False)
        return b''.join( (len_byte, vl_contents) )
    elif vl_len <= 12480:
        vl_len -= 193
        byte1 = ((vl_len >> 8) + 193).to_bytes(1, byteorder="big", signed=False)
        byte2 = (vl_len & 0xff).to_bytes(1, byteorder="big", signed=False)
        return b''.join( (byte1, byte2, vl_contents) )
    elif vl_len <= 918744:
        vl_len -= 12481
        byte1 = (241 + (vl_len >> 16)).to_bytes(1, byteorder="big", signed=False)
        byte2 = ((vl_len >> 8) & 0xff).to_bytes(1, byteorder="big", signed=False)
        byte3 = (vl_len & 0xff).to_bytes(1, byteorder="big", signed=False)
        return b''.join( (byte1, byte2, byte3, vl_contents) )

    raise ValueError("VariableLength field must be <= 918744 bytes long")

def vl_to_bytes(field_val):
    vl_contents = bytes.fromhex(field_val)
    return vl_encode(vl_contents)

def accountid_to_bytes(address):
    return vl_encode(decode_address(address))

def field_to_bytes(field_name, field_val):
    field_type = DEFINITIONS["FIELDS"][field_name]["type"]
    logger.debug("Serializing field {f} of type {t}".format(f=field_name, t=field_type))

    id_prefix = field_id(field_name)
    logger.debug("id_prefix is: %s" % id_prefix.hex())

    if field_name == "TransactionType":
        # Special case: convert from string to UInt16
        return b''.join( (id_prefix, tx_type_to_bytes(field_val)) )

    dispatch = {
        # TypeName: function(field): bytes object
        "UInt64": lambda x:bytes_from_uint(x, 64),
        "UInt32": lambda x:bytes_from_uint(x, 32),
        "UInt16": lambda x:bytes_from_uint(x, 16),
        "UInt8" : lambda x:bytes_from_uint(x, 8),
        "AccountID": accountid_to_bytes,
        "Amount": amount_to_bytes,
        "Blob": vl_to_bytes
    }
    field_binary = dispatch[field_type](field_val)
    return b''.join( (id_prefix, field_binary) )

def serialize_tx(tx):
    field_order = sorted(tx.keys(), key=field_sort_key)
    logger.debug("Canonical field order: %s" % field_order)

    fields_as_bytes = []
    for field_name in field_order:
        if (DEFINITIONS["FIELDS"][field_name]["isSerialized"]):
            field_val = tx[field_name]
            field_bytes = field_to_bytes(field_name, field_val)
            logger.debug("{n}: {h}".format(n=field_name, h=field_bytes.hex()))
            fields_as_bytes.append(field_bytes)

    all_serial = b''.join(fields_as_bytes)
    logger.info(all_serial.hex().upper())
    return all_serial



################################################################################

if __name__ == "__main__":
    logger.setLevel(logging.DEBUG)
    DEFINITIONS = load_defs()

    # example_tx = {
    #   "TransactionType" : "Payment",
    #   "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    #   "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    #   "Amount" : {
    #      "currency" : "USD",
    #      "value" : "1",
    #      "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    #   },
    #   "Fee": "12",
    #   "Flags": 2147483648,
    #   "Sequence": 2
    # }

    with open("test-cases/tx1-nometa.json") as f:
        example_tx = json.load(f)

    serialize_tx(example_tx)

    # example rippled signature:
    # ./rippled sign masterpassphrase (the above JSON)
    # where "masterpassphrase" is the key behind rHb9...
    # snoPBrXtMeMyMHUVTgbuqAfg1SUTb in base58
    # "tx_blob" : "1200002280000000240000000261D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000C73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD0207446304402201FE0A74FC1BDB509C8F42B861EF747C43B92917706BB623F0A0D621891933AF402205206FBA8B0BF6733DB5B03AD76B5A76A2D46DF9093916A3BEC78897E58A3DF148114B5F762798A53D543A014CAF8B297CFF8F2F937E883143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    # "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
    # "TxnSignature" : "304402201FE0A74FC1BDB509C8F42B861EF747C43B92917706BB623F0A0D621891933AF402205206FBA8B0BF6733DB5B03AD76B5A76A2D46DF9093916A3BEC78897E58A3DF14",
    # "hash" : "8BA1509E4FB80CCF76CD9DE924B8B71597637C775BA2DC515F90C333DA534BF3"
