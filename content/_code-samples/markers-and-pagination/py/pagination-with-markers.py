from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerData

# Create a client to connect to the network.
client = JsonRpcClient("https://xrplcluster.com/")

# Specify a ledger to query for info.
ledger = LedgerData(ledger_index=500000)
ledger_data = client.request(ledger).result

# Create a function to run on each API call.
def code():
    print(ledger_data)

# Execute function at least once before checking for markers.
while True:
    code()
    if "marker" not in ledger_data:
        break
    
    # Specify the same ledger and add the marker to continue querying.
    ledger_marker = LedgerData(ledger_index=500000, marker=ledger_data["marker"])
    ledger_data = client.request(ledger_marker).result