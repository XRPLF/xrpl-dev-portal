from xrpl.clients import JsonRpcClient
from xrpl.models import AccountInfo

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to testnetwork


ACCOUNT_ROOT_LEDGER_FLAGS: dict[str, int] = {
        "lsfPasswordSpent": 0x00010000,
        "lsfRequireDestTag": 0x00020000,
        "lsfRequireAuth": 0x00040000,
        "lsfRequireAuth": 0x00040000,
        "lsfDisableMaster": 0x00100000,
        "lsfNoFreeze": 0x00200000,
        "lsfGlobalFreeze": 0x00400000,
        "lsfDefaultRipple": 0x00800000,
        "lsfDepositAuth": 0x01000000,
    }

def parse_account_root_flags(flags: int) -> list[str]:
    flags_enabled = []
    for flag in ACCOUNT_ROOT_LEDGER_FLAGS:
        check_flag = ACCOUNT_ROOT_LEDGER_FLAGS[flag]
        if check_flag & flags == check_flag:
            flags_enabled.append(flag)
    return flags_enabled

# issuer address to query for global freeze status
issuer_addr = "rfDJ98Z8k7ubr6atbZoCqAPdg9MetyBwcg"

# build account line query
acc_info = AccountInfo(account=issuer_addr, ledger_index="validated")

# submit query
response = client.request(acc_info)

# parse response for result
result = response.result

# query result for global freeze status
if "account_data" in result:
    if "Flags" in result["account_data"]:
        if "lsfNoFreeze" in parse_account_root_flags(result["account_data"]["Flags"]):
            print("No Freeze is enabled")
        else:
            print("No Freeze is disabled")
