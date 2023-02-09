"""Example of how we can see a transaction that was validated on the ledger"""
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import Ledger, Tx

# References
# - https://xrpl.org/look-up-transaction-results.html
# - https://xrpl.org/parallel-networks.html#parallel-networks
# - https://xrpl.org/tx.html

# Create a client to connect to the main network
client = JsonRpcClient("https://xrplcluster.com/")

# Create a Ledger request and have the client call it
ledger_request = Ledger(ledger_index="validated", transactions=True)
ledger_response = client.request(ledger_request)
print(ledger_response)

# Extract out transactions from the ledger response
transactions = ledger_response.result["ledger"]["transactions"]

# If there are transactions, we can display the first one
# If there are none (visualized at https://testnet.xrpl.org/), try re running the script
if transactions:
    # Create a Transaction request and have the client call it
    tx_request = Tx(transaction=transactions[0])
    tx_response = client.request(tx_request)
    print("First transaction in the ledger:")
    print(tx_response)
else:
    print("No transactions were found on the ledger!")
