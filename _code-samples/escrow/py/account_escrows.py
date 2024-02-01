from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects
from xrpl.utils import drops_to_xrp, ripple_time_to_datetime

# Retreive all escrows created or received by an account, formatted

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # Connect to the testnetwork

account_address = "r9CEVt4Cmcjt68ME6GKyhf2DyEGo2rG8AW"

all_escrows_dict = {} 
sent_escrows = [] 
received_escrows = []

# Build and make request
req = AccountObjects(account=account_address, ledger_index="validated", type="escrow")
response = client.request(req)

# Return account escrows
escrows = response.result["account_objects"]

# Loop through result and parse account escrows
for escrow in escrows:
    escrow_data = {} 
    if isinstance(escrow["Amount"], str):
        escrow_data["escrow_id"] = escrow["index"]
        escrow_data["sender"] = escrow["Account"] 
        escrow_data["receiver"] = escrow["Destination"] 
        escrow_data["amount"] = str(drops_to_xrp(escrow["Amount"])) 
        if "PreviousTxnID" in escrow:
            escrow_data["prex_txn_id"] = escrow["PreviousTxnID"] 
        if "FinishAfter" in escrow:
            escrow_data["redeem_date"] = str(ripple_time_to_datetime(escrow["FinishAfter"])) 
        if "CancelAfter" in escrow:
            escrow_data["expiry_date"] = str(ripple_time_to_datetime(escrow["CancelAfter"]))
        if "Condition" in escrow:
            escrow_data["condition"] = escrow["Condition"]
            
        # Sort escrows
        if escrow_data["sender"] == account_address:
            sent_escrows.append(escrow_data)
        else:
            received_escrows.append(escrow_data)

# Add lists to escrow dict
all_escrows_dict["sent"] = sent_escrows
all_escrows_dict["received"] = received_escrows

print(all_escrows_dict)
