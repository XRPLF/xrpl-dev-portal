from xrpl.clients import JsonRpcClient
from xrpl.models import AccountInfo

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnetwork


# issuer address to query for global freeze status
issuer_addr = "rfDJ98Z8k7ubr6atbZoCqAPdg9MetyBwcg"

# build account line query
acc_info = AccountInfo(account=issuer_addr, ledger_index="validated")

# submit query
response = client.request(acc_info)

# parse response for result
result = response.result

if "account_data" in result:
    if "Flags" in result["account_data"]:
        if result["account_data"]["Flags"] == 4194304:
            print("global freeze is enabled")
        
