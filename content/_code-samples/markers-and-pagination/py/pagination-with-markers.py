from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerData

# Create a client to connect to the main network.
client = JsonRpcClient("https://xrplcluster.com/")

# Specify ledger to query and request data.
ledger = LedgerData(ledger_index=500000)
ledger_data = client.request(ledger).result

# Code to run on each call.
def code():
    print(ledger_data)

#Execute code at least once before checking for markers.
while True:
    code()
    if "marker" not in ledger_data:
        break
    
    # Specify ledger and marker to continue querying.
    ledger_marker = LedgerData(ledger_index=500000, marker=ledger_data["marker"])
    ledger_data = client.request(ledger_marker).result