from xrpl.clients import JsonRpcClient
from xrpl.models import AccountLines

client = JsonRpcClient("https://xrplcluster.com")

print("connected to mainnet")

# issuer address
issuer_addr = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"

# target address to query for freeze status
target_addr = "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v"

# token name
token = "USD"

# build account line query
acc_info = AccountLines(account=issuer_addr, ledger_index="validated")

# submit query
response = client.request(acc_info)

# parse response for result
result = response.result

# parse result for account lines
if "lines" in result:
    lines = result["lines"]
    for line in lines:
        # query result with trustline params
        if target_addr == line["account"] and token == line["currency"]: 
            if 'freeze' in line:
               print(f'freeze status of trustline: {line["freeze"]}')
            else:
                print(print(f'freeze status of trustline: False'))
        else:
            print("no such trustline exists")
else:
    print("no lines")

