from xrpl.clients import JsonRpcClient
from xrpl.models import AccountLines
from xrpl.wallet import Wallet, generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnetwork


# Token helper method
def symbol_to_hex(symbol: str = None) -> str:
    """symbol_to_hex."""
    if len(symbol) > 3:
        bytes_string = bytes(str(symbol).encode('utf-8'))
        return bytes_string.hex().upper().ljust(40, '0')
    return symbol

# issuer address
issuer_addr =generate_faucet_wallet(client=client).classic_address

# target address to query for freeze status
target_addr = generate_faucet_wallet(client=client).classic_address

# token name
token = "LegitXRP"

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
        if target_addr == line["account"] and symbol_to_hex(token) == line["currency"]: 
            if 'freeze' in line:
               print(f'freeze status of trustline: {line["freeze"]}')
            else:
                print(print(f'freeze status of trustline: False'))
        else:
            print("no such trustline exists")
else:
    print("no lines")

