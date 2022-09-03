from xrpl.clients import JsonRpcClient
from xrpl.models import Tx

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork

prev_txn_id = str
# Return escrow seq from `PreviousTxnID` for finishing or cancelling escrows

req = Tx(transaction=prev_txn_id) # build query for PreviousTxnID
response = client.request(req) # send query to the network
result = response.result # return the result

# print escrow sequence if available
if "Sequence" in result:
    print(f'escrow sequence: {result["Sequence"]}')
# use escrow ticket sequence if escrow sequence is not available
if "TicketSequence" in result:
    print(f'escrow ticket sequence: {result["TicketSequence"]}')
