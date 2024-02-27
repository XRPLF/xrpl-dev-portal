from xrpl.clients import JsonRpcClient
from xrpl.models.requests import LedgerData

# Create a client to connect to the network.
client = JsonRpcClient("https://xrplcluster.com/")

# Query the most recently validated ledger for info.
ledger = LedgerData(ledger_index="validated")
ledger_data = client.request(ledger).result
ledger_data_index = ledger_data["ledger_index"]

# Create a function to run on each API call.
def printLedgerResult():
    print(ledger_data)

# Execute function at least once before checking for markers.
while True:
    printLedgerResult()
    if "marker" not in ledger_data:
        break
    
    # Specify the same ledger and add the marker to continue querying.
    ledger_marker = LedgerData(ledger_index=ledger_data_index, marker=ledger_data["marker"])
    ledger_data = client.request(ledger_marker).result
