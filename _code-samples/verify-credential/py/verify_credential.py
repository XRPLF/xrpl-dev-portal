from binascii import hexlify
from re import match

from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerEntry, Ledger
from xrpl.utils import ripple_time_to_datetime

client = JsonRpcClient("https://xrplcluster.com")
SUBJECT_ADDRESS = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
ISSUER_ADDRESS = "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
CREDENTIAL_TYPE = hexlify("my_credential".encode("utf-8")).decode("ascii").upper()

# Look up Credential ledger entry ----------------------------------------------
ledger_entry_request = LedgerEntry(
    credential={
        "subject": SUBJECT_ADDRESS,
        "issuer": ISSUER_ADDRESS,
        "credential_type": CREDENTIAL_TYPE,
    },
    ledger_index="validated",
)
print("Looking up credential...")
print(ledger_entry_request.to_dict())
try:
    xrpl_response = client.request(ledger_entry_request)
except Exception as err:
    print("Error: ledger_entry failed with error:", err)
    exit(1)

if xrpl_response.status != "success":
    if xrpl_response.result["error"] == "entryNotFound":
        print("Credential was not found")
        exit(1)
    # Other errors, for example invalidly-specified addresses.
    print("Unexpected error looking up credential:", xrpl_response.result)

credential = xrpl_response.result["node"]
print("Found credential:")
print(credential)

# Check if the credential has been accepted ------------------------------------
lsfAccepted = 0x00010000
if not credential["Flags"] & lsfAccepted:
    print("Credential is not accepted.")
    exit(2)

# Confirm that the credential is not expired -----------------------------------
if credential.get("Expiration"):
    expiration_time = ripple_time_to_datetime(credential["Expiration"])
    print("Credential has expiration:", expiration_time.isoformat())
    print("Looking up validated ledger to check for expiration.")

    ledger_response = client.request(Ledger(ledger_index="validated"))
    if ledger_response.status != "success":
        print("Error looking up most recent validated ledger:", ledger_response.result)
        exit(3)
    close_time = ripple_time_to_datetime(ledger_response.result["ledger"]["close_time"])
    print("Most recent validated ledger was at:", close_time.isoformat())

    if close_time > expiration_time:
        print("Credential is expired.")
        exit(4)

# Credential has passed all checks. --------------------------------------------
print("Credential is valid.")
