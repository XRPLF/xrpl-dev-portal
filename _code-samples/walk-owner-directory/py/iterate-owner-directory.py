# iterate-owner-directory.py
# Iterate over an account's owner directory and display how many ledger entries
# are in each page. In cases of highly active accounts, it can demonstrate
# the extent of "fragmentation" with skipped page numbers and non-full pages.
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerEntry
from xrpl.clients import XRPLRequestFailureException

OWNER_ADDRESS = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" # Testnet faucet
# OWNER_ADDRESS = "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" # TST issuer

client = JsonRpcClient("https://s.altnet.rippletest.net:51234/")

# Set initial values for iterating
sub_index = 0  # Directory root
ledger_index = "validated"

# Query pages from the owner directory until they run out
print("Page #\t\t\tEntry count")
print("-----------------------------------")
while True:
    # Construct the LedgerEntry request for the directory page
    directory_request = LedgerEntry(
        directory={
            "owner": OWNER_ADDRESS,
            "sub_index": sub_index
        },
        ledger_index=ledger_index
    )

    # Send the request
    try:
        response = client.request(directory_request)
    except Exception as e:
        print(f"\nError: ledger_entry failed: {e}")
        break

    # The 'ledger_index' is consistently set after the first successful query.
    # This ensures subsequent pages are read from the same ledger version.
    if ledger_index == "validated":
        ledger_index = response.result["ledger_index"]

    # The entries are stored in the 'Indexes' field of the 'DirectoryNode'
    entry_count = len(response.result["node"]["Indexes"])
    print(f"{sub_index}\t\t\t{entry_count}")

    # Check for the next page indicator
    if "IndexNext" in response.result["node"].keys():
        # The directory continues onto another page.
        # Convert IndexNext from hex to decimal for sub_index.
        hex_next = response.result["node"]["IndexNext"]
        sub_index = int(hex_next, 16)
    else:
        print("\nThis is the last page of the directory.")
        break
