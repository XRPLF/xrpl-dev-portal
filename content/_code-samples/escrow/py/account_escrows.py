from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects
from xrpl.utils import drops_to_xrp, ripple_time_to_datetime

# Retreive all escrows created or received by an account, formatted

client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork

account_address = "r9CEVt4Cmcjt68ME6GKyhf2DyEGo2rG8AW"

escrow_dict = {} # a dict to store all escrows
sent = [] # a list to store sent/ created escrows
received = [] # a list to store received escrows

# build and make request
req = AccountObjects(account=account_address, ledger_index="validated", type="escrow")
response = client.request(req)

# return account escrows
escrows = response.result["account_objects"]

# loop through result and parse account escrows
for escrow in escrows:
    escrow_data = {} # new dict per escrow for storing each escrow info
    if isinstance(escrow["Amount"], str):
        escrow_data["escrow_id"] = escrow["index"] # escrow id
        escrow_data["sender"] = escrow["Account"] # escrow sender AKA creator
        escrow_data["receiver"] = escrow["Destination"] # escrow receiver
        escrow_data["amount"] = str(drops_to_xrp(escrow["Amount"])) # amount held in escrow
        if "PreviousTxnID" in escrow:
            escrow_data["prex_txn_id"] = escrow["PreviousTxnID"] # needed to cancel or complete the escrow
        if "FinishAfter" in escrow:
            # date when and after ecsrow can be claimed if available
            escrow_data["redeem_date"] = str(ripple_time_to_datetime(escrow["FinishAfter"])) 
        if "CancelAfter" in escrow:
            # date when and after escrow expires if available
            escrow_data["expiry_date"] = str(ripple_time_to_datetime(escrow["CancelAfter"]))
        if "Condition" in escrow:
            # return cryptic condition if available
            escrow_data["condition"] = escrow["Condition"]
            
        # arrange escrows into sent and received lists
        if escrow_data["sender"] == account_address:
            sent.append(escrow_data)
        else:
            received.append(escrow_data)

# add lists to escrow dict
escrow_dict["sent"] = sent
escrow_dict["received"] = received

# print escrow dict
print(escrow_dict)
