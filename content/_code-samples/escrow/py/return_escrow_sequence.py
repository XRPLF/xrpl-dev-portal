from xrpl.clients import JsonRpcClient
from xrpl.models import Tx

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork


prev_txn_id = "" # should look like this '84503EA84ADC4A65530C6CC91C904FCEE64CFE2BB973C023476184288698991F'
# Return escrow seq from `PreviousTxnID` for finishing or cancelling escrows
if prev_txn_id == "":
    print("No transaction id provided. Use create_escrow.py to generate an escrow transaction, then you can look it up by modifying prev_txn_id to use that transaction's id.")

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
