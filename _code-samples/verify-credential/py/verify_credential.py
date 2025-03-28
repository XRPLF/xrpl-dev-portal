#!/usr/bin/env python

import argparse
import logging
import sys
from binascii import hexlify
from re import match

from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerEntry, Ledger
from xrpl.utils import ripple_time_to_datetime

# Set up logging --------------------------------------------------------------
# Use WARNING by default in case verify_credential is called from elsewhere.
logger = logging.getLogger("verify_credential")
logger.setLevel(logging.WARNING)
logger.addHandler(logging.StreamHandler(sys.stderr))

# Define an error to throw when XRPL lookup fails unexpectedly ----------------
class XRPLLookupError(Exception):
    def __init__(self, xrpl_response):
        self.body = xrpl_response.result

# Main function ---------------------------------------------------------------
def verify_credential(client:JsonRpcClient, 
                      issuer:str, 
                      subject:str, 
                      credential_type:str="", 
                      credential_type_hex:str=""):
    """
    Check whether an XRPL account holds a specified credential,
    as of the most recently validated ledger.

    Paramters:
        client - JsonRpcClient for the XRPL network to use.
        issuer - Address of the credential issuer, in base58
        subject - Address of the credential holder/subject, in base58
        credential_type - Credential type to check for as a string,
                          which will be encoded as UTF-8 (1-64 bytes long).
        credential_type_hex - Credential type (binary) as hexadecimal.
        verbose - If true, print details to stdout during lookup.
    You must provide either credential_type or credential_type_hex.

    Returns True if the account holds the specified, valid credential.
    Returns False if the credential is missing, expired, or not accepted.
    """
    # Handle function inputs --------------------------------------------------
    if not (credential_type or credential_type_hex):
        raise ValueError("Provide a non-empty credential_type or " +
                         "credential_type_hex")
    if credential_type and credential_type_hex:
        raise ValueError("Provide either credential_type or " +
                         "credential_type_hex, but not both")
    
    # Encode credential_type as uppercase hex, if needed
    if credential_type:
        credential_type_hex = hexlify(credential_type.encode("utf-8")
                                      ).decode("ascii")
        logger.info("Encoded credential_type as hex: "+credential_type_hex.upper())
    credential_type_hex = credential_type_hex.upper()

    if len(credential_type_hex) % 2 or \
            not match(r"[0-9A-F]{2,128}", credential_type_hex):
        # Hexadecimal is always 2 chars per byte, so an odd length is invalid.
        raise ValueError("credential_type_hex must be 1-64 bytes as hexadecimal.")

    # Perform XRPL lookup of Credential ledger entry --------------------------
    ledger_entry_request = LedgerEntry(
        credential={
            "subject": subject,
            "issuer": issuer,
            "credential_type": credential_type_hex
        },
        ledger_index="validated"
    )
    logger.info("Looking up credential...")
    logger.info(ledger_entry_request.to_dict())
    xrpl_response = client.request(ledger_entry_request)

    if xrpl_response.status != "success":
        if xrpl_response.result["error"] == "entryNotFound":
            logger.info("Credential was not found")
            return False
        # Other errors, for example invalidly-specified addresses.
        raise XRPLLookupError(xrpl_response)

    credential = xrpl_response.result["node"]
    logger.info("Found credential:")
    logger.info(credential)

    # Confirm that the credential has been accepted ---------------------------
    lsfAccepted = 0x00010000
    if not credential["Flags"] & lsfAccepted:
        logger.info("Credential is not accepted.")
        return False
    
    # Confirm that the credential is not expired ------------------------------
    if credential.get("Expiration"):
        expiration_time = ripple_time_to_datetime(credential["Expiration"])
        logger.info("Credential has expiration: "+expiration_time.isoformat())
        logger.info("Looking up validated ledger to check for expiration.")

        ledger_response = client.request(Ledger(ledger_index="validated"))
        if ledger_response.status != "success":
            raise XRPLLookupError(ledger_response)
        close_time = ripple_time_to_datetime(
                ledger_response.result["ledger"]["close_time"]
        )
        logger.info("Most recent validated ledger is: "+close_time.isoformat())

        if close_time > expiration_time:
            logger.info("Credential is expired.")
            return False

    # Credential has passed all checks. ---------------------------------------
    logger.info("Credential is valid.")
    return True

# Commandline usage -----------------------------------------------------------
if __name__=="__main__":
    NETWORKS = {
        # JSON-RPC URLs of public servers
        "devnet": "https://s.devnet.rippletest.net:51234/",
        "testnet": "https://s.altnet.rippletest.net:51234/",
        "mainnet": "https://xrplcluster.com/"
    }

    # Parse arguments ---------------------------------------------------------
    parser = argparse.ArgumentParser(description="Verify an XRPL credential")
    parser.add_argument("issuer", type=str, nargs="?",
                        help="Credential issuer address as base58.",
                        default="rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS")
    parser.add_argument("subject", type=str, nargs="?",
                        help="Credential subject (holder) address as base58.",
                        default="rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA")
    parser.add_argument("credential_type", type=str, nargs="?",
                        help="Credential type as string", 
                        default="my_credential")
    parser.add_argument("-b", "--binary", action="store_true",
                        help="Use binary (hexadecimal) for credential_type")
    parser.add_argument("-n", "--network", choices=NETWORKS.keys(),
                        help="Use the specified network for lookup",
                        default="devnet")
    parser.add_argument("-q", "--quiet", action="store_true",
                        help="Don't print log messages.")
    args = parser.parse_args()

    # Call verify_credential with appropriate args ----------------------------
    client = JsonRpcClient(NETWORKS[args.network])
    if not args.quiet:
        # Use INFO level by default when called from the commandline.
        logger.setLevel(logging.INFO)

    if args.binary:
        result = verify_credential(client,
                          issuer=args.issuer,
                          subject=args.subject,
                          credential_type_hex=args.credential_type)
    else:
        result = verify_credential(client,
                          issuer=args.issuer,
                          subject=args.subject,
                          credential_type=args.credential_type)
    
    # Return a nonzero exit code if credential verification failed. -----------
    if not result:
        exit(1)
