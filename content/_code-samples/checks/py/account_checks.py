from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects
from xrpl.utils import drops_to_xrp, hex_to_str, ripple_time_to_datetime

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork


# Query the ledger for all xrp checks an account has created or received


wallet_addr_to_query = "rPKcw5cXUtREMgsQZqSLkxJTfpwMGg7WcP"

checks_dict = {}

sent_checks = []

received_checks = []

# Build request
req = AccountObjects(account=wallet_addr, ledger_index="validated", type="check")

# Make request and return result
response = client.request(req)
result = response.result

# Parse result
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

# Sort checks
checks_dict["sent"] = sent
checks_dict["receive"] = receive
print(checks_dict)



############################# Query for token checks #############################



# Query the ledger for all token checks an account has created or received


wallet_addr_to_query = "rPKcw5cXUtREMgsQZqSLkxJTfpwMGg7WcP"

checks_dict = {}

sent_dict = []

received_dict = []

# Build request
req = AccountObjects(account=wallet_addr, ledger_index="validated", type="check")

# Make request and return result
response = client.request(req)
result = response.result

# Parse result
if "account_objects" in result:
    account_checks = result["account_objects"]
    for check in account_checks:
        if isinstance(check["SendMax"], dict):
            check_data = {}
            check_data["sender"] = check["Account"]
            check_data["receiver"] = check["Destination"]
            if "Expiration" in check:
                check_data["expiry_date"] = str(ripple_time_to_datetime(check["Expiration"]))
            check_data["token"] = hex_to_str(check["SendMax"]["currency"])
            check_data["issuer"] = check["SendMax"]["issuer"]
            check_data["amount"] = check["SendMax"]["value"]
            check_data["check_id"] = check["index"]
            if check_data["sender"] == wallet_addr:
                sent.append(check_data)
            elif check_data["sender"] != wallet_addr:
                receive.append(check_data)

# Sort checks
checks_dict["sent"] = sent
checks_dict["receive"] = receive
print(checks_dict)
