#!/usr/bin/env python3

# Transaction Serialization Sample Code (Python3 version)
# Author: rome@ripple.com
# Copyright Ripple 2018
# Requires Python 3.5+ because of bytes.hex()

import argparse
import json
import logging
import re
import sys

from address import decode_address
from xrpl_num import IssuedAmount

logger = logging.getLogger(__name__)
logger.addHandler(logging.StreamHandler())

def load_defs(fname="definitions.json"):
    """
    Loads JSON from the definitions file and converts it to a preferred format.

    (The definitions file should be drop-in compatible with the one from the
    ripple-binary-codec JavaScript package.)
    """
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
    """
    Returns the unique field ID for a given field name.
    This field ID consists of the type code and field code, in 1 to 3 bytes
    depending on whether those values are "common" (<16) or "uncommon" (>=16)
    """
    field_type_name = DEFINITIONS["FIELDS"][field_name]["type"]
    type_code = DEFINITIONS["TYPES"][field_type_name]
    field_code = DEFINITIONS["FIELDS"][field_name]["nth"]

    # Codes must be nonzero and fit in 1 byte
    assert 0 < field_code <= 255
    assert 0 < type_code <= 255

    if type_code < 16 and field_code < 16:
        # high 4 bits is the type_code
        # low 4 bits is the field code
        combined_code = (type_code << 4) | field_code
        return uint8_to_bytes(combined_code)
    elif type_code >= 16 and field_code < 16:
        # first 4 bits are zeroes
        # next 4 bits is field code
        # next byte is type code
        byte1 = uint8_to_bytes(field_code)
        byte2 = uint8_to_bytes(type_code)
        return b''.join( (byte1, byte2) )
    elif type_code < 16 and field_code >= 16:
        # first 4 bits is type code
        # next 4 bits are zeroes
        # next byte is field code
        byte1 = uint8_to_bytes(type_code << 4)
        byte2 = uint8_to_bytes(field_code)
        return b''.join( (byte1, byte2) )
    else: # both are >= 16
        # first byte is all zeroes
        # second byte is type
        # third byte is field code
        byte2 = uint8_to_bytes(type_code)
        byte3 = uint8_to_bytes(field_code)
        return b''.join( (bytes(1), byte2, byte3) )

def vl_encode(vl_contents):
    """
    Helper function for length-prefixed fields including Blob types
    and some AccountID types.

    Encodes arbitrary binary data with a length prefix. The length of the prefix
    is 1-3 bytes depending on the length of the contents:

    Content length <= 192 bytes: prefix is 1 byte
    192 bytes < Content length <= 12480 bytes: prefix is 2 bytes
    12480 bytes < Content length <= 918744 bytes: prefix is 3 bytes
    """

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


# Individual field type serialization routines ---------------------------------

def accountid_to_bytes(address):
    """
    Serialize an AccountID field type. These are length-prefixed.

    Some fields contain nested non-length-prefixed AccountIDs directly; those
    call decode_address() instead of this function.
    """
    return vl_encode(decode_address(address))

def amount_to_bytes(a):
    """
    Serializes an "Amount" type, which can be either XRP or an issued currency:
    - XRP: 64 bits; 0, followed by 1 ("is positive"), followed by 62 bit UInt amount
    - Issued Currency: 64 bits of amount, followed by 160 bit currency code and
      160 bit issuer AccountID.
    """
    if type(a) == str:
        # is XRP
        xrp_amt = int(a)
        if (xrp_amt >= 0):
            assert xrp_amt <= 10**17
            # set the "is positive" bit -- this is backwards from usual two's complement!
            xrp_amt = xrp_amt | 0x4000000000000000
        else:
            assert xrp_amt >= -(10**17)
            # convert to absolute value, leaving the "is positive" bit unset
            xrp_amt = -xrp_amt
        return xrp_amt.to_bytes(8, byteorder="big", signed=False)
    elif type(a) == dict:
        if sorted(a.keys()) != ["currency", "issuer", "value"]:
            raise ValueError("amount must have currency, value, issuer only (actually had: %s)" %
                    sorted(a.keys()))

        issued_amt = IssuedAmount(a["value"]).to_bytes()
        logger.debug("Issued amount: %s"%issued_amt.hex())
        currency_code = currency_code_to_bytes(a["currency"])
        return issued_amt + currency_code + decode_address(a["issuer"])
    else:
        raise ValueError("amount must be XRP string or {currency, value, issuer}")

def array_to_bytes(array):
    """
    Serialize an array of objects from decoded JSON.
    Each member object must have a type wrapper and an inner object.
    For example:
    [
        {
            // wrapper object
            "Memo": {
                // inner object
                "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
                "MemoData": "72656e74"
            }
        }
    ]
    """
    members_as_bytes = []
    for el in array:
        wrapper_key = list(el.keys())[0]
        inner_obj = el[wrapper_key]
        members_as_bytes.append(field_to_bytes(field_name=wrapper_key, field_val=el))
    members_as_bytes.append(field_id("ArrayEndMarker"))
    return b''.join(members_as_bytes)

