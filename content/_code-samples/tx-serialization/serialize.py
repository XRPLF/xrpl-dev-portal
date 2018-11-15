#!/bin/env python3

# Transaction Serialization Sample Code (Python3 version)
# Author: rome@ripple.com
# Copyright Ripple 2018

import json
import logging

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
        # first 4 bits is the type_code, next 4 bits is the field code
        combined_code = (type_code << 4) | field_code
        return combined_code.to_bytes(1, byteorder="big", signed=False)
    else:
        # TODO: need more than 1 byte to encode this field id
        raise ValueError("field_id not yet implemented for types/fields > 16")

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
        # TODO: calculate 160-bit currency ID
        currency_code = bytes(20)
        return issued_amt + currency_code + decode_address(a["issuer"])
    else:
        raise ValueError("amount must be XRP string or {currency, value, issuer}")

def tx_type_to_bytes(txtype):
    type_uint = DEFINITIONS["TRANSACTION_TYPES"][txtype]
    return type_uint.to_bytes(2, byteorder="big", signed=False)

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
        "AccountID": decode_address,
        "Amount": amount_to_bytes
    }
    field_binary = dispatch[field_type](field_val)
    return b''.join( (id_prefix, field_binary) )

def serialize_tx(tx):
    field_order = sorted(tx.keys(), key=field_sort_key)
    logger.debug("Canonical field order: %s" % field_order)

    fields_as_bytes = []
    for field_name in field_order:
        field_val = tx[field_name]
        fields_as_bytes.append(field_to_bytes(field_name, field_val))

    all_serial = b''.join(fields_as_bytes)
    logger.info(all_serial.hex().upper())
    return all_serial



################################################################################

if __name__ == "__main__":
    logger.setLevel(logging.DEBUG)
    DEFINITIONS = load_defs()

    example_tx = {
      "TransactionType" : "Payment",
      "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : {
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      },
      "Fee": "12",
      "Flags": 2147483648,
      "Sequence": 2
    }

    serialize_tx(example_tx)

    # example rippled signature:
    # ./rippled sign masterpassphrase (the above JSON)
    # where "masterpassphrase" is the key behind rHb9...
    # snoPBrXtMeMyMHUVTgbuqAfg1SUTb in base58
    # "tx_blob" : "1200002280000000240000000261D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000C73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD0207446304402201FE0A74FC1BDB509C8F42B861EF747C43B92917706BB623F0A0D621891933AF402205206FBA8B0BF6733DB5B03AD76B5A76A2D46DF9093916A3BEC78897E58A3DF148114B5F762798A53D543A014CAF8B297CFF8F2F937E883143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    # "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
    # "TxnSignature" : "304402201FE0A74FC1BDB509C8F42B861EF747C43B92917706BB623F0A0D621891933AF402205206FBA8B0BF6733DB5B03AD76B5A76A2D46DF9093916A3BEC78897E58A3DF14",
    # "hash" : "8BA1509E4FB80CCF76CD9DE924B8B71597637C775BA2DC515F90C333DA534BF3"
