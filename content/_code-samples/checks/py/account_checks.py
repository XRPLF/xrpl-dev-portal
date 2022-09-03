from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects
from xrpl.utils import drops_to_xrp, ripple_time_to_datetime

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork



"""Helper methods for working with token names"""

def hex_to_symbol(hex: str = None) -> str:
    """token hex_to_symbol."""
    if len(hex) > 3:
        bytes_string = bytes.fromhex(str(hex)).decode('utf-8')
        return bytes_string.rstrip('\x00')
    return hex


# Query the ledger for all xrp checks an account has created or received

# wallet address to query
wallet_addr = str

# dict to store all the checks
checks_dict = {}

# list of sent checks
sent = []

# list of received checks
receive = []

# build request
req = AccountObjects(account=wallet_addr, ledger_index="validated", type="check")

# make request and return result
response = client.request(req)
result = response.result

# parse result
if "account_objects" in result:
    account_checks = result["account_objects"]
    for check in account_checks:
        if isinstance(check["SendMax"], str):
            check_data = {}
            check_data["sender"] = check["Account"]
            check_data["receiver"] = check["Destination"]
            if "Expiration" in check:
                check_data["expiry_date"] = str(ripple_time_to_datetime(check["Expiration"]))
            check_data["amount"] = str(drops_to_xrp(check["SendMax"]))
            check_data["check_id"] = check["index"]
            if check_data["sender"] == wallet_addr:
                sent.append(check_data)
            elif check_data["sender"] != wallet_addr:
                receive.append(check_data)

# sort checks
checks_dict["sent"] = sent
checks_dict["receive"] = receive
print(checks_dict)



############################# Query for token checks #############################



# Query the ledger for all token checks an account has created or received

# wallet address to query
wallet_addr = str

# dict to store all the checks
checks_dict = {}

# list of sent checks
sent = []

# list of received checks
receive = []

# build request
req = AccountObjects(account=wallet_addr, ledger_index="validated", type="check")

# make request and return result
response = client.request(req)
result = response.result

# parse result
if "account_objects" in result:
    account_checks = result["account_objects"]
    for check in account_checks:
        if isinstance(check["SendMax"], dict):
            check_data = {}
            check_data["sender"] = check["Account"]
            check_data["receiver"] = check["Destination"]
            if "Expiration" in check:
                check_data["expiry_date"] = str(ripple_time_to_datetime(check["Expiration"]))
            check_data["token"] = hex_to_symbol(check["SendMax"]["currency"])
            check_data["issuer"] = check["SendMax"]["issuer"]
            check_data["amount"] = check["SendMax"]["value"]
            check_data["check_id"] = check["index"]
            if check_data["sender"] == wallet_addr:
                sent.append(check_data)
            elif check_data["sender"] != wallet_addr:
                receive.append(check_data)

# sort checks
checks_dict["sent"] = sent
checks_dict["receive"] = receive
print(checks_dict)
