from xrpl.clients import JsonRpcClient
from xrpl.models import Tx

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

prev_txn_id = ""
# Return escrow seq from `PreviousTxnID` for finishing or cancelling escrows

# Build and send query for PreviousTxnID 
req = Tx(transaction=prev_txn_id) 
response = client.request(req)

# Return the result
result = response.result

# Print escrow sequence if available
if "Sequence" in result:
    print(f'escrow sequence: {result["Sequence"]}')
# Use escrow ticket sequence if escrow sequence is not available
if "TicketSequence" in result:
    print(f'escrow ticket sequence: {result["TicketSequence"]}')
