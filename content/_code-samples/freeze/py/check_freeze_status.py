from xrpl.clients import JsonRpcClient
from xrpl.models import AccountLines

client = JsonRpcClient("https://xrplcluster.com")

print("connected to mainnet")

# Real accounts that were frozen on mainnet as an example

# Issuer address
issuer_addr = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"

# Target address to query for freeze status
target_addr = "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v"

token_name = "USD"

# Build account line query
acc_info = AccountLines(account=issuer_addr, ledger_index="validated")

# Submit query
response = client.request(acc_info)

# Parse response for result
result = response.result

# Parse result for account lines
if "lines" in result:
    lines = result["lines"]
    for line in lines:
        # Query result with trustline params
        if target_addr == line["account"] and token == line["currency"]: 
            if 'freeze' in line:
                print(f'freeze status of trustline: {line["freeze"]}')
            else:
                print(f'freeze status of trustline: False')
        else:
            print("no such trustline exists")
else:
    print("this account has no trustlines")

