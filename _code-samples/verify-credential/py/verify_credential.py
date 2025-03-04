import sys
import logging
from binascii import hexlify
from re import match

from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerEntry, Ledger
from xrpl.utils import ripple_time_to_datetime

logger = logging.getLogger("verify_credential")
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler(sys.stderr))

# class CredentialVerificationError(Exception):
#     pass

class XRPLLookupError(Exception):
    def __init__(self, xrpl_response):
        self.body = xrpl_response.result

lsfAccepted = 0x00010000

def verify_credential(client:JsonRpcClient, 
                      issuer:str, 
                      subject:str, 
                      credential_type:str="", 
                      credential_type_hex:str=""):
    """
    Check whether an XRPL account holds a specified credential,
    as of the most recently validated ledger.

    Paramters:
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
    if not (credential_type or credential_type_hex):
        raise ValueError("Provide a non-empty credential_type or credential_type_hex")
    if credential_type and credential_type_hex:
        raise ValueError("Provide either credential_type or credential_type_hex but not both")

    if credential_type:
        credential_type_hex = hexlify(credential_type.encode("utf-8")).decode("ascii")
        logger.info("Encoded credential_type as hex: "+credential_type_hex.upper())
    
    credential_type_hex = credential_type_hex.upper()
    if len(credential_type_hex) % 2 or not match(r"[0-9A-F]{2,128}", credential_type_hex):
        # Hexadecimal is always 2 chars per byte, so an odd length is invalid.
        raise ValueError("credential_type_hex must be 1-64 bytes as hexadecimal.")

    xrpl_response = client.request(LedgerEntry(
        credential={
            "subject": subject,
            "issuer": issuer,
            "credential_type": credential_type_hex
        },
        ledger_index="validated"
    ))

    if xrpl_response.status != "success":
        if xrpl_response.result["error"] == "entryNotFound":
            logger.info("Credential was not found")
            return False
        raise XRPLLookupError(xrpl_response)
    
    credential = xrpl_response.result["node"]
    logger.info("Found credential:")
    logger.info(credential)

    if not credential["Flags"] & lsfAccepted:
        logger.info("Credential is not accepted.")
        return False
    
    if credential.get("Expiration"):
        expiration_time = ripple_time_to_datetime(credential["Expiration"])
        logger.info("Credential has expiration time: "+expiration_time.isoformat())
        logger.info("Looking up last validated ledger to check for expiration.")

        ledger_response = client.request(Ledger(ledger_index="validated"))
        if ledger_response.status != "success":
            raise XRPLLookupError(ledger_response)
        close_time = ripple_time_to_datetime(ledger_response.result["ledger"]["close_time"])
        logger.info("Most recent validated ledger is: "+close_time.isoformat())

        if close_time > expiration_time:
            logger.info("Credential is expired.")
            return False

    return True


if __name__=="__main__":
    XRPL_SERVER = "https://s.devnet.rippletest.net:51234/"
    client = JsonRpcClient(XRPL_SERVER)
    verify_credential(client, 
                      issuer="ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                      subject="rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
                      credential_type="my_credential",
                      # credential_type_hex = "6D795F63726564656E7469616C",
    )