def blob_to_bytes(field_val):
    """
    Serializes a string of hex as binary data with a length prefix.
    """
    vl_contents = bytes.fromhex(field_val)
    return vl_encode(vl_contents)

def currency_code_to_bytes(code_string, xrp_ok=False):
    if re.match(r"^[A-Za-z0-9?!@#$%^&*<>(){}\[\]|]{3}$", code_string):
        # ISO 4217-like code
        if code_string == "XRP":
            if xrp_ok:
                # Rare, but when the currency code "XRP" is serialized, it's
                # a special-case all zeroes.
                logger.debug("Currency code(XRP): "+("0"*40))
                return bytes(20)
            raise ValueError("issued currency can't be XRP")

        code_ascii = code_string.encode("ASCII")
        logger.debug("Currency code ASCII: %s"%code_ascii.hex())
        # standard currency codes: https://xrpl.org/currency-formats.html#standard-currency-codes
        # 8 bits type code (0x00)
        # 88 bits reserved (0's)
        # 24 bits ASCII
        # 16 bits version (0x00)
        # 24 bits reserved (0's)
        return b''.join( ( bytes(12), code_ascii, bytes(5) ) )
    elif re.match(r"^[0-9a-fA-F]{40}$", code_string):
        # raw hex code
        return bytes.fromhex(code_string) # requires Python 3.5+
    else:
        raise ValueError("invalid currency code")

def hash128_to_bytes(contents):
    """
    Serializes a hexadecimal string as binary and confirms that it's 128 bits
    """
    b = hash_to_bytes(contents)
    if len(b) != 16: # 16 bytes = 128 bits
        raise ValueError("Hash128 is not 128 bits long")
    return b

def hash160_to_bytes(contents):
    b = hash_to_bytes(contents)
    if len(b) != 20: # 20 bytes = 160 bits
        raise ValueError("Hash160 is not 160 bits long")
    return b

def hash256_to_bytes(contents):
    b = hash_to_bytes(contents)
    if len(b) != 32: # 32 bytes = 256 bits
        raise ValueError("Hash256 is not 256 bits long")
    return b

def hash_to_bytes(contents):
    """
    Helper function; serializes a hash value from a hexadecimal string
    of any length.
    """
    return bytes.fromhex(field_val)

def object_to_bytes(obj):
    """
    Serialize an object from decoded JSON.
    Each object must have a type wrapper and an inner object. For example:

    {
        // type wrapper
        "SignerEntry": {
            // inner object
            "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
            "SignerWeight": 1
        }
    }

    Puts the child fields (e.g. Account, SignerWeight) in canonical order
    and appends an object end marker.
    """
    wrapper_key = list(obj.keys())[0]
    inner_obj = obj[wrapper_key]
    child_order = sorted(inner_obj.keys(), key=field_sort_key)
    fields_as_bytes = []
    for field_name in child_order:
        if (DEFINITIONS["FIELDS"][field_name]["isSerialized"]):
            field_val = inner_obj[field_name]
            field_bytes = field_to_bytes(field_name, field_val)
            logger.debug("{n}: {h}".format(n=field_name, h=field_bytes.hex()))
            fields_as_bytes.append(field_bytes)

    fields_as_bytes.append(field_id("ObjectEndMarker"))
    return b''.join(fields_as_bytes)

def pathset_to_bytes(pathset):
    """
    Serialize a PathSet, which is an array of arrays,
    where each inner array represents one possible payment path.
    A path consists of "path step" objects in sequence, each with one or
    more of "account", "currency", and "issuer" fields, plus (ignored) "type"
    and "type_hex" fields which indicate which fields are present.
    (We re-create the type field for serialization based on which of the core
    3 fields are present.)
    """

    if not len(pathset):
        raise ValueError("PathSet type must not be empty")

    paths_as_bytes = []
    for n in range(len(pathset)):
        path = path_as_bytes(pathset[n])
        logger.debug("Path %d:  %s"%(n, path.hex()))
        paths_as_bytes.append(path)
        if n + 1 == len(pathset): # last path; add an end byte
            paths_as_bytes.append(bytes.fromhex("00"))
        else: # add a path separator byte
            paths_as_bytes.append(bytes.fromhex("ff"))

    return b''.join(paths_as_bytes)

