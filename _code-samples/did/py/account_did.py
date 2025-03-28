from xrpl.models import LedgerEntry
from xrpl.clients import JsonRpcClient


# connect to the xrpl via a client
print("Connecting to client")
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("connected!!!")


# address of an account that has an existing DID
account_did_creator = "rQB1cBMMyFXshFQd6cj3eg7vSJZtYb6d8e"

# build the request for the account's DID
req = LedgerEntry(ledger_index="validated", did=account_did_creator)

# submit request and awaiting result
print("submitting request")
response = client.request(req)
result = response.result


# parse result
if "index" in result and "Account" in result["node"]:
    print(f'DID index: {result["node"]["index"]}')
    print(f'DID Document: {result["node"]["DIDDocument"]}')
    print(f'Data: {result["node"]["Data"]}')
    print(f'URI: {result["node"]["URI"]}')
else:
    print("No DID found for this account")