def path_as_bytes(path):
    """
    Helper function for representing one member of a pathset as a bytes object
    """

    if not len(path):
        raise ValueError("Path must not be empty")

    path_contents = []
    for step in path:
        step_data = []
        type_byte = 0
        if "account" in step.keys():
            type_byte |= 0x01
            step_data.append(decode_address(step["account"]))
        if "currency" in step.keys():
            type_byte |= 0x10
            step_data.append(currency_code_to_bytes(step["currency"], xrp_ok=True))
        if "issuer" in step.keys():
            type_byte |= 0x20
            step_data.append(decode_address(step["issuer"]))
        step_data = [uint8_to_bytes(type_byte)] + step_data
        path_contents += step_data

    return b''.join(path_contents)

def tx_type_to_bytes(txtype):
    """
    TransactionType field is a special case that is written in JSON
    as a string name but in binary as a UInt16.
    """
    type_uint = DEFINITIONS["TRANSACTION_TYPES"][txtype]
    return uint16_to_bytes(type_uint)


def uint8_to_bytes(i):
    return i.to_bytes(1, byteorder="big", signed=False)

def uint16_to_bytes(i):
    return i.to_bytes(2, byteorder="big", signed=False)

def uint32_to_bytes(i):
    return i.to_bytes(4, byteorder="big", signed=False)


# Core serialization logic -----------------------------------------------------

def field_to_bytes(field_name, field_val):
    """
    Returns a bytes object containing the serialized version of a field
    including its field ID prefix.
    """
    field_type = DEFINITIONS["FIELDS"][field_name]["type"]
    logger.debug("Serializing field {f} of type {t}".format(f=field_name, t=field_type))

    id_prefix = field_id(field_name)
    logger.debug("id_prefix is: %s" % id_prefix.hex())

    if field_name == "TransactionType":
        # Special case: convert from string to UInt16
        return b''.join( (id_prefix, tx_type_to_bytes(field_val)) )

    dispatch = {
        # TypeName: function(field): bytes object
        "AccountID": accountid_to_bytes,
        "Amount": amount_to_bytes,
        "Blob": blob_to_bytes,
        "Hash128": hash128_to_bytes,
        "Hash160": hash160_to_bytes,
        "Hash256": hash256_to_bytes,
        "PathSet": pathset_to_bytes,
        "STArray": array_to_bytes,
        "STObject": object_to_bytes,
        "UInt8" : uint8_to_bytes,
        "UInt16": uint16_to_bytes,
        "UInt32": uint32_to_bytes,
    }
    field_binary = dispatch[field_type](field_val)
    return b''.join( (id_prefix, field_binary) )

def serialize_tx(tx, for_signing=False):
    """
    Takes a transaction as decoded JSON and returns a bytes object representing
    the transaction in binary format.

    The input format should omit transaction metadata and the transaction
    should be formatted with the transaction instructions at the top level.
    ("hash" can be included, but will be ignored)

    If for_signing=True, then only signing fields are serialized, so you can use
    the output to sign the transaction.

    SigningPubKey and TxnSignature are optional, but the transaction can't
    be submitted without them.

    For example:

    {
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
    """
    field_order = sorted(tx.keys(), key=field_sort_key)
    logger.debug("Canonical field order: %s" % field_order)

    fields_as_bytes = []
    for field_name in field_order:
        if (DEFINITIONS["FIELDS"][field_name]["isSerialized"]):
            if for_signing and not DEFINITIONS["FIELDS"][field_name]["isSigningField"]:
                # Skip non-signing fields in for_signing mode.
                continue
            field_val = tx[field_name]
            field_bytes = field_to_bytes(field_name, field_val)
            logger.debug("{n}: {h}".format(n=field_name, h=field_bytes.hex()))
            fields_as_bytes.append(field_bytes)

    all_serial = b''.join(fields_as_bytes)
    logger.debug(all_serial.hex().upper())
    return all_serial

# Startup stuff ----------------------------------------------------------------
logger.setLevel(logging.WARNING)
DEFINITIONS = load_defs()

# Commandline utility ----------------------------------------------------------
#    parses JSON from a file or commandline argument and prints the serialized
#    form of the transaction as hex
if __name__ == "__main__":
    p = argparse.ArgumentParser()
    txsource = p.add_mutually_exclusive_group()
    txsource.add_argument("-f", "--filename", default="test-cases/tx1.json",
        help="Read input transaction from a JSON file. (Uses test-cases/tx1.json by default)")
    txsource.add_argument("-j", "--json",
        help="Read input transaction JSON from the command line")
    txsource.add_argument("--stdin", action="store_true", default=False,
        help="Read input transaction JSON from standard input (stdin)")
    p.add_argument("-v", "--verbose", action="store_true", default=False,
        help="Display debug messages (such as individual field serializations)")
    args = p.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    # Determine source of JSON transaction:
    if args.json:
        example_tx = json.loads(args.json)
    elif args.stdin:
        example_tx = json.load(sys.stdin)
    else:
        with open(args.filename) as f:
            example_tx = json.load(f)

    print(serialize_tx(example_tx).hex().upper())
